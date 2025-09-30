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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-x-hidden">
      {/* Structured Data for SEO */}
      <StructuredData />
      
      {/* Loading Bar Component */}
      <LoadingBar isLoading={isLoading} onComplete={stopLoading} />
      
      {/* Modern Clean Background */}
      <div className="fixed z-0">
        <div className="absolute bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-indigo-950/95"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"></div>
      </div>

      {/* Header Component */}
      <Header variant="default" />

      {/* Hero Section - Dark Background */}
      <HeroSection handleRedirect={handleRedirect} />

      {/* Problem → Solution Section - Light Background */}
      <ProblemSolutionSection handleRedirect={handleRedirect} />

      {/* How It Works Section - Light Background */}
      <HowItWorksSection handleRedirect={handleRedirect} />

      {/* Proof & Trust Section - White Background */}
      <ProofTrustSection />

      {/* Pricing Section - Light Background */}
      <PricingSection handleRedirect={handleRedirect} />

      {/* FAQ Section - Light Background */}
      <FAQSection />

      {/* Final CTA Section - Dark Background */}
      <FinalCTASection handleRedirect={handleRedirect} />

      {/* Footer - Dark Background */}
      <FooterSection />

      {/* Floating CTA */}
      <FloatingCTA handleRedirect={handleRedirect} />
    </div>
  );
}
