import React from "react";

export default function AuditResultCard({
  totalScore = 0,
  sectionScore = 0,
  keywordScore = 0,
  lengthScore = 0,
  contactScore = 0,
  foundKeywords = [],
  missingKeywords = [],
  missingSections = [],
}) {
  const scoreItems = [
    { label: "Section", value: sectionScore, color: "bg-blue-500" },
    { label: "Keyword", value: keywordScore, color: "bg-green-500" },
    { label: "Length", value: lengthScore, color: "bg-purple-500" },
    { label: "Contact", value: contactScore, color: "bg-yellow-500" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-1">{totalScore} <span className="text-lg font-normal">/ 100</span></div>
        <div className="text-gray-500 text-sm">Total ATS Score</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {scoreItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="font-semibold mb-1">{item.label} Score</div>
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-3 bg-gray-200 rounded">
                <div
                  className={`${item.color} h-3 rounded transition-all`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-bold w-8 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">✅ Found Keywords</div>
        <div className="flex flex-wrap gap-2">
          {foundKeywords.length ? foundKeywords.map((kw) => (
            <span key={kw} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{kw}</span>
          )) : <span className="text-gray-500">None</span>}
        </div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-1">❌ Missing Keywords</div>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length ? missingKeywords.map((kw) => (
            <span key={kw} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{kw}</span>
          )) : <span className="text-gray-500">None</span>}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1">❗ Missing Sections</div>
        <div className="flex flex-wrap gap-2">
          {missingSections.length ? missingSections.map((sec) => (
            <span key={sec} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{sec}</span>
          )) : <span className="text-gray-500">None</span>}
        </div>
      </div>
    </div>
  );
} 