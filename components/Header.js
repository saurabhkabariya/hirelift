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
      setIsScrolled(scrollY > 50);
      
      // Only apply dark theme detection on homepage
      if (pathname === '/') {
        // Detect dark sections (FinalCTA section and Footer)
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Check if we're in the last ~40% of the page (where dark sections are)
        const isInDarkSection = scrollY > documentHeight - (windowHeight * 2.5);
        setIsDarkTheme(isInDarkSection);
      } else {
        // For other pages (playground, blog, etc.), use light theme
        setIsDarkTheme(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Different navigation links for different pages
  const defaultNavLinks = [
    { name: "Home", href: "#home", description: "AI-powered resume optimization platform" },
    { name: "How it Works", href: "#how-it-works", description: "3-step process to optimize your job search" },
    { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
    { name: "Blog", href: "/blog", description: "Latest insights and tips for job seekers", isExternal: true },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "Resume Review", href: "/audit", description: "Get your resume's ATS score and suggestions for improvement.", isExternal: true },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Referrals Hub", href: "/referrals", description: "Find referral opportunities and manage your network", isExternal: true, isSpecial: true }
  ];

  const blogNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "How it Works", href: "/#how-it-works", description: "3-step process to optimize your job search", isExternal: true },
    { name: "Pricing", href: "/#pricing", description: "Affordable plans for every job seeker", isExternal: true },
    { name: "Free Jobs", href: "/jobs", description: "Browse 1000+ free remote job opportunities", isExternal: true },
    { name: "Free Review", href: "/audit", description: "Get your resume's ATS score and suggestions for improvement.", isExternal: true },
    { name: "Templates", href: "/playground", description: "Free email and LinkedIn templates", isExternal: true },
    { name: "Referrals Hub", href: "/referrals", description: "Find referral opportunities and manage your network", isExternal: true, isSpecial: true }
  ];

  const playgroundNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "How it Works", href: "/#how-it-works", description: "3-step process to optimize your job search", isExternal: true },
    { name: "Pricing", href: "/#pricing", description: "Affordable plans for every job seeker", isExternal: true },
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
      setActiveLink('Home');
    } else if (pathname === '/jobs') {
      setActiveLink('Free Jobs');
    } else if (pathname === '/playground') {
      setActiveLink('Templates');
    } else if (pathname === '/blog') {
      setActiveLink('Blog');
    } else if (pathname === '/referrals') {
      setActiveLink('Referrals Hub');
    } else if (pathname.includes('#pricing')) {
      setActiveLink('Pricing');
    }

    // Handle scroll-based section detection for homepage
    if (pathname === '/') {
      const handleScroll = () => {
        const sections = ['#home', '#how-it-works', '#proof-trust', '#pricing'];
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
        else if (currentSection === '#proof-trust') setActiveLink('Testimonials');
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
              ? 'bg-gray-900/95 backdrop-blur-3xl shadow-2xl border-b border-cyan-400/60 shadow-cyan-500/20'
              : 'bg-white/70 backdrop-blur-3xl shadow-2xl border-b border-cyan-300/60 shadow-cyan-200/30'
            : isDarkTheme
              ? isScrolled 
                ? 'bg-gray-900/90 backdrop-blur-2xl shadow-xl border-b border-cyan-400/50 shadow-cyan-500/15'
                : 'bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-cyan-400/40 shadow-cyan-500/10'
              : isScrolled 
                ? 'bg-white/60 backdrop-blur-2xl shadow-xl border-b border-cyan-200/50 shadow-cyan-200/20'
                : 'bg-gradient-to-r from-white/50 via-cyan-50/20 to-white/50 backdrop-blur-xl shadow-lg border-b border-cyan-200/40 shadow-cyan-100/25'
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
              isDarkTheme ? 'text-white' : 'text-gray-800'
            }`}>
              HireLift
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            const isSpecialLink = link.name === 'Free Jobs' || link.name === 'Templates'|| link.name === 'Resume Review' || link.name === 'Free Review' || link.name === 'Referrals Hub';
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
                        ? isDarkTheme
                          ? 'text-cyan-300 font-semibold bg-cyan-900/50 px-3 py-1.5 rounded-lg border border-cyan-400/50 hover:bg-cyan-800/50'
                          : 'text-cyan-700 font-semibold bg-cyan-100 px-3 py-1.5 rounded-lg border border-cyan-300 hover:bg-cyan-200'
                        : isDarkTheme
                          ? 'text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-900/30 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:bg-cyan-800/40'
                          : 'text-cyan-600 hover:text-cyan-700 font-semibold bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200 hover:bg-cyan-100'
                      : isActive
                        ? isDarkTheme ? 'text-white font-semibold px-1' : 'text-gray-800 font-semibold px-1'
                        : isDarkTheme ? 'text-gray-300 hover:text-cyan-300 px-1' : 'text-gray-600 hover:text-cyan-600 px-1'
                  }`}
                >
                  {link.name}
                </button>
                
                {/* Animated underline for regular navigation links */}
                {!isSpecialLink && (
                  <motion.div
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
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
                className="px-4 xl:px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap"
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className={`px-4 xl:px-6 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-cyan-400'
                    : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-cyan-400'
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
                  isDarkTheme 
                    ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-cyan-400'
                    : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-cyan-400'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => handleRedirect('/auth?mode=signup')}
                className="px-4 xl:px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap"
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
            isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
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
                  ? 'bg-gray-900/95 border-cyan-400/50'
                  : 'bg-white/80 border-cyan-200/50'
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
                              ? 'text-cyan-300 bg-cyan-900/50 border border-cyan-400/50 font-semibold'
                              : 'text-cyan-700 bg-cyan-100 border border-cyan-300 font-semibold'
                            : isDarkTheme
                              ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-900/30 border border-cyan-500/30 font-semibold hover:bg-cyan-800/40'
                              : 'text-cyan-600 hover:text-cyan-700 bg-cyan-50 border border-cyan-200 font-semibold hover:bg-cyan-100'
                          : isActive
                            ? isDarkTheme
                              ? 'text-white bg-cyan-900/30 border border-cyan-400/30 font-semibold'
                              : 'text-gray-800 bg-cyan-50 border border-cyan-200 font-semibold'
                            : isDarkTheme
                              ? 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-900/20'
                              : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50'
                      }`}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{link.name}</div>
                      <div className={`text-sm mt-1 transition-colors duration-300 ${
                        isSpecialLink
                          ? isActive 
                            ? isDarkTheme ? 'text-cyan-200' : 'text-cyan-600'
                            : isDarkTheme ? 'text-cyan-300' : 'text-cyan-500'
                          : isActive 
                            ? isDarkTheme ? 'text-cyan-200' : 'text-cyan-600'
                            : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      }`}>{link.description}</div>
                      
                      {/* Active indicator for mobile */}
                      {isActive && !isSpecialLink && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-r-full"
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
                
                <div className={`pt-6 space-y-3 border-t mt-4 transition-colors duration-300 ${
                  isDarkTheme ? 'border-cyan-400/30' : 'border-cyan-200/30'
                }`}>
                  {user ? (
                    <>
                      {/* <div className="text-gray-300 text-sm px-4">
                        Welcome, {user.email?.split('@')[0]}
                      </div> */}
                      <button 
                        onClick={() => handleRedirect('/dashboard')}
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-center"
                      >
                        Go to Dashboard
                      </button>
                      <button 
                        onClick={handleLogout}
                        className={`block w-full py-3 px-4 rounded-lg transition-all duration-300 text-center ${
                          isDarkTheme 
                            ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-cyan-400'
                            : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-cyan-400'
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
                            ? 'text-gray-300 hover:text-white border border-gray-600 hover:border-cyan-400'
                            : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-cyan-400'
                        }`}
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => handleRedirect('/auth?mode=signup')}
                        className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-center"
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
