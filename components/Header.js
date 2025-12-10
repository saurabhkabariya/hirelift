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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
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

  // Enhanced scroll detection for backdrop effects and dark theme
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Only apply dark theme detection on homepage
      if (pathname === '/') {
        // Header should be light/transparent on hero section (first screen)
        // and dark on FinalCTA/Footer sections (last 2-3 screens)
        const documentHeight = document.documentElement.scrollHeight;
        
        // Use light theme on hero (top ~100vh) and dark theme on bottom sections
        const isInHeroSection = scrollY < windowHeight * 0.8;
        const isInDarkSection = scrollY > documentHeight - (windowHeight * 2.5);
        
        // Set scrolled state for backdrop blur
        setIsScrolled(scrollY > 50);
        
        // Set theme: white on hero, light in middle, dark at bottom
        setIsDarkTheme(isInDarkSection && !isInHeroSection);
      } else {
        // For other pages, use light theme with scroll detection
        setIsScrolled(scrollY > 50);
        setIsDarkTheme(false);
      }
    };

    // Run on mount to set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Different navigation links for different pages
  const defaultNavLinks = [
    { name: "Home", href: "#home", description: "Break the no experience cycle" },
    { name: "Testimonials", href: "#testimonials", description: "Success stories from job seekers" },
    { name: "Features", href: "#features", description: "Everything you need to get hired" },
    { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "Resume Review", href: "/audit", description: "Get your resume's ATS score", isExternal: true },
    { name: "Referrals Hub", href: "/referrals", description: "Find referral opportunities and manage your network", isExternal: true },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true }
  ];

  const blogNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "Pricing", href: "/pricing", description: "Affordable plans for every job seeker", isExternal: true },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "Free Review", href: "/audit", description: "Get your resume's ATS score and suggestions for improvement.", isExternal: true },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Referrals Hub", href: "/referrals", description: "Find referral opportunities and manage your network", isExternal: true, isSpecial: true }
  ];

  const playgroundNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "Pricing", href: "/pricing", description: "Affordable plans for every job seeker", isExternal: true },
    { name: "Blog", href: "/blog", description: "Latest insights and tips for job seekers", isExternal: true },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "Free Review", href: "/audit", description: "Get your resume's ATS score and suggestions for improvement.", isExternal: true },
    { name: "Referrals Hub", href: "/referrals", description: "Find referral opportunities and manage your network", isExternal: true, isSpecial: true }
  ];

  // Determine which navigation links to use based on current pathname
  const getNavLinks = () => {
    if (variant === 'blog' || pathname === '/blog') return blogNavLinks;
    if (pathname === '/playground') return playgroundNavLinks;
    return defaultNavLinks;
  };

  const navLinks = getNavLinks();

  // Update active link based on pathname and scroll position
  useEffect(() => {
    if (pathname === '/') {
      // For homepage, detect active section based on scroll position
      const handleScroll = () => {
        const sections = ['#home', '#toolkit', '#testimonials', '#features', '#pricing'];
        let currentSection = null;
        
        for (const sectionId of sections) {
          const element = document.querySelector(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Check if section is in viewport (with header offset)
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = sectionId;
              break;
            }
          }
        }
        
        if (currentSection === '#home') {
          setActiveLink('Home');
        } else if (currentSection === '#testimonials') {
          setActiveLink('Testimonials');
        } else if (currentSection === '#features') {
          setActiveLink('Features');
        } else if (currentSection === '#pricing') {
          setActiveLink('Pricing');
        } else if (window.scrollY < 100) {
          // At very top of page, highlight Home
          setActiveLink('Home');
        }
      };
      
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else if (pathname === '/jobs') {
      setActiveLink('Free Jobs');
    } else if (pathname === '/playground') {
      setActiveLink('Templates');
    } else if (pathname === '/blog') {
      setActiveLink('Blog');
    } else if (pathname === '/audit') {
      setActiveLink('Resume Review');
    } else if (pathname === '/referrals') {
      setActiveLink('Referrals Hub');
    }
  }, [pathname]);

  const handleRedirect = (href) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  // Smooth scroll utility for homepage
  const scrollToSection = (sectionId) => {
    // Validate that sectionId is a valid CSS selector (starts with # for IDs)
    if (!sectionId || !sectionId.startsWith('#')) {
      console.warn('Invalid section ID provided to scrollToSection:', sectionId);
      return;
    }
    
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
      // Only call scrollToSection for valid CSS selectors (section IDs starting with #)
      if (link.href.startsWith('#')) {
        scrollToSection(link.href);
      } else {
        handleRedirect(link.href);
      }
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
        className={`fixed top-0 z-50 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 py-3 lg:py-4 transition-all duration-500 ${
          mobileMenuOpen 
            ? isDarkTheme
              ? 'bg-gray-900/95 backdrop-blur-3xl shadow-2xl border-b border-white/20'
              : 'bg-white/95 backdrop-blur-3xl shadow-2xl border-b border-white/20'
            : isDarkTheme
              ? isScrolled 
                ? 'bg-gray-900/90 backdrop-blur-2xl shadow-xl border-b border-white/20'
                : 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10'
              : pathname === '/'
                ? isScrolled
                  ? 'bg-white/10 backdrop-blur-md border-b border-white/20'
                  : 'bg-white/5 backdrop-blur-sm border-b border-white/10'
                : isScrolled 
                  ? 'bg-white/90 backdrop-blur-2xl shadow-xl border-b border-gray-200/50'
                  : 'bg-white/50 backdrop-blur-xl border-b border-gray-200/30'
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              H
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${
              isDarkTheme || (pathname === '/' && !isScrolled) ? 'text-white' : 'text-gray-800'
            }`}>
              HireLift
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            const isSpecialLink = link.name === 'Free Jobs' || link.name === 'Templates'|| link.name === 'Resume Review' || link.name === 'Free Review' || link.name === 'Referrals Hub' || link.name === 'Pricing';
            return (
              <div key={link.name} className="relative">
                <button
                  onClick={() => {
                    setActiveLink(link.name);
                    handleNavClick(link);
                  }}
                  className={`font-medium transition-all duration-300 cursor-pointer relative pb-2 whitespace-nowrap ${
                    isSpecialLink
                      ? isActive
                        ? (isDarkTheme || (pathname === '/' && !isScrolled))
                          ? 'text-white font-semibold bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 hover:bg-white/30'
                          : 'text-blue-700 font-semibold bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-300 hover:bg-blue-200'
                        : (isDarkTheme || (pathname === '/' && !isScrolled))
                          ? 'text-white/90 hover:text-white font-semibold bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/20'
                          : 'text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100'
                      : isActive
                        ? (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white font-semibold px-1' : 'text-gray-800 font-semibold px-1'
                        : (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white/90 hover:text-white px-1' : 'text-gray-600 hover:text-blue-600 px-1'
                  }`}
                >
                  {link.name}
                </button>
                
                {/* Animated underline for regular navigation links */}
                {!isSpecialLink && (
                  <motion.div
                    className={`absolute bottom-0 left-1 right-1 h-0.5 rounded-full ${
                      (isDarkTheme || (pathname === '/' && !isScrolled)) 
                        ? 'bg-white' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? 'calc(100% - 8px)' : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          {user ? (
            <>
              <button 
                onClick={() => handleRedirect('/dashboard')}
                className={`px-4 xl:px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg whitespace-nowrap ${
                  (isDarkTheme || (pathname === '/' && !isScrolled))
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className={`px-4 xl:px-6 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  (isDarkTheme || (pathname === '/' && !isScrolled))
                    ? 'text-white/90 hover:text-white border border-white/30 hover:border-white/50'
                    : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-blue-400'
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleRedirect('/auth')}
                className={`px-4 xl:px-6 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  (isDarkTheme || (pathname === '/' && !isScrolled))
                    ? 'text-white/90 hover:text-white border border-white/30 hover:border-white/50'
                    : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-blue-400'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => handleRedirect('/auth?mode=signup')}
                className={`px-4 xl:px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg whitespace-nowrap ${
                  (isDarkTheme || (pathname === '/' && !isScrolled))
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors duration-300 ${
            (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white hover:text-white' : 'text-gray-600 hover:text-gray-800'
          }`}
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
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative backdrop-blur-3xl border-b max-h-screen overflow-y-auto shadow-2xl transition-colors duration-500 ${
                isDarkTheme 
                  ? 'bg-gray-900/95 border-white/20'
                  : 'bg-white/95 border-gray-200/50'
              }`}
              style={{ 
                paddingTop: '84px', // Match header height exactly
                minHeight: '100vh'
              }}
            >
              <div className="px-4 sm:px-6 py-6 space-y-3 pb-20">
                {navLinks.map((link) => {
                  const isActive = activeLink === link.name;
                  const isSpecialLink = link.name === 'Free Jobs' || link.name === 'Templates';
                  return (
                    <motion.button
                      key={link.name}
                      onClick={() => {
                        setActiveLink(link.name);
                        handleNavClick(link);
                      }}
                      className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 relative ${
                        isSpecialLink
                          ? isActive
                            ? isDarkTheme
                              ? 'text-white bg-white/20 border border-white/30 font-semibold'
                              : 'text-blue-700 bg-blue-100 border border-blue-300 font-semibold'
                            : isDarkTheme
                              ? 'text-white/90 hover:text-white bg-white/10 border border-white/20 font-semibold hover:bg-white/20'
                              : 'text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 font-semibold hover:bg-blue-100'
                          : isActive
                            ? isDarkTheme
                              ? 'text-white bg-white/10 border border-white/20 font-semibold'
                              : 'text-gray-800 bg-blue-50 border border-blue-200 font-semibold'
                            : isDarkTheme
                              ? 'text-gray-200 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{link.name}</div>
                      <div className={`text-sm mt-1 transition-colors duration-300 ${
                        isSpecialLink
                          ? isActive 
                            ? isDarkTheme ? 'text-white/80' : 'text-blue-600'
                            : isDarkTheme ? 'text-white/70' : 'text-blue-500'
                          : isActive 
                            ? isDarkTheme ? 'text-gray-300' : 'text-blue-600'
                            : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      }`}>{link.description}</div>
                      
                      {/* Active indicator for mobile */}
                      {isActive && !isSpecialLink && (
                        <motion.div
                          className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${
                            isDarkTheme ? 'bg-white' : 'bg-gradient-to-b from-blue-500 to-indigo-500'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
                
                <div className={`pt-6 space-y-3 border-t mt-4 transition-colors duration-300 ${
                  isDarkTheme ? 'border-white/20' : 'border-gray-200'
                }`}>
                  {user ? (
                    <>
                      {/* <div className="text-gray-300 text-sm px-4">
                        Welcome, {user.email?.split('@')[0]}
                      </div> */}
                      <button 
                        onClick={() => handleRedirect('/dashboard')}
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center"
                      >
                        Go to Dashboard
                      </button>
                      <button 
                        onClick={handleLogout}
                        className={`block w-full py-3 px-4 rounded-lg transition-all duration-300 text-center ${
                          isDarkTheme 
                            ? 'text-white border border-white/30 hover:border-white/50'
                            : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleRedirect('/auth')}
                        className={`block w-full py-3 px-4 rounded-lg transition-all duration-300 text-center ${
                          isDarkTheme 
                            ? 'text-white border border-white/30 hover:border-white/50'
                            : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => handleRedirect('/auth?mode=signup')}
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center"
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
