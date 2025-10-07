import { NextResponse } from 'next/server';
import { getUserCountry } from '@/utils/getUserCountry';

/**
 * API route to detect user's country based on IP address
 * GET /api/detect-location
 */
export async function GET(request) {
  try {
    const countryData = await getUserCountry(request);
    
    return NextResponse.json(countryData);
  } catch (error) {
    console.error('Error in detect-location API:', error);
    
    // Return default India data on error
    return NextResponse.json({
      country: 'IN',
      currency: 'INR',
      symbol: '₹'
    });
  }
}