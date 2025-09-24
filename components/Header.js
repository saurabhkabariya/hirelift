'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ variant = 'default' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Different navigation links for different pages
  const defaultNavLinks = [
    { name: "Home", href: "#home", description: "AI-powered resume optimization platform" },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "How it Works", href: "#how-it-works", description: "3-step process to optimize your job search" },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Features", href: "#features", description: "Complete job search toolkit" },
    { name: "Blogs", href: "/blog", description: "Career advice and job search tips", isExternal: true },
    { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
  ];

  const blogNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Blog", href: "/blog", description: "Career advice and job search tips", isExternal: true },
    { name: "Pricing", href: "/#pricing", description: "Affordable plans for every job seeker", isExternal: true },
  ];

  const navLinks = variant === 'blog' ? blogNavLinks : defaultNavLinks;

  // Update active link based on pathname and scroll position
  useEffect(() => {
    if (pathname === '/') {
      setActiveLink('Home');
    } else if (pathname === '/jobs') {
      setActiveLink('Free Jobs');
    } else if (pathname === '/playground') {
      setActiveLink('Templates');
    } else if (pathname === '/blog') {
      setActiveLink('Blogs');
    } else if (pathname.includes('#pricing')) {
      setActiveLink('Pricing');
    }

    // Handle scroll-based section detection for homepage
    if (pathname === '/') {
      const handleScroll = () => {
        const sections = ['#home', '#how-it-works', '#features', '#pricing'];
        const currentSection = sections.find(section => {
          const element = document.querySelector(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        if (currentSection === '#home') setActiveLink('Home');
        else if (currentSection === '#how-it-works') setActiveLink('How it Works');
        else if (currentSection === '#features') setActiveLink('Features');
        else if (currentSection === '#pricing') setActiveLink('Pricing');
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname]);

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

  const handleLogout = async () => {
    await signOutUser();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Clean Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 z-50 w-full flex items-center justify-between px-6 lg:px-12 py-4 transition-all duration-500 ${
          mobileMenuOpen ? 'bg-gray-900/98 backdrop-blur-2xl' : 'bg-gray-900/90 backdrop-blur-xl'
        } border-b border-purple-500/20`}
      >
        {/* Logo */}
        <Link href="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              H
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              HireLift
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            return (
              <div key={link.name} className="relative">
                <button
                  onClick={() => {
                    setActiveLink(link.name);
                    handleNavClick(link);
                  }}
                  className={`font-medium transition-colors duration-300 cursor-pointer relative pb-2 ${
                    link.name === 'Free Jobs' 
                      ? isActive
                        ? 'text-green-200 font-semibold bg-green-500/20 px-3 py-1 rounded-lg border border-green-400/30' 
                        : 'text-green-300 hover:text-green-200 font-semibold bg-green-500/20 px-3 py-1 rounded-lg border border-green-400/30'
                      : isActive
                        ? 'text-white font-semibold'
                        : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  {link.name}
                </button>
                
                {/* Animated underline for non-Free Jobs links */}
                {link.name !== 'Free Jobs' && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? '100%' : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              {/* <div className="text-gray-300 text-sm">
                Welcome, {user.email?.split('@')[0]}
              </div> */}
              <button 
                onClick={() => handleRedirect('/dashboard')}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-purple-400 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleRedirect('/auth')}
                className="px-6 py-2 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-purple-400 transition-all duration-300"
              >
                Login
              </button>
              <button 
                onClick={() => handleRedirect('/auth?mode=signup')}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
              >
                Get Started
              </button>
            </>
          )}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-gray-900/98 backdrop-blur-2xl border-b border-purple-500/20 max-h-screen overflow-y-auto"
              style={{ 
                paddingTop: '84px', // Match header height exactly
                minHeight: '100vh'
              }}
            >
              <div className="px-6 py-6 space-y-4 pb-20">
                {navLinks.map((link) => {
                  const isActive = activeLink === link.name;
                  return (
                    <motion.button
                      key={link.name}
                      onClick={() => {
                        setActiveLink(link.name);
                        handleNavClick(link);
                      }}
                      className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 relative ${
                        link.name === 'Free Jobs'
                          ? isActive
                            ? 'text-green-200 bg-green-500/30 border border-green-400/50 font-semibold'
                            : 'text-green-300 hover:text-green-200 bg-green-500/20 border border-green-400/30 font-semibold'
                          : isActive
                            ? 'text-white bg-purple-500/20 border border-purple-400/40 font-semibold'
                            : 'text-gray-300 hover:text-purple-300 hover:bg-purple-500/10'
                      }`}
                      whileHover={{ x: 10 }}
                    >
                      <div className="font-medium">{link.name}</div>
                      <div className={`text-sm mt-1 ${
                        link.name === 'Free Jobs' 
                          ? isActive ? 'text-green-100' : 'text-green-200'
                          : isActive ? 'text-purple-200' : 'text-gray-400'
                      }`}>{link.description}</div>
                      
                      {/* Active indicator for mobile */}
                      {isActive && link.name !== 'Free Jobs' && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full"
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
                
                <div className="pt-4 space-y-3 border-t border-purple-500/20">
                  {user ? (
                    <>
                      {/* <div className="text-gray-300 text-sm px-4">
                        Welcome, {user.email?.split('@')[0]}
                      </div> */}
                      <button 
                        onClick={() => handleRedirect('/dashboard')}
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center"
                      >
                        Go to Dashboard
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="block w-full py-3 px-4 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-purple-400 transition-all duration-300 text-center"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleRedirect('/auth')}
                        className="block w-full py-3 px-4 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-purple-400 transition-all duration-300 text-center"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => handleRedirect('/auth?mode=signup')}
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
