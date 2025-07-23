import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const TemplatePreview = ({ template }) => {
  const [previewData, setPreviewData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    companyName: 'TechCorp Solutions',
    role: 'Senior Frontend Developer',
    email: 'john.doe@techcorp.com',
    phoneNumber: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com/in/johndoe',
    experience: '5 years',
    skills: 'React, TypeScript, Node.js',
    location: 'San Francisco, CA'
  });

  const [isEditingData, setIsEditingData] = useState(false);

  if (!template) return null;

  // Process template with preview data
  const processedContent = useMemo(() => {
    let content = template.template;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, value);
    });
    return content;
  }, [template.template, previewData]);

  const processedSubject = useMemo(() => {
    if (!template.subject) return '';
    let subject = template.subject;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      subject = subject.replace(regex, value);
    });
    return subject;
  }, [template.subject, previewData]);

  const copyPreviewToClipboard = () => {
    const content = template.templateType === 'email' 
      ? `Subject: ${processedSubject}\n\n${processedContent}`
      : processedContent;
    
    navigator.clipboard.writeText(content);
  };

  const resetPreviewData = () => {
    setPreviewData({
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      companyName: 'TechCorp Solutions',
      role: 'Senior Frontend Developer',
      email: 'john.doe@techcorp.com',
      phoneNumber: '+1 (555) 123-4567',
      linkedin: 'https://linkedin.com/in/johndoe',
      experience: '5 years',
      skills: 'React, TypeScript, Node.js',
      location: 'San Francisco, CA'
    });
  };

  const getTemplateTypeIcon = (templateType) => {
    if (templateType === 'email') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTemplateTypeIcon(template.templateType)}
            <div>
              <h3 className="text-xl font-bold">Live Preview</h3>
              <p className="text-green-100 mt-1">See how your template will look</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditingData(!isEditingData)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {isEditingData ? 'Hide Editor' : 'Edit Data'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyPreviewToClipboard}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Preview
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Preview Data Editor */}
        {isEditingData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Preview Data</h4>
              <button
                onClick={resetPreviewData}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset to Default
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(previewData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${key}...`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Template Preview */}
        <div className="space-y-6">
          {/* Template Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                template.templateType === 'email' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {getTemplateTypeIcon(template.templateType)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{template.name}</h4>
                <p className="text-sm text-gray-600">
                  {template.roleType} • {template.templateType === 'email' ? 'Email' : 'LinkedIn DM'}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              template.templateType === 'email' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {template.templateType === 'email' ? 'Email Template' : 'LinkedIn Template'}
            </div>
          </div>

          {/* Email Preview */}
          {template.templateType === 'email' && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Email Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Subject:</span>
                    <span className="text-gray-800">{processedSubject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">From:</span>
                    <span className="text-gray-800">your.email@company.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">To:</span>
                    <span className="text-gray-800">{previewData.email}</span>
                  </div>
                </div>
              </div>
              
              {/* Email Body */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {processedContent}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Preview */}
          {template.templateType === 'linkedin' && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* LinkedIn Header */}
              <div className="bg-[#0077b5] p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-sm">YN</span>
                  </div>
                  <div>
                    <div className="font-semibold">Your Name</div>
                    <div className="text-sm text-blue-100">LinkedIn Message</div>
                  </div>
                </div>
              </div>
              
              {/* LinkedIn Message */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {processedContent}
                  </pre>
                </div>
              </div>
              
              {/* LinkedIn Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Message sent via LinkedIn</span>
                  <div className="flex items-center gap-4">
                    <button className="text-blue-600 hover:text-blue-800">Reply</button>
                    <button className="text-blue-600 hover:text-blue-800">Forward</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600">
                {processedContent.length}
              </div>
              <div className="text-sm text-blue-700 font-medium">Characters</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-green-600">
                {processedContent.split(/\s+/).length}
              </div>
              <div className="text-sm text-green-700 font-medium">Words</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600">
                {(processedContent.match(/{[^}]+}/g) || []).length}
              </div>
              <div className="text-sm text-purple-700 font-medium">Variables Left</div>
            </div>
          </div>

          {/* Variable Usage */}
          {(processedContent.match(/{[^}]+}/g) || []).length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium text-yellow-800">Unresolved Variables</span>
              </div>
              <div className="text-sm text-yellow-700">
                The following variables still need values: {' '}
                <span className="font-mono">
                  {(processedContent.match(/{[^}]+}/g) || []).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TemplatePreview;
