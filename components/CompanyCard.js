import React, { useState } from "react";

export default function CompanyCard({
  companyName,
  industry,
  location,
  hiringRoles = [],
  jobMode,
  experience,
  hrContacts = [],
  lastUpdated,
}) {
  const [expanded, setExpanded] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (email, idx) => {
    navigator.clipboard.writeText(email);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6 transition hover:shadow-xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-[#2563eb] mb-1">{companyName}</h2>
          <div className="text-gray-500 text-sm mb-1">{industry} &bull; {location}</div>
        </div>
        <div className="text-xs text-gray-400 mt-2 sm:mt-0">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : '-'}</div>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="bg-blue-100 text-[#2563eb] px-3 py-1 rounded text-xs font-semibold">{jobMode}</span>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-semibold">Exp: {experience}</span>
      </div>
      <div className="mb-3">
        <div className="font-semibold text-sm mb-1">Hiring Roles</div>
        <div className="flex flex-wrap gap-2">
          {hiringRoles.length ? hiringRoles.map((role) => (
            <span key={role} className="bg-blue-50 text-[#2563eb] px-2 py-1 rounded text-xs">{role}</span>
          )) : <span className="text-gray-400 text-xs">None</span>}
        </div>
      </div>
      <div>
        <button
          className="flex items-center gap-2 text-sm text-[#2563eb] font-semibold focus:outline-none mt-2 mb-1 hover:underline"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? (
            <svg className="w-4 h-4 inline-block" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          ) : (
            <svg className="w-4 h-4 inline-block" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          )}
          {expanded ? "Hide HR Contacts" : "Show HR Contacts"}
        </button>
        {expanded && (
          <div className="flex flex-col gap-2 mt-2">
            {hrContacts.length ? hrContacts.map((hr, idx) => (
              <div key={hr.email + idx} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-blue-50 rounded px-3 py-2">
                <span className="font-medium text-[#2563eb]">{hr.name}</span>
                <span className="text-xs text-gray-500">{hr.position}</span>
                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  {hr.linkedIn && (
                    <a href={hr.linkedIn} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline px-2 py-1 rounded hover:bg-blue-100 transition">LinkedIn</a>
                  )}
                  <button
                    onClick={() => handleCopy(hr.email, idx)}
                    className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded hover:bg-blue-200 transition focus:outline-none"
                  >
                    {copiedIdx === idx ? "Copied!" : "Copy Email"}
                  </button>
                </div>
              </div>
            )) : <span className="text-gray-400 text-xs">No HR contacts</span>}
          </div>
        )}
      </div>
    </div>
  );
} 