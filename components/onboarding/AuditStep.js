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
import EnhancedATSReport from '@/components/ui/EnhancedATSReport';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const AuditStep = ({ onComplete, userInfo }) => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const inputRef = useRef();
  const { user, refetchUser } = useAuth();

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
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleFileZoneClick = () => {
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
    e.preventDefault();
    
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

  const handleComplete = () => {
    onComplete({ auditResult: result });
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
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
              type="submit"
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
          </form>

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
                handleRedirect={() => {}}
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
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue to Upgrade Options
                  <ArrowRight className="w-5 h-5" />
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
      </div>
    </div>
  );
};

export default AuditStep;