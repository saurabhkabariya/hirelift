import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateModal from "./TemplateModal";
import { POPULAR_ROLES } from "@/data/emailTemplates";

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
  const [templateModal, setTemplateModal] = useState({ isOpen: false, selectedRole: null });
  const openTemplateModal = (role) => {
    setTemplateModal({ isOpen: true, selectedRole: role });
  };

  const closeTemplateModal = () => {
    setTemplateModal({ isOpen: false, selectedRole: null });
  };

  // Company data for templates
  const companyData = {
    companyName,
    industry,
    location,
    hiringRoles,
    jobMode,
    experience,
    hrContacts
  };

  return (
    <motion.div 
      layout
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-600 h-full w-full flex flex-col justify-between"
      whileHover={{ 
        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
        borderColor: "rgba(59, 130, 246, 0.3)"
      }}
    >
      {/* Company Header */}
      <div className="mb-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-3"
        >
          <div className="flex-1">
            <motion.h3 
              whileHover={{ scale: 1.02 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2 leading-tight"
            >
              {companyName}
            </motion.h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">{industry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Recently'}
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
            </svg>
            {jobMode}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Exp: {experience}
          </motion.span>
        </div>
      </div>

      {/* Hiring Roles */}
      <div className="mb-4">
        <div className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-3">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Open Positions
        </div>        <div className="space-y-2">
          {hiringRoles.length ? hiringRoles.slice(0, 3).map((role, index) => (
            <motion.div 
              key={role}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-2 h-2 rounded-full ${
                  POPULAR_ROLES.includes(role) ? 'bg-orange-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-800">{role}</span>
                {POPULAR_ROLES.includes(role) && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    🔥 Popular
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openTemplateModal(role)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-lg hover:shadow-md transition-all font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Templates
              </motion.button>
            </motion.div>
          )) : (
            <div className="text-center py-3 text-gray-500 text-sm">
              No open positions listed
            </div>
          )}
            {hiringRoles.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExpanded(!expanded)}
              className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {expanded ? 'Show Less' : `+${hiringRoles.length - 3} More Roles`}
            </motion.button>
          )}

          {/* Expanded Roles View */}
          <AnimatePresence>
            {expanded && hiringRoles.length > 3 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mt-2"
              >
                {hiringRoles.slice(3).map((role, index) => (
                  <motion.div 
                    key={role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-2 h-2 rounded-full ${
                        POPULAR_ROLES.includes(role) ? 'bg-orange-400' : 'bg-blue-400'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-800">{role}</span>
                      {POPULAR_ROLES.includes(role) && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                          🔥 Popular
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openTemplateModal(role)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-lg hover:shadow-md transition-all font-medium"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Templates
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* HR Contacts Section */}
      <div className="border-t border-gray-100 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-between w-full text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none transition-colors"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            HR Contacts ({hrContacts.length})
          </div>
          <motion.svg 
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {hrContacts.length ? hrContacts.map((hr, idx) => (
                  <motion.div 
                    key={hr.email + idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                  >                    <div className="flex flex-col gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-blue-800 mb-1">{hr.name}</div>
                        <div className="text-sm text-gray-600 mb-1">{hr.position}</div>
                        <div className="text-xs text-gray-500 font-mono">{hr.email}</div>
                      </div>
                      <div className="flex items-center justify-start gap-2 pt-2 border-t border-blue-100">
                        {hr.linkedIn && (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={hr.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                            LinkedIn
                          </motion.a>
                        )}                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(hr.email)}&su=${encodeURIComponent(`Inquiry about opportunities at ${companyName}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-lg hover:shadow-md transition-all font-medium"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v9.273L12 8.183l6.545 4.91V3.82h3.819c.904 0 1.636.733 1.636 1.637z"/>
                          </svg>
                          Quick Mail
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4"
                  >
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-400 text-sm">No HR contacts available</span>
                  </motion.div>
                )}
              </div>
            </motion.div>          )}
        </AnimatePresence>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={templateModal.isOpen}
        onClose={closeTemplateModal}
        company={companyData}
        selectedRole={templateModal.selectedRole}
      />
    </motion.div>
  );
}