import { NextResponse } from 'next/server';
import { fetchRemoteOkJobs, getCacheInfo } from '@/lib/remoteok';

// Simple rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  for (const [requestIp, requests] of requestCounts.entries()) {
    const filteredRequests = requests.filter(time => time > windowStart);
    if (filteredRequests.length === 0) {
      requestCounts.delete(requestIp);
    } else {
      requestCounts.set(requestIp, filteredRequests);
    }
  }
  
  // Check current IP
  const requests = requestCounts.get(ip) || [];
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  
  return false;
}

export async function GET(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const includeCache = searchParams.get('includeCache') === 'true';

    // Fetch jobs from RemoteOK
    const jobs = await fetchRemoteOkJobs();
    
    // Prepare response
    const response = {
      success: true,
      data: jobs,
      count: jobs.length,
      source: 'remoteok',
      timestamp: new Date().toISOString()
    };

    // Include cache info if requested (for debugging)
    if (includeCache) {
      response.cache = getCacheInfo();
    }

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error in RemoteOK proxy:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch remote jobs',
        message: error.message,
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD(request) {
  try {
    const cacheInfo = getCacheInfo();
    
    return new Response(null, {
      status: 200,
      headers: {
        'X-Cache-Status': cacheInfo.hasCachedData ? 'HIT' : 'MISS',
        'X-Cache-Age': cacheInfo.cacheAge ? cacheInfo.cacheAge.toString() : '0',
        'X-Job-Count': cacheInfo.cachedJobCount.toString()
      }
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}