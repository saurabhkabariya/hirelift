/**
 * Decode JWT token payload (client-side safe)
 * @param {string} token - The JWT token to decode
 * @returns {object|null} - Decoded payload or null if invalid
 */
function decodeJWTPayload(token) {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if a JWT token is close to expiring (within 1 hour)
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token expires within 1 hour
 */
export function isTokenExpiringSoon(token) {
  if (!token) return true;
  
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - now;
  
  // Return true if token expires within 1 hour (3600 seconds)
  return timeUntilExpiry < 3600;
}

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token is expired
 */
export function isTokenExpired(token) {
  if (!token) return true;
  
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Get time remaining until token expires in seconds
 * @param {string} token - The JWT token to check
 * @returns {number} - Seconds until expiry, or 0 if expired/invalid
 */
export function getTokenTimeRemaining(token) {
  if (!token) return 0;
  
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}