'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Sparkles,
  ArrowRight,
  Gift,
  TrendingUp,
  Star,
  Clock,
  Zap
} from 'lucide-react';
import JOB_ROLES from '@/data/jobRoles';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import EnhancedATSReport from '@/components/ui/EnhancedATSReport';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const AuditStep = ({ onComplete, userInfo }) => {
  const { user, refetchUser } = useAuth();
  const { updateAuditResult } = useOnboarding();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const inputRef = useRef();

  // Set default role based on user info
  useEffect(() => {
    if (userInfo?.currentRole && !role) {
      // Find matching role or set to Custom
      const matchingRole = JOB_ROLES.find(r => 
        r.label.toLowerCase().includes(userInfo.currentRole.toLowerCase()) ||
        userInfo.currentRole.toLowerCase().includes(r.label.toLowerCase())
      );
      setRole(matchingRole ? matchingRole.label : 'Custom');
    }
  }, [userInfo, role]);

  // Show motivational message after file upload
  useEffect(() => {
    if (file && !showMotivation) {
      const timer = setTimeout(() => setShowMotivation(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [file, showMotivation]);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setError("");
      setShowMotivation(false);
    }
  }, []);

  const handleFileChange = (e) => {
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
      setShowMotivation(false);
    }
  };

  const handleFileZoneClick = (e) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  // Get keywords based on selected role
  const getKeywords = () => {
    if (role === 'Custom' && userInfo?.currentRole) {
      // Generate keywords based on current role
      return userInfo.currentRole.split(' ').filter(word => word.length > 2);
    }
    return JOB_ROLES.find((r) => r.label === role)?.keywords || [];
  };

  // Handle audit submission
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!file) {
      setError("Please upload your resume to continue");
      return;
    }

    const keywords = getKeywords();
    if (!keywords.length) {
      setError("Please select a job role or enter keywords");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("keywords", JSON.stringify(keywords));

      // Add auth header if user is logged in
      const headers = {};
      if (user && typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle free review exhausted with conversion-focused modal
        if (data.error && data.error.toLowerCase().includes('free review exhausted')) {
          setShowUpgradeModal(true);
          return;
        }
        throw new Error(data.error || "Audit failed");
      }

      setResult(data);

      // Update user audit count if logged in
      if (user) {
        // Force immediate refresh of user data to reflect audit count update
        setTimeout(async () => {
          await refetchUser();
        }, 500);
        
        toast.success('🎉 Your free resume review is complete!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        toast.success('🎉 Resume analysis complete!', {
          duration: 3000,
          position: 'top-center',
        });
      }

      // Auto-scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('audit-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);

    } catch (error) {
      console.error('Audit error:', error);
      setError(error.message || 'Failed to analyze resume');
      toast.error('Analysis failed. Please try again.', {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Download PDF functionality
  const handleDownloadAudit = async () => {
    if (!result) return;
    
    const pdfDiv = document.getElementById("audit-pdf-section");
    if (!pdfDiv) return;
    
    pdfDiv.style.display = "block";
    
    try {
      const canvas = await html2canvas(pdfDiv, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#f8fafc' 
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ 
        orientation: "portrait", 
        unit: "pt", 
        format: "a4" 
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight, undefined, "FAST");
      pdf.save(`${userInfo?.fullName || 'User'}-resume-audit.pdf`);
      
      toast.success('Resume audit downloaded!', {
        duration: 2000,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF');
    } finally {
      pdfDiv.style.display = "none";
    }
  };

  const handleComplete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!result) {
      toast.error('Please complete your resume analysis first');
      return;
    }
    
    if (completing) return; // Prevent double-clicks
    
    setCompleting(true);
    
    // Prepare the complete audit data structure
    const auditData = {
      ...result,
      // Ensure all important fields are present for PricingShowcaseStep
      totalScore: result.totalScore || 0,
      sectionScore: result.sectionScore || 0,
      keywordScore: result.keywordScore || 0,
      lengthScore: result.lengthScore || 0,
      contactScore: result.contactScore || 0,
      foundKeywords: result.foundKeywords || [],
      missingKeywords: result.missingKeywords || [],
      suggestions: result.suggestions || [],
      // Add file info for reference
      fileName: file?.name || 'resume.pdf',
      analysisDate: new Date().toISOString()
    };
    
    // First, update the audit result in context
    updateAuditResult(auditData);
    
    // Call onComplete immediately - parent will handle step transition
    onComplete(auditData);
    
    // Reset completing state after a short delay
    setTimeout(() => {
      setCompleting(false);
    }, 500);
  };

  // Upgrade Modal Component
  const UpgradeModal = () => (
    <AnimatePresence>
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6"
          onClick={() => setShowUpgradeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md lg:max-w-lg w-full max-h-[90vh] overflow-hidden overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 lg:p-8 text-center relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              >
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">You're On Fire! 🔥</h3>
              <p className="text-white/90 text-sm sm:text-base">You've used your free resume review</p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Ready to Unlock More Opportunities?
                </h4>
                <p className="text-gray-600 leading-relaxed mb-3 text-sm sm:text-base">
                  You're clearly committed to improving your career prospects. 
                  Join thousands who've already transformed their job search with our premium features.
                </p>
                
                {/* Social proof badge */}
                <div className="inline-flex items-center gap-1 sm:gap-2 bg-blue-50 border border-blue-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                  <div className="flex -space-x-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-blue-800 font-medium hidden sm:inline">2,847+ users upgraded this month</span>
                  <span className="text-blue-800 font-medium sm:hidden">2,847+ upgraded</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {[
                  { icon: Star, text: "Unlimited resume reviews" },
                  { icon: Zap, text: "AI-powered optimization suggestions" },
                  { icon: TrendingUp, text: "Industry-specific keyword targeting" },
                  { icon: CheckCircle, text: "Professional resume rewriting service" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowUpgradeModal(false);
                    // Navigate to pricing
                    window.location.href = '/pricing';
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Upgrade Now</span>
                  <span className="sm:hidden">Upgrade</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                
                {/* Limited time offer */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-600 font-medium bg-orange-50 border border-orange-200 px-2 sm:px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Limited time: 50% off first month</span>
                    <span className="sm:hidden">50% off first month</span>
                  </span>
                </div>
                
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base"
                >
                  Maybe Later
                </button>
              </div>

              {/* Trust indicators */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="hidden sm:inline">30-day money back</span>
                    <span className="sm:hidden">Money back</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/6 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 1 
            }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Gift className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your FREE Resume Review
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {userInfo?.fullName ? `${userInfo.fullName.split(' ')[0]}, get` : 'Get'} instant insights into your resume's ATS performance. 
            This professional analysis is normally worth $25 - but it's completely free for new HireLift users!
          </p>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-6 py-3 rounded-full">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-green-800 font-semibold">Completely FREE • No Credit Card Required</span>
          </div>
        </motion.div>

        {/* Audit form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 mb-8"
        >
          <div className="space-y-6">
            {/* File upload section */}
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Upload Your Resume
              </label>
              
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer min-h-[120px] py-6 px-4 ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : file 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={handleFileZoneClick}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {file ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-3 text-green-600"
                  >
                    <CheckCircle className="w-8 h-8" />
                    <div>
                      <p className="font-semibold text-lg">{file.name}</p>
                      <p className="text-sm text-gray-600">Ready to analyze!</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF format only • Max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Target Role {userInfo?.targetRole && (
                  <span className="text-sm font-normal text-gray-500">
                    (Based on your goal: {userInfo.targetRole})
                  </span>
                )}
              </label>
              
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
              >
                <option value="">Select your target role</option>
                {JOB_ROLES.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>
              
              {role && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-600 mt-2"
                >
                  ✓ We'll analyze your resume against {role} requirements
                </motion.p>
              )}
            </div>

            {/* Submit button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !file || !role}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Analyzing Your Resume...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Get My FREE Analysis
                </>
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Motivational message */}
          <AnimatePresence>
            {showMotivation && !result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 text-center"
              >
                <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <p className="text-amber-800 font-semibold text-lg mb-2">
                  You're Taking the Right Step! 🚀
                </p>
                <p className="text-amber-700">
                  Most resumes get rejected by ATS systems before humans even see them. 
                  You're about to discover exactly how to fix that and get more interviews!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results section */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="audit-results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Success celebration */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Analysis Complete! 🎉
                </h2>
                <p className="text-lg text-gray-600">
                  Here's your comprehensive resume analysis
                </p>
              </motion.div>

              {/* Enhanced ATS Report */}
              <EnhancedATSReport 
                result={result} 
                user={user}
                handleRedirect={(path) => {
                  // Navigate to pricing page when upgrade is clicked
                  if (path === '/pricing') {
                    window.location.href = '/pricing';
                  }
                }}
              />

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
              >
                <button
                  onClick={handleDownloadAudit}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>

                <motion.button
                  onClick={handleComplete}
                  disabled={completing}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: completing ? 1 : 1.05 }}
                  whileTap={{ scale: completing ? 1 : 0.95 }}
                >
                  {completing ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Proceeding...
                    </>
                  ) : (
                    <>
                      Continue to Upgrade Options
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden PDF section */}
        <div id="audit-pdf-section" style={{ display: 'none', padding: 0, margin: 0, background: '#f8fafc', width: 600, minHeight: 800 }}>
          {result && (
            <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#222' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(90deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 28 }}>H</div>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', letterSpacing: -1 }}>HireLift</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#2563eb' }}>Resume ATS Review Result</h2>
              <div style={{ fontSize: 16, color: '#555', marginBottom: 24 }}>
                {userInfo?.fullName && `${userInfo.fullName}'s `}Personalized Resume Review
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>
                  {result.totalScore} <span style={{ fontSize: 20, fontWeight: 500, color: '#888' }}>/ 100</span>
                </div>
                <div style={{ fontSize: 16, color: '#666' }}>Overall ATS Score</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div><b>Section Score:</b> {result.sectionScore}</div>
                <div><b>Keyword Score:</b> {result.keywordScore}</div>
                <div><b>Length Score:</b> {result.lengthScore}</div>
                <div><b>Contact Score:</b> {result.contactScore}</div>
              </div>
              
              {result.foundKeywords.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>Found Keywords:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.foundKeywords.map((kw) => (
                      <span key={kw} style={{ background: '#bbf7d0', color: '#166534', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {result.missingKeywords.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>Missing Keywords:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.missingKeywords.map((kw) => (
                      <span key={kw} style={{ background: '#fecaca', color: '#991b1b', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: 24, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                Powered by HireLift | Professional Resume Analysis
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal />
      </div>
    </div>
  );
};

export default AuditStep;