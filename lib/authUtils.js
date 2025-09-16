/**
 * JWT and Authentication utilities
 * Handles JWT expiration detection and authentication redirects
 */

/**
 * Check if error is related to JWT expiration or authentication
 * @param {Error|Object} error - Error object
 * @returns {boolean} - True if it's an auth error
 */
export function isAuthError(error) {
  if (!error) return false;
  
  const errorMessage = error.message || error.error || '';
  const statusCode = error.status || error.statusCode;
  
  // Check for common JWT/auth error patterns
  const authErrorPatterns = [
    'jwt expired',
    'jwt must be provided',
    'jwt malformed',
    'invalid token',
    'token expired',
    'authentication required',
    'unauthorized',
    'not authenticated',
    'login again',
    'authentication token not found'
  ];
  
  // Check status codes
  const authStatusCodes = [401, 403];
  
  return (
    authStatusCodes.includes(statusCode) ||
    authErrorPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    )
  );
}

/**
 * Handle authentication errors by clearing tokens and redirecting
 * @param {Object} router - Next.js router instance
 * @param {string} redirectPath - Path to redirect to after login (optional)
 */
export function handleAuthError(router, redirectPath = null) {
  // Clear stored authentication data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  // Determine redirect URL
  const currentPath = redirectPath || (typeof window !== 'undefined' ? window.location.pathname : '/pricing');
  const redirectUrl = `/auth?redirect=${encodeURIComponent(currentPath)}`;
  
  // Redirect to auth page
  if (router) {
    router.push(redirectUrl);
  } else if (typeof window !== 'undefined') {
    window.location.href = redirectUrl;
  }
}

/**
 * Enhanced fetch with JWT expiration handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @param {Object} router - Next.js router instance
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithAuth(url, options = {}, router = null) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    const error = new Error('Authentication token not found. Please login again.');
    error.status = 401;
    throw error;
  }
  
  // Add auth header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Check for auth errors
    if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || 'Authentication failed');
      error.status = response.status;
      
      // Handle auth error
      if (router && isAuthError(error)) {
        handleAuthError(router);
      }
      
      throw error;
    }
    
    return response;
  } catch (error) {
    // Check if it's a network error that might indicate auth issues
    if (isAuthError(error) && router) {
      handleAuthError(router);
    }
    throw error;
  }
}

export default {
  isAuthError,
  handleAuthError,
  fetchWithAuth
};
