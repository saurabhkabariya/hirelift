/**
 * Global SEO Configuration for HireLift
 * Centralized SEO settings for international job search platform
 */

export const SEO_CONFIG = {
  // Base configuration - Primary domains
  baseUrl: 'https://www.hirelift.tech',
  alternateDomains: [
    'https://www.hirelift.tech',
    'https://www.hirelift.dev',
    'https://hirelift.tech',
    'https://hirelift.dev',
    'https://hirelift.vercel.app'
  ],
  siteName: 'HireLift',
  defaultTitle: 'HireLift - AI Job Assistance, Resume Reviewer & Job Search Platform for US & UK Freshers',
  defaultDescription: 'Land your dream job in the US & UK with AI-powered resume optimization. #1 ATS resume checker for freshers and graduates. Get interview callbacks 3x faster with expert templates and career coaching. Trusted by 50,000+ job seekers.',
  
  // Geographic targeting
  primaryRegions: ['US', 'UK', 'IND'],
  targetCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'India'],
  targetCities: {
    US: ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Los Angeles'],
    UK: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Leeds', 'Glasgow']
  },
  
  // Social media
  twitter: '@hirelift',
  facebook: 'hirelift',
  linkedin: 'hirelifttech',
  
  // Default images
  defaultOGImage: '/og-default.jpg',
  logoUrl: '/logo.png',
  
  // Language and region
  defaultLocale: 'en-US',
  alternateLocales: ['en-GB', 'en-CA', 'en-AU', 'en-IN'],
  
  // Contact
  email: 'hirelift01@gmail.com',
  supportEmail: 'hirelift01@gmail.com',
  
  // Business info
  foundingYear: '2025',
  companyType: 'Technology',
  category: 'Career & Job Search Platform',
  
  // Target audience
  targetAudience: [
    'Fresh Graduates',
    'College Students',
    'Entry-Level Job Seekers',
    'Career Changers',
    'International Job Seekers'
  ]
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'HireLift - Top AI Job Assistance and Resume Reviewer for Freshers in US & UK | Get Hired 3x Faster',
    description: 'Land your first job in the US & UK with AI-powered resume optimization. Free ATS resume checker for fresh graduates & college students. Get interview callbacks from top companies. 95% success rate for entry-level jobs.',
    keywords: [
      'resume builder for freshers', 'entry level resume US', 'graduate jobs UK', 'ATS resume checker free',
      'first job resume builder', 'college student resume', 'fresh graduate resume template',
      'entry level jobs US', 'graduate jobs UK', 'resume tips for freshers',
      'AI resume builder', 'resume optimizer for graduates', 'job search for freshers',
      'internship resume builder', 'career starter resume', 'no experience resume builder',
      'US job search freshers', 'UK graduate recruitment', 'entry level career platform'
    ],
    ogImage: '/og-home.jpg',
    regions: ['US', 'UK', 'CA', 'IND']
  },
  
  audit: {
    title: 'Free AI Resume Reviewer for Freshers & Graduates | ATS Scanner US & UK',
    description: 'Free AI-powered resume checker for fresh graduates in US & UK. Instant ATS compatibility score, keyword optimization for entry-level jobs. Get hired at top companies with our expert resume analysis.',
    keywords: [
      'free resume checker for freshers', 'ATS scanner graduates', 'resume checker US', 'CV checker UK',
      'entry level resume checker', 'graduate resume review', 'first job resume scanner',
      'ATS test for freshers', 'college resume checker', 'internship resume analyzer',
      'free ATS checker students', 'resume audit freshers', 'graduate CV checker',
      'entry level ATS optimization', 'fresher resume score'
    ],
    ogImage: '/og-audit.jpg',
    regions: ['US', 'UK', 'CA']
  },
  
  pricing: {
    title: 'Pricing Plans for Students & Freshers - HireLift | Affordable Resume Services',
    description: 'Student-friendly pricing for fresh graduates in US & UK. Free ATS resume checker, affordable premium plans starting at $10. Special discounts for college students and first-time job seekers.',
    keywords: [
      'resume builder pricing students', 'affordable resume checker', 'student discount resume service',
      'cheap resume builder freshers', 'graduate job search pricing', 'entry level career coaching cost',
      'free ATS checker students', 'budget resume optimizer', 'college student resume pricing',
      'fresher friendly pricing', 'first job resume cost', 'affordable career services students'
    ],
    ogImage: '/og-pricing.jpg',
    regions: ['US', 'UK', 'CA']
  },
  
  auth: {
    title: 'Sign Up | Login - HireLift | Start Your Career Transformation',
    description: 'Join HireLift to transform your job search with AI-powered resume optimization, ATS checking, and expert career coaching. Sign up free and get hired 3x faster.',
    keywords: [
      'job seeker registration', 'career platform signup', 'resume optimizer account',
      'ATS checker login', 'professional networking signup', 'career coaching registration',
      'job search platform account', 'resume builder signup'
    ],
    ogImage: '/og-auth.jpg'
  },
  
  dashboard: {
    title: 'Dashboard - HireLift | Your Career Command Center',
    description: 'Access your personalized career dashboard with AI resume analysis, job tracking, interview preparation, and career coaching tools. Monitor your job search progress.',
    keywords: [
      'career dashboard', 'job search tracker', 'resume builder dashboard',
      'interview preparation center', 'career coaching portal', 'job application tracker',
      'professional development hub', 'career management tools'
    ],
    ogImage: '/og-dashboard.jpg',
    noIndex: true // Private page
  }
};

// Structured data templates
export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HireLift',
    alternateName: ['HireLift Tech', 'HireLift Career Platform'],
    url: SEO_CONFIG.baseUrl,
    sameAs: SEO_CONFIG.alternateDomains,
    logo: {
      '@type': 'ImageObject',
      url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.logoUrl}`,
      width: 512,
      height: 512
    },
    description: SEO_CONFIG.defaultDescription,
    foundingDate: SEO_CONFIG.foundingYear,
    areaServed: [
      {
        '@type': 'Country',
        name: 'United States'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      },
      {
        '@type': 'Country',
        name: 'Canada'
      },
      {
        '@type': 'Country',
        name: 'Australia'
      },
      {
        '@type': 'Country',
        name: 'India'
      }
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Fresh Graduates, College Students, Entry-Level Job Seekers'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: SEO_CONFIG.email,
      contactType: 'customer service',
      areaServed: ['US', 'GB', 'CA', 'AU', 'IN'],
      availableLanguage: ['English']
    },
    sameAs: [
      `https://twitter.com/${SEO_CONFIG.twitter.replace('@', '')}`,
      `https://linkedin.com/company/${SEO_CONFIG.linkedin}`,
      `https://facebook.com/${SEO_CONFIG.facebook}`
    ]
  },
  
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.baseUrl}/jobs?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: SEO_CONFIG.defaultLocale,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName
    }
  }
};

// Meta tags for different page types
export const META_TAGS = {
  default: {
    'theme-color': '#2563eb',
    'msapplication-TileColor': '#2563eb',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no'
  },
  
  businessPage: {
    'article:author': 'HireLift Team',
    'article:publisher': SEO_CONFIG.baseUrl,
    'og:site_name': SEO_CONFIG.siteName
  }
};

// SEO best practices checklist
export const SEO_CHECKLIST = {
  technical: [
    'Page loads in under 3 seconds',
    'Mobile-friendly design',
    'HTTPS enabled',
    'Proper heading hierarchy (H1, H2, H3)',
    'Alt text for all images',
    'Clean URL structure',
    'XML sitemap available',
    'Robots.txt configured'
  ],
  
  content: [
    'Unique title for each page',
    'Meta descriptions under 155 characters',
    'Keywords in title and description',
    'Internal linking strategy',
    'High-quality, original content',
    'Regular content updates',
    'User-focused content'
  ],
  
  international: [
    'Hreflang tags for US (en-US) and UK (en-GB)',
    'Region-specific landing pages',
    'Local currency display (USD, GBP)',
    'US & UK specific job market keywords',
    'Time zones and date formats',
    'Local testimonials from US & UK users',
    'Regional content optimization',
    'US & UK focused backlink strategy',
    'Local search engine optimization',
    'Region-specific meta descriptions'
  ]
};

// Regional keyword mapping for US & UK freshers
export const REGIONAL_KEYWORDS = {
  US: {
    freshers: ['entry level', 'new grad', 'recent graduate', 'college grad', 'junior position'],
    resume: ['resume', 'CV', 'curriculum vitae'],
    jobSearch: ['job search', 'career opportunities', 'hiring', 'employment'],
    companies: ['Fortune 500', 'startups', 'tech companies', 'consulting firms']
  },
  UK: {
    freshers: ['graduate', 'school leaver', 'graduate trainee', 'graduate scheme', 'entry level'],
    resume: ['CV', 'curriculum vitae', 'resume'],
    jobSearch: ['graduate jobs', 'graduate schemes', 'recruitment', 'graduate recruitment'],
    companies: ['FTSE 100', 'graduate employers', 'top employers', 'blue chip companies']
  }
};

export default SEO_CONFIG;