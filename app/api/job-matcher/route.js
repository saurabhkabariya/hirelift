import { NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/services/extractTextFromPDF';
import { cleanText } from '@/services/cleanText';
import jobMatcherService from '@/services/jobMatcherService';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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
    let matchCount = 0;
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
        await connectDB();
        user = await User.findById(userId);
        if (user) {
          isPremium = user.isPremium || false;
          // Track job match count (using auditCount field or add new field)
          matchCount = user.jobMatchCount || 0;
        }
      } catch (err) {
        console.error('JWT verification error:', err);
        user = null;
      }
    }

    // Enforce free match limit on server side
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please sign in to use job matcher.' 
      }, { status: 401 });
    }

    // Check if free user has already used their free match
    if (!isPremium && matchCount >= 1) {
      return NextResponse.json({ 
        error: 'Free match limit reached. Please upgrade to premium for unlimited matches.' 
      }, { status: 403 });
    }

    // Free users get 1 free match (show mismatches only)
    // For subsequent matches, they need to upgrade
    const isFirstMatch = matchCount === 0;
    const canAccessSuggestions = isPremium;

    const formData = await req.formData();
    const file = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!file) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Job description is required and must be at least 50 characters' 
      }, { status: 400 });
    }

    // Read PDF file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from resume
    const { text: rawText, pageCount } = await extractTextFromPDF(buffer);
    if (!rawText || rawText.length < 20) {
      return NextResponse.json({ 
        error: 'Could not extract text from PDF. Please ensure your resume is readable.' 
      }, { status: 400 });
    }

    // Clean text
    const resumeText = cleanText(rawText);

    console.log('🔍 Starting resume-job matching...');
    
    // Get AI-powered matching results
    const matchResult = await jobMatcherService.matchResumeWithJob(
      resumeText, 
      jobDescription.trim()
    );

    if (!matchResult.success) {
      return NextResponse.json({ 
        error: 'Failed to analyze resume. Please try again.' 
      }, { status: 500 });
    }

    // Prepare response based on user's premium status
    const response = {
      ...matchResult,
      isPremium,
      canAccessSuggestions,
      isFirstMatch,
      matchCount: matchCount + 1,
      pageCount
    };

    // If user is authenticated, update match count
    if (user) {
      if (!user.jobMatchCount) {
        user.jobMatchCount = 0;
      }
      user.jobMatchCount += 1;
      
      // Track highest match score (optional)
      if (!user.highestJobMatchScore || matchResult.matchScore > user.highestJobMatchScore) {
        user.highestJobMatchScore = matchResult.matchScore;
      }
      
      await user.save();
      console.log(`✅ Updated match count for user ${user.email}: ${user.jobMatchCount}`);
    }

    // For non-premium users, include suggestions but mark them as locked
    if (!isPremium && response.suggestions) {
      response.suggestions = response.suggestions.map(suggestion => ({
        ...suggestion,
        isLocked: true
      }));
    }

    console.log(`✅ Job matching completed (Score: ${matchResult.matchScore}, Premium: ${isPremium})`);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Job Matcher API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again later.' 
    }, { status: 500 });
  }
}
