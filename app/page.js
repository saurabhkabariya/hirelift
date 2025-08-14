'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes
} from 'react-icons/fa';
import LoadingBar from '../components/LoadingBar';
import { useLoading } from '../hooks/useLoading';

// Import modular sections
import HeroSection from '../components/sections/HeroSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PricingSection from '../components/sections/PricingSection';
import SEOContentSection from '../components/sections/SEOContentSection';
import FooterSection from '../components/sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import StructuredData from '../components/StructuredData';

const navLinks = [
  { name: "Home", href: "#home", description: "AI-powered resume optimization platform" },
  { name: "How it Works", href: "#how-it-works", description: "3-step process to optimize your job search" },
  { name: "Testimonials", href: "#testimonials", description: "Success stories from our users" },
  { name: "Features", href: "#features", description: "Complete job search toolkit" },
  { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
];

// Smooth scroll utility
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoading, stopLoading, handleRedirect } = useLoading();

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

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
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-indigo-950/95"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"></div>
      </div>

      {/* Clean Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 z-50 w-full flex items-center justify-between px-6 lg:px-12 py-4 transition-all duration-500 ${
          mobileMenuOpen ? 'bg-slate-950/98 backdrop-blur-2xl' : 'bg-slate-950/90 backdrop-blur-xl'
        } border-b border-white/10`}
      >
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            H
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            HireLift
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="text-gray-300 hover:text-white font-medium transition-colors duration-300 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => handleRedirect('/auth')}
            className="px-6 py-2 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-all duration-300"
          >
            Login
          </button>
          <button 
            onClick={() => handleRedirect('/auth?mode=signup')}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
        >
          {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    scrollToSection(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-xl font-semibold text-gray-300 hover:text-white transition-colors w-full text-left"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={() => handleRedirect('/auth')}
                  className="px-6 py-3 rounded-lg text-center border border-gray-600 text-gray-300 hover:text-white transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleRedirect('/auth?mode=signup')}
                  className="px-6 py-3 rounded-lg text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Hero Section - Dark Background */}
      <HeroSection handleRedirect={handleRedirect} />

      {/* How It Works Section - Light Background */}
      <HowItWorksSection handleRedirect={handleRedirect} />

      {/* Testimonials Section - White Background */}
      <TestimonialsSection />

      {/* Features Section - Dark Background */}
      <FeaturesSection />

      {/* Pricing Section - Light Background */}
      <PricingSection handleRedirect={handleRedirect} />

      {/* SEO Content Section - White Background */}
      <SEOContentSection />

      {/* Footer - Dark Background */}
      <FooterSection />

      {/* Floating CTA */}
      <FloatingCTA handleRedirect={handleRedirect} />
    </div>
  );
}
