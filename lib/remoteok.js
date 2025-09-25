import sanitizeHtml from 'sanitize-html';

// Cache for RemoteOK data
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch jobs from RemoteOK API with caching
 */
export async function fetchRemoteOkJobs() {
  try {
    // Check if we have valid cached data
    if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached RemoteOK data');
      return cachedData;
    }

    console.log('Fetching fresh RemoteOK data...');
    
    const userAgent = process.env.REMOTEOK_USER_AGENT || 'HireLift-JobBoard/1.0 (contact@hirelift.com)';
    
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Next.js revalidation
    });

    if (!response.ok) {
      throw new Error(`RemoteOK API returned ${response.status}: ${response.statusText}`);
    }

    const rawJobs = await response.json();
    
    // RemoteOK returns an array where first item is metadata, rest are jobs
    const jobs = Array.isArray(rawJobs) ? rawJobs.slice(1) : [];
    
    // Normalize the jobs
    const normalizedJobs = jobs
      .filter(job => job && job.id) // Filter out invalid entries
      .map(normalizeRemoteOkJob)
      .filter(job => job !== null); // Remove failed normalizations

    // Update cache
    cachedData = normalizedJobs;
    cacheTimestamp = Date.now();
    
    console.log(`Fetched and normalized ${normalizedJobs.length} jobs from RemoteOK`);
    
    return normalizedJobs;
    
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
    
    // Return cached data if available, even if stale
    if (cachedData) {
      console.log('Returning stale cached data due to fetch error');
      return cachedData;
    }
    
    // Return empty array if no cache available
    return [];
  }
}

/**
 * Normalize a RemoteOK job object to our Job schema
 */
export function normalizeRemoteOkJob(remoteJob) {
  try {
    if (!remoteJob || !remoteJob.id) {
      return null;
    }

    // Clean and validate required fields
    const title = sanitizeText(remoteJob.position || remoteJob.title || '');
    const company = sanitizeText(remoteJob.company || '');
    const location = sanitizeText(remoteJob.location || 'Remote');
    
    if (!title || !company) {
      console.warn(`Skipping RemoteOK job ${remoteJob.id}: missing title or company`);
      return null;
    }

    // Process description with enhanced cleaning
    let description = remoteJob.description || '';
    if (description) {
      // First fix character encoding issues
      description = cleanJobDescription(description);
      
      // Then sanitize HTML
      description = sanitizeHtml(description, {
        allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h3', 'h4', 'h5', 'h6'],
        allowedAttributes: {},
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {},
        disallowedTagsMode: 'discard'
      });
    }

    // Extract tags
    const tags = [];
    if (remoteJob.tags && Array.isArray(remoteJob.tags)) {
      tags.push(...remoteJob.tags.map(tag => sanitizeText(tag)).filter(Boolean));
    }
    
    // Add technology tags if available
    if (remoteJob.tech && Array.isArray(remoteJob.tech)) {
      tags.push(...remoteJob.tech.map(tech => sanitizeText(tech)).filter(Boolean));
    }

    // Process salary information
    let salaryRange = null;
    if (remoteJob.salary_min || remoteJob.salary_max) {
      salaryRange = {
        min: remoteJob.salary_min || null,
        max: remoteJob.salary_max || null,
        currency: 'USD',
        period: 'yearly'
      };
    }

    // Determine job type
    const jobType = normalizeJobType(remoteJob.type || remoteJob.employment_type);
    
    // Determine work mode
    const workMode = normalizeWorkMode(remoteJob.location, tags);
    
    // Determine experience level from title and description
    const experienceLevel = normalizeExperienceLevel(title, description, tags);

    // Create application URL
    const url = remoteJob.url || `https://remoteok.io/remote-jobs/${remoteJob.id}`;

    // Calculate creation date with better handling
    let createdAt;
    if (remoteJob.date) {
      // RemoteOK date is Unix timestamp in seconds
      const timestamp = Number(remoteJob.date);
      if (!isNaN(timestamp)) {
        // Convert to milliseconds and create date
        createdAt = new Date(timestamp * 1000);
        
        // Validate the date isn't too far in past/future
        const now = new Date();
        const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
        const minAge = -24 * 60 * 60 * 1000; // not more than 1 day in future
        
        if (now - createdAt > maxAge || createdAt - now > -minAge) {
          console.warn(`Invalid date for job ${remoteJob.id}: ${createdAt}, using current date`);
          createdAt = new Date();
        }
      } else {
        createdAt = new Date();
      }
    } else {
      createdAt = new Date();
    }
    
    // Calculate expiry date (RemoteOK jobs typically stay active for 30 days)
    const expiresAt = new Date(createdAt.getTime() + (30 * 24 * 60 * 60 * 1000));

    // Calculate days ago for display
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let daysAgo;
    if (diffDays === 0) daysAgo = 'Today';
    else if (diffDays === 1) daysAgo = '1 day ago';
    else if (diffDays < 30) daysAgo = `${diffDays} days ago`;
    else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      daysAgo = months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      daysAgo = 'Over a year ago';
    }

    return {
      externalId: remoteJob.id.toString(),
      source: 'remoteok',
      title,
      company,
      location,
      description,
      tags: [...new Set(tags)], // Remove duplicates
      salaryRange,
      jobType,
      workMode,
      experienceLevel,
      url,
      createdAt,
      expiresAt,
      daysAgo,
      isFeatured: false,
      status: 'active',
      companyLogo: remoteJob.company_logo || null,
      rawRemote: remoteJob // Store original data for debugging
    };
    
  } catch (error) {
    console.error(`Error normalizing RemoteOK job ${remoteJob?.id}:`, error);
    return null;
  }
}

