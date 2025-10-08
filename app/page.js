'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingBar from '../components/LoadingBar';
import { useLoading } from '../hooks/useLoading';
import Header from '../components/Header';

// Import modular sections
import HeroSection from '../components/sections/HeroSection';
import ProblemSolutionSection from '../components/sections/ProblemSolutionSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import ProofTrustSection from '../components/sections/ProofTrustSection';
import PricingSection from '../components/sections/PricingSection';
import FAQSection from '../components/sections/FAQSection';
import FinalCTASection from '../components/sections/FinalCTASection';
import FooterSection from '../components/sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import StructuredData from '../components/StructuredData';
import Head from 'next/head';

const navLinks = [
  { name: "Home", href: "#home", description: "AI-powered resume optimization platform" },
  { name: "Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
  { name: "How it Works", href: "#how-it-works", description: "3-step process to optimize your job search" },
  { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
  { name: "Features", href: "#features", description: "Complete job search toolkit" },
  { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
];

// Smooth scroll utility - kept for any internal use
const scrollToSection = (sectionId) => {
  const element = document.querySelector(sectionId);
  if (element) {
    const headerHeight = 70; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { isLoading, stopLoading, handleRedirect } = useLoading();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Enhanced SEO for Homepage */}
      <Head>
        <title>HireLift - AI-Powered Resume Optimizer & Job Search Platform | Get Hired 3x Faster</title>
        <meta name="description" content="Transform your job search with AI-powered resume optimization, ATS checker, and proven strategies. 95% ATS pass rate, expert templates, personalized coaching. Trusted by 50,000+ professionals worldwide to land dream jobs faster." />
        <meta name="keywords" content="resume optimizer, ATS resume checker, job search platform, AI resume builder, career coaching, interview preparation, resume writing service, applicant tracking system, professional resume, global job search, remote jobs, tech jobs, resume templates, career development" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="HireLift Team" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="Global" />
        <meta name="geo.placename" content="Worldwide" />
        
        {/* Enhanced Open Graph */}
        <meta property="og:title" content="HireLift - AI-Powered Resume Optimizer & Global Job Search Platform" />
        <meta property="og:description" content="Transform your career with AI-powered resume optimization, ATS checker & proven job search strategies. 95% ATS pass rate. Trusted by 50,000+ professionals worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirelift.vercel.app" />
        <meta property="og:image" content="https://hirelift.vercel.app/og-image-home.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="HireLift - AI-Powered Resume Optimizer helping professionals get hired faster" />
        <meta property="og:site_name" content="HireLift" />
        <meta property="og:locale" content="en_US" />
        
        {/* Enhanced Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HireLift - AI Resume Optimizer | Get Hired 3x Faster" />
        <meta name="twitter:description" content="Transform your job search with AI-powered resume optimization. 95% ATS pass rate, expert templates, and career coaching. Join 50,000+ professionals worldwide." />
        <meta name="twitter:image" content="https://hirelift.vercel.app/twitter-image-home.jpg" />
        <meta name="twitter:image:alt" content="HireLift AI Resume Optimizer Dashboard" />
        <meta name="twitter:creator" content="@hirelift" />
        <meta name="twitter:site" content="@hirelift" />
        
        {/* Advanced Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "HireLift - AI-Powered Resume Optimizer & Job Search Platform",
              "url": "https://hirelift.vercel.app",
              "description": "Transform your job search with AI-powered resume optimization, ATS checker, and proven strategies. 95% ATS pass rate, expert templates, personalized coaching.",
              "mainEntity": {
                "@type": "SoftwareApplication",
                "name": "HireLift",
                "applicationCategory": "BusinessApplication",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "2847"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free AI resume analysis and optimization"
                }
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://hirelift.vercel.app"
                }]
              },
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": ["h1", ".hero-description", ".key-features"]
              }
            })
          }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does HireLift's AI resume optimizer work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HireLift's AI analyzes your resume against ATS systems and job requirements, providing specific recommendations to improve keyword optimization, formatting, and content structure for maximum visibility."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "What is the ATS pass rate with HireLift?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HireLift achieves a 95% ATS pass rate by optimizing resumes with the right keywords, formatting, and structure that applicant tracking systems prefer."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is HireLift suitable for international job searches?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, HireLift is optimized for global job markets including the US, Canada, UK, Australia, and other English-speaking countries, with templates and strategies for international applications."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-cyan-50/70 to-cyan-50/50 text-gray-900 relative overflow-x-hidden">
        {/* Structured Data for SEO */}
        <StructuredData />
      
      {/* Loading Bar Component */}
      <LoadingBar isLoading={isLoading} onComplete={stopLoading} />
      
      {/* Optimized Professional Background with Enhanced Cyan Theme */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient background with depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/90 via-cyan-50/70 to-blue-50/80"></div>
        
        {/* Simplified floating elements for visual appeal - optimized for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Reduced blur elements for better performance */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-200/20 to-cyan-300/15 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-200/15 to-cyan-200/15 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-cyan-100/20 to-blue-100/15 rounded-full blur-2xl opacity-60"></div>
          
          {/* Subtle static accent - removed rotation animation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-gradient-to-r from-transparent via-cyan-50/5 to-transparent"></div>
        </div>
        
        {/* Simplified mesh pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Subtle depth layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-50/10 via-transparent to-transparent"></div>
      </div>

      {/* Header Component */}
      <Header variant="default" />

      {/* Hero Section - Cyan Theme */}
      <HeroSection handleRedirect={handleRedirect} />

      {/* Problem → Solution Section - Light Background */}
      <ProblemSolutionSection handleRedirect={handleRedirect} />

      {/* How It Works Section - White Background */}
      <HowItWorksSection handleRedirect={handleRedirect} />

      {/* Proof & Trust Section - Cyan Accent Background */}
      <ProofTrustSection />

      {/* Pricing Section - Light Cyan Background */}
      <PricingSection handleRedirect={handleRedirect} />

      {/* FAQ Section - White Background */}
      <FAQSection />

      {/* Final CTA Section - Cyan Gradient Background */}
      <FinalCTASection handleRedirect={handleRedirect} />

      {/* Footer - Dark Background with Cyan Accents */}
      <FooterSection />

      {/* Floating CTA */}
      <FloatingCTA handleRedirect={handleRedirect} />
      </div>
    </>
  );
}
