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
    default: "HireLift - Job Hunt Assistant Platform for India | ATS Resume Optimizer",
    template: "%s | HireLift - India's Leading Job Search Platform"
  },
  description: "India's leading job hunt platform. Free ATS resume checker, cold email templates, HR directory & job search tools. Get hired 3x faster with 85% ATS pass rate. Trusted by 100+ Indian job seekers.",
  keywords: [
    // Job Hunt & Career (20 keywords)
    "jobs", "jobs near me", "job search", "jobs hiring", "work from home jobs", 
    "job alert", "job vacancy", "career", "employment", "job opportunities",
    "job posting", "job application", "online jobs", "part time jobs", "full time jobs",
    "fresher jobs", "government jobs", "private jobs", "job hunt", "job finder",
    
    // Indian Market Specific (12 keywords)
    "jobs in India", "naukri", "job search India", "India jobs", "jobs Mumbai",
    "jobs Delhi", "jobs Bangalore", "jobs Chennai", "sarkari naukri", 
    "government jobs India", "IT jobs India", "job portal India",
    
    // ATS Resume (15 keywords)
    "ATS resume", "resume optimization", "ATS friendly resume", "resume keywords",
    "applicant tracking system", "ATS checker", "resume scanner", "ATS compliant resume",
    "resume audit", "resume analyzer", "resume builder", "ATS resume template",
    "resume format", "resume tips", "ATS optimization",
    
    // Cold Email & Outreach (15 keywords)
    "cold email templates", "email outreach", "cold emailing", "job application email",
    "email templates", "outreach templates", "cold email tips", "email marketing templates",
    "professional email templates", "networking emails", "job inquiry email",
    "follow up email templates", "email subject lines", "cold outreach", "LinkedIn DM templates",
    
    // HR Directory & Recruitment (15 keywords)
    "HR contacts", "HR directory", "recruitment contacts", "hiring managers",
    "HR database", "recruiter contacts", "company HR", "HR information",
    "recruitment directory", "hiring contacts", "HR email addresses",
    "recruitment agencies", "headhunters", "talent acquisition", "hiring team contacts"
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
    locale: "en_IN",
    url: "https://hirelift.vercel.app",
    title: "HireLift - India's leading Job Hunt Assistant Platform | ATS Resume Optimizer",
    description: "India's leading job hunt platform with free ATS resume checker, cold email templates, and HR directory. Get hired 3x faster with 85% ATS pass rate. Trusted by 100+ Indian job seekers.",
    siteName: "HireLift",
    images: [
      {
        url: "https://hirelift.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireLift - India's Leading Job Hunt Assistant Platform",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLift - India's leading Job Hunt Assistant Platform | Free ATS Resume Checker",
    description: "Get hired 3x faster with India's leading job hunt platform. Free ATS resume optimization, cold email templates, HR directory & proven job search tools.",
    creator: "@hirelift",
    site: "@hirelift",
    images: {
      url: "https://hirelift.vercel.app/twitter-image.jpg",
      alt: "HireLift - Job Hunt Assistant Platform India"
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
      'en-IN': 'https://hirelift.vercel.app',
      'hi-IN': 'https://hirelift.vercel.app/hi'
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
        
        {/* Enhanced Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HireLift",
              "alternateName": "HireLift India",
              "url": "https://hirelift.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hirelift.vercel.app/logo.png",
                "width": 512,
                "height": 512
              },
              "description": "India's leading job hunt assistant platform with free ATS resume checker, cold email templates, and HR directory. Helping 10,000+ Indian job seekers get hired 3x faster.",
              "foundingDate": "2024",
              "foundingLocation": {
                "@type": "Country",
                "name": "India"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "knowsAbout": [
                "ATS Resume Optimization",
                "Job Search in India",
                "Cold Email Templates",
                "HR Directory",
                "Interview Preparation",
                "Career Coaching"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-HIRELIFT",
                "contactType": "customer service",
                "email": "hirelift01@gmail.com",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://twitter.com/hirelift",
                "https://linkedin.com/hirelift",
                "https://facebook.com/hirelift",
                "https://instagram.com/hirelift_india"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "HireLift Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Free ATS Resume Audit",
                      "description": "Instant resume analysis for ATS compatibility"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Cold Email Templates",
                      "description": "Professional email templates for job applications"
                    }
                  }
                ]
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
              "alternateName": "HireLift Job Hunt Assistant",
              "applicationCategory": "BusinessApplication",
              "applicationSubCategory": "Job Search Platform",
              "operatingSystem": ["Web", "Android", "iOS"],
              "description": "India's leading job hunt assistant platform with free ATS resume optimization, cold email templates, and HR directory access",
              "url": "https://hirelift.vercel.app",
              "downloadUrl": "https://hirelift.vercel.app",
              "screenshot": "https://hirelift.vercel.app/screenshot.jpg",
              "featureList": [
                "Free ATS Resume Checker",
                "Cold Email Templates",
                "HR Directory Access",
                "Interview Preparation",
                "Job Search Tools",
                "Career Guidance"
              ],
              "requirements": "Web Browser",
              "memoryRequirements": "1GB",
              "storageRequirements": "10MB",
              "permissions": "Internet Access",
              "countriesSupported": "IN",
              "inLanguage": "en-IN",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "price": "0",
                  "priceCurrency": "INR",
                  "description": "Free ATS resume analysis and basic email templates",
                  "category": "Free Tier"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Plan",
                  "price": "99",
                  "priceCurrency": "INR",
                  "description": "Unlimited audits, HR directory access, and premium templates",
                  "category": "Premium"
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

        {/* FAQ Structured Data for AI Chatbots */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is ATS resume optimization?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ATS resume optimization is the process of formatting and writing your resume to pass through Applicant Tracking Systems used by Indian companies. HireLift's free ATS checker analyzes your resume and provides instant feedback to improve your ATS score and get more interview calls."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I get HR contacts in India?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HireLift provides a comprehensive HR directory with verified contacts of hiring managers across Indian companies. Our Pro plan includes direct HR email addresses, LinkedIn profiles, and company contact information to help you reach decision-makers directly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the best cold email templates for job applications?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HireLift's Cold Email Playground offers 50+ proven templates specifically designed for Indian job market. These include job inquiry emails, follow-up templates, networking messages, and LinkedIn DM templates with 75% average response rates."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How to find jobs in India effectively?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HireLift combines ATS-optimized resumes with direct HR outreach to help you find jobs 3x faster in India. Use our free resume audit, access HR directories, and send personalized emails using our proven templates to skip traditional job portals and reach hiring managers directly."
                  }
                }
              ]
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
