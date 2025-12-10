'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageLoading } from '@/hooks/usePageLoading';
import Header from '../components/Header';

// Import essential sections
import NewHeroSection from '../components/sections/NewHeroSection';
import ToolkitSection from '../components/sections/ToolkitSection';
import PainPointsSection from '../components/sections/PainPointsSection';
import TestimonialShowcase from '../components/sections/TestimonialShowcase';
import FeatureCardsSection from '../components/sections/FeatureCardsSection';
import FinalCTABlue from '../components/sections/FinalCTABlue';
import FooterSection from '../components/sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import StructuredData from '../components/StructuredData';
import UrgencyBanner from '../components/conversion/UrgencyBanner';
import ExitIntentPopup from '../components/conversion/ExitIntentPopup';
import Head from 'next/head';
import PricingSection from '@/components/sections/PricingSection';

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
  const { navigateWithLoading } = usePageLoading();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRedirect = (path) => {
    navigateWithLoading(path, 'Loading...');
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Enhanced SEO for Homepage */}
      <Head>
        <title>HireLift - AI Job Hunt Assistant | Get Hired 3x Faster</title>
        <meta name="description" content="Stop getting rejected. Start getting hired. AI-powered job hunt assistant that reveals exactly why you're not getting interviews and connects you directly with hiring managers. 95% success rate." />
        <meta name="keywords" content="job hunt assistant, AI resume analysis, ATS checker, hiring manager contacts, interview preparation, career transformation, job search platform, resume optimization, professional development" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="HireLift Team" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="Global" />
        <meta name="geo.placename" content="Worldwide" />
        
        {/* Enhanced Open Graph */}
        <meta property="og:title" content="HireLift - AI Job Hunt Assistant | Transform Your Career" />
        <meta property="og:description" content="AI-powered job hunt assistant that reveals why you're not getting interviews and connects you with hiring managers. Join 50,000+ professionals who transformed their careers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirelift.vercel.app" />
        <meta property="og:image" content="https://hirelift.vercel.app/og-image-home.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="HireLift AI Job Hunt Assistant - Transform your career with AI-powered insights" />
        <meta property="og:site_name" content="HireLift" />
        <meta property="og:locale" content="en_US" />
        
        {/* Enhanced Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HireLift - AI Job Hunt Assistant | Get Hired 3x Faster" />
        <meta name="twitter:description" content="Stop getting rejected. Start getting hired. AI-powered insights + human-centered approach = career transformation. Join 50,000+ success stories." />
        <meta name="twitter:image" content="https://hirelift.vercel.app/twitter-image-home.jpg" />
        <meta name="twitter:image:alt" content="HireLift AI Job Hunt Assistant Dashboard" />
        <meta name="twitter:creator" content="@hirelift" />
        <meta name="twitter:site" content="@hirelift" />
        
        {/* Advanced Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "HireLift - AI Job Hunt Assistant",
              "url": "https://hirelift.vercel.app",
              "description": "AI-powered job hunt assistant that reveals why you're not getting interviews and connects you with hiring managers. Human-centered approach to career transformation.",
              "mainEntity": {
                "@type": "SoftwareApplication",
                "name": "HireLift",
                "applicationCategory": "BusinessApplication",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "50000"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free AI-powered career analysis and job hunt assistance"
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
                  "name": "How does HireLift's AI job hunt assistant work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HireLift's AI analyzes your resume, reveals exactly why you're not getting interviews, and provides direct access to hiring managers. Our human-centered approach combines technology with personal care for guaranteed results."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "What makes HireLift different from other job search platforms?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unlike generic job boards, HireLift is a comprehensive job hunt assistant that combines AI-powered insights with direct hiring manager access and human-centered support for actual career transformation."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How quickly can I expect results with HireLift?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most users see their first interview within 2 weeks. Our AI immediately reveals what's blocking your applications, and our hiring manager network ensures direct connections to decision-makers."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-white text-gray-900 relative overflow-x-hidden">
        {/* Structured Data for SEO */}
        <StructuredData />
      
      {/* Minimalist Professional Background - Removed for cleaner look matching design */}
      {/* <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-white"></div>
      </div> */}

      {/* Header Component */}
      <Header variant="default" />

      {/* Hero Section - Break the No Experience Cycle */}
      <NewHeroSection handleRedirect={handleRedirect} />

      {/* Toolkit Section - Your Complete Toolkit */}
      <ToolkitSection />

      {/* Pain Points Section - We Know It Feels Hopeless */}
      <PainPointsSection />

      {/* Testimonials - From Rejected to Offer Letter */}
      <TestimonialShowcase />

      {/* Feature Cards - Everything You Need */}
      <FeatureCardsSection handleRedirect={handleRedirect} />

      <PricingSection  handleRedirect={handleRedirect} />

      {/* Final CTA - Your First Paycheck is Waiting */}
      <FinalCTABlue handleRedirect={handleRedirect} />

      {/* Footer - Dark Background with Cyan Accents */}
      <FooterSection />

      {/* Floating CTA */}
      <FloatingCTA handleRedirect={handleRedirect} />

      {/* Urgency Banner for Conversion Boost */}
      <UrgencyBanner onCTAClick={() => handleRedirect('/pricing')} />

      {/* Exit Intent Popup for Maximum Conversion */}
      <ExitIntentPopup onCTAClick={() => handleRedirect('/audit')} />
      </div>
    </>
  );
}
