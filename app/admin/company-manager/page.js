"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CompanyForm from "@/components/CompanyForm";
import CompanyRow from "@/components/CompanyRow";
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
  const [pending, setPending] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

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

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2563eb] mb-2 text-center">Admin: Company Manager</h1>
        <p className="text-gray-600 text-center mb-6">Add, edit, approve, and manage companies and HR contacts.</p>
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#2563eb] mb-2">Add New Company</h2>
              <CompanyForm onSubmit={handleAdd} />
            </div>            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#2563eb] mb-2">Bulk Add (JSON)</h2>
              <div className="mb-2">
                <details className="text-sm text-gray-600">
                  <summary className="cursor-pointer hover:text-blue-600">Show JSON Example</summary>                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`[
  {
    "companyName": "TechCorp Ltd",
    "industry": "Technology",
    "location": "San Francisco, CA",
    "jobMode": "Remote",
    "experience": "1-3",
    "hiringRoles": ["React Developer", "Backend Developer", "Full Stack Developer"],
    "hrContacts": [
      {
        "name": "John Doe",
        "position": "HR Manager",
        "email": "john@techcorp.com",
        "linkedIn": "https://linkedin.com/in/johndoe"
      }
    ]
  }
]`}
                  </pre>
                </details>
              </div>
              <textarea
                className="w-full border border-blue-200 rounded px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
                placeholder="Paste JSON array of companies here..."
                value={bulkJson}
                onChange={e => setBulkJson(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Required fields: companyName, industry, location, jobMode, experience
                </span>
                <button
                  className="px-4 py-2 bg-[#2563eb] text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={handleBulkAdd}
                  disabled={!bulkJson.trim()}
                >
                  Bulk Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending List */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#2563eb] mb-4">Pending Approvals</h2>
          {pending.length === 0 ? (
            <div className="text-gray-400">No pending companies.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-2 text-left">Company</th>
                    <th className="p-2 text-left">Roles</th>
                    <th className="p-2 text-left">Job Mode</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((c) => (
                    <tr key={c._id} className="border-b">
                      <td className="p-2 font-semibold">{c.companyName}</td>
                      <td className="p-2">{c.hiringRoles?.join(", ")}</td>
                      <td className="p-2">{c.jobMode}</td>
                      <td className="p-2 capitalize">{c.status}</td>
                      <td className="p-2 flex gap-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200" onClick={() => handleStatusToggle(c, "approved")}>Approve</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => handleStatusToggle(c, "rejected")}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Company List */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-[#2563eb] mb-4">All Companies</h2>
          {pageLoading ? (
            <div className="text-center py-10 text-blue-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-2 text-left">Company</th>
                    <th className="p-2 text-left">Roles</th>
                    <th className="p-2 text-left">Job Mode</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <CompanyRow
                      key={c._id}
                      company={c}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-[#2563eb] text-white" : "bg-blue-100 text-blue-700"}`}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setEditing(null)}>✕</button>
              <h2 className="text-xl font-semibold text-[#2563eb] mb-4">Edit Company</h2>
              <CompanyForm initialValues={editing} onSubmit={handleUpdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
