'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackButton from '../components/feedback/FeedbackButton';
import { 
  FaCheckCircle, 
  FaBars, 
  FaTimes, 
  FaRocket, 
  FaUsers, 
  FaLinkedin, 
  FaSquareXTwitter, 
  FaEnvelope,
  FaEdit,
  FaStar,
  FaChartLine,
  FaBuilding,
  FaUserTie,
  FaCrown,
  FaInfinity,
  FaShieldAlt,
  FaAward
} from 'react-icons/fa';
import { IoSparkles } from "react-icons/io5";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [atsScore, setAtsScore] = useState(25);

  useEffect(() => {
    setMounted(true);
    
    // Animate ATS score improvement
    const timer = setTimeout(() => {
      setAtsScore(95);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  if (!mounted) {
    return null;
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const popUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-lg border-b border-blue-100"
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            <span className="z-10">H</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HireLift
          </span>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.nav 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="hidden md:flex gap-8"
        >
          {navLinks.map(link => (
            <motion.a
              key={link.name}
              href={link.href}
              variants={popUp}
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-gray-700 hover:text-blue-600 font-semibold relative overflow-hidden group transition-colors duration-200"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
        </motion.nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div
            variants={popUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/auth" 
              className="px-6 py-2 rounded-xl text-blue-600 border border-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              Login
            </Link>
          </motion.div>
          
          <motion.div
            variants={popUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/auth?mode=signup" 
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
        
        {/* Mobile Menu Button */}
        <motion.button 
          variants={popUp}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-blue-600 text-white shadow-lg"
        >
          {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </motion.button>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-blue-100 sticky top-[72px] z-40 shadow-lg"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 font-semibold py-2 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Link 
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 rounded-xl text-center text-blue-600 font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  href="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 rounded-xl text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center px-6 pt-10 pb-16 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10 h-full">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
            >
              <FaRocket className="w-4 h-4" />
              Escape Unemployment Hell
            </motion.div>            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-extrabold leading-tight"
            >
              <span className="block text-gray-900">Break Free from</span>
              <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Job Rejection
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get Hired Fast
              </span>
            </motion.h1>            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-600 max-w-2xl leading-relaxed"
            >
              Transform your job search with AI-powered resume audits, direct HR connections, 
              and personalized outreach templates. Join Other job seekers 
              who landed their dream jobs.
            </motion.p>            {/* Stats */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-6 py-2"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-xs text-gray-500">ATS Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">10k+</div>
                <div className="text-xs text-gray-500">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24hrs</div>
                <div className="text-xs text-gray-500">Avg. Response</div>
              </div>
            </motion.div> */}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/audit" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <FaCheckCircle className="w-5 h-5" />
                  Start Free Audit
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full">FREE</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/playground" 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all duration-300"
                >
                  <FaEdit className="w-5 h-5" />
                  Try Playground
                </Link>
              </motion.div>
            </motion.div>            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Trusted by other job seekers
              </div>
            </motion.div>
          </motion.div>          {/* Right Content - ATS Score Animation */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center items-start pt-8"
          >
            <ATSScoreAnimation score={atsScore} />
          </motion.div>
        </div>
      </section>      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Escape <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Unemployment Hell</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop getting rejected. Start getting hired. Our proven 3-step process transforms your job search.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1: ATS Score Improvement */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="relative mb-8">
                <ATSScoreComparison />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fix Your ATS Score</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your resume and identifies exactly why you&apos;re getting rejected. 
                Transform your low ATS score into a high-performing resume that passes all screening systems.
              </p>
            </motion.div>

            {/* Step 2: Direct HR Connections */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="relative mb-8">
                <HRConnectionDemo />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect with HRs Directly</h3>
              <p className="text-gray-600 leading-relaxed">
                Access curated lists of HR contacts and company details. No more applying into the void - 
                reach decision-makers directly with their LinkedIn, email, and social profiles.
              </p>
            </motion.div>

            {/* Step 3: Personalized Outreach */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="relative mb-8">
                <OutreachTemplateDemo />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Send Winning Messages</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our proven outreach templates that get responses. Customize professional emails 
                and LinkedIn messages that make HRs want to interview you.
              </p>
            </motion.div>
          </div>

          {/* Results Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-3xl font-bold mb-4">The Result? You Get Hired!</h3>
            <p className="text-xl opacity-90 mb-6">
              Join other professionals who escaped unemployment hell and landed their dream jobs
            </p>
            {/* <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold">10k+</div>
                <div className="opacity-80">Success Stories</div>
              </div>
              <div>
                <div className="text-4xl font-bold">95%</div>
                <div className="opacity-80">Interview Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold">3x</div>
                <div className="opacity-80">Faster Hiring</div>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get Hired</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop wasting time on job applications that go nowhere. Our comprehensive toolkit gets you hired faster.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1: Resume Audit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <FaCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Resume Audit</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get instant feedback on your resume with our AI-powered audit. Identify exactly what&apos;s 
                blocking your applications and fix it in minutes.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  ATS Compatibility Score
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Keyword Optimization
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Section Analysis
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Instant Improvements
                </li>
              </ul>
              <Link 
                href="/audit"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Try Free Audit <FaRocket className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Feature 2: HR Directory */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <FaBuilding className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">HR Directory</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access curated lists of HR contacts and company details. Connect directly with 
                decision-makers instead of applying through black holes.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Direct HR Contacts
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  LinkedIn Profiles
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Company Details
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Social Profiles
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                Premium Feature <FaCrown className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Feature 3: Outreach Templates */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <FaEdit className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Templates</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Use proven outreach templates that get responses. Customize professional emails 
                and LinkedIn messages in our interactive playground.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Email Templates
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  LinkedIn Messages
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Live Preview
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  Instant Download
                </li>
              </ul>
              <Link 
                href="/playground"
                className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Try Playground <FaEdit className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Success Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get unlimited resume audits, advanced ATS analysis, and personalized recommendations to land your dream job.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 relative"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-extrabold text-gray-900 mb-4">₹0</div>
                <p className="text-gray-600">Perfect for trying out our service</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">1 Basic Resume Audit</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Email/DM Templates With Playground</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Basic ATS Score</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Standard Support</span>
                </li>
              </ul>
              
              <Link 
                href="/audit"
                className="w-full py-3 px-6 rounded-xl bg-gray-600 text-white font-semibold text-center block hover:bg-gray-700 transition-colors duration-200"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-8 relative scale-105"
            >
              {/* Popular Badge */}
              {/* <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <FaStar className="w-4 h-4" />
                  Most Popular
                </div>
              </div> */}

              {/* Sale Badge */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white text-center py-3 text-sm font-bold rounded-t-2xl">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg animate-bounce">🔥</span>
                  <span className="text-base font-extrabold tracking-wide">50% OFF</span>
                  <span className="text-lg animate-bounce">🔥</span>
                </div>
                <div className="text-xs opacity-90 mt-1 font-medium">
                  Limited Time - Ends August 31, 2025
                </div>
              </div>
              
              <div className="text-center mb-6 pt-16">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaCrown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
                
                {/* Pricing with Strike-through */}
                <div className="mb-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-red-500 line-through opacity-75">₹199</span>
                    <span className="text-red-500 ml-1 text-sm line-through opacity-75">/month</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-4xl font-extrabold text-green-600">₹99</span>
                    <span className="text-green-600 ml-1 font-semibold">/month</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-full mt-3">
                    <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-green-300 shadow-lg">
                      💰 Save ₹100 this month!
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600">Most popular for job seekers</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited Resume Audits</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Curated HR & Company Lists</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Personalized Outreach Templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Advanced ATS Analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Keyword Optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Priority Support</span>
                </li>
              </ul>
              
              <Link 
                href="/pricing"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-center block hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Subscribe Monthly
              </Link>
            </motion.div>

            {/* AI Assistant Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 relative opacity-75"
            >
              {/* Coming Soon Badge */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-center py-2 text-sm font-medium rounded-t-2xl">
                <div className="flex items-center justify-center gap-2">
                  <IoSparkles className="w-4 h-4" />
                  Coming Soon
                </div>
              </div>
              
              <div className="text-center mb-6 pt-12">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IoSparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Assistant</h3>
                <div className="text-4xl font-extrabold text-gray-900 mb-4">₹499</div>
                <p className="text-gray-600">Coming soon - AI-powered career guidance</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">AI Job Assistance</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Future Skills Guidance</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Project Recommendations</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Company Matching</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Expert Consultation</span>
                </li>
              </ul>
              
              <button 
                className="w-full py-3 px-6 rounded-xl bg-gray-300 text-gray-500 font-semibold text-center cursor-not-allowed"
                disabled
              >
                Notify Me
              </button>
            </motion.div>
          </div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gray-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Choose HireLift?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Analysis</h4>
                <p className="text-sm text-gray-600">Get your ATS score in seconds</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
                <p className="text-sm text-gray-600">Your data is protected and never shared</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaInfinity className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Unlimited Audits</h4>
                <p className="text-sm text-gray-600">Improve your resume continuously</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaUserTie className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert Support</h4>
                <p className="text-sm text-gray-600">Get help when you need it</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  <span>H</span>
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  HireLift
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Your career acceleration partner. Get noticed by recruiters with optimized resumes and direct HR connections.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <FaSquareXTwitter className="w-5 h-5" />
                </a>
                <a href="mailto:hirelift01@gmail.com" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  <FaEnvelope className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-white transition-colors">How it Works</a>
                <a href="#pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <Link href="/auth" className="block text-gray-400 hover:text-white transition-colors">Get Started</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-white mb-6">Services</h4>
              <div className="space-y-3">
                <Link href="/audit" className="block text-gray-400 hover:text-white transition-colors">Resume Audit</Link>
                <Link href="/playground" className="block text-gray-400 hover:text-white transition-colors">Template Playground</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing Plans</Link>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">HR Directory <span className="text-xs bg-purple-600 px-2 py-1 rounded">Premium</span></a>
              </div>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="font-bold text-white mb-6">Legal & Support</h4>
              <div className="space-y-3">
                <a href="mailto:hirelift01@gmail.com" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
                <Link href="/refund" className="block text-gray-400 hover:text-white transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400">
              &copy; {new Date().getFullYear()} HireLift. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-gray-400">
              <span className="flex items-center gap-2">
                Made with <span className="text-red-500">❤️</span> for job seekers
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}

// ATS Score Animation Component
function ATSScoreAnimation({ score }) {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-56 h-56 bg-white rounded-3xl shadow-2xl p-6 border border-gray-200"
      >
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your ATS Score</h3>
          
          {/* Circular Progress */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={339.292}
                initial={{ strokeDashoffset: 339.292 }}
                animate={{ strokeDashoffset: 339.292 - (score / 100) * 339.292 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <div className={`text-2xl font-bold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {score}
                </div>
                <div className="text-xs text-gray-500">/ 100</div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className={`text-xs font-semibold px-3 py-2 rounded-full ${
              score >= 80 ? 'bg-green-100 text-green-700' : 
              score >= 50 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'
            }`}
          >
            {score >= 80 ? 'Excellent!' : score >= 50 ? 'Good Progress' : 'Needs Improvement'}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ATS Score Comparison Component
function ATSScoreComparison() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">Before</div>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-red-600">25</span>
          </div>
          <div className="text-xs text-red-600 mt-2 font-semibold">Poor ATS Score</div>
        </div>
        
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-blue-600"
        >
          <FaRocket className="w-8 h-8" />
        </motion.div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">After</div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">95</span>
          </div>
          <div className="text-xs text-green-600 mt-2 font-semibold">Excellent Score</div>
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Rejection Rate</span>
          <span>Interview Rate</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "25%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 2, delay: 1 }}
            className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// HR Connection Demo Component
function HRConnectionDemo() {
  const hrProfiles = [
    { name: "Sarah Johnson", company: "Google", role: "Senior Recruiter" },
    { name: "Mike Chen", company: "Microsoft", role: "Talent Acquisition" },
    { name: "Emily Davis", company: "Amazon", role: "HR Manager" }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="text-center mb-4">
        <FaBuilding className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <div className="text-sm font-semibold text-gray-900">Direct HR Access</div>
      </div>
      
      <div className="space-y-3">
        {hrProfiles.map((hr, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUserTie className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">{hr.name}</div>
              <div className="text-xs text-gray-500 truncate">{hr.company} • {hr.role}</div>
            </div>
            <div className="flex gap-1">
              <FaLinkedin className="w-3 h-3 text-blue-600" />
              <FaEnvelope className="w-3 h-3 text-gray-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Outreach Template Demo Component
function OutreachTemplateDemo() {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const templates = [
    "Hi [Name], I'm impressed by [Company]'s innovative approach...",
    "Dear [Name], Your recent post about [Topic] resonated with me...",
    "Hello [Name], I'd love to discuss how my skills in [Skill]..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTemplate((prev) => (prev + 1) % templates.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [templates.length]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="text-center mb-4">
        <FaEdit className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <div className="text-sm font-semibold text-gray-900">Smart Templates</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="text-xs text-gray-500 ml-2">Template Editor</div>
        </div>
        
        <motion.div
          key={currentTemplate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-700 leading-relaxed"
        >
          {templates[currentTemplate]}
        </motion.div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-1">
            {templates.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentTemplate ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-green-600 font-semibold">✓ Ready to send</div>
        </div>
      </div>
    </div>
  );
}