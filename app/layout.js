import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://hirelift.vercel.app'),
  title: {
    default: "HireLift - AI-Powered Resume Optimizer & Job Search Platform | Get Hired 3x Faster",
    template: "%s | HireLift - Global Job Search & Resume Optimization Platform"
  },
  description: "Transform your job search with AI-powered resume optimization, ATS checker, and proven job search strategies. 95% ATS pass rate, expert-crafted templates, and personalized coaching. Trusted by 50,000+ professionals worldwide to land dream jobs faster.",
  keywords: [
    // Core Job Search & Career Keywords (25 keywords)
    "resume optimizer", "ATS resume checker", "job search platform", "resume builder", "career coaching",
    "job application tracker", "interview preparation", "resume writing service", "career advice", "job hunting tips",
    "professional resume", "CV optimizer", "applicant tracking system", "resume keywords", "job search tools",
    "career development", "employment opportunities", "job seeker", "recruitment platform", "hiring platform",
    "job portal", "career services", "resume audit", "job matching", "talent acquisition",
    
    // Global Job Market Keywords (20 keywords)
    "remote jobs", "work from home", "international jobs", "global careers", "freelance jobs",
    "tech jobs", "software engineer jobs", "data analyst jobs", "marketing jobs", "sales jobs",
    "customer service jobs", "project manager jobs", "business analyst jobs", "product manager jobs", "designer jobs",
    "developer jobs", "startup jobs", "corporate jobs", "entry level jobs", "senior level jobs",
    
    // ATS & Resume Optimization (20 keywords)
    "ATS friendly resume", "resume scanner", "resume optimization", "ATS compliant", "resume format",
    "resume template", "professional resume template", "executive resume", "modern resume", "creative resume",
    "resume review", "resume critique", "resume makeover", "resume upgrade", "resume enhancement",
    "resume analysis", "resume scoring", "resume rating", "resume feedback", "resume improvement",
    
    // AI & Technology Keywords (15 keywords)
    "AI resume optimizer", "artificial intelligence resume", "machine learning resume", "AI job matching",
    "automated resume screening", "smart resume builder", "AI career coaching", "intelligent job search",
    "AI-powered hiring", "resume AI", "job search AI", "career AI", "recruitment AI", "hiring AI", "talent AI",
    
    // Industry & Location Keywords (20 keywords)
    "technology jobs", "healthcare jobs", "finance jobs", "education jobs", "retail jobs",
    "manufacturing jobs", "consulting jobs", "non-profit jobs", "government jobs", "legal jobs",
    "USA jobs", "Canada jobs", "UK jobs", "Australia jobs", "Europe jobs",
    "Asia jobs", "Middle East jobs", "Africa jobs", "Latin America jobs", "worldwide jobs"
  ],
  authors: [{ name: "HireLift Team" }],
  creator: "HireLift",
  publisher: "HireLift",
  applicationName: "HireLift",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" }
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA", "en_AU", "en_IN"],
    url: "https://hirelift.vercel.app",
    title: "HireLift - AI-Powered Resume Optimizer & Global Job Search Platform",
    description: "Transform your job search with AI-powered resume optimization, ATS checker, and proven strategies. 95% ATS pass rate, expert templates, personalized coaching. Trusted by 50,000+ professionals worldwide.",
    siteName: "HireLift",
    images: [
      {
        url: "https://hirelift.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireLift - AI-Powered Resume Optimizer & Global Job Search Platform",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLift - AI-Powered Resume Optimizer & Job Search Platform | Get Hired 3x Faster",
    description: "Transform your career with AI-powered resume optimization, ATS checker & proven job search strategies. 95% ATS pass rate. Trusted by 50,000+ professionals worldwide.",
    creator: "@hirelift",
    site: "@hirelift",
    images: {
      url: "https://hirelift.vercel.app/twitter-image.jpg",
      alt: "HireLift - AI-Powered Global Job Search Platform"
    }
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
  verification: {
    google: "HKgvrxQDwRgmswOq7p_GoG2yId-fcWZkSjyAEGC_ASw",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      bing: "your-bing-verification-code"
    }
  },
  alternates: {
    canonical: "https://hirelift.vercel.app",
    languages: {
      'en-US': 'https://hirelift.vercel.app',
      'en-GB': 'https://hirelift.vercel.app/en-gb',
      'en-CA': 'https://hirelift.vercel.app/en-ca',
      'en-AU': 'https://hirelift.vercel.app/en-au',
      'en-IN': 'https://hirelift.vercel.app/en-in'
    }
  },
  category: "Technology",
  classification: "Job Search Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* SEO Meta Tags */}
        <meta name="google-site-verification" content="HKgvrxQDwRgmswOq7p_GoG2yId-fcWZkSjyAEGC_ASw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href="https://hirelift.vercel.app" />
        <link rel="alternate" type="application/rss+xml" title="HireLift Blog RSS Feed" href="https://hirelift.vercel.app/feed.xml" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HireLift",
              "alternateName": "HireLift Global",
              "url": "https://hirelift.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hirelift.vercel.app/logo.png",
                "width": 512,
                "height": 512
              },
              "description": "AI-powered resume optimization and global job search platform helping professionals worldwide get hired 3x faster with 95% ATS pass rate and expert career coaching.",
              "foundingDate": "2024",
              "areaServed": {
                "@type": "Place",
                "name": "Worldwide"
              },
              "knowsAbout": [
                "AI Resume Optimization",
                "Global Job Search",
                "ATS Resume Checker",
                "Career Coaching",
                "Interview Preparation",
                "Remote Work",
                "Professional Development",
                "Talent Acquisition",
                "Resume Writing",
                "Job Application Strategy"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hirelift01@gmail.com",
                "contactType": "customer service",
                "areaServed": "Worldwide",
                "availableLanguage": ["English"]
              },
              "sameAs": [
                "https://twitter.com/hirelift",
                "https://linkedin.com/company/hirelift",
                "https://facebook.com/hirelift",
                "https://instagram.com/hirelift_global"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "HireLift Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AI Resume Optimization",
                      "description": "AI-powered resume analysis and optimization for global ATS systems"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Career Coaching",
                      "description": "Personalized career coaching and job search strategy"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Interview Preparation",
                      "description": "Comprehensive interview preparation and practice sessions"
                    }
                  }
                ]
              }
            })
          }}
        />
        
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "HireLift",
              "url": "https://hirelift.vercel.app",
              "description": "AI-powered resume optimizer and global job search platform",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://hirelift.vercel.app/jobs?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "inLanguage": "en-US",
              "publisher": {
                "@type": "Organization",
                "name": "HireLift"
              }
            })
          }}
        />
        
        {/* Enhanced Structured Data for SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "HireLift",
              "alternateName": "HireLift AI Resume Optimizer",
              "applicationCategory": "BusinessApplication",
              "applicationSubCategory": "Career & Job Search Platform",
              "operatingSystem": ["Web", "Android", "iOS", "Windows", "macOS"],
              "description": "AI-powered resume optimization and global job search platform helping professionals worldwide get hired faster with ATS-compliant resumes and expert career coaching",
              "url": "https://hirelift.vercel.app",
              "downloadUrl": "https://hirelift.vercel.app",
              "screenshot": "https://hirelift.vercel.app/screenshot.jpg",
              "featureList": [
                "AI Resume Optimization",
                "ATS Compatibility Checker",
                "Global Job Search",
                "Career Coaching",
                "Interview Preparation",
                "Resume Templates",
                "LinkedIn Optimization",
                "Salary Negotiation Tools"
              ],
              "requirements": "Modern Web Browser",
              "memoryRequirements": "512MB",
              "storageRequirements": "5MB",
              "permissions": "Internet Access",
              "countriesSupported": ["US", "CA", "GB", "AU", "IN", "DE", "FR", "SG", "AE"],
              "inLanguage": ["en-US", "en-GB", "en-CA", "en-AU"],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "2847",
                "bestRating": "5",
                "worstRating": "1"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free AI resume analysis and basic optimization tools",
                  "category": "Free Tier",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "Professional Plan",
                  "price": "29",
                  "priceCurrency": "USD",
                  "description": "Advanced AI optimization, expert review, and comprehensive career tools",
                  "category": "Premium",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "Premium Plan",
                  "price": "79",
                  "priceCurrency": "USD",
                  "description": "Full AI suite with personal career coach and unlimited optimization",
                  "category": "Enterprise",
                  "availability": "https://schema.org/InStock"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Organization",
                "name": "HireLift"
              }
            })
          }}
        />


        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://hirelift.vercel.app"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "ATS Resume Audit",
                  "item": "https://hirelift.vercel.app/audit"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Cold Email Templates",
                  "item": "https://hirelift.vercel.app/playground"
                }
              ]
            })
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1K3S00G7VG"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1K3S00G7VG');
            `,
          }}
        />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