/**
 * Sanitize text input and fix character encoding issues
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Fix common character encoding issues
  let cleaned = text
    // Fix UTF-8 encoding issues
    .replace(/ð/g, '👋') // wave emoji
    .replace(/â/g, "'") // smart quotes
    .replace(/â/g, "'") // smart quotes
    .replace(/â/g, '"') // smart quotes
    .replace(/â/g, '"') // smart quotes
    .replace(/â¢/g, '•') // bullet points
    .replace(/â/g, '—') // em dash
    .replace(/â/g, '–') // en dash
    .replace(/â¦/g, '...') // ellipsis
    .replace(/Â/g, '') // non-breaking space artifacts
    .replace(/Ã©/g, 'é') // accented e
    .replace(/Ã¡/g, 'á') // accented a
    .replace(/Ã­/g, 'í') // accented i
    .replace(/Ã³/g, 'ó') // accented o
    .replace(/Ãº/g, 'ú') // accented u
    .replace(/Ã±/g, 'ñ') // n with tilde
    // Fix HTML entities that might have been double-encoded
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    // Remove other encoding artifacts
    .replace(/\uFFFD/g, '') // replacement character
    .replace(/\u00A0/g, ' ') // non-breaking space
    ;
  
  // Clean up whitespace
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  return cleaned.substring(0, 500); // Increased limit for descriptions
}

/**
 * Clean job description text and fix character encoding issues
 */
function cleanJobDescription(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Fix common character encoding issues specific to job descriptions
  let cleaned = text
    // Fix UTF-8 encoding issues
    .replace(/ð/g, '👋') // wave emoji
    .replace(/ð/g, '🚀') // rocket emoji (sometimes appears)
    .replace(/â/g, "'") // smart quotes (left)
    .replace(/â/g, "'") // smart quotes (right)
    .replace(/â/g, '"') // smart quotes (left)
    .replace(/â/g, '"') // smart quotes (right)
    .replace(/â¢/g, '•') // bullet points
    .replace(/â/g, '—') // em dash
    .replace(/â/g, '–') // en dash
    .replace(/â¦/g, '...') // ellipsis
    .replace(/Â/g, '') // non-breaking space artifacts
    .replace(/Â /g, ' ') // non-breaking space with regular space
    // Fix accented characters
    .replace(/Ã©/g, 'é')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¤/g, 'ä')
    // Fix HTML entities that might have been double-encoded
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&bull;/g, '•')
    // Remove other encoding artifacts
    .replace(/\uFFFD/g, '') // replacement character
    .replace(/\u00A0/g, ' ') // non-breaking space
    .replace(/\u200B/g, '') // zero-width space
    .replace(/\u2019/g, "'") // right single quotation mark
    .replace(/\u201C/g, '"') // left double quotation mark
    .replace(/\u201D/g, '"') // right double quotation mark
    .replace(/\u2013/g, '–') // en dash
    .replace(/\u2014/g, '—') // em dash
    .replace(/\u2026/g, '...') // horizontal ellipsis
    .replace(/\u2022/g, '•') // bullet
    ;
  
  // Clean up whitespace and line breaks
  cleaned = cleaned
    .replace(/\r\n/g, '\n') // normalize line endings
    .replace(/\r/g, '\n') // normalize line endings
    .replace(/\n{3,}/g, '\n\n') // limit consecutive line breaks
    .replace(/[ \t]+/g, ' ') // normalize spaces and tabs
    .trim();
  
  return cleaned;
}

