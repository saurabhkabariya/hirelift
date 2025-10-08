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
  );
}
