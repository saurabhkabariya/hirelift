import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import UniversalLoadingBar from "@/components/ui/UniversalLoadingBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL( 'https://www.hirelift.tech'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en-GB': '/en-GB'
    }
  },
  title: {
    default: "HireLift - Top Job Assistance and Resume Reviewer for Freshers & Graduates in US & UK",
    template: "%s | HireLift - Resume Reviewer for Freshers"
  },
  description: "Land your dream job in the US & UK with AI-powered resume optimization. Free ATS resume checker for fresh graduates, college students, and entry-level job seekers. Get hired 3x faster with expert templates. Trusted by 50,000+ freshers.",
  keywords: [
    // Fresher & Graduate Keywords (30 keywords)
    "resume builder for freshers", "entry level resume", "fresh graduate resume", "college student resume", "first job resume",
    "internship resume", "graduate job search", "entry level jobs US", "graduate jobs UK", "fresher jobs",
    "new grad resume", "recent graduate jobs", "student resume builder", "career starter", "junior position resume",
    "no experience resume", "entry level resume template", "graduate resume template", "fresher resume format", "college grad resume",
    "first time job seeker", "beginner resume builder", "graduate trainee resume", "entry level career", "fresh graduate jobs US",
    "UK graduate schemes", "graduate recruitment", "campus hiring", "college placement", "university graduate jobs",
    
    // ATS & Resume Optimization (25 keywords)
    "ATS resume checker free", "free resume checker", "ATS friendly resume", "resume scanner", "ATS optimization",
    "ATS compliant resume", "applicant tracking system", "resume keywords", "ATS score", "resume audit",
    "resume review free", "CV checker", "resume analyzer", "ATS test", "resume rating",
    "AI resume optimizer", "resume scoring", "resume feedback", "resume improvement", "resume enhancement",
    "professional resume builder", "modern resume template", "ATS approved resume", "resume formatting", "resume optimization tool",
    
    // US Job Market Keywords (20 keywords)
    "entry level jobs USA", "graduate jobs America", "US job search", "jobs in United States", "American companies hiring",
    "Fortune 500 entry level", "tech jobs US freshers", "startup jobs USA", "internships USA", "US career opportunities",
    "New York jobs freshers", "San Francisco jobs graduates", "Boston entry level", "Austin tech jobs", "Seattle careers",
    "Chicago jobs freshers", "Los Angeles opportunities", "US remote jobs freshers", "American job market", "USA employment freshers",
    
    // UK Job Market Keywords (20 keywords)
    "graduate jobs UK", "entry level jobs Britain", "UK job search", "jobs in United Kingdom", "British companies hiring",
    "FTSE 100 graduate schemes", "London jobs graduates", "UK graduate recruitment", "graduate trainee UK", "UK career opportunities",
    "Manchester jobs freshers", "Birmingham graduate jobs", "Edinburgh careers", "Bristol opportunities", "Leeds jobs graduates",
    "Glasgow jobs freshers", "UK remote jobs", "British job market", "UK employment graduates", "graduate scheme applications",
    
    // Job Search & Career Keywords (20 keywords)
    "job search platform", "career coaching", "interview preparation", "job application tips", "resume writing service",
    "career advice freshers", "job hunting tips", "employment guidance", "career development", "professional growth",
    "job matching", "career resources", "job seeker tools", "recruitment platform", "hiring platform",
    "job portal freshers", "career services students", "placement assistance", "career counseling", "job search strategy"
  ],
  authors: [{ name: "HireLift Team" }],
  creator: "HireLift",
  publisher: "HireLift",
  applicationName: "HireLift",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA", "en_AU"],
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.hirelift.tech",
    title: "HireLift - Top Job Assistance and Resume Reviewer for Freshers & Graduates in US & UK",
    description: "Land your dream job in the US & UK with AI-powered resume optimization. Free ATS resume checker for fresh graduates and college students. Get hired 3x faster.",
    siteName: "HireLift",
    images: [
      {
        url: ("https://www.hirelift.tech") + "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireLift - Job Assistance and Resume Reviewer for Freshers in US & UK",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLift - Top Job Assistance and Resume Reviewer for Freshers & Graduates in US & UK",
    description: "Free ATS resume checker for fresh graduates. Land your first job in US & UK with AI-powered optimization. Get hired 3x faster.",
    creator: "@hirelift",
    site: "@hirelift",
    images: {
      url: ( "https://www.hirelift.tech") + "/twitter-image.jpg",
      alt: "HireLift - Job Assistance and Resume Reviewer for Freshers"
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
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'geo.region': 'US;GB;CA',
    'geo.placename': 'United States;United Kingdom;Canada',
    'DC.title': 'HireLift - Resume Builder for Freshers',
    'DC.subject': 'Resume Building, Job Search, Career Development',
    'DC.description': 'AI-powered resume builder for fresh graduates in US & UK'
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://www.hirelift.tech",
    languages: {
      'en-US': `${ 'https://www.hirelift.tech'}`,
      'en-GB': `${'https://www.hirelift.tech'}/en-gb`
    }
  },
  category: "Technology",
  classification: "Job Search Platform",
};

export const viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* SEO Meta Tags */}
        <meta name="google-site-verification" content="HKgvrxQDwRgmswOq7p_GoG2yId-fcWZkSjyAEGC_ASw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href={"https://www.hirelift.tech"} />
        <link rel="alternate" type="application/rss+xml" title="HireLift Blog RSS Feed" href={`${'https://www.hirelift.tech'}/feed.xml`} />
        
        {/* Google AdSense - Required for verification */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7941545613699675"
          crossOrigin="anonymous"
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HireLift",
              "alternateName": "HireLift Global",
              "url": "https://www.hirelift.tech",
              "logo": {
                "@type": "ImageObject",
                "url": `${'https://www.hirelift.tech'}/logo.png`,
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
              "url": "https://www.hirelift.tech",
              "description": "AI-powered resume optimizer and global job search platform",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${'https://www.hirelift.tech'}/jobs?q={search_term_string}`
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
              "url": "https://www.hirelift.tech",
              "downloadUrl": "https://www.hirelift.tech",
              "screenshot": `${'https://www.hirelift.tech'}/screenshot.jpg`,
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
                  "item": "https://www.hirelift.tech"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "ATS Resume Review",
                  "item": `${'https://www.hirelift.tech'}/audit`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Cold Email Templates",
                  "item": `${'https://www.hirelift.tech'}/playground`
                }
              ]
            })
          }}
        />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-1K3S00G7VG"
          strategy="afterInteractive"
        />
        <Script 
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1K3S00G7VG');
          `}
        </Script>
        
        {/* Razorpay Script */}
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        
        <LoadingProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <UniversalLoadingBar />
            </Suspense>
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
        </LoadingProvider>
      </body>
    </html>
  );
}