/**
 * Normalize job type from RemoteOK format
 */
function normalizeJobType(remoteType) {
  if (!remoteType) return 'full-time';
  
  const type = remoteType.toLowerCase();
  
  if (type.includes('full-time') || type.includes('fulltime')) return 'full-time';
  if (type.includes('part-time') || type.includes('parttime')) return 'part-time';
  if (type.includes('contract') || type.includes('contractor')) return 'contract';
  if (type.includes('intern') || type.includes('internship')) return 'internship';
  if (type.includes('freelance') || type.includes('freelancer')) return 'freelance';
  
  return 'full-time'; // Default
}

/**
 * Normalize work mode based on location and tags
 */
function normalizeWorkMode(location, tags = []) {
  if (!location) return 'remote';
  
  const locationLower = location.toLowerCase();
  const allTags = tags.map(tag => tag.toLowerCase()).join(' ');
  
  if (locationLower.includes('remote') || 
      locationLower === 'worldwide' || 
      locationLower === 'anywhere' ||
      allTags.includes('remote')) {
    return 'remote';
  }
  
  if (locationLower.includes('hybrid') || allTags.includes('hybrid')) {
    return 'hybrid';
  }
  
  return 'onsite';
}

/**
 * Determine experience level from job content
 */
function normalizeExperienceLevel(title, description, tags = []) {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  if (content.includes('senior') || 
      content.includes('lead') || 
      content.includes('staff') ||
      content.includes('principal') ||
      content.includes('5+ years') ||
      content.includes('5-') ||
      content.includes('6+ years')) {
    return 'senior';
  }
  
  if (content.includes('junior') || 
      content.includes('entry') || 
      content.includes('graduate') ||
      content.includes('0-2 years') ||
      content.includes('new grad')) {
    return 'entry';
  }
  
  if (content.includes('intern') || content.includes('internship')) {
    return 'entry';
  }
  
  if (content.includes('executive') || 
      content.includes('director') || 
      content.includes('vp') ||
      content.includes('chief')) {
    return 'executive';
  }
  
  if (content.includes('lead') || content.includes('team lead')) {
    return 'lead';
  }
  
  return 'mid'; // Default to mid-level
}

/**
 * Merge RemoteOK jobs with manual jobs, removing duplicates
 * Priority: Manual jobs override RemoteOK jobs if duplicate detected
 */
export function mergeJobSources(manualJobs = [], remoteOkJobs = []) {
  const merged = [...manualJobs]; // Start with manual jobs (higher priority)
  const manualCompanies = new Set(manualJobs.map(job => 
    `${job.company.toLowerCase()}_${job.title.toLowerCase()}`
  ));
  
  // Add RemoteOK jobs that don't duplicate manual jobs
  for (const remoteJob of remoteOkJobs) {
    const key = `${remoteJob.company.toLowerCase()}_${remoteJob.title.toLowerCase()}`;
    
    if (!manualCompanies.has(key)) {
      merged.push(remoteJob);
    }
  }
  
  return merged;
}

/**
 * Get cache info for debugging
 */
export function getCacheInfo() {
  return {
    hasCachedData: !!cachedData,
    cacheTimestamp,
    cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    isStale: cacheTimestamp ? (Date.now() - cacheTimestamp) > CACHE_DURATION : null,
    cachedJobCount: cachedData ? cachedData.length : 0
  };
}