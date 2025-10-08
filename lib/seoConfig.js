/**
 * Global SEO Configuration for HireLift
 * Centralized SEO settings for international job search platform
 */

export const SEO_CONFIG = {
  // Base configuration
  baseUrl: 'https://hirelift.vercel.app',
  siteName: 'HireLift',
  defaultTitle: 'HireLift - AI-Powered Resume Optimizer & Global Job Search Platform',
  defaultDescription: 'Transform your job search with AI-powered resume optimization, ATS checker, and proven strategies. 95% ATS pass rate, expert templates, personalized coaching. Trusted by 50,000+ professionals worldwide.',
  
  // Social media
  twitter: '@hirelift',
  facebook: 'hirelift',
  linkedin: 'hirelift',
  
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
  category: 'Career & Job Search Platform'
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'HireLift - AI-Powered Resume Optimizer & Job Search Platform | Get Hired 3x Faster',
    description: 'Transform your job search with AI-powered resume optimization, ATS checker, and proven strategies. 95% ATS pass rate, expert templates, personalized coaching. Trusted by 50,000+ professionals worldwide.',
    keywords: [
      'AI resume optimizer', 'job search platform', 'ATS checker', 'career coaching',
      'resume builder', 'interview preparation', 'professional resume templates',
      'global job search', 'remote jobs', 'career development'
    ],
    ogImage: '/og-home.jpg'
  },
  
  audit: {
    title: 'Free AI Resume Checker & ATS Scanner | HireLift Resume Audit',
    description: 'Get instant AI-powered resume analysis with our free ATS scanner. Check ATS compatibility, keyword optimization, and formatting. Improve your resume\'s success rate with expert recommendations.',
    keywords: [
      'free resume checker', 'ATS scanner', 'resume analysis', 'CV checker',
      'applicant tracking system test', 'resume audit', 'ATS optimization',
      'resume scanner', 'free resume review', 'AI resume analyzer'
    ],
    ogImage: '/og-audit.jpg'
  },
  
  pricing: {
    title: 'Pricing Plans - HireLift | AI Resume Optimizer & Career Coaching',
    description: 'Choose the perfect plan for your career goals. From free ATS resume checker to premium AI optimization with expert coaching. Affordable pricing for students, professionals, and job seekers worldwide.',
    keywords: [
      'resume optimizer pricing', 'ATS checker cost', 'career coaching price',
      'resume writing service cost', 'job search platform pricing', 'AI resume builder plans',
      'professional resume service rates', 'affordable career coaching'
    ],
    ogImage: '/og-pricing.jpg'
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
    alternateName: 'HireLift Global',
    url: SEO_CONFIG.baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.logoUrl}`,
      width: 512,
      height: 512
    },
    description: SEO_CONFIG.defaultDescription,
    foundingDate: SEO_CONFIG.foundingYear,
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: SEO_CONFIG.email,
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: ['English']
    },
    sameAs: [
      `https://twitter.com/${SEO_CONFIG.twitter.replace('@', '')}`,
      `https://linkedin.com/${SEO_CONFIG.linkedin}`,
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
    'Hreflang tags for different regions',
    'Local currency and pricing',
    'Region-specific keywords',
    'Cultural considerations',
    'International backlinks',
    'Local testimonials'
  ]
};

export default SEO_CONFIG;