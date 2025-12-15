'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown, FaFileAlt, FaUsers, FaBriefcase, FaBuilding, FaEnvelope, FaStar } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ variant = 'default' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();

  // Tools menu items with icons
  const toolsMenuItems = [
    { 
      name: "Resume Review", 
      href: "/audit", 
      description: "Free ATS score & optimization tips",
      icon: FaFileAlt,
      color: "from-blue-500 to-cyan-500",
      badge: "Popular"
    },
    { 
      name: "Referrals Hub", 
      href: "/referrals", 
      description: "Get employee referrals",
      icon: FaUsers,
      color: "from-purple-500 to-pink-500",
      badge: "Popular"
    },
    { 
      name: "Free Jobs", 
      href: "/jobs", 
      description: "1000+ remote opportunities",
      icon: FaBriefcase,
      color: "from-green-500 to-emerald-500"
    },
    { 
      name: "HR Directory", 
      href: "/company-search", 
      description: "Connect with hiring managers",
      icon: FaBuilding,
      color: "from-orange-500 to-red-500"
    },
    { 
      name: "Email Templates", 
      href: "/playground", 
      description: "Cold email & LinkedIn templates",
      icon: FaEnvelope,
      color: "from-indigo-500 to-blue-500"
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { name: "Features", href: "#features", description: "Everything you need to get hired" },
    { name: "Testimonials", href: "#testimonials", description: "Success stories from job seekers" },
    { name: "Pricing", href: "#pricing", description: "Affordable plans for every job seeker" },
    { name: "Blog", href: "/blog", description: "Career tips & guides", isExternal: true }
  ];

  const blogNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "Blog", href: "/blog", description: "All articles", isExternal: true },
    { name: "Pricing", href: "/pricing", description: "View plans", isExternal: true }
  ];

  const otherPagesNavLinks = [
    { name: "Home", href: "/", description: "Back to homepage", isExternal: true },
    { name: "Features", href: "/#features", description: "See features", isExternal: true },
    { name: "Pricing", href: "/pricing", description: "View plans", isExternal: true },
    { name: "Blog", href: "/blog", description: "Career insights", isExternal: true }
  ];

  // Determine which navigation links to use based on current pathname
  const getNavLinks = () => {
    if (variant === 'blog' || pathname.startsWith('/blog')) return blogNavLinks;
    if (pathname === '/') return defaultNavLinks;
    return otherPagesNavLinks;
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
    } else if (pathname.startsWith('/blog')) {
      setActiveLink('Blog');
    } else if (pathname === '/pricing') {
      setActiveLink('Pricing');
    } else {
      // Check if current path matches any tool item
      const currentTool = toolsMenuItems.find(item => item.href === pathname);
      if (currentTool) {
        setActiveLink('Tools');
      }
    }
  }, [pathname, toolsMenuItems]);

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
            return (
              <div key={link.name} className="relative">
                <button
                  onClick={() => {
                    setActiveLink(link.name);
                    handleNavClick(link);
                  }}
                  className={`font-medium transition-all duration-300 cursor-pointer relative pb-2 whitespace-nowrap ${
                    isActive
                      ? (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white font-semibold px-1' : 'text-gray-800 font-semibold px-1'
                      : (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white/90 hover:text-white px-1' : 'text-gray-600 hover:text-blue-600 px-1'
                  }`}
                >
                  {link.name}
                </button>
                
                {/* Animated underline */}
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
              </div>
            );
          })}

          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              className={`font-medium transition-all duration-300 cursor-pointer relative pb-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeLink === 'Tools'
                  ? (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white font-semibold px-1' : 'text-gray-800 font-semibold px-1'
                  : (isDarkTheme || (pathname === '/' && !isScrolled)) ? 'text-white/90 hover:text-white px-1' : 'text-gray-600 hover:text-blue-600 px-1'
              }`}
            >
              Tools
              <motion.div
                animate={{ rotate: toolsDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown className="w-3 h-3" />
              </motion.div>
            </button>

            {/* Animated underline */}
            <motion.div
              className={`absolute bottom-0 left-1 right-1 h-0.5 rounded-full ${
                (isDarkTheme || (pathname === '/' && !isScrolled)) 
                  ? 'bg-white' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: (activeLink === 'Tools' || toolsDropdownOpen) ? 'calc(100% - 8px)' : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            {/* Dropdown Menu */}
            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                >
                  <div className="p-2">
                    {toolsMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.name}
                          onClick={() => {
                            handleRedirect(item.href);
                            setToolsDropdownOpen(false);
                            setActiveLink('Tools');
                          }}
                          className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group relative overflow-hidden"
                          whileHover={{ x: 4 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Premium footer */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-center">
                    <p className="text-white text-sm font-medium flex items-center justify-center gap-2">
                      <FaStar className="w-4 h-4 text-yellow-300" />
                      All tools designed to get you a job faster!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                  return (
                    <motion.button
                      key={link.name}
                      onClick={() => {
                        setActiveLink(link.name);
                        handleNavClick(link);
                      }}
                      className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 relative ${
                        isActive
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
                        isActive 
                          ? isDarkTheme ? 'text-gray-300' : 'text-blue-600'
                          : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      }`}>{link.description}</div>
                      
                      {/* Active indicator for mobile */}
                      {isActive && (
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

                {/* Mobile Tools Section */}
                <div className={`pt-4 border-t ${isDarkTheme ? 'border-white/20' : 'border-gray-200'}`}>
                  <button
                    onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-between ${
                      isDarkTheme
                        ? 'text-white bg-white/10 border border-white/20 font-semibold'
                        : 'text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaStar className={`w-4 h-4 ${isDarkTheme ? 'text-yellow-300' : 'text-blue-600'}`} />
                      <span className="font-semibold">Best Tools</span>
                    </div>
                    <motion.div
                      animate={{ rotate: mobileToolsOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {mobileToolsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2">
                          {toolsMenuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                              <motion.button
                                key={item.name}
                                onClick={() => {
                                  handleRedirect(item.href);
                                  setMobileMenuOpen(false);
                                  setMobileToolsOpen(false);
                                }}
                                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                                  isDarkTheme
                                    ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-200'
                                }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                                        {item.name}
                                      </span>
                                      {item.badge && (
                                        <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-sm mt-0.5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
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
