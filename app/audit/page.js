"use client";
import AuditResultCard from "@/components/AuditResultCard";
import JOB_ROLES from "@/data/jobRoles";
import FeedbackButton from "../../components/feedback/FeedbackButton";
import UpgradeCTA from "../../components/UpgradeCTA";
import AuditExhaustedPopup from "../../components/conversion/AuditExhaustedPopup";
import EnhancedATSReport from "@/components/ui/EnhancedATSReport";
import { useState, useRef, useCallback, useEffect } from "react";
import { FaFilePdf, FaUserTie, FaSearch, FaCheckCircle, FaExclamationCircle, FaUserEdit, FaChevronDown, FaTimesCircle, FaBuilding, FaCrown, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { LogOut, User, CreditCard, Home, BarChart } from "lucide-react";
import Head from "next/head";
import { usePageLoading } from "@/hooks/usePageLoading";

export default function ResumeAuditPage() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(JOB_ROLES[0].label);
  const [customKeywords, setCustomKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExhaustedPopup, setShowExhaustedPopup] = useState(false);
  const inputRef = useRef();
  const { user, loading: userLoading, refetchUser, signOutUser } = useAuth();
  const router = useRouter();  
  const { executeWithLoading, navigateWithLoading } = usePageLoading();

  
  
  // Handle logout
  const handleLogout = async () => {
    await signOutUser();
    navigateWithLoading('/auth', 'Signing out...');
  };


  // State for local audit count (for non-logged-in users)
  const [localAuditCount, setLocalAuditCount] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("auditCount") || "0", 10);
    }
    return 0;
  });

  // State for real-time audit count display
  const [currentAuditCount, setCurrentAuditCount] = useState(0);

  // Update current audit count when user data changes or local count changes
  useEffect(() => {
    if (user && typeof user.auditCount === 'number') {
      // For logged-in users, use server audit count
      setCurrentAuditCount(user.auditCount);
    } else {
      // For non-logged-in users, use local audit count
      setCurrentAuditCount(localAuditCount);
    }
  }, [user, localAuditCount]);

  // Cleanup body scroll on component unmount or mobile menu close
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Helper: isPremium and auditCount
  const isPremium = user?.isPremium || false;
  const auditCount = currentAuditCount;
  
  // Show loading for audit count if user is loading
  const auditCountDisplay = userLoading ? '...' : auditCount;
  // Block further audits for non-premium users after 1
  const canAudit = isPremium || auditCount < 1;

  // Download PDF logic (robust, print-friendly)
  const handleDownloadAudit = async () => {
    if (!result) return;
    // Render print-friendly audit result in hidden div
    const pdfDiv = document.getElementById("audit-pdf-section");
    if (!pdfDiv) return alert("PDF section not found");
    pdfDiv.style.display = "block";
    try {
      const canvas = await html2canvas(pdfDiv, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight, undefined, "FAST");
      pdf.save("resume-audit.pdf");
    } catch (err) {
      alert("Failed to generate PDF. Please try again.");
    } finally {
      pdfDiv.style.display = "none";
    }
  };
  // Update local audit count after successful audit
  const incrementLocalAuditCount = () => {
    if (typeof window !== "undefined") {
      const newCount = localAuditCount + 1;
      setLocalAuditCount(newCount);
      localStorage.setItem("auditCount", newCount.toString());
      
      // Update current audit count immediately for UI
      if (!user) {
        setCurrentAuditCount(newCount);
      }
    }
  };

  // Update audit count after successful audit for logged-in users
  const updateUserAuditCount = async () => {
    try {
      await refetchUser();
      // Force re-fetch user data to get updated audit count
      if (user && typeof user.auditCount === 'number') {
        setCurrentAuditCount(user.auditCount + 1);
      }
    } catch (error) {
      console.error('Failed to update user review count:', error);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setError("");
    }
  }, []);

  const handleFileZoneClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setResult(null);
    setError("");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setResult(null);
    setError("");
  };

  const handleCustomKeywordsChange = (e) => {
    setCustomKeywords(e.target.value);
    setResult(null);
    setError("");
  };

  const getKeywords = () => {
    if (role === "Custom") {
      return customKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    }
    return JOB_ROLES.find((r) => r.label === role)?.keywords || [];
  };
  // Handle audit submit with robust count checking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    
    if (!file) {
      setError("Please upload a PDF resume.");
      return;
    }
    
    const keywords = getKeywords();
    if (!keywords.length) {
      setError("Please enter at least one keyword.");
      return;
    }
    
    // Check if user is logged in before proceeding with audit
    if (!user) {
      // Redirect to login page with return URL
      navigateWithLoading("/auth?redirect=/audit", "Redirecting to login...");
      return;
    }
    
    // Double-check audit eligibility before submission
    const currentCount = user?.auditCount ?? localAuditCount;
    const isUserPremium = user?.isPremium || false;
    
    if (!isUserPremium && currentCount >= 1) {
      setError("Your 1 free review is exhausted. Upgrade to premium to continue.");
      setTimeout(() => navigateWithLoading("/pricing", "Redirecting to pricing..."), 2000);
      return;
    }
    
    // Use the loading system for audit processing
    await executeWithLoading(async () => {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("keywords", JSON.stringify(keywords));
      const headers = {};
      if (user && typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setError("Your 1 free review is exhausted. Upgrade to premium to continue.");
          setTimeout(() => navigateWithLoading("/pricing", "Redirecting to pricing..."), 2000);
          return;
        }
        throw new Error(data.error || "Audit failed");      
      }
      setResult(data);
      
      // Successfully completed audit - increment count and show feedback
      if (!isPremium) {
        if (user) {
          // For logged-in users, update audit count from server
          await updateUserAuditCount();
          
          // Check if this was their first audit (count was 0, now will be 1)
          const wasFirstAudit = (user.auditCount || 0) === 0;
          
          toast.success('Review completed! Count updated.', {
            duration: 2000,
            position: 'top-center',
          });
          
          // Show conversion popup after first audit completion
          if (wasFirstAudit) {
            setTimeout(() => {
              setShowExhaustedPopup(true);
            }, 2000); // Show popup 2 seconds after audit completion
          }
        } else {
          // For non-logged-in users, increment local count
          const wasFirstAudit = localAuditCount === 0;
          incrementLocalAuditCount();
          
          toast.success('Review completed! 1 free review used.', {
            duration: 2000,
            position: 'top-center',
          });
          
          // Show conversion popup after first audit completion
          if (wasFirstAudit) {
            setTimeout(() => {
              setShowExhaustedPopup(true);
            }, 2000); // Show popup 2 seconds after audit completion
          }
        }
      } else {
        toast.success('Review completed successfully!', {
          duration: 2000,
          position: 'top-center',
        });
      }
    }, "Analyzing your resume...");
  };

  return (
    <>
      {/* Enhanced SEO for Audit Page */}
      <Head>
        <title>Free AI Resume Checker & ATS Scanner | HireLift Resume Review</title>
        <meta name="description" content="Get instant AI-powered resume analysis with our free ATS scanner. Check ATS compatibility, keyword optimization, and formatting. Improve your resume's success rate with expert recommendations." />
        <meta name="keywords" content="free resume checker, ATS scanner, resume analysis, CV checker, applicant tracking system test, resume review, ATS optimization, resume scanner, free resume review, AI resume analyzer, resume ATS test, resume keyword checker" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Audit-specific Open Graph */}
        <meta property="og:title" content="Free AI Resume Checker & ATS Scanner - HireLift" />
        <meta property="og:description" content="Get instant AI-powered resume analysis with our free ATS scanner. Check compatibility, keywords, and formatting to improve your job application success rate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirelift.vercel.app/audit" />
        <meta property="og:image" content="https://hirelift.vercel.app/og-audit.jpg" />
        
        {/* Tool Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "HireLift Resume Checker",
              "url": "https://hirelift.vercel.app/audit",
              "description": "Free AI-powered resume analysis and ATS compatibility checker",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free resume analysis and ATS checking"
              },
              "featureList": [
                "ATS Compatibility Check",
                "Keyword Optimization Analysis", 
                "Resume Formatting Review",
                "Professional Recommendations",
                "Instant Results",
                "Industry-Specific Analysis"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "15420"
              },
              "potentialAction": {
                "@type": "UseAction",
                "target": "https://hirelift.vercel.app/audit",
                "object": {
                  "@type": "DigitalDocument",
                  "name": "Resume Document"
                }
              }
            })
          }}
        />
        
        {/* How-to Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Check Your Resume with ATS Scanner",
              "description": "Step-by-step guide to analyze your resume for ATS compatibility",
              "totalTime": "PT2M",
              "supply": [
                {
                  "@type": "HowToSupply",
                  "name": "Resume file (PDF, DOC, DOCX)"
                }
              ],
              "tool": [
                {
                  "@type": "HowToTool", 
                  "name": "HireLift Resume Checker"
                }
              ],
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Upload Resume",
                  "text": "Upload your resume file in PDF, DOC, or DOCX format"
                },
                {
                  "@type": "HowToStep",
                  "name": "Select Job Role", 
                  "text": "Choose your target job role for industry-specific analysis"
                },
                {
                  "@type": "HowToStep",
                  "name": "Get Analysis",
                  "text": "Receive instant AI-powered analysis with ATS compatibility score and recommendations"
                }
              ]
            })
          }}
        />
      </Head>

      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-start px-2 pb-4 pt-1">
      {/* Custom Audit Page Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo/Brand */}
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-base sm:text-lg">H</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                HireLift
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  <Link 
                    href="/jobs" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                    </svg>
                    Jobs
                  </Link>
                  
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    href="/pricing" 
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <CreditCard className="w-4 h-4" />
                    Upgrade
                  </Link>

                  {/* User Menu */}
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden xl:inline">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden xl:inline">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/jobs" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                    </svg>
                    Jobs
                  </Link>
                  
                  <Link 
                    href="/auth" 
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                // Prevent body scroll when menu is open
                if (!mobileMenuOpen) {
                  document.body.style.overflow = 'hidden';
                } else {
                  document.body.style.overflow = 'unset';
                }
              }}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.body.style.overflow = 'unset';
                  }}
                />
                
                {/* Mobile Navigation Panel */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-50 lg:hidden"
                >
                  <div className="px-4 py-4 space-y-3">
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-lg border border-blue-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {user?.name || user?.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-gray-600">
                              {isPremium ? 'Premium User' : 'Free User'}
                            </p>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <Link 
                          href="/jobs" 
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                          </svg>
                          <span>Browse Jobs</span>
                          <div className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                            Free
                          </div>
                        </Link>
                        
                        <Link 
                          href="/dashboard" 
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                        >
                          <Home className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link 
                          href="/audit" 
                          className="flex items-center gap-3 p-3 text-blue-700 bg-blue-100 rounded-lg font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                        >
                          <BarChart className="w-5 h-5" />
                          <span>Resume Review</span>
                          <div className="ml-auto bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Current
                          </div>
                        </Link>
                        
                        <Link 
                          href="/pricing" 
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                        >
                          <CreditCard className="w-5 h-5" />
                          <span>Upgrade to Pro</span>
                          <div className="ml-auto bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Premium
                          </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                          className="w-full flex items-center gap-3 p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/jobs" 
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                          </svg>
                          <span>Browse Jobs</span>
                          <div className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                            Free
                          </div>
                        </Link>

                        <div className="flex items-center gap-3 p-3 text-blue-700 bg-blue-100 rounded-lg font-medium">
                          <BarChart className="w-5 h-5" />
                          <span>Resume Review</span>
                          <div className="ml-auto bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Current
                          </div>
                        </div>
                        
                        <Link 
                          href="/auth" 
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            document.body.style.overflow = 'unset';
                          }}
                        >
                          <User className="w-5 h-5" />
                          <span>Login / Sign Up</span>
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl mt-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-2 animate-fade-in">
            Resume ATS Review
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in delay-100 mb-2">
            Instantly analyze your resume for ATS compatibility and job fit.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full animate-fade-in delay-200">
            <span className="text-green-600 font-semibold text-sm">🎉 FREE Analysis</span>
            <span className="text-green-700 text-sm">• No credit card required • Instant results</span>
          </div>

          {/* Show audit count and premium status */}
          <div className="mt-4 flex flex-col items-center gap-1 animate-fade-in">
            {user ? (
              <>
                <span className="text-blue-700 font-semibold text-base">{isPremium ? "Premium User" : "Free User"}</span>
                <span className="text-gray-600 text-sm">
                  Reviews used: {isPremium ? '' : auditCountDisplay} {isPremium ? "(Unlimited)" : "/ 1 free"}
                </span>
              </>
            ) : (
              <>
                <span className="text-blue-700 font-semibold text-base">Guest User</span>
                <span className="text-gray-600 text-sm">
                  Login required to review your resume
                </span>
                <span className="text-blue-500 text-xs">
                  ✨ Get 1 free review after signup + unlimited with premium
                </span>
              </>
            )}
            {/* Debug info - remove in production */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-400 mt-1">
                Debug: User={user ? 'Yes' : 'No'}, UserCount={user?.auditCount}, LocalCount={localAuditCount}, CurrentCount={currentAuditCount}
              </div>
            )} */}
          </div>
        </div>
        <form
          className="bg-white/90 rounded-2xl shadow-2xl p-8 space-y-7 border border-blue-100 backdrop-blur-md animate-fade-in delay-200"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Drag and Drop File Input */}
          <div>
            <label className="font-semibold mb-2 text-blue-700 flex items-center gap-2">
              <FaFilePdf className="text-blue-500" /> Upload PDF Resume
            </label>
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer bg-blue-50/50 hover:bg-blue-100/70 ${dragActive ? "border-blue-500 bg-blue-100/80" : "border-blue-200"} min-h-[120px] py-6 px-4 mt-2`}
              onClick={handleFileZoneClick}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              tabIndex={0}
              role="button"
              aria-label="Upload PDF Resume"
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-3 animate-fade-in">
                  <FaFilePdf className="text-3xl text-blue-500" />
                  <span className="font-medium text-blue-700 truncate max-w-[180px]">{file.name}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-400 hover:text-red-600 focus:outline-none"
                    onClick={e => { e.stopPropagation(); setFile(null); }}
                    aria-label="Remove file"
                  >
                    <FaTimesCircle className="text-lg" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-blue-500 animate-fade-in">
                  <FaFilePdf className="text-4xl" />
                  <span className="font-medium text-blue-700">Drag & drop your PDF here, or <span className="underline">click to browse</span></span>
                  <span className="text-xs text-gray-400">PDF only, max 5MB</span>
                </div>
              )}
              {dragActive && (
                <div className="absolute inset-0 bg-blue-100/60 rounded-xl border-2 border-blue-400 pointer-events-none animate-fade-in" />
              )}
            </div>
          </div>
          {/* Custom Dropdown for Job Role */}
          <div>
            <label className="font-semibold mb-2 text-blue-700 flex items-center gap-2">
              <FaUserTie className="text-blue-500" /> Select Job Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={handleRoleChange}
                className="block w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-white shadow-sm text-base font-medium text-blue-700 cursor-pointer"
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                {JOB_ROLES.map((r) => (
                  <option key={r.label} value={r.label} className="text-base">
                    {r.label}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
            </div>
          </div>
          {role === "Custom" && (
            <div>
              <label className="font-semibold mb-2 text-blue-700 flex items-center gap-2">
                <FaUserEdit className="text-blue-500" /> Custom Keywords (comma separated)
              </label>
              <input
                type="text"
                value={customKeywords}
                onChange={handleCustomKeywordsChange}
                placeholder="e.g. python, sql, data analysis"
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none"
              />
            </div>
          )}
          <motion.button
            type="submit"
            className="px-6 mx-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: loading ? 1 : 1.01 }}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <FaSearch className="text-white" />
            )}
            {loading ? "Reviewing..." : user ? "Review Resume" : "Login & Review Resume"}
          </motion.button>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-red-600 text-center font-semibold flex items-center justify-center gap-2 animate-fade-in"
              >
                <FaExclamationCircle className="text-red-500" /> {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        <AnimatePresence>
          {result && (
            <>
              {/* Enhanced ATS Report */}
              <EnhancedATSReport 
                result={result} 
                user={user}
                handleRedirect={handleRedirect}
              />

              {/* Download Audit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-8"
              >
                <button
                  onClick={handleDownloadAudit}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 text-lg animate-pop-in"
                >
                  <FaFilePdf className="text-white text-2xl" /> Download Audit
                </button>
              </motion.div>

              {/* HR Directory CTA - Conversion Focused */}
              <HRDirectoryCTA user={user} isPremium={isPremium} />

              {/* Recommended Resume Template Card */}
              <RecommendedTemplateCard />
              {/* Hidden print-friendly PDF section */}
              
              <div id="audit-pdf-section" style={{ display: 'none', padding: 0, margin: 0, background: '#f8fafc', width: 600, minHeight: 800 }}>
                <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(90deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent:'center', marginTop:'auto', marginBottom:'auto', color: '#fff', fontWeight: 700, fontSize: 28 }}>H</div>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', letterSpacing: -1 }}>HireLift</span>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#2563eb' }}>Resume ATS Review Result</h2>
                  <div style={{ fontSize: 16, color: '#555', marginBottom: 24 }}>Your personalized resume Review powered by HireLift</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>{result.totalScore} <span style={{ fontSize: 20, fontWeight: 500, color: '#888' }}>/ 100</span></div>
                    <div style={{ fontSize: 16, color: '#666' }}>Overall Score</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div><b>Section Score:</b> {result.sectionScore}</div>
                    <div><b>Keyword Score:</b> {result.keywordScore}</div>
                    <div><b>Length Score:</b> {result.lengthScore}</div>
                    <div><b>Contact Score:</b> {result.contactScore}</div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>Found Keywords:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.foundKeywords.length ? result.foundKeywords.map((kw) => (
                        <span key={kw} style={{ background: '#bbf7d0', color: '#166534', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600, alignContent:'center' }}>{kw}</span>
                      )) : <span style={{ color: '#888' }}>None</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>Missing Keywords:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.missingKeywords.length ? result.missingKeywords.map((kw) => (
                        <span key={kw} style={{ background: '#fecaca', color: '#991b1b', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600, alignContent:'center' }}>{kw}</span>
                      )) : <span style={{ color: '#888' }}>None</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>Missing Sections:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {result.missingSections.length ? result.missingSections.map((sec) => (
                        <span key={sec} style={{ background: '#fef08a', color: '#92400e', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{sec}</span>
                      )) : <span style={{ color: '#888' }}>None</span>}
                    </div>
                  </div>
                  <div style={{ marginTop: 24, padding: 16, background: '#f1f5f9', borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 6 }}>Suggested Improvements</div>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {(() => {
                        const suggestions = [];
                        if (result.sectionScore < 80) suggestions.push("Add or improve missing resume sections for a more complete profile.");
                        if (result.keywordScore < 80) suggestions.push("Include more relevant keywords from the job description to boost your match.");
                        if (result.lengthScore < 80) suggestions.push("Adjust your resume length for optimal readability (1-2 pages recommended).");
                        if (result.contactScore < 100) suggestions.push("Ensure your contact information is complete and up to date.");
                        if (result.missingKeywords.length)
                          suggestions.push(`Add these missing keywords: ${result.missingKeywords.join(", ")}`);
                        if (result.missingSections.length)
                          suggestions.push(`Include these missing sections: ${result.missingSections.join(", ")}`);
                        if (!suggestions.length) suggestions.push("Great job! Your resume is well-optimized for ATS.");
                        return suggestions.map((s, i) => (
                          <li key={i} style={{ color: '#2563eb', fontSize: 15, marginBottom: 4 }}>{s}</li>
                        ));
                      })()}
                    </ul>
                  </div>
                  <div style={{ marginTop: 32, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                    Powered by HireLift | https://hirelift.vercel.app
                  </div>
                </div>
              </div>
            </>
          )}        </AnimatePresence>
      </motion.div>
      
      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />

      {/* Audit Exhausted Conversion Popup */}
      <AuditExhaustedPopup 
        isOpen={showExhaustedPopup}
        onClose={() => setShowExhaustedPopup(false)}
        user={user}
      />
      
    </div>
  </>
  );
}

// ScoreBar component for animated progress bars
function ScoreBar({ label, value, color }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-gray-700 text-sm">{label}</span>
        <span className="font-bold text-blue-700 text-sm">{value}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`h-full bg-gradient-to-r ${color} rounded-full shadow-inner`}
        />
      </div>
    </div>
  );
}

// Recommended Template Card Component
function RecommendedTemplateCard() {  const handleDownloadTemplate = () => {
    try {
      // Create a download link for the DOCX template
      const link = document.createElement('a');
      link.href = '/Recommended_Resume.docx'; // Path to your DOCX file in public folder
      link.download = 'Recommended_Resume_Template.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success toast
      toast.success('🎉 Resume template downloaded successfully!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: '600',
        },
      });
    } catch (error) {
      toast.error('Failed to download template. Please try again.', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  return (    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl p-8 border-2 border-transparent bg-clip-border animate-fade-in relative overflow-hidden group"
      style={{
        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #8b5cf6, #3b82f6, #6366f1)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box'
      }}
    >
      <div className="text-center mb-6 mt-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg"
        >
          <FaFilePdf className="text-white text-3xl" />
        </motion.div>
        
        <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          📄 Recommended Resume Template
        </h3>
          <p className="text-gray-600 text-lg font-medium">
          Get our professionally designed template optimized for the highest ATS scores
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-xs text-gray-500 font-medium">ATS Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">10k+</div>
            <div className="text-xs text-gray-500 font-medium">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">4.9★</div>
            <div className="text-xs text-gray-500 font-medium">User Rating</div>
          </div>
        </div>
      </div>      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-100">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Template Preview */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors duration-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Template Preview</p>
                <p className="text-xs text-gray-500">Professional Layout</p>
                <div className="mt-3 space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
              <span className="text-gray-700 font-medium">ATS-Optimized Layout</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-blue-600 text-sm" />
              </div>
              <span className="text-gray-700 font-medium">Professional Formatting</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-purple-600 text-sm" />
              </div>
              <span className="text-gray-700 font-medium">Industry Best Practices</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-orange-600 text-sm" />
              </div>
              <span className="text-gray-700 font-medium">Easy to Customize</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-pink-600 text-sm" />
              </div>
              <span className="text-gray-700 font-medium">Section Guidelines</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-teal-600 text-sm" />
              </div>
              <span className="text-gray-700 font-medium">Keyword Friendly</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <motion.button
          onClick={handleDownloadTemplate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg mx-auto group"
        >
          <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Template (.docx)
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl"
          >
            🚀
          </motion.span>
        </motion.button>
        
        <p className="text-sm text-gray-500 mt-3 font-medium">
          ✨ Compatible with Microsoft Word & Google Docs
        </p>
      </div>
    </motion.div>
  );
}

// Suggested Improvements Section
function SuggestedImprovements({ result }) {
  if (!result) return null;
  const suggestions = [];
  if (result.sectionScore < 80) suggestions.push("Add or improve missing resume sections for a more complete profile.");
  if (result.keywordScore < 80) suggestions.push("Include more relevant keywords from the job description to boost your match.");
  if (result.lengthScore < 80) suggestions.push("Adjust your resume length for optimal readability (1-2 pages recommended).");
  if (result.contactScore < 100) suggestions.push("Ensure your contact information is complete and up to date.");
  if (result.missingKeywords.length)
    suggestions.push(`Add these missing keywords: ${result.missingKeywords.join(", ")}`);
  if (result.missingSections.length)
    suggestions.push(`Include these missing sections: ${result.missingSections.join(", ")}`);
  if (!suggestions.length) suggestions.push("Great job! Your resume is well-optimized for ATS.");

  return (
    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-inner animate-fade-in">
      <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
        <FaUserEdit className="text-blue-500" /> Suggested Improvements
      </h3>
      <ul className="list-disc pl-6 space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="text-blue-800 text-base animate-pop-in">
            {s}
          </li>
        ))}
      </ul>
      
    </div>
  );
}

// HR Directory CTA Component
function HRDirectoryCTA({ user, isPremium }) {
  const router = useRouter();

  const handleUpgradeClick = () => {
    router.push('/pricing');
  };

  const handleHRDirectoryClick = () => {
    router.push('/company-search');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl p-8 border-2 border-transparent bg-clip-border relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #7c3aed, #3b82f6, #06b6d4)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg"
          >
            <FaBuilding className="text-white text-3xl" />
          </motion.div>
          
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            🎯 Ready for the Next Step?
          </h3>
          <p className="text-gray-700 text-lg font-medium mb-4">
            Your resume is optimized! Now connect directly with hiring managers and skip the application queue.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">500+</div>
            <div className="text-sm text-gray-600 font-medium">HR Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-600 font-medium">Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">3x</div>
            <div className="text-sm text-gray-600 font-medium">Faster Hiring</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-100">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">Direct HR Emails</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">LinkedIn Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">Message Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">Company Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">Job Openings</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">Hiring Trends</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          {isPremium ? (
            <motion.button
              onClick={handleHRDirectoryClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg mx-auto group"
            >
              <FaBuilding className="w-6 h-6 group-hover:animate-bounce" />
              Access HR Directory
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xl"
              >
                🚀
              </motion.span>
            </motion.button>
          ) : (
            <div className="space-y-4">
              <motion.button
                onClick={handleUpgradeClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg mx-auto group"
              >
                <FaCrown className="w-6 h-6 group-hover:animate-bounce" />
                Unlock HR Directory - Upgrade to Pro
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl"
                >
                  💎
                </motion.span>
              </motion.button>
              
              <p className="text-sm text-gray-600">
                🎉 <strong>Special Offer:</strong> Get unlimited reviews + HR directory access
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 