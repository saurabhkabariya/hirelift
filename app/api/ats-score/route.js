import { NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/services/extractTextFromPDF';
import { cleanText } from '@/services/cleanText';
import { scoreResume } from '@/services/scoreResume';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('ATS Score API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 