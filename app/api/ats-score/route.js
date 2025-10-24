import { NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/services/extractTextFromPDF';
import { cleanText } from '@/services/cleanText';
import { scoreResume } from '@/services/scoreResume';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

export const dynamic = 'force-dynamic';

export async function POST(req) { 
  try {
    // Parse JWT from Authorization header or cookies
    let token = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    let user = null;
    let isPremium = false;
    let auditCount = 0;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
        await connectDB();
        user = await User.findById(userId);
        if (user) {
          isPremium = user.isPremium;
          auditCount = user.auditCount || 0;
        }
      } catch (err) {
        // Invalid token, treat as unauthenticated
        user = null;
      }
    }

    // If not premium and auditCount >= 1, block
    if (user && !isPremium && auditCount >= 1) {
      return NextResponse.json({ error: 'Free review exhausted. Please upgrade to premium.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('resume');
    const keywordsRaw = formData.get('keywords');
    if (!file || !keywordsRaw) {
      return NextResponse.json({ error: 'Missing resume file or keywords' }, { status: 400 });
    }

    // Parse keywords (expecting a JSON array string or comma-separated string)
    let keywords = [];
    try {
      keywords = JSON.parse(keywordsRaw);
      if (!Array.isArray(keywords)) throw new Error();
    } catch {
      keywords = keywordsRaw.split(',').map(k => k.trim()).filter(Boolean);
    }
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: 'No keywords provided' }, { status: 400 });
    }

    // Read PDF file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text and page count
    const { text: rawText, pageCount } = await extractTextFromPDF(buffer);
    if (!rawText || rawText.length < 20) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    // Clean text
    const text = cleanText(rawText);

    // Score resume
    const result = scoreResume({ text, pageCount, keywords });

    // If user is authenticated, handle scoring and tracking
    if (user) {
      // If not premium, increment auditCount
      if (!isPremium) {
        user.auditCount = (user.auditCount || 0) + 1;
      }
      
      // Update highest ATS score if this score is higher
      const previousHighestScore = user.highestATSScore || 0;
      if (result.totalScore > previousHighestScore) {
        user.highestATSScore = result.totalScore;
        
        // Update Brevo contact with new highest score
        try {
          const currentPlanType = user.isPremium ? PLAN_TYPES.PREMIUM : PLAN_TYPES.FREE;
          await updateBrevoContact(user.email, currentPlanType, {
            FIRSTNAME: user.firstName || '',
            LASTNAME: user.lastName || '',
            additionalAttributes: {
              ATS_SCORE: result.totalScore,
              LAST_ATS_UPDATE: new Date().toISOString()
            }
          });
          console.log(`✅ Updated Brevo contact for ${user.email} with new highest ATS score: ${result.totalScore}`);
        } catch (brevoError) {
          console.error(`❌ Failed to update Brevo contact for ${user.email}:`, brevoError);
          // Don't fail the scoring process due to Brevo errors
        }
      }
      
      await user.save();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('ATS Score API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 