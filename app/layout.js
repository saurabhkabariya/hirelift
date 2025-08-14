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
    default: "HireLift - AI-Powered Resume ATS Score Optimizer & Job Search Platform",
    template: "%s | HireLift - Get Hired Faster"
  },
  description: "Transform your job search with HireLift's AI-powered resume ATS optimization, direct HR contacts, and proven templates. Get 85% ATS pass rate, 2x more interviews, and land your dream job faster.",
  keywords: [
    "ATS resume optimization",
    "resume ATS score checker",
    "job search platform",
    "HR contacts database",
    "resume optimizer AI",
    "ATS friendly resume",
    "job application success",
    "career advancement tool",
    "resume analysis",
    "interview preparation",
    "job hunting platform",
    "resume improvement",
    "ATS compatibility checker",
    "professional resume builder",
    "job search assistance"
  ],
  authors: [{ name: "HireLift Team" }],
  creator: "HireLift",
  publisher: "HireLift",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hirelift.vercel.app",
    title: "HireLift - AI-Powered Resume ATS Score Optimizer & Job Search Platform",
    description: "Transform your job search with HireLift's AI-powered resume ATS optimization, direct HR contacts, and proven templates. Get 85% ATS pass rate, 2x more interviews, and land your dream job faster.",
    siteName: "HireLift",
    images: [
      {
        url: "https://hirelift.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireLift - AI-Powered Job Search Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLift - AI-Powered Resume ATS Score Optimizer & Job Search Platform",
    description: "Transform your job search with HireLift's AI-powered resume ATS optimization, direct HR contacts, and proven templates. Get 85% ATS pass rate, 2x more interviews.",
    creator: "@hirelift",
    images: ["https://hirelift.vercel.app/twitter-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://hirelift.vercel.app"
  },
  category: "Technology"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href="https://hirelift.vercel.app" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HireLift",
              "url": "https://hirelift.vercel.app",
              "logo": "https://hirelift.vercel.app/logo.png",
              "description": "AI-powered resume ATS optimization and job search platform helping professionals get hired faster",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-HIRELIFT",
                "contactType": "customer service",
                "email": "support@hirelift.io"
              },
              "sameAs": [
                "https://twitter.com/hirelift",
                "https://linkedin.com/hirelift",
                "https://facebook.com/hirelift"
              ]
            })
          }}
        />
        
        {/* Structured Data for SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "HireLift",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "AI-powered resume ATS optimization and job search platform",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free resume ATS analysis and optimization"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150",
                "bestRating": "5"
              }
            })
          }}
        />

        {/* Google Analytics */}
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
