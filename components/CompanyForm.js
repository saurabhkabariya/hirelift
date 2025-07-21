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
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2563eb] mb-1">Company Name</label>
          <input name="companyName" value={form.companyName} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2563eb] mb-1">Industry</label>
          <input name="industry" value={form.industry} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2563eb] mb-1">Location</label>
          <input name="location" value={form.location} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2563eb] mb-1">Job Mode</label>
          <select name="jobMode" value={form.jobMode} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select</option>
            {jobModes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2563eb] mb-1">Experience</label>
          <select name="experience" value={form.experience} onChange={handleChange} required className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select</option>
            {experiences.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>        <div className="col-span-1 sm:col-span-2">
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
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2563eb] mb-1">HR Contacts</label>
        <div className="space-y-2">
          {form.hrContacts.map((hr, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-blue-50 rounded p-3 mb-1">
              <input name="name" value={hr.name} onChange={e => handleHRChange(idx, e)} placeholder="Name" required className="flex-1 border border-blue-200 rounded px-2 py-1" />
              <input name="position" value={hr.position} onChange={e => handleHRChange(idx, e)} placeholder="Position" required className="flex-1 border border-blue-200 rounded px-2 py-1" />
              <input name="email" value={hr.email} onChange={e => handleHRChange(idx, e)} placeholder="Email" required className="flex-1 border border-blue-200 rounded px-2 py-1" />
              <input name="linkedIn" value={hr.linkedIn} onChange={e => handleHRChange(idx, e)} placeholder="LinkedIn" className="flex-1 border border-blue-200 rounded px-2 py-1" />
              {form.hrContacts.length > 1 && (
                <button type="button" className="text-red-500 ml-2" onClick={() => removeHR(idx)}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 px-3 py-1 bg-blue-100 text-[#2563eb] rounded hover:bg-blue-200" onClick={addHR}>+ Add HR</button>
      </div>
      <button type="submit" disabled={submitting} className="mt-4 px-6 py-2 bg-[#2563eb] text-white rounded hover:bg-blue-700 transition">
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
} 