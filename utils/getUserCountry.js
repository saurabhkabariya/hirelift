/**
 * Server-side utility to detect user's country from IP address
 * Uses multiple fallback APIs for reliability
 */

/**
 * Get country code from user's IP address
 * @param {Request} request - Next.js request object
 * @returns {Promise<{country: string, currency: string, symbol: string}>}
 */
export async function getUserCountry(request) {
  try {
    // Get IP address from request headers
    const ip = getClientIP(request);
    
    // For localhost/development, default to India for testing
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'IN',
        currency: 'INR',
        symbol: '₹'
      };
    }

    // Try primary API: ipapi.co (free tier: 1000 requests/month)
    let countryData = await getCountryFromIPAPI(ip);
    
    // Fallback to ipinfo.io if primary fails
    if (!countryData) {
      countryData = await getCountryFromIPInfo(ip);
    }
    
    // Final fallback - default to India if all APIs fail
    if (!countryData) {
      console.warn('All geolocation APIs failed, defaulting to India');
      return {
        country: 'IN',
        currency: 'INR',
        symbol: '₹'
      };
    }

    // Map country to currency
    const { currency, symbol } = getCurrencyForCountry(countryData.country);
    
    return {
      country: countryData.country,
      currency,
      symbol
    };

  } catch (error) {
    console.error('Error detecting user country:', error);
    // Default to India on any error
    return {
      country: 'IN',
      currency: 'INR',
      symbol: '₹'
    };
  }
}

/**
 * Extract client IP from request headers
 * @param {Request} request 
 * @returns {string|null}
 */
function getClientIP(request) {
  // Check various headers where IP might be stored
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for'); // Vercel
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  return cfConnectingIP || vercelForwardedFor || realIP || null;
}

/**
 * Get country from ipapi.co (Primary API - free tier)
 * @param {string} ip 
 * @returns {Promise<{country: string}|null>}
 */
async function getCountryFromIPAPI(ip) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'HireLift/1.0'
      },
      // Set timeout for faster fallback
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      throw new Error(`IPAPI HTTP error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`IPAPI error: ${data.reason}`);
    }

    if (!data.country_code) {
      throw new Error('No country code in IPAPI response');
    }

    return {
      country: data.country_code.toUpperCase()
    };

  } catch (error) {
    console.warn('ipapi.co failed:', error.message);
    return null;
  }
}

/**
 * Get country from ipinfo.io (Fallback API - free tier)
 * @param {string} ip 
 * @returns {Promise<{country: string}|null>}
 */
async function getCountryFromIPInfo(ip) {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`, {
      headers: {
        'User-Agent': 'HireLift/1.0'
      },
      // Set timeout for faster fallback
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      throw new Error(`IPInfo HTTP error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.country) {
      throw new Error('No country code in IPInfo response');
    }

    return {
      country: data.country.toUpperCase()
    };

  } catch (error) {
    console.warn('ipinfo.io failed:', error.message);
    return null;
  }
}

/**
 * Map country code to currency and symbol
 * @param {string} countryCode 
 * @returns {{currency: string, symbol: string}}
 */
function getCurrencyForCountry(countryCode) {
  // India uses INR, all other countries use USD for simplicity
  if (countryCode === 'IN') {
    return {
      currency: 'INR',
      symbol: '₹'
    };
  }
  
  // Default to USD for all other countries
  return {
    currency: 'USD',
    symbol: '$'
  };
}

/**
 * Get pricing configuration based on country
 * @param {string} country - Country code (e.g., 'IN', 'US')
 * @returns {Object} Pricing configuration
 */
export function getPricingForCountry(country) {
  const isIndia = country === 'IN';
  
  if (isIndia) {
    return {
      currency: 'INR',
      symbol: '₹',
      amounts: {
        basic: 99,
        'resume-fix': 299,
        professional: 599,
        premium: 999
      },
      originalPrices: {
        basic: 199,
        'resume-fix': 499,
        professional: 999,
        premium: 1499
      }
    };
  }
  
  // USD pricing for international users
  return {
    currency: 'USD',
    symbol: '$',
    amounts: {
      basic: 10,
      'resume-fix': 25,
      professional: 50,
      premium: 100
    },
    originalPrices: {
      basic: 20,
      'resume-fix': 40,
      professional: 80,
      premium: 150
    }
  };
}