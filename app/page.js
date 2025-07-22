'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How it Helps", href: "#how-it-helps" },
  { name: "Pricing", href: "#pricing" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full flex items-center justify-between px-6 py-4 bg-[var(--background)] backdrop-blur-lg sticky top-0 z-50 glass shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xl shadow-md">
            <span className="z-10">H</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight gradient-text">HireLift</span>
        </div>
        
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
              whileHover={{ scale: 1.05 }}
              className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium smooth relative overflow-hidden group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
        </motion.nav>
        
        <div className="flex items-center gap-4">
          <motion.div
            variants={popUp}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              href="/auth" 
              className="hidden md:inline-block px-5 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-light)] smooth btn"
            >
              Login
            </Link>
          </motion.div>
          
          <motion.div
            variants={popUp}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              href="/auth?mode=signup" 
              className="hidden md:inline-block px-5 py-2 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-semibold hover:bg-[var(--primary)] hover:text-white smooth btn"
            >
              Signup
            </Link>
          </motion.div>
          
          <motion.button 
            variants={popUp}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg bg-[var(--primary)] text-white"
          >
            ☰
          </motion.button>
        </div>
      </motion.header>      {/* Hero Section */}
      <section id="home" className="relative flex flex-col md:flex-row items-center justify-between gap-10 px-6 py-16 md:py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gray-100)] via-white to-[var(--accent-light)] opacity-50 -z-10"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.2,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="flex-1 flex flex-col gap-6 items-start max-w-xl z-10 ml-8"
        >
          <div className="inline-block px-3 py-1 bg-[var(--accent-light)] text-[var(--accent-dark)] rounded-full text-sm font-semibold mb-2">
            Your career game-changer
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="block gradient-text"
            >
              Lift your chances.
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="block text-[var(--foreground)]"
            >
              Land your dream job.
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-lg md:text-xl text-[var(--gray-600)] max-w-xl mb-4"
          >
            AI-powered resume audits, curated HR contacts, and personalized outreach templates. Everything you need to stand out and get hired—faster.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              href="/audit" 
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 btn"
            >
              Upload Resume for Audit
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="flex items-center gap-2 mt-6 text-sm text-[var(--gray-600)]"
          >
            <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free ATS compatibility check</span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.5,
            ease: "easeOut"
          }}
          className="flex-1 flex justify-center items-center z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-300"></div>
            <div className="relative bg-white rounded-2xl p-5 shadow-2xl">
              <Image 
                src="/hirelift_home.webp" 
                alt="Resume Audit" 
                width={500} 
                height={400} 
                className="drop-shadow-xl rotate-y-180"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[var(--background)]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--primary)] mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-[var(--background-light)] rounded-2xl shadow-lg p-8 flex flex-col gap-4 items-start smooth">
            <h3 className="text-xl font-bold text-[var(--secondary)]">Resume Audit</h3>
            <p className="text-[var(--foreground)]">Get a detailed, ATS-friendly review of your resume. Receive actionable feedback to increase your chances of being shortlisted by recruiters and passing automated screening systems.</p>
            <h3 className="text-xl font-bold text-[var(--secondary)] mt-6">LinkedIn Audit</h3>
            <p className="text-[var(--foreground)]">Optimize your LinkedIn profile for maximum visibility. Our audit ensures your profile is ATS-friendly, highlights your strengths, and boosts your chances of being shortlisted by top companies.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-[var(--background-light)] rounded-2xl shadow-lg p-8 flex flex-col gap-4 items-start smooth">
            <h3 className="text-xl font-bold text-[var(--primary)]">Curated HR & Company Lists</h3>
            <p className="text-[var(--foreground)]">Access a curated list of HR contacts and company details tailored to your job role and requirements. Save time and connect directly with decision-makers.</p>
            <h3 className="text-xl font-bold text-[var(--primary)] mt-6">Personalized Outreach Templates</h3>
            <p className="text-[var(--foreground)]">Get ready-to-use, personalized email and DM templates, custom-curated for your profile. Make your outreach stand out and get noticed by recruiters.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-[var(--background-light)] rounded-2xl shadow-lg p-8 flex flex-col gap-4 items-start smooth">
            <h3 className="text-xl font-bold text-[var(--background-dark)]">AI Powered Job Assistance <span className="text-xs bg-[var(--secondary)] text-white px-2 py-0.5 rounded-full ml-2">Coming Soon</span></h3>
            <p className="text-[var(--foreground)]">Unlock the future of job search with AI audits, guidance on future skills, project recommendations, and realistic company matches. Stay ahead with actionable insights and personalized career advice.</p>
          </div>
        </div>
      </section>

      {/* How it Helps Section */}
      <section id="how-it-helps" className="py-20 px-6 bg-gradient-to-br from-[var(--background-light)] to-[var(--accent)] smooth">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--primary)] mb-10">How HireLift Helps You</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[var(--secondary)]">Stand Out Instantly</h3>
            <p className="text-[var(--foreground)]">With ATS-friendly audits and personalized templates, your application rises above the rest—no more getting lost in the pile.</p>
            <h3 className="text-xl font-bold text-[var(--primary)] mt-6">Direct Connections</h3>
            <p className="text-[var(--foreground)]">Curated HR and company lists mean you reach the right people, faster. No more cold outreach that goes nowhere.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[var(--background-dark)]">Future-Proof Your Career</h3>
            <p className="text-[var(--foreground)]">AI-powered guidance (coming soon) helps you learn the right skills, work on the right projects, and target the right companies for your growth.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[var(--background)]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--primary)] mb-10">Pricing</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-[var(--background-light)] rounded-2xl shadow-lg p-8 flex flex-col items-center smooth">
            <h3 className="text-xl font-bold text-[var(--primary)] mb-2">Free</h3>
            <p className="text-3xl font-extrabold text-[var(--foreground)] mb-4">₹0</p>
            <ul className="mb-6 text-[var(--foreground)]">
              <li>1 Basic Resume Audit</li>
              <li>1 Basic LinkedIn Audit</li>
              <li>Email/DM Templates</li>
            </ul>
            <Link href="/auth" className="px-6 py-2 cursor-pointer rounded-full bg-[var(--primary)] text-white font-semibold hover:bg-[var(--secondary)] smooth">Get Started</Link>
          </div>
          {/* Pro Plan */}
          <div className="bg-[var(--primary)] rounded-2xl shadow-xl p-8 flex flex-col items-center scale-105 border-4 border-[var(--accent)] smooth">
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-3xl font-extrabold text-white mb-4">₹49</p>
            <ul className="mb-6 text-white">
              <li>Unlimited Advanced Resume & LinkedIn Audit</li>
              <li>Curated HR & Company Lists</li>
              <li>Personalized Outreach Templates</li>
            </ul>
            <Link href="/pricing" className="px-6 py-2 rounded-full bg-[var(--secondary)] text-[var(--background-light)] cursor-pointer font-semibold hover:bg-[var(--background-dark)] hover:text-white smooth">Upgrade</Link>
          </div>
          {/* Coming Soon Plan */}
          <div className="bg-[var(--background-light)] rounded-2xl shadow-lg p-8 flex flex-col items-center opacity-70 smooth">
            <h3 className="text-xl font-bold text-[var(--secondary)] mb-2">AI Assistant <div className="text-xs text-center bg-[var(--secondary)] text-white px-2 py-0.5 rounded-full">Coming Soon</div></h3>
            <p className="text-3xl font-extrabold text-[var(--foreground)] mb-4">₹499</p>
            <ul className="mb-6 text-[var(--foreground)]">
              <li>AI Job Assistance</li>
              <li>Future Skills & Projects Guidance</li>
              <li>Company Recommendations</li>
            </ul>
            <button className="px-6 py-2 rounded-full bg-[var(--secondary)] text-white font-semibold cursor-not-allowed" disabled>Notify Me</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-[var(--background-dark)] text-[var(--background-light)] flex flex-col md:flex-row items-center justify-between gap-4 mt-auto smooth">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl">H</span>
          <span className="text-xl font-extrabold tracking-tight text-[var(--primary)]">HireLift</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:underline hover:text-[var(--accent)] smooth">Features</a>
          <a href="#how-it-helps" className="hover:underline hover:text-[var(--accent)] smooth">How it Helps</a>
          <a href="#pricing" className="hover:underline hover:text-[var(--accent)] smooth">Pricing</a>
        </div>
        <div className="text-sm">&copy; {new Date().getFullYear()} HireLift. All rights reserved.</div>
      </footer>
    </div>
  );
} 