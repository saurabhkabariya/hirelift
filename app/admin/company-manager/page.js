"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import CompanyForm from "@/components/CompanyForm";
import CompanyRow from "@/components/CompanyRow";
import JobForm from "@/components/JobForm";
import toast from "react-hot-toast";

const ADMIN_EMAIL = "websiteads074@gmail.com";
const PAGE_SIZE = 10;

export default function CompanyManagerPage() {
  const { user, loading } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [jsonValidation, setJsonValidation] = useState({ isValid: null, message: "" });
  const [pending, setPending] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  // Job management state
  const [jobs, setJobs] = useState([]);
  const [jobTotal, setJobTotal] = useState(0);
  const [jobTotalPages, setJobTotalPages] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [editingJob, setEditingJob] = useState(null);
  const [jobBulkJson, setJobBulkJson] = useState("");
  const [jobJsonValidation, setJobJsonValidation] = useState({ isValid: null, message: "" });
  const [pendingJobs, setPendingJobs] = useState([]);
  const [jobPageLoading, setJobPageLoading] = useState(false);

  const validateJobJson = (json) => {
    try {
      const jobs = JSON.parse(json);
      if (!Array.isArray(jobs)) {
        return { isValid: false, message: "JSON must be an array of job objects" };
      }
      
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        if (!job.title || !job.company || !job.location || !job.description || !job.url) {
          return { 
            isValid: false, 
            message: `Job ${i + 1}: Missing required fields (title, company, location, description, url)` 
          };
        }
      }
      
      return { isValid: true, message: `${jobs.length} valid jobs found` };
    } catch (error) {
      return { isValid: false, message: "Invalid JSON format" };
    }
  };

  // Fetch companies
  useEffect(() => {
    setPageLoading(true);
    fetch(`/api/companies?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data.data || []);
        setTotal(data.total || 0);
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, [page]);

  // Fetch pending approvals
  useEffect(() => {
    fetch(`/api/companies?status=pending&page=1&limit=100`)
      .then((res) => res.json())
      .then((data) => setPending(data.data || []));
  }, [companies]);

  // Fetch jobs
  useEffect(() => {
    setJobPageLoading(true);
    fetch(`/api/jobs?page=${jobPage}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.data || []);
        setJobTotal(data.pagination?.total || 0);
        setJobTotalPages(data.pagination?.totalPages || 1);
        setJobPageLoading(false);
      })
      .catch(() => setJobPageLoading(false));
  }, [jobPage]);

  // Fetch pending jobs
  useEffect(() => {
    fetch(`/api/jobs?status=draft&page=1&limit=100`)
      .then((res) => res.json())
      .then((data) => setPendingJobs(data.data || []));
  }, [jobs]);

  // Job JSON validation effect
  useEffect(() => {
    if (jobBulkJson.trim()) {
      const validation = validateJobJson(jobBulkJson);
      setJobJsonValidation(validation);
    } else {
      setJobJsonValidation({ isValid: null, message: "" });
    }
  }, [jobBulkJson]);

    // JSON validation effect
  useEffect(() => {
    if (!bulkJson.trim()) {
      setJsonValidation({ isValid: null, message: "" });
      return;
    }

    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        setJsonValidation({ isValid: false, message: "JSON must be an array of company objects" });
        return;
      }
      if (parsed.length === 0) {
        setJsonValidation({ isValid: false, message: "Array cannot be empty" });
        return;
      }
      if (parsed.length > 50) {
        setJsonValidation({ isValid: false, message: "Maximum 50 companies allowed per bulk upload" });
        return;
      }
      
      // Basic field validation
      const missingFields = [];
      parsed.forEach((company, index) => {
        if (!company.companyName || !company.industry || !company.location || !company.jobMode || !company.experience) {
          missingFields.push(`Company ${index + 1} missing required fields`);
        }
      });
      
      if (missingFields.length > 0) {
        setJsonValidation({ isValid: false, message: `${missingFields.length} companies have missing required fields` });
        return;
      }

      setJsonValidation({ isValid: true, message: `✓ Valid JSON with ${parsed.length} companies ready for upload` });
    } catch (error) {
      setJsonValidation({ isValid: false, message: "Invalid JSON format" });
    }
  }, [bulkJson]);

  // Access control - render early returns after hooks
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Access Denied</div>;
  }

  // Handlers
  const handleAdd = async (values) => {
    const res = await fetch("/api/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast.success("Company added!");
      setShowForm(false);
      setPage(1);
      fetch(`/api/companies?page=1&limit=${PAGE_SIZE}`)
        .then((res) => res.json())
        .then((data) => setCompanies(data.data || []));
    } else {
      toast.error("Failed to add company");
    }
  };
  const handleBulkAdd = async () => {
    try {
      // Validate JSON format
      let companies;
      try {
        companies = JSON.parse(bulkJson);
      } catch (parseError) {
        toast.error("Invalid JSON format. Please check your syntax.");
        return;
      }
      
      if (!Array.isArray(companies)) {
        toast.error("JSON must be an array of company objects.");
        return;
      }
      
      if (companies.length === 0) {
        toast.error("Array cannot be empty.");
        return;
      }
      
      // Show loading state
      toast.loading("Processing bulk upload...", { id: "bulk-upload" });
      
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companies),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Successfully added ${data.data?.length || companies.length} companies!`, { id: "bulk-upload" });
        setBulkJson("");
        setPage(1);
        // Refresh the company list
        fetch(`/api/companies?page=1&limit=${PAGE_SIZE}`)
          .then((res) => res.json())
          .then((data) => {
            setCompanies(data.data || []);
            setTotal(data.total || 0);
          });
      } else {
        // Handle validation errors
        if (data.details && data.details.length > 0) {
          toast.error("Validation errors found:", { id: "bulk-upload" });
          // Show detailed errors
          data.details.forEach((error, index) => {
            setTimeout(() => {
              toast.error(error, { duration: 5000 });
            }, index * 500);
          });
        } else {
          toast.error(data.error || "Bulk add failed", { id: "bulk-upload" });
        }
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("An unexpected error occurred during bulk upload", { id: "bulk-upload" });
    }
  };

  const handleEdit = (company) => setEditing(company);
  const handleUpdate = async (values) => {
    const res = await fetch(`/api/company/${editing._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast.success("Company updated!");
      setEditing(null);
      fetch(`/api/companies?page=${page}&limit=${PAGE_SIZE}`)
        .then((res) => res.json())
        .then((data) => setCompanies(data.data || []));
    } else {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    const res = await fetch(`/api/company/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      setPage(1);
      fetch(`/api/companies?page=1&limit=${PAGE_SIZE}`)
        .then((res) => res.json())
        .then((data) => setCompanies(data.data || []));
    } else {
      toast.error("Delete failed");
    }
  };

  const handleStatusToggle = async (company, status) => {
    const res = await fetch(`/api/company/${company._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Status set to ${status}`);
      setPending(pending.filter((c) => c._id !== company._id));
    } else {
      toast.error("Status update failed");
    }
  };

  // Job Management Functions
  const fetchJobs = () => {
    setJobPageLoading(true);
    fetch(`/api/jobs?page=${jobPage}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.data || []);
        setJobTotal(data.pagination?.total || 0);
        setJobTotalPages(data.pagination?.totalPages || 1);
        setJobPageLoading(false);
      })
      .catch(() => setJobPageLoading(false));
  };

  const fetchPendingJobs = () => {
    fetch(`/api/jobs?status=draft&page=1&limit=100`)
      .then((res) => res.json())
      .then((data) => setPendingJobs(data.data || []));
  };

  const handleJobAdd = async (data) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      toast.success("Job added successfully!");
      fetchJobs();
      fetchPendingJobs();
    } else {
      const error = await res.json();
      toast.error(error.message || "Failed to add job");
    }
  };

  const handleJobBulkAdd = async () => {
    try {
      const jobs = JSON.parse(jobBulkJson);
      const res = await fetch("/api/jobs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs }),
      });
      
      if (res.ok) {
        const result = await res.json();
        toast.success(`${result.successful} jobs added successfully!`);
        if (result.failed > 0) {
          toast.error(`${result.failed} jobs failed to add`);
        }
        setJobBulkJson("");
        setJobJsonValidation({ isValid: null, message: "" });
        fetchJobs();
        fetchPendingJobs();
      } else {
        const error = await res.json();
        toast.error(error.message || "Bulk upload failed");
      }
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const handleJobEdit = (job) => setEditingJob(job);

  const handleJobUpdate = async (data) => {
    const res = await fetch(`/api/jobs/${editingJob._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      toast.success("Job updated successfully!");
      setEditingJob(null);
      fetchJobs();
      fetchPendingJobs();
    } else {
      const error = await res.json();
      toast.error(error.message || "Failed to update job");
    }
  };

  const handleJobDelete = async (id) => {
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Job deleted successfully!");
      fetchJobs();
      fetchPendingJobs();
    } else {
      toast.error("Failed to delete job");
    }
  };

  const handleJobStatusToggle = async (job, status) => {
    const res = await fetch(`/api/jobs/${job._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (res.ok) {
      toast.success(`Job status set to ${status}`);
      setPendingJobs(pendingJobs.filter((j) => j._id !== job._id));
      fetchJobs();
    } else {
      toast.error("Status update failed");
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
      >        {/* Navigation Header */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-6 border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 border border-blue-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </motion.button>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm">
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.05 }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Dashboard
                </motion.a>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-600 font-medium">Admin Panel</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-blue-700 font-semibold">Company Manager</span>
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v4m8-4v4" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Admin Mode</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Header */}
        <motion.div 
          variants={cardVariants}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl py-2 font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-4"
          >
            Company Manager
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Add, edit, approve, and manage companies and HR contacts with powerful admin tools.
          </motion.p>
        </motion.div>{/* Form Section */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-blue-100"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Add New Company
                </h2>
              </div>
              <CompanyForm onSubmit={handleAdd} />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Bulk Add (JSON)
                </h2>
              </div>              <div className="mb-4">
                <motion.details 
                  whileHover={{ scale: 1.01 }}
                  className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm"
                >
                  <summary className="cursor-pointer hover:text-blue-600 font-semibold flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2h4" />
                    </svg>
                    📋 JSON Format Example & Guidelines
                  </summary>
                  
                  <div className="space-y-4 mt-4">
                    {/* Guidelines */}
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Field Requirements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-medium text-red-600">Required:</span>
                          <ul className="mt-1 space-y-1 text-gray-600">
                            <li>• companyName (string)</li>
                            <li>• industry (string)</li>
                            <li>• location (string)</li>
                            <li>• jobMode (Remote/Hybrid/On-site/WFH)</li>
                            <li>• experience (Fresher/0-1/1-3/3-5)</li>
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">Optional:</span>
                          <ul className="mt-1 space-y-1 text-gray-600">
                            <li>• hiringRoles (array of strings)</li>
                            <li>• hrContacts (array of objects)</li>
                            <li>• description (string)</li>
                            <li>• website (string)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Example JSON */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Complete Example
                        </h4>
                        <button 
                          type="button"
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                          onClick={() => {
                            const exampleJson = `[
  {
    "companyName": "TechCorp Solutions",
    "industry": "Technology",
    "location": "San Francisco, CA",
    "jobMode": "Remote",
    "experience": "1-3",
    "hiringRoles": ["React Developer", "Node.js Developer", "DevOps Engineer"],
    "hrContacts": [
      {
        "name": "Sarah Johnson",
        "position": "Senior HR Manager",
        "email": "sarah.johnson@techcorp.com",
        "linkedIn": "https://linkedin.com/in/sarahjohnson"
      },
      {
        "name": "Mike Chen",
        "position": "Technical Recruiter",
        "email": "mike.chen@techcorp.com",
        "linkedIn": "https://linkedin.com/in/mikechen"
      }
    ],
    "website": "https://techcorp.com",
    "description": "Leading software solutions company"
  },
  {
    "companyName": "DataFlow Analytics",
    "industry": "Data Science",
    "location": "New York, NY",
    "jobMode": "Hybrid",
    "experience": "3-5",
    "hiringRoles": ["Data Scientist", "ML Engineer"],
    "hrContacts": [
      {
        "name": "Emily Rodriguez",
        "position": "Talent Acquisition Lead",
        "email": "emily@dataflow.com",
        "linkedIn": "https://linkedin.com/in/emilyrodriguez"
      }
    ]
  }
]`;
                            setBulkJson(exampleJson);
                          }}
                        >
                          Copy Example
                        </button>
                      </div>
                      <motion.pre 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs overflow-x-auto font-mono text-green-400 whitespace-pre-wrap"
                      >
{`[
  {
    "companyName": "TechCorp Solutions",
    "industry": "Technology",
    "location": "San Francisco, CA",
    "jobMode": "Remote",
    "experience": "1-3",
    "hiringRoles": ["React Developer", "Node.js Developer", "DevOps Engineer"],
    "hrContacts": [
      {
        "name": "Sarah Johnson",
        "position": "Senior HR Manager",
        "email": "sarah.johnson@techcorp.com",
        "linkedIn": "https://linkedin.com/in/sarahjohnson"
      }
    ],
    "website": "https://techcorp.com",
    "description": "Leading software solutions company"
  }
]`}
                      </motion.pre>
                    </div>
                  </div>
                </motion.details>
              </div>              <div className="relative">
                <motion.textarea
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                  className={`w-full border-2 rounded-xl px-4 py-4 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm bg-white transition-all duration-200 resize-vertical ${
                    jsonValidation.isValid === null ? "border-blue-200 focus:border-blue-400" :
                    jsonValidation.isValid ? "border-green-300 focus:border-green-400" :
                    "border-red-300 focus:border-red-400"
                  }`}
                  placeholder={`Paste your JSON array here...\n\nTip: Use the "Copy Example" button above to get started quickly!`}
                  value={bulkJson}
                  onChange={e => setBulkJson(e.target.value)}
                />
                
                {/* JSON Validation Indicator */}
                {jsonValidation.message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-medium ${
                      jsonValidation.isValid 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {jsonValidation.message}
                  </motion.div>
                )}
              </div>
              <div className="flex justify-between items-start mt-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Bulk upload validates all fields automatically</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Invalid entries will be skipped with detailed error messages</span>
                  </div>
                </div>                <motion.button
                  whileHover={{ scale: jsonValidation.isValid ? 1.05 : 1, boxShadow: jsonValidation.isValid ? "0 10px 25px rgba(59, 130, 246, 0.3)" : "none" }}
                  whileTap={{ scale: jsonValidation.isValid ? 0.95 : 1 }}
                  className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ml-4 transition-all duration-200 ${
                    jsonValidation.isValid
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white hover:shadow-lg cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleBulkAdd}
                  disabled={!jsonValidation.isValid}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  {jsonValidation.isValid ? "Bulk Upload" : "Invalid JSON"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>        {/* Pending List */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Pending Approvals
            </h2>
            {pending.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
              >
                {pending.length}
              </motion.span>
            )}
          </div>
          {pending.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">All caught up! No pending companies.</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-blue-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="p-4 text-left font-semibold text-blue-700">Company</th>
                    <th className="p-4 text-left font-semibold text-blue-700">Roles</th>
                    <th className="p-4 text-left font-semibold text-blue-700">Job Mode</th>
                    <th className="p-4 text-left font-semibold text-blue-700">Status</th>
                    <th className="p-4 text-left font-semibold text-blue-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((c, index) => (
                    <motion.tr 
                      key={c._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-gray-800">{c.companyName}</td>
                      <td className="p-4 text-gray-600">{c.hiringRoles?.join(", ")}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {c.jobMode}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium capitalize">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-xs"
                          onClick={() => handleStatusToggle(c, "approved")}
                        >
                          Approve
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs"
                          onClick={() => handleStatusToggle(c, "rejected")}
                        >
                          Reject
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>        {/* Company List */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              All Companies
            </h2>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
            >
              {total} total
            </motion.span>
          </div>
          
          {pageLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
              />
              <p className="text-blue-600 font-medium">Loading companies...</p>
            </motion.div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-blue-100">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <th className="p-4 text-left font-semibold text-blue-700">Company</th>
                      <th className="p-4 text-left font-semibold text-blue-700">Roles</th>
                      <th className="p-4 text-left font-semibold text-blue-700">Job Mode</th>
                      <th className="p-4 text-left font-semibold text-blue-700">Status</th>
                      <th className="p-4 text-left font-semibold text-blue-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((c, index) => (
                      <motion.tr
                        key={c._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <CompanyRow
                          company={c}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-blue-100"
                >
                  <div className="text-sm text-gray-600 font-medium">
                    Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} companies
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </motion.button>

                    <div className="flex items-center gap-1 max-w-xs sm:max-w-sm overflow-x-auto scrollbar-hide">
                      {/* First page */}
                      {page > 3 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg font-semibold transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 flex-shrink-0"
                            onClick={() => setPage(1)}
                          >
                            1
                          </motion.button>
                          {page > 4 && (
                            <span className="px-2 text-gray-400 flex-shrink-0">...</span>
                          )}
                        </>
                      )}

                      {/* Page numbers around current page */}
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;
                        if (pageNum === 1 && page > 3) return null;
                        if (pageNum === totalPages && page < totalPages - 2) return null;

                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 flex-shrink-0 ${
                              page === pageNum
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                            }`}
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}

                      {/* Last page */}
                      {page < totalPages - 2 && (
                        <>
                          {page < totalPages - 3 && (
                            <span className="px-2 text-gray-400 flex-shrink-0">...</span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg font-semibold transition-all duration-200 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 flex-shrink-0"
                            onClick={() => setPage(totalPages)}
                          >
                            {totalPages}
                          </motion.button>
                        </>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* ====== JOB MANAGEMENT SECTION ====== */}
        
        {/* Job Manager Header */}
        <motion.div 
          variants={cardVariants}
          className="text-center mb-8 mt-16"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl py-2 font-extrabold bg-gradient-to-r from-green-700 via-green-500 to-green-400 bg-clip-text text-transparent mb-4"
          >
            Job Manager
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Add, edit, approve, and manage job postings with powerful admin tools.
          </motion.p>
        </motion.div>

        {/* Job Form Section */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-green-100"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6m0 0v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  Add New Job
                </h2>
              </div>
              <JobForm onSubmit={handleJobAdd} />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  Bulk Add Jobs (JSON)
                </h2>
              </div>
              
              <div className="mb-4">
                <motion.details 
                  whileHover={{ scale: 1.01 }}
                  className="text-sm text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 shadow-sm"
                >
                  <summary className="cursor-pointer hover:text-green-600 font-semibold flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    📋 JSON Format Example & Guidelines
                  </summary>
                  
                  <div className="space-y-4 mt-4">
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Field Requirements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-medium text-red-600">Required:</span>
                          <ul className="mt-1 space-y-1 text-gray-600">
                            <li>• title (string)</li>
                            <li>• company (string)</li>
                            <li>• location (string)</li>
                            <li>• description (string)</li>
                            <li>• url (string)</li>
                            <li>• tags (array)</li>
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">Optional:</span>
                          <ul className="mt-1 space-y-1 text-gray-600">
                            <li>• jobType (string)</li>
                            <li>• workMode (string)</li>
                            <li>• experienceLevel (string)</li>
                            <li>• salaryRange (object)</li>
                            <li>• companyLogo (string)</li>
                            <li>• shortDescription (string)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-700 mb-2 text-xs">📝 Example JSON Format:</h5>
                      <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
{`[
  {
    "title": "Senior React Developer",
    "company": "TechCorp Solutions",
    "location": "Remote",
    "description": "We are looking for an experienced React developer...",
    "url": "https://company.com/careers/react-dev",
    "tags": ["React", "JavaScript", "TypeScript", "Node.js"],
    "jobType": "full-time",
    "workMode": "remote",
    "experienceLevel": "senior",
    "salaryRange": {
      "min": 80000,
      "max": 120000,
      "currency": "USD",
      "period": "yearly"
    },
    "companyLogo": "https://company.com/logo.png"
  }
]`}
                      </pre>
                    </div>
                  </div>
                </motion.details>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">
                    JSON Data
                  </label>
                  <textarea
                    value={jobBulkJson}
                    onChange={(e) => setJobBulkJson(e.target.value)}
                    placeholder="Paste your job array JSON here..."
                    rows="12"
                    className="w-full border-2 border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 bg-white font-mono text-sm resize-vertical"
                  />
                </div>
                
                {/* JSON Validation Status */}
                {jobJsonValidation.message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg text-sm font-medium ${
                      jobJsonValidation.isValid === true
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : jobJsonValidation.isValid === false
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {jobJsonValidation.message}
                  </motion.div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJobBulkAdd}
                  disabled={!jobJsonValidation.isValid}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Jobs
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Pending Job Approvals */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-green-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-700 to-orange-500 bg-clip-text text-transparent">
              Pending Job Approvals
            </h2>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
            >
              {pendingJobs.length} pending
            </motion.span>
          </div>
          
          {pendingJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">All caught up! No pending jobs.</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-green-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-green-100">
                    <th className="p-4 text-left font-semibold text-green-700">Job Title</th>
                    <th className="p-4 text-left font-semibold text-green-700">Company</th>
                    <th className="p-4 text-left font-semibold text-green-700">Location</th>
                    <th className="p-4 text-left font-semibold text-green-700">Type</th>
                    <th className="p-4 text-left font-semibold text-green-700">Status</th>
                    <th className="p-4 text-left font-semibold text-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingJobs.map((job, index) => (
                    <motion.tr 
                      key={job._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-green-50 hover:bg-green-50/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-gray-800">{job.title}</td>
                      <td className="p-4 text-gray-600">{job.company}</td>
                      <td className="p-4 text-gray-600">{job.location}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                          {job.jobType?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium capitalize">
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-xs"
                          onClick={() => handleJobStatusToggle(job, "active")}
                        >
                          Approve
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs"
                          onClick={() => handleJobStatusToggle(job, "rejected")}
                        >
                          Reject
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Job List */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-green-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6m0 0v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              All Jobs
            </h2>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full"
            >
              {jobTotal} total
            </motion.span>
          </div>
          
          {jobPageLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
              />
              <p className="text-green-600 font-medium">Loading jobs...</p>
            </motion.div>
          ) : (
            <>
              {jobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6m0 0v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No jobs found. Add your first job!</p>
                </motion.div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-green-100">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-50 to-green-100">
                        <th className="p-4 text-left font-semibold text-green-700">Job Title</th>
                        <th className="p-4 text-left font-semibold text-green-700">Company</th>
                        <th className="p-4 text-left font-semibold text-green-700">Location</th>
                        <th className="p-4 text-left font-semibold text-green-700">Type</th>
                        <th className="p-4 text-left font-semibold text-green-700">Status</th>
                        <th className="p-4 text-left font-semibold text-green-700">Posted</th>
                        <th className="p-4 text-left font-semibold text-green-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job, index) => (
                        <motion.tr 
                          key={job._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-green-50 hover:bg-green-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-semibold text-gray-800">{job.title}</div>
                                <div className="text-xs text-gray-500">
                                  {job.tags?.slice(0, 3).join(", ")}
                                  {job.tags?.length > 3 && ` +${job.tags.length - 3} more`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{job.company}</td>
                          <td className="p-4 text-gray-600">{job.location}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                              {job.jobType?.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              job.status === 'active' ? 'bg-green-100 text-green-700' :
                              job.status === 'draft' ? 'bg-orange-100 text-orange-700' :
                              job.status === 'expired' ? 'bg-gray-100 text-gray-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 text-xs">
                            {job.daysAgo}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs"
                                onClick={() => handleJobEdit(job)}
                              >
                                Edit
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this job?')) {
                                    handleJobDelete(job._id);
                                  }
                                }}
                              >
                                Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Job Pagination */}
              {jobTotalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-green-100"
                >
                  <div className="text-sm text-gray-600 font-medium">
                    Showing {((jobPage - 1) * PAGE_SIZE) + 1} to {Math.min(jobPage * PAGE_SIZE, jobTotal)} of {jobTotal} jobs
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setJobPage(jobPage - 1)}
                      disabled={jobPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </motion.button>

                    <div className="flex items-center gap-1 max-w-xs sm:max-w-sm overflow-x-auto scrollbar-hide">
                      {/* First page */}
                      {jobPage > 3 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg font-semibold transition-all duration-200 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 flex-shrink-0"
                            onClick={() => setJobPage(1)}
                          >
                            1
                          </motion.button>
                          {jobPage > 4 && (
                            <span className="px-2 text-gray-400 flex-shrink-0">...</span>
                          )}
                        </>
                      )}

                      {/* Page numbers around current page */}
                      {Array.from({ length: Math.min(jobTotalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (jobTotalPages <= 5) {
                          pageNum = i + 1;
                        } else if (jobPage <= 3) {
                          pageNum = i + 1;
                        } else if (jobPage >= jobTotalPages - 2) {
                          pageNum = jobTotalPages - 4 + i;
                        } else {
                          pageNum = jobPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > jobTotalPages) return null;
                        if (pageNum === 1 && jobPage > 3) return null;
                        if (pageNum === jobTotalPages && jobPage < jobTotalPages - 2) return null;

                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 flex-shrink-0 ${
                              jobPage === pageNum
                                ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg"
                                : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                            }`}
                            onClick={() => setJobPage(pageNum)}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}

                      {/* Last page */}
                      {jobPage < jobTotalPages - 2 && (
                        <>
                          {jobPage < jobTotalPages - 3 && (
                            <span className="px-2 text-gray-400 flex-shrink-0">...</span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg font-semibold transition-all duration-200 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 flex-shrink-0"
                            onClick={() => setJobPage(jobTotalPages)}
                          >
                            {jobTotalPages}
                          </motion.button>
                        </>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setJobPage(jobPage + 1)}
                      disabled={jobPage === jobTotalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>


        {/* Job Edit Modal */}
        <AnimatePresence>
          {editingJob && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setEditingJob(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Edit Job</h2>
                        <p className="text-green-100 text-sm">{editingJob.title}</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      onClick={() => setEditingJob(null)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 bg-white text-gray-800">
                  <JobForm initialValues={editingJob} onSubmit={handleJobUpdate} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>        {/* Enhanced Edit Modal */}
        <AnimatePresence>
          {editing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setEditing(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Edit Company</h2>
                        <p className="text-blue-100 text-sm">{editing.companyName}</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      onClick={() => setEditing(null)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 bg-white text-gray-800">
                  <CompanyForm initialValues={editing} onSubmit={handleUpdate} />
                </div>
              </motion.div>
            </motion.div>
          )}        </AnimatePresence>

        {/* Floating Navigation Menu */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="relative group">
            {/* Main FAB */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              onClick={() => {
                const menu = document.getElementById('fab-menu');
                menu.classList.toggle('hidden');
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </motion.button>

            {/* Menu Items */}
            <div id="fab-menu" className="hidden absolute bottom-16 right-0 space-y-3">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-3 px-4 py-3 bg-white text-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-200 min-w-[160px]"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <span className="font-medium">Dashboard</span>
              </motion.a>

              <motion.a
                href="/company-search"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-3 px-4 py-3 bg-white text-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-purple-200 min-w-[160px]"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="font-medium">Search</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 px-4 py-3 bg-white text-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-green-200 min-w-[160px]"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <span className="font-medium">Top</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
