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
      
      {/* Stunning Professional Background with Enhanced Cyan Theme */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient background with depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/90 via-cyan-50/70 to-blue-50/80"></div>
        
        {/* Dynamic floating elements for visual appeal */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large decorative blurs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-200/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-200/25 to-cyan-200/25 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-cyan-100/30 to-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 right-1/6 w-64 h-64 bg-gradient-to-bl from-cyan-300/20 to-cyan-200/15 rounded-full blur-3xl"></div>
          
          {/* Additional middle section enhancement */}
          <div className="absolute top-1/2 left-1/5 w-60 h-60 bg-gradient-to-r from-cyan-150/25 to-blue-150/20 rounded-full blur-2xl opacity-80"></div>
          <div className="absolute top-2/3 right-1/3 w-48 h-48 bg-gradient-to-l from-cyan-200/30 to-cyan-100/25 rounded-full blur-2xl"></div>
          
          {/* Subtle animated accents */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-gradient-to-r from-transparent via-cyan-50/10 to-transparent rotate-45"></div>
        </div>
        
        {/* Elegant mesh pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.4) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Subtle noise texture for depth and richness */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-50/10 opacity-50"></div>
        
        {/* Additional depth layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-50/20 via-transparent to-transparent"></div>
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
