'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ variant = 'default' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Different navigation links for different pages
  const defaultNavLinks = [
    { name: "Home", href: "#home", description: "AI-powered resume optimization platform" },
    { name: "How it Works", href: "#how-it-works", description: "3-step process to optimize your job search" },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Features", href: "#features", description: "Complete job search toolkit" },
    { name: "Blog", href: "/blog", description: "Career advice and job search tips", isExternal: true },
    { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
  ];

  const blogNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Blog", href: "/blog", description: "Career advice and job search tips", isExternal: true },
    { name: "Pricing", href: "/#pricing", description: "Affordable plans for every job seeker", isExternal: true },
  ];

  const navLinks = variant === 'blog' ? blogNavLinks : defaultNavLinks;

  const handleRedirect = (href) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  // Smooth scroll utility for homepage
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const headerHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (link) => {
    if (link.isExternal) {
      handleRedirect(link.href);
    } else {
      scrollToSection(link.href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Clean Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 z-50 w-full flex items-center justify-between px-6 lg:px-12 py-4 transition-all duration-500 ${
          mobileMenuOpen ? 'bg-slate-950/98 backdrop-blur-2xl' : 'bg-slate-800/90 backdrop-blur-xl'
        } border-b border-white/10`}
      >
        {/* Logo */}
        <Link href="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              H
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              HireLift
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
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
          className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[84px] left-0 right-0 z-40 lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-white/10"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="block w-full text-left py-3 px-4 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                  whileHover={{ x: 10 }}
                >
                  <div className="font-medium">{link.name}</div>
                  <div className="text-sm text-gray-400 mt-1">{link.description}</div>
                </motion.button>
              ))}
              
              <div className="pt-4 space-y-3 border-t border-white/10">
                <button 
                  onClick={() => handleRedirect('/auth')}
                  className="block w-full py-3 px-4 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-all duration-300 text-center"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleRedirect('/auth?mode=signup')}
                  className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
