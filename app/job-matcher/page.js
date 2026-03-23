"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePageLoading } from "@/hooks/usePageLoading";
import toast from "react-hot-toast";
import {
  FaFilePdf,
  FaClipboard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaCrown,
  FaSpinner,
  FaChartLine,
  FaLock,
  FaUnlock
} from "react-icons/fa";
import { Upload, FileText, Target, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import UpgradeCTA from "@/components/UpgradeCTA";

export default function JobMatcherPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);
  const [showExhaustedPopup, setShowExhaustedPopup] = useState(false);
  const [hasCompletedFreeMatch, setHasCompletedFreeMatch] = useState(false);
  const inputRef = useRef();
  const { user, loading: userLoading, refetchUser } = useAuth();
  const router = useRouter();
  const { executeWithLoading, navigateWithLoading } = usePageLoading();

  const isPremium = user?.isPremium || false;
  const matchCount = user?.jobMatchCount || 0;
  
  // Use local state to track if user has completed their free match
  // This prevents race conditions during state updates
  const hasUsedFreeMatch = hasCompletedFreeMatch || matchCount >= 1;

  // Sync local state with user data on mount/update to ensure consistency
  useEffect(() => {
    if (user && !isPremium && matchCount >= 1) {
      setHasCompletedFreeMatch(true);
    }
  }, [user, isPremium, matchCount]);

  // Update match count after successful match for logged-in users
  const updateUserMatchCount = async () => {
    try {
      await refetchUser();
      // Don't show this toast as we already show "Match analysis completed!"
    } catch (error) {
      console.error('Failed to update user match count:', error);
    }
  };

  // Handle file drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a PDF file");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload your resume");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError("Please paste a complete job description (at least 50 characters)");
      return;
    }

    // Check if user is logged in before proceeding
    if (!user) {
      // Redirect to login page with return URL
      navigateWithLoading("/auth?redirect=/job-matcher", "Redirecting to login...");
      return;
    }

    // Check if free user has already used their free match
    // Use hasUsedFreeMatch which includes local state tracking
    if (!isPremium && hasUsedFreeMatch) {
      setShowExhaustedPopup(true);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const headers = {};
      if (user && typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/job-matcher", {
        method: "POST",
        body: formData,
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle 403 (free match exhausted) with popup
        if (res.status === 403) {
          setShowExhaustedPopup(true);
          return;
        }
        throw new Error(data.error || "Matching failed");
      }

      setResult(data);
      
      // Update local state immediately to prevent race conditions
      if (user && !isPremium) {
        setHasCompletedFreeMatch(true);
      }
      
      // Update match count for logged-in users (async, won't block)
      if (user) {
        updateUserMatchCount();
      }

      toast.success("Match analysis completed!", {
        duration: 3000,
        position: "top-center",
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

    } catch (err) {
      console.error("Match error:", err);
      setError(err.message || "Failed to analyze. Please try again.");
      toast.error(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setError("");
    // Don't reset hasCompletedFreeMatch - it should persist
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-10 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-10 sm:mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 sm:p-4 rounded-2xl">
              <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight px-1">
            Resume-Job Matcher
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 px-2">
            Upload your resume and paste any job description to get instant AI-powered match analysis
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FaCheckCircle className="text-green-500" />
              <span>Free Mismatch Analysis</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FaCrown className="text-yellow-500" />
              <span>Premium Suggestions</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FaChartLine className="text-blue-500" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Resume Upload Section */}
              <div>
                <label className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Upload Your Resume
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                      <FaFilePdf className="text-red-500 text-3xl flex-shrink-0" />
                      <div className="text-center sm:text-left min-w-0">
                        <p className="font-medium text-gray-800 break-all">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaFilePdf className="text-gray-400 text-4xl mx-auto mb-3" />
                      <p className="text-gray-600 font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">PDF format only</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Section */}
              <div>
                <label className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here... Include requirements, responsibilities, qualifications, and skills."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  rows={10}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {jobDescription.length} characters
                  {jobDescription.length > 0 && jobDescription.length < 50 && (
                    <span className="text-orange-500 ml-2">
                      (Need at least 50 characters)
                    </span>
                  )}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200"
                >
                  <FaExclamationTriangle />
                  <p>{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !file || jobDescription.length < 50}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Analyze Match
                  </>
                )}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-500 px-1">
                {!user ? (
                  <>
                    🔐 <span className="font-semibold text-blue-600">Sign in required</span> to use this feature.
                    First match is <span className="font-semibold text-green-600">FREE</span>!
                  </>
                ) : isPremium ? (
                  <>
                    👑 <span className="font-semibold text-purple-600">Premium active</span> - Unlimited matches with full suggestions!
                  </>
                ) : hasUsedFreeMatch ? (
                  <>
                    ⚡ You've used your free match. <span className="font-semibold text-orange-600">Upgrade</span> for unlimited access!
                  </>
                ) : (
                  <>
                    🎉 First match is <span className="font-semibold text-green-600">FREE</span>! 
                    Upgrade to unlock detailed suggestions.
                  </>
                )}
              </p>
            </form>
          </div>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div
            id="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <MatchResults result={result} isPremium={isPremium} onReset={resetForm} />
          </motion.div>
        )}

        {/* Upgrade CTA Modal */}
        <AnimatePresence>
          {showUpgradeCTA && !isPremium && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowUpgradeCTA(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md"
              >
                <UpgradeCTA
                  title="Unlock Full Match Analysis"
                  description="Get detailed suggestions and actionable insights to improve your resume match score."
                  onClose={() => setShowUpgradeCTA(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Free Match Exhausted Popup */}
        <AnimatePresence>
          {showExhaustedPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4"
              onClick={() => setShowExhaustedPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 sm:p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative"
                  >
                    <FaCrown className="text-5xl sm:text-6xl mx-auto mb-3 sm:mb-4 drop-shadow-lg" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 relative">Free Match Used!</h2>
                  <p className="text-orange-100 text-sm sm:text-base relative">You've already used your complimentary match</p>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8">
                  <div className="text-center mb-5 sm:mb-6">
                    <div className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-base sm:text-xl mb-3 sm:mb-4 shadow-lg">
                      🎉 Limited Time: 50% OFF!
                    </div>
                    <p className="text-gray-700 text-base sm:text-lg mb-3 sm:mb-4 px-2">
                      Upgrade to <span className="font-bold text-orange-600">Career Accelerator</span> and unlock unlimited resume matches with detailed AI-powered suggestions!
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="bg-green-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                        <FaCheckCircle className="text-green-600 text-sm sm:text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Unlimited Job Matches</p>
                        <p className="text-xs sm:text-sm text-gray-600">Compare your resume with as many jobs as you want</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="bg-purple-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                        <FaLightbulb className="text-purple-600 text-sm sm:text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Detailed AI Suggestions</p>
                        <p className="text-xs sm:text-sm text-gray-600">Get actionable recommendations to improve your resume</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="bg-blue-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                        <FaChartLine className="text-blue-600 text-sm sm:text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Unlimited ATS Resume Audits</p>
                        <p className="text-xs sm:text-sm text-gray-600">Fix, test, and optimize until your resume is recruiter-ready</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="bg-orange-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                        <FaCheckCircle className="text-orange-600 text-sm sm:text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">100+ HR Contacts Directory</p>
                        <p className="text-xs sm:text-sm text-gray-600">Reach real hiring managers directly</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6 border-2 border-orange-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-gray-600 line-through text-xs sm:text-sm">Regular: ₹199</p>
                        <p className="text-2xl sm:text-3xl font-bold text-orange-600">₹99<span className="text-base sm:text-lg">/30 days</span></p>
                      </div>
                      <div className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold transform rotate-3 shadow-lg text-sm sm:text-base flex-shrink-0">
                        SAVE 50%
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <button
                      onClick={() => {
                        setShowExhaustedPopup(false);
                        navigateWithLoading("/pricing");
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <FaCrown className="text-base sm:text-lg" />
                      Upgrade Now - 50% OFF!
                    </button>
                    <button
                      onClick={() => setShowExhaustedPopup(false)}
                      className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all"
                    >
                      Maybe Later
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4 px-2">
                    💡 Most popular plan - Join thousands of job seekers accelerating their career
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Section */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Use Resume-Job Matcher?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl" />
              </div>
              <h3 className="font-semibold mb-2">Instant Analysis</h3>
              <p className="text-sm text-blue-100">
                Get immediate feedback on how well your resume matches any job description
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-3xl" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-blue-100">
                Leverage advanced AI to identify gaps and opportunities in your application
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Higher Success Rate</h3>
              <p className="text-sm text-blue-100">
                Tailor your resume for each job to increase your chances of getting interviews
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Check your resume against multiple job descriptions to improve your chances with every application.
          </p>
          {!user && (
            <button
              onClick={() => navigateWithLoading("/auth")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              Sign Up - It's Free!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Match Results Component
function MatchResults({ result, isPremium, onReset }) {
  const router = useRouter();

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-5 sm:p-6 md:p-8 text-white shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Match Score</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              {result.isAIGenerated ? "AI-Powered Analysis" : "Rule-Based Analysis"}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold">{result.matchScore}%</div>
            <p className="text-sm mt-2 text-blue-100">Overall Match</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{result.matchedSkills?.length || 0}</div>
            <div className="text-sm text-blue-100">Matched Skills</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{result.missingSkills?.length || 0}</div>
            <div className="text-sm text-blue-100">Missing Skills</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{result.mismatches?.length || 0}</div>
            <div className="text-sm text-blue-100">Mismatches</div>
          </div>
        </div>
      </motion.div>

      {/* Mismatches Section - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-start sm:items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-xl sm:text-2xl text-orange-500 flex-shrink-0 mt-1 sm:mt-0" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Mismatches Found ({result.mismatches?.length || 0})
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Areas where your resume doesn't align with the job requirements
        </p>

        {result.mismatches && result.mismatches.length > 0 ? (
          <div className="space-y-4">
            {result.mismatches.map((mismatch, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(
                  mismatch.severity
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-white rounded-full">
                        {mismatch.category}
                      </span>
                      <span className={`text-xs font-semibold uppercase ${getPriorityColor(mismatch.severity)}`}>
                        {mismatch.severity}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {mismatch.title}
                    </h4>
                    <p className="text-sm text-gray-600">{mismatch.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No major mismatches found! Your resume aligns well with this job.
          </p>
        )}
      </motion.div>

      {/* Suggestions Section - Blurred for Non-Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 relative"
      >
        <div className="flex items-start sm:items-center gap-3 mb-4">
          <FaLightbulb className="text-xl sm:text-2xl text-yellow-500 flex-shrink-0 mt-1 sm:mt-0" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Improvement Suggestions ({result.suggestions?.length || 0})
          </h3>
          {!isPremium && (
            <span className="ml-auto flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 whitespace-nowrap">
              <FaLock /> Premium Only
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-6">
          Actionable recommendations to improve your match score
        </p>

        <div className={`${!isPremium ? "filter blur-sm pointer-events-none" : ""}`}>
          {result.suggestions && result.suggestions.length > 0 ? (
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {suggestion.category}
                        </span>
                        <span className={`text-xs font-semibold uppercase ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority} Priority
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {suggestion.description}
                      </p>
                      {suggestion.impact && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">Impact:</span> {suggestion.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Great! Your resume is well-optimized for this job.
            </p>
          )}
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] bg-opacity-80 rounded-2xl p-3 sm:p-4">
            <div className="text-center max-w-md p-4 sm:p-6">
              <FaCrown className="text-4xl sm:text-5xl text-yellow-500 mx-auto mb-3 sm:mb-4" />
              <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Unlock Premium Suggestions
              </h4>
              <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                Get detailed, actionable recommendations to improve your resume and increase your match score
              </p>
              <button
                onClick={() => router.push("/pricing")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 sm:px-8 rounded-xl text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Additional Details - Expandable Sections */}
      {result.matchedSkills && result.matchedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Try Another Match
        </button>
        {!isPremium && (
          <button
            onClick={() => router.push("/pricing")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <FaCrown />
            Upgrade for Full Access
          </button>
        )}
      </div>
    </div>
  );
}
