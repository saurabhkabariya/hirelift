import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const TemplateEditor = ({ template, onEdit, onSave }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);

  if (!template) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
    onSave();
    setIsSaving(false);
  };

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = template.template;
      const newValue = currentValue.substring(0, start) + `{${variable}}` + currentValue.substring(end);
      
      onEdit('template', newValue);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
      }, 0);
    }
  };

  const commonVariables = [
    'firstName', 'lastName', 'fullName', 'companyName', 'role', 'email',
    'phoneNumber', 'linkedin', 'experience', 'skills', 'location'
  ];

  const copyToClipboard = () => {
    const content = template.templateType === 'email' 
      ? `Subject: ${template.subject}\n\n${template.template}`
      : template.template;
    
    navigator.clipboard.writeText(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Template Editor</h3>
            <p className="text-blue-100 mt-1">Customize your {template.templateType} template</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('variables')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'variables'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Variables
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => onEdit('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template name..."
              />
            </div>

            {/* Subject (for email templates) */}
            {template.templateType === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={template.subject || ''}
                  onChange={(e) => onEdit('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email subject..."
                />
              </div>
            )}

            {/* Template Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                ref={textareaRef}
                value={template.template}
                onChange={(e) => onEdit('template', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                rows={12}
                placeholder="Enter your template content..."
              />
              <div className="mt-2 text-xs text-gray-500">
                Use {'{variableName}'} to insert dynamic content. Click variables from the Variables tab to insert them.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Available Variables</h4>
              <p className="text-gray-600 mb-6">
                Click on any variable to insert it at your cursor position in the template.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonVariables.map((variable) => (
                  <motion.button
                    key={variable}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => insertVariable(variable)}
                    className="p-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-colors group"
                  >
                    <div className="font-mono text-sm text-blue-600 group-hover:text-blue-700">
                      {'{' + variable + '}'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {variable.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Variable */}
            <div className="border-t pt-6">
              <h5 className="font-medium text-gray-800 mb-3">Custom Variable</h5>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="variableName"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      insertVariable(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector('input');
                    if (input.value.trim()) {
                      insertVariable(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Template Settings</h4>
              
              <div className="space-y-4">
                {/* Template Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Type
                  </label>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => onEdit('templateType', 'email')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        template.templateType === 'email'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </button>
                    <button
                      onClick={() => onEdit('templateType', 'linkedin')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        template.templateType === 'linkedin'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                  </div>
                </div>

                {/* Role Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Category
                  </label>
                  <select
                    value={template.roleType}
                    onChange={(e) => onEdit('roleType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Mobile App Developer">Mobile App Developer</option>
                    <option value="React Developer">React Developer</option>
                  </select>
                </div>

                {/* Template ID (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template ID
                  </label>
                  <input
                    type="text"
                    value={template.id}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TemplateEditor;
