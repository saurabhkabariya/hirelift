import React, { useState, useRef, useEffect } from "react";
import HIRING_ROLES from "@/data/hiringRoles";

const jobModes = ["Remote", "Hybrid", "On-site", "WFH"];
const experiences = ["Fresher", "0-1", "1-3", "3-5"];

export default function CompanyForm({ initialValues = {}, onSubmit }) {  const [form, setForm] = useState({
    companyName: initialValues.companyName || "",
    industry: initialValues.industry || "",
    location: initialValues.location || "",
    jobMode: initialValues.jobMode || "",
    experience: initialValues.experience || "",
    hiringRoles: initialValues.hiringRoles || [],
    hrContacts: initialValues.hrContacts || [{ name: "", position: "", email: "", linkedIn: "" }],
  });  const [submitting, setSubmitting] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const dropdownRef = useRef(null);

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
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role) => {
    const updatedRoles = form.hiringRoles.includes(role)
      ? form.hiringRoles.filter(r => r !== role)
      : [...form.hiringRoles, role];
    setForm({ ...form, hiringRoles: updatedRoles });
  };
  const removeRole = (roleToRemove) => {
    setForm({ ...form, hiringRoles: form.hiringRoles.filter(role => role !== roleToRemove) });
  };

  // Filter roles based on search term
  const filteredRoles = HIRING_ROLES.filter(role =>
    role.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );
  const handleHRChange = (idx, e) => {
    const updated = [...form.hrContacts];
    updated[idx][e.target.name] = e.target.value;
    setForm({ ...form, hrContacts: updated });
  };
  const addHR = () => {
    setForm({ ...form, hrContacts: [...form.hrContacts, { name: "", position: "", email: "", linkedIn: "" }] });
  };
  const removeHR = (idx) => {
    setForm({ ...form, hrContacts: form.hrContacts.filter((_, i) => i !== idx) });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate hiring roles
    if (form.hiringRoles.length === 0) {
      alert("Please select at least one hiring role");
      return;
    }
    
    setSubmitting(true);
    const data = {
      ...form,
      hiringRoles: form.hiringRoles, // Already an array
      hrContacts: form.hrContacts.filter((hr) => hr.name && hr.email),
    };
    await onSubmit(data);
    setSubmitting(false);
  };
  return (    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Company Name *</label>
          <input 
            name="companyName" 
            value={form.companyName} 
            onChange={handleChange} 
            required 
            placeholder="e.g., TechCorp Solutions"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Industry *</label>
          <input 
            name="industry" 
            value={form.industry} 
            onChange={handleChange} 
            required 
            placeholder="e.g., Technology, Healthcare"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Location *</label>
          <input 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            required 
            placeholder="e.g., San Francisco, CA"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Job Mode *</label>
          <select 
            name="jobMode" 
            value={form.jobMode} 
            onChange={handleChange} 
            required 
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white"
          >
            <option value="">Select job mode...</option>
            {jobModes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-blue-700 mb-2">Experience Level *</label>
          <select 
            name="experience" 
            value={form.experience} 
            onChange={handleChange} 
            required 
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white"
          >
            <option value="">Select experience level...</option>
            {experiences.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div><div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-[#2563eb] mb-1">Hiring Roles *</label>
          
          {/* Selected Roles Display */}
          <div className="mb-2">
            {form.hiringRoles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.hiringRoles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="ml-1 text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full border border-blue-200 rounded px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white flex items-center justify-between"
            >
              <span className="text-gray-500">
                {form.hiringRoles.length === 0 
                  ? "Select hiring roles..." 
                  : `${form.hiringRoles.length} role(s) selected`
                }
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>            {showRoleDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                    filteredRoles.map((role) => (
                      <label
                        key={role}
                        className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer rounded"
                      >
                        <input
                          type="checkbox"
                          checked={form.hiringRoles.includes(role)}
                          onChange={() => handleRoleToggle(role)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{role}</span>
                      </label>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No roles found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {form.hiringRoles.length === 0 && (
            <p className="text-red-500 text-xs mt-1">Please select at least one hiring role</p>
          )}
        </div>
      </div>      <div>
        <label className="block text-sm font-medium text-[#2563eb] mb-2">HR Contacts</label>
        <div className="space-y-3">
          {form.hrContacts.map((hr, idx) => (
            <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">HR Contact {idx + 1}</span>
                </div>
                {form.hrContacts.length > 1 && (
                  <button 
                    type="button" 
                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors" 
                    onClick={() => removeHR(idx)}
                    title="Remove HR Contact"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Single row layout for HR fields */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                  <input 
                    name="name" 
                    value={hr.name} 
                    onChange={e => handleHRChange(idx, e)} 
                    placeholder="e.g., Sarah Johnson" 
                    required 
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200" 
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Position *</label>
                  <input 
                    name="position" 
                    value={hr.position} 
                    onChange={e => handleHRChange(idx, e)} 
                    placeholder="e.g., HR Manager" 
                    required 
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200" 
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                  <input 
                    name="email" 
                    type="email"
                    value={hr.email} 
                    onChange={e => handleHRChange(idx, e)} 
                    placeholder="e.g., sarah@company.com" 
                    required 
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200" 
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn Profile</label>
                  <input 
                    name="linkedIn" 
                    value={hr.linkedIn} 
                    onChange={e => handleHRChange(idx, e)} 
                    placeholder="https://linkedin.com/in/..." 
                    className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          type="button" 
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 font-medium text-sm flex items-center gap-2 border border-blue-200" 
          onClick={addHR}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another HR Contact
        </button>
      </div>      <button 
        type="submit" 
        disabled={submitting} 
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Submit Company
          </>
        )}
      </button>
    </form>
  );
} 