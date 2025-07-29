"use client";
import AuditResultCard from "@/components/AuditResultCard";
import JOB_ROLES from "@/data/jobRoles";
import FeedbackButton from "../../components/feedback/FeedbackButton";
import { useState, useRef, useCallback, useEffect } from "react";
import { FaFilePdf, FaUserTie, FaSearch, FaCheckCircle, FaExclamationCircle, FaUserEdit, FaChevronDown, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export default function ResumeAuditPage() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(JOB_ROLES[0].label);
  const [customKeywords, setCustomKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();
  const { user, loading: userLoading, refetchUser } = useAuth();
  const router = useRouter();
  const [localAuditCount, setLocalAuditCount] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("auditCount") || "0", 10);
    }
    return 0;
  });
  // --- Fix audit count display ---
  const [displayAuditCount, setDisplayAuditCount] = useState(user?.auditCount ?? localAuditCount);
  useEffect(() => {
    setDisplayAuditCount(user?.auditCount ?? localAuditCount);
  }, [user, localAuditCount]);
  // --- End fix ---

  
  // Helper: isPremium and auditCount
  const isPremium = user?.isPremium;
  const auditCount = displayAuditCount;
  
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

  // Update local audit count after audit
  const incrementLocalAuditCount = () => {
    if (typeof window !== "undefined") {
      const newCount = localAuditCount + 1;
      setLocalAuditCount(newCount);
      localStorage.setItem("auditCount", newCount.toString());
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

  // Handle audit submit
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
    if (!canAudit) {
      setError("Your 1 free audit is exhausted. Upgrade to premium to continue.");
      setTimeout(() => router.push("/pricing"), 2000);
      return;
    }
    setLoading(true);
    try {
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
          setError("Your 1 free audit is exhausted. Upgrade to premium to continue.");
          setTimeout(() => router.push("/pricing"), 2000);
          return;
        }
        throw new Error(data.error || "Audit failed");
      }
      setResult(data);
      // Increment audit count if not premium
      if (!isPremium) {
        if (user) {
          // Refetch user to update auditCount in context and UI
          await refetchUser();
        } else {
          incrementLocalAuditCount();
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-start px-2 pb-4 pt-1">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 mb-6 bg-white/80 rounded-2xl shadow border border-blue-100 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <span className="z-10">H</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight gradient-text group-hover:text-blue-700 transition">HireLift</span>
          </Link>
        </div>
        <button
          onClick={() => router.push(user ? "/dashboard" : "/")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow-sm border border-blue-200 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </nav>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-2 animate-fade-in">
            Resume ATS Audit
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in delay-100">
            Instantly analyze your resume for ATS compatibility and job fit.
          </p>
          {/* Show audit count and premium status */}
          <div className="mt-4 flex flex-col items-center gap-1 animate-fade-in">
            <span className="text-blue-700 font-semibold text-base">{isPremium ? "Premium User" : "Free User"}</span>
            <span className="text-gray-600 text-sm">Audits used: {auditCountDisplay} {isPremium ? "(Unlimited)" : "/ 1 free"}</span>
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
            {loading ? "Auditing..." : "Audit Resume"}
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
              <motion.div
                id="audit-result-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-10 bg-white/95 rounded-2xl shadow-2xl p-8 animate-fade-in border border-blue-100"
              >
                <h2 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                  Audit Result
                </h2>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center mb-6"
                >
                  <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e0e7ef"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="12"
                        strokeDasharray={339.292}
                        strokeDashoffset={339.292 - (result.totalScore / 100) * 339.292}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 339.292 }}
                        animate={{ strokeDashoffset: 339.292 - (result.totalScore / 100) * 339.292 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                      />
                    </svg>
                    <span className="text-4xl font-extrabold text-blue-700 z-10">
                      {result.totalScore}
                    </span>
                    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-base text-gray-500 font-medium">/ 100</span>
                  </div>
                  <span className="text-sm text-gray-500">Overall Score</span>
                </motion.div>
                <div className="grid grid-cols-2 gap-4 text-base mb-6">
                  <ScoreBar label="Section Score" value={result.sectionScore} color="from-green-400 to-green-600" />
                  <ScoreBar label="Keyword Score" value={result.keywordScore} color="from-blue-400 to-blue-600" />
                  <ScoreBar label="Length Score" value={result.lengthScore} color="from-purple-400 to-purple-600" />
                  <ScoreBar label="Contact Score" value={result.contactScore} color="from-yellow-400 to-yellow-600" />
                </div>
                <div className="mt-4">
                  <div className="font-semibold my-2 text-blue-700">Found Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {result.foundKeywords.length ? result.foundKeywords.map((kw) => (
                      <span key={kw} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-pop-in">
                        <FaCheckCircle className="text-green-500" /> {kw}
                      </span>
                    )) : <span className="text-gray-400">None</span>}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-semibold my-4 text-blue-700">Missing Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.length ? result.missingKeywords.map((kw) => (
                      <span key={kw} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-pop-in">
                        <FaExclamationCircle className="text-red-500" /> {kw}
                      </span>
                    )) : <span className="text-gray-400">None</span>}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-semibold my-4 text-blue-700">Missing Sections:</div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSections.length ? result.missingSections.map((sec) => (
                      <span key={sec} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold animate-pop-in">
                        {sec}
                      </span>
                    )) : <span className="text-gray-400">None</span>}
                  </div>
                </div>
                <SuggestedImprovements result={result} />
                {/* Download Audit Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleDownloadAudit}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 text-lg animate-pop-in"
                  >
                    <FaFilePdf className="text-white text-2xl" /> Download Audit
                  </button>
                  
                </div>
              </motion.div>
              {/* Hidden print-friendly PDF section */}
              
              <div id="audit-pdf-section" style={{ display: 'none', padding: 0, margin: 0, background: '#f8fafc', width: 600, minHeight: 800 }}>
                <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(90deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent:'center', marginTop:'auto', marginBottom:'auto', color: '#fff', fontWeight: 700, fontSize: 28 }}>H</div>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', letterSpacing: -1 }}>HireLift</span>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#2563eb' }}>Resume ATS Audit Result</h2>
                  <div style={{ fontSize: 16, color: '#555', marginBottom: 24 }}>Your personalized resume audit powered by HireLift</div>
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
                    Powered by HireLift | https://hirelift.ai
                  </div>
                </div>
              </div>
            </>
          )}        </AnimatePresence>
      </motion.div>
      
      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
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