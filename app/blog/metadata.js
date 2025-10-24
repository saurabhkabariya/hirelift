export const metadata = {
  title: "Global Career Blog - Expert Job Search & Resume Optimization Tips | HireLift",
  description: "Expert career advice for global professionals. Master AI resume optimization, remote work strategies, US & UK job market insights, interview preparation, and career development from industry leaders worldwide.",
  keywords: [
    // Global Career & Job Search Keywords
    "global career blog", "international job search", "career development worldwide", "professional career advice",
    "job search strategies", "career growth tips", "global job market", "international careers", "worldwide employment",
    
    // US & UK Specific Keywords
    "US job search tips", "UK career advice", "American job market", "British employment", "US resume tips",
    "UK CV writing", "North American careers", "European job search", "US interview preparation", "UK professional development",
    
    // Resume & AI Keywords
    "AI resume optimization", "resume writing tips", "professional resume advice", "ATS resume tips", "modern resume strategies",
    "executive resume writing", "career change advice", "resume makeover", "CV optimization", "professional branding",
    
    // Remote Work & Tech Keywords
    "remote work strategies", "work from home tips", "digital nomad careers", "tech job search", "software engineer careers",
    "remote job hunting", "virtual interview tips", "online professional networking", "digital career development",
    
    // Industry-Specific Keywords
    "tech careers", "finance careers", "marketing careers", "sales careers", "consulting careers",
    "startup careers", "corporate careers", "executive careers", "leadership development", "management tips",
    
    // Career Development Keywords
    "salary negotiation", "career advancement", "professional skills", "networking strategies", "personal branding",
    "career coaching", "job interview mastery", "workplace success", "career transition", "professional growth"
  ],
  openGraph: {
    title: "Global Career Blog - Expert Job Search & Professional Development | HireLift",
    description: "Master your career with expert advice from global industry leaders. AI resume optimization, US & UK job market insights, remote work strategies, and proven career development techniques.",
    type: "website",
    url: "https://hirelift.vercel.app/blog",
    siteName: "HireLift",
    locale: "en_US",
    images: [
      {
        url: "https://hirelift.vercel.app/og-blog-global.jpg",
        width: 1200,
        height: 630,
        alt: "HireLift Global Career Blog - Expert Job Search and Professional Development Tips"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Career Blog - Expert Job Search & Professional Tips | HireLift",
    description: "Master your career with expert advice from global industry leaders. AI resume optimization, US & UK job market insights, and proven career development techniques.",
    images: ["https://hirelift.vercel.app/twitter-blog-global.jpg"],
    creator: "@hirelift",
    site: "@hirelift"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://hirelift.vercel.app/blog",
    types: {
      'application/rss+xml': [
        { url: 'https://hirelift.vercel.app/blog/feed.xml', title: 'HireLift Career Blog RSS Feed' }
      ]
    }
  },
  category: "Career Development"
};