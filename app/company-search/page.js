"use client";
import React, { useState, useEffect, useRef } from "react";
import CompanyCard from "@/components/CompanyCard";
import sampleCompanies from "@/data/sampleCompanies.json";
import HIRING_ROLES from "@/data/hiringRoles";

const jobModes = ["Remote", "Hybrid", "On-site", "WFH"];
const experiences = ["Fresher", "0-1", "1-3", "3-5"];

// Popular roles for quick selection
const POPULAR_ROLES = [
  "Full Stack Developer",
  "Frontend Developer", 
  "Backend Developer",
  "React Developer",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "Product Manager"
];

export default function CompanySearchPage() {
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("");
  const [exp, setExp] = useState("");
  const [companies, setCompanies] = useState(sampleCompanies);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter roles based on search term
  const filteredRoles = HIRING_ROLES.filter(r =>
    r.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setTouched(true);
    setShowRoleDropdown(false);
    setRoleSearchTerm("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowRoleDropdown(false);
    }
  };

  useEffect(() => {
    if (!touched) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (mode) params.append("mode", mode);
    if (exp) params.append("exp", exp);
    fetch(`/api/companies?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [role, mode, exp, touched]);

  // Initial fetch (all companies)
  useEffect(() => {
    setLoading(true);
    fetch(`/api/companies`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto mb-8">        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2 text-center">Company & HR Directory</h1>
        <p className="text-gray-600 text-center mb-6">Find companies by role, job mode, and experience. Connect with HRs directly.</p>
        
        {/* Selected Role Display */}
        {role && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full">
              <span>Searching for: <strong>{role}</strong></span>
              <button
                onClick={() => { setRole(""); setTouched(true); }}
                className="text-blue-600 hover:text-blue-800 text-lg leading-none"
              >
                ×
              </button>
            </span>
          </div>
        )}<div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-blue-700 mb-1">Role</label>
            <div className="relative" ref={dropdownRef}>              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                onKeyDown={handleKeyDown}
                className="w-full border border-blue-200 rounded px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white flex items-center justify-between"
                aria-expanded={showRoleDropdown}
                aria-haspopup="listbox"
              >
                <span className={role ? "text-gray-900" : "text-gray-500"}>
                  {role || "Select a role..."}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showRoleDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {/* Clear Selection Option */}
                  <div className="p-2 border-b border-gray-200">
                    <button
                      onClick={() => handleRoleSelect("")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded"
                    >
                      Clear selection
                    </button>
                  </div>

                  {/* Popular Roles */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-2">Popular Roles</div>
                    <div className="flex flex-wrap gap-1">
                      {POPULAR_ROLES.slice(0, 6).map((popularRole) => (
                        <button
                          key={popularRole}
                          onClick={() => handleRoleSelect(popularRole)}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                        >
                          {popularRole}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={roleSearchTerm}
                      onChange={(e) => setRoleSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {/* Roles List */}
                  <div className="p-2 max-h-48 overflow-y-auto">
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRoleSelect(r)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm text-gray-700 rounded block"
                        >
                          {r}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">No roles found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-blue-700 mb-1">Job Mode</label>
            <select
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={mode}
              onChange={e => { setMode(e.target.value); setTouched(true); }}
            >
              <option value="">Any</option>
              {jobModes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-blue-700 mb-1">Experience</label>
            <select
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={exp}
              onChange={e => { setExp(e.target.value); setTouched(true); }}
            >
              <option value="">Any</option>
              {experiences.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
      </div>      <div className="max-w-4xl mx-auto">
        {/* Results Counter */}
        {!loading && (
          <div className="mb-4 text-center text-gray-600">
            {companies.length > 0 ? (
              <span>{companies.length} compan{companies.length === 1 ? 'y' : 'ies'} found</span>
            ) : touched ? (
              <span>No companies found for your search criteria</span>
            ) : null}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p className="text-gray-500">Searching companies...</p>
            </div>
          </div>
        ) : companies.length ? (
          <div className="space-y-4">
            {companies.map((company) => (
              <CompanyCard
                key={company._id}
                companyName={company.companyName}
                industry={company.industry}
                location={company.location}
                hiringRoles={company.hiringRoles}
                jobMode={company.jobMode}
                experience={company.experience}
                hrContacts={company.hrContacts}
                lastUpdated={company.lastUpdated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500 mb-4">
                {touched 
                  ? "Try adjusting your search criteria to find more companies." 
                  : "Use the filters above to search for companies by role, job mode, and experience level."
                }
              </p>
              {touched && (
                <button
                  onClick={() => {
                    setRole("");
                    setMode("");
                    setExp("");
                    setTouched(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 