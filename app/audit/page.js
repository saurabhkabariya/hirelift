"use client";
import AuditResultCard from "@/components/AuditResultCard";
import JOB_ROLES from "@/data/jobRoles";
import { useState } from "react";


export default function ResumeAuditPage() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(JOB_ROLES[0].label);
  const [customKeywords, setCustomKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("keywords", JSON.stringify(keywords));
      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Resume ATS Audit</h1>
      <form
        className="bg-white rounded-lg shadow p-6 space-y-6"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-medium mb-2">Upload PDF Resume</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Select Job Role</label>
          <select
            value={role}
            onChange={handleRoleChange}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          >
            {JOB_ROLES.map((r) => (
              <option key={r.label} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {role === "Custom" && (
          <div>
            <label className="block font-medium mb-2">Custom Keywords (comma separated)</label>
            <input
              type="text"
              value={customKeywords}
              onChange={handleCustomKeywordsChange}
              placeholder="e.g. python, sql, data analysis"
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : null}
          {loading ? "Auditing..." : "Audit Resume"}
        </button>
        {error && <div className="text-red-600 text-center font-medium">{error}</div>}
      </form>
      {result && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Audit Result</h2>
          <div className="text-center text-3xl font-bold mb-2">
            {result.totalScore} <span className="text-lg font-normal">/ 100</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div>
              <span className="font-semibold">Section Score:</span> {result.sectionScore}
            </div>
            <div>
              <span className="font-semibold">Keyword Score:</span> {result.keywordScore}
            </div>
            <div>
              <span className="font-semibold">Length Score:</span> {result.lengthScore}
            </div>
            <div>
              <span className="font-semibold">Contact Score:</span> {result.contactScore}
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1">Found Keywords:</div>
            <div className="flex flex-wrap gap-2">
              {result.foundKeywords.length ? result.foundKeywords.map((kw) => (
                <span key={kw} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{kw}</span>
              )) : <span className="text-gray-500">None</span>}
            </div>
          </div>
          <div className="mt-2">
            <div className="font-semibold mb-1">Missing Keywords:</div>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.length ? result.missingKeywords.map((kw) => (
                <span key={kw} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{kw}</span>
              )) : <span className="text-gray-500">None</span>}
            </div>
          </div>
          <div className="mt-2">
            <div className="font-semibold mb-1">Missing Sections:</div>
            <div className="flex flex-wrap gap-2">
              {result.missingSections.length ? result.missingSections.map((sec) => (
                <span key={sec} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{sec}</span>
              )) : <span className="text-gray-500">None</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 