import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { getTemplatesForRole, POPULAR_ROLES } from '@/data/emailTemplates';

const TemplateModal = ({ 
  isOpen, 
  onClose, 
  company, 
  selectedRole,
  userInfo = {
    name: "Your Name",
    email: "your.email@example.com", 
    phone: "+1 (555) 123-4567",
    linkedinProfile: "https://linkedin.com/in/yourprofile",
    experience: "3+ years",
    skills: "React, JavaScript, Node.js",
    portfolioLink: "https://yourportfolio.com",
    githubProfile: "https://github.com/yourusername"
  }
}) => {  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateType, setTemplateType] = useState('email'); // 'email' or 'linkedin'
  const [editableFields, setEditableFields] = useState({});
  const [activeTab, setActiveTab] = useState('roleSpecific');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const textareaRef = useRef(null);
  
  // Portal container for rendering modal outside of parent containers
  const [portalContainer, setPortalContainer] = useState(null);
  
  useEffect(() => {
    // Create or get portal container
    let container = document.getElementById('modal-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-portal';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    setPortalContainer(container);
    
    return () => {
      // Clean up if component unmounts
      const existingContainer = document.getElementById('modal-portal');
      if (existingContainer && !existingContainer.hasChildNodes()) {
        document.body.removeChild(existingContainer);
      }
    };
  }, []);
  
  const templates = getTemplatesForRole(selectedRole);
    // Reset selected template when template type or tab changes
  useEffect(() => {
    setSelectedTemplate(null);
  }, [templateType, activeTab]);

  // Auto-switch to general tab if no role-specific templates for current type
  useEffect(() => {
    const roleSpecificTemplates = templates.roleSpecific || {};
    const hasRoleSpecificForCurrentType = roleSpecificTemplates[templateType] && roleSpecificTemplates[templateType].length > 0;
    
    if (activeTab === 'roleSpecific' && !hasRoleSpecificForCurrentType) {
      setActiveTab('general');
    }
  }, [templateType, templates, activeTab]);

  // Auto-select first template when available
  useEffect(() => {
    const roleSpecificTemplates = templates.roleSpecific || {};
    const generalTemplates = templates.general || {};
    const currentTemplates = templateType === 'email' 
      ? (activeTab === 'roleSpecific' ? roleSpecificTemplates.email || [] : generalTemplates.email || [])
      : (activeTab === 'roleSpecific' ? roleSpecificTemplates.linkedin || [] : generalTemplates.linkedin || []);
    
    if (currentTemplates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(currentTemplates[0]);
    }
  }, [templates, templateType, activeTab, selectedTemplate]);
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      // Handle ESC key press
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);
  
  // Fill template with company and user data
  const fillTemplate = (template) => {
    if (!template) return '';
    
    let filledTemplate = template.template;
    
    // Company information
    filledTemplate = filledTemplate.replace(/{companyName}/g, company.companyName || '[Company Name]');
    filledTemplate = filledTemplate.replace(/{industry}/g, company.industry || '[Industry]');
    filledTemplate = filledTemplate.replace(/{hrName}/g, 
      company.hrContacts?.[0]?.name || editableFields.hrName || '[HR Name]');
    
    // Role information
    filledTemplate = filledTemplate.replace(/{role}/g, selectedRole || '[Role]');
    
    // User information  
    filledTemplate = filledTemplate.replace(/{userName}/g, editableFields.userName || userInfo.name);
    filledTemplate = filledTemplate.replace(/{userEmail}/g, editableFields.userEmail || userInfo.email);
    filledTemplate = filledTemplate.replace(/{userPhone}/g, editableFields.userPhone || userInfo.phone);
    filledTemplate = filledTemplate.replace(/{linkedinProfile}/g, editableFields.linkedinProfile || userInfo.linkedinProfile);
    filledTemplate = filledTemplate.replace(/{experience}/g, editableFields.experience || userInfo.experience);
    filledTemplate = filledTemplate.replace(/{skills}/g, editableFields.skills || userInfo.skills);
    filledTemplate = filledTemplate.replace(/{portfolioLink}/g, editableFields.portfolioLink || userInfo.portfolioLink);
    filledTemplate = filledTemplate.replace(/{githubProfile}/g, editableFields.githubProfile || userInfo.githubProfile);
    
    // Customizable fields with defaults
    filledTemplate = filledTemplate.replace(/{userRole}/g, editableFields.userRole || selectedRole || '[Your Role]');
    filledTemplate = filledTemplate.replace(/{skillArea}/g, editableFields.skillArea || '[Your Skill Area]');
    filledTemplate = filledTemplate.replace(/{specificProject}/g, editableFields.specificProject || '[specific project/initiative]');
    filledTemplate = filledTemplate.replace(/{companyValues}/g, editableFields.companyValues || '[innovation/growth/customer success]');
    filledTemplate = filledTemplate.replace(/{expertise}/g, editableFields.expertise || '[your expertise area]');
    filledTemplate = filledTemplate.replace(/{specificGoal}/g, editableFields.specificGoal || '[specific company goal]');
    filledTemplate = filledTemplate.replace(/{uniqueStrength}/g, editableFields.uniqueStrength || '[unique company strength]');
    filledTemplate = filledTemplate.replace(/{achievement1}/g, editableFields.achievement1 || '[Achievement 1]');
    filledTemplate = filledTemplate.replace(/{achievement2}/g, editableFields.achievement2 || '[Achievement 2]');
    filledTemplate = filledTemplate.replace(/{achievement3}/g, editableFields.achievement3 || '[Achievement 3]');
    filledTemplate = filledTemplate.replace(/{contactInfo}/g, `${editableFields.userEmail || userInfo.email}\n${editableFields.userPhone || userInfo.phone}`);
    filledTemplate = filledTemplate.replace(/{fieldOfInterest}/g, editableFields.fieldOfInterest || '[your field of interest]');
    filledTemplate = filledTemplate.replace(/{specificArea}/g, editableFields.specificArea || '[specific area of interest]');
    
    // Role-specific technical fields
    filledTemplate = filledTemplate.replace(/{techStack}/g, editableFields.techStack || '[relevant tech stack]');
    filledTemplate = filledTemplate.replace(/{specificFeature}/g, editableFields.specificFeature || '[specific feature/aspect]');
    filledTemplate = filledTemplate.replace(/{improvementArea}/g, editableFields.improvementArea || '[area for improvement]');
    filledTemplate = filledTemplate.replace(/{projectType}/g, editableFields.projectType || '[project type]');
    filledTemplate = filledTemplate.replace(/{percentage}/g, editableFields.percentage || '[X]');
    filledTemplate = filledTemplate.replace(/{performanceGain}/g, editableFields.performanceGain || '[X]');
    filledTemplate = filledTemplate.replace(/{projectLink}/g, editableFields.projectLink || '[project link]');
    
    return filledTemplate;
  };
  const copyToClipboard = async () => {
    if (selectedTemplate) {
      try {
        const content = fillTemplate(selectedTemplate);
        await navigator.clipboard.writeText(content);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const updateField = (fieldName, value) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  if (!isOpen || !portalContainer) return null;

  const roleSpecificTemplates = templates.roleSpecific || {};
  const generalTemplates = templates.general || {};
  const currentTemplates = templateType === 'email' 
    ? (activeTab === 'roleSpecific' ? roleSpecificTemplates.email || [] : generalTemplates.email || [])
    : (activeTab === 'roleSpecific' ? roleSpecificTemplates.linkedin || [] : generalTemplates.linkedin || []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start xl:items-center justify-center overflow-auto"
          style={{ pointerEvents: 'auto', zIndex: 10000 }}
          onClick={onClose}
        >          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}            className="bg-white shadow-2xl overflow-hidden flex flex-col w-full h-full max-w-none max-h-none m-0 rounded-none xl:w-[90vw] xl:h-[90vh] xl:max-w-7xl xl:max-h-[90vh] xl:rounded-3xl xl:m-4 xl:min-h-[600px]"
            onClick={e => e.stopPropagation()}
          >{/* Header */}            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-4 md:px-6 md:py-6 lg:px-8 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg md:text-xl lg:text-3xl font-bold mb-1 truncate">Cold Outreach Templates</h2>
                    <p className="text-blue-100 text-sm md:text-base lg:text-lg truncate">
                      {company.companyName} • {selectedRole}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 ml-2"                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>            {/* Main Content */}
            <div className="flex flex-col xl:flex-row flex-1 overflow-hidden">              {/* Left Sidebar - Template Selection */}
              <div className={`w-full xl:w-80 2xl:w-96 border-b xl:border-b-0 xl:border-r border-gray-200 bg-gray-50/50 flex flex-col xl:max-h-none transition-all duration-300 ${
                selectedTemplate && !isMobileSidebarOpen ? 'max-h-16' : 'max-h-80'
              }`}>
                {/* Mobile Toggle Header */}
                <div className="xl:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    {selectedTemplate ? selectedTemplate.name : 'Select Template'}
                  </h3>
                  {selectedTemplate && (
                    <button
                      onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {isMobileSidebarOpen ? 'Hide' : 'Change'}
                    </button>
                  )}
                </div>
                
                <div className={`flex flex-col flex-1 transition-all duration-300 ${
                  selectedTemplate && !isMobileSidebarOpen ? 'xl:flex hidden' : 'flex'
                }`}>
                  <div className="p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0">
                  {/* Template Type Toggle */}
                  <div className="flex bg-gray-100 rounded-xl md:rounded-2xl p-1 mb-4 md:mb-6">
                    <button
                      onClick={() => setTemplateType('email')}
                      className={`flex-1 py-2.5 md:py-3 px-3 md:px-5 rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-all flex items-center justify-center gap-2 md:gap-3 ${
                        templateType === 'email'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email</span>
                    </button>
                    <button
                      onClick={() => setTemplateType('linkedin')}
                      className={`flex-1 py-2.5 md:py-3 px-3 md:px-5 rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-all flex items-center justify-center gap-2 md:gap-3 ${
                        templateType === 'linkedin'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </button>
                  </div>

                  {/* Template Category Tabs */}
                  <div className="flex bg-gray-100 rounded-xl md:rounded-2xl p-1">
                    {templates.roleSpecific && templates.roleSpecific[templateType] && templates.roleSpecific[templateType].length > 0 && (
                      <button
                        onClick={() => setActiveTab('roleSpecific')}
                        className={`flex-1 py-2 md:py-2.5 px-2 md:px-4 rounded-lg md:rounded-xl text-sm font-medium transition-all ${
                          activeTab === 'roleSpecific'
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        🎯 <span>Role-Specific</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`flex-1 py-2 md:py-2.5 px-2 md:px-4 rounded-lg md:rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'general'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      📝 <span>General</span>
                    </button>
                  </div>
                </div>                {/* Template List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 max-h-60 xl:max-h-none min-h-0">                  <div className="space-y-3 md:space-y-4">
                    {(() => {
                      const roleSpecificTemplates = templates.roleSpecific || {};
                      const generalTemplates = templates.general || {};
                      const currentTemplates = templateType === 'email' 
                        ? (activeTab === 'roleSpecific' ? roleSpecificTemplates.email || [] : generalTemplates.email || [])
                        : (activeTab === 'roleSpecific' ? roleSpecificTemplates.linkedin || [] : generalTemplates.linkedin || []);
                      
                      return currentTemplates.map((template) => (
                        <motion.button
                          key={template.id}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setSelectedTemplate(template);
                            // Auto-hide sidebar on mobile when template is selected
                            if (window.innerWidth < 1280) {
                              setIsMobileSidebarOpen(false);
                            }
                          }}
                          className={`w-full text-left p-3 md:p-5 rounded-xl md:rounded-2xl border transition-all relative overflow-hidden ${
                            selectedTemplate?.id === template.id
                              ? 'border-blue-300 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                          }`}
                        >
                          {selectedTemplate?.id === template.id && (
                            <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-blue-500 rounded-r"></div>
                          )}
                          <h3 className={`font-semibold text-sm md:text-base mb-2 md:mb-3 ${
                            selectedTemplate?.id === template.id ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {template.name}
                          </h3>
                          {template.subject && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-2 md:mb-3">
                              {template.subject.replace(/{[^}]+}/g, '...')}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className={`text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium ${
                              templateType === 'email' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {templateType === 'email' ? '📧' : '💼'} <span>{templateType === 'email' ? 'Email' : 'LinkedIn'}</span>
                            </span>
                          </div>
                        </motion.button>
                      ));
                    })()}
                  </div>
                </div>
                </div>
              </div>{/* Right Side - Template Preview and Customization */}
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {selectedTemplate ? (
                  <>                    {/* Template Header with Copy Button */}
                    <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8 md:py-6 flex-shrink-0">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                            {templateType === 'email' ? (
                              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            )}
                            <span className="truncate">{selectedTemplate.name}</span>
                          </h3>
                          <p className="text-gray-500 text-sm md:text-base">
                            {templateType === 'email' ? 'Email Template' : 'LinkedIn Message Template'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={copyToClipboard}
                          className={`flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg transition-all w-full md:w-auto ${
                            copySuccess 
                              ? 'bg-green-500 text-white'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl'
                          }`}
                        >
                          {copySuccess ? (
                            <>
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy to Clipboard
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                        {/* Basic Information Form */}
                        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-8">
                          <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Your Information
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm md:text-base font-medium text-gray-700">Full Name *</label>
                              <input
                                type="text"
                                placeholder="Your Full Name"
                                value={editableFields.userName || userInfo.name}
                                onChange={(e) => updateField('userName', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm md:text-base font-medium text-gray-700">Email Address *</label>
                              <input
                                type="email"
                                placeholder="your.email@example.com"
                                value={editableFields.userEmail || userInfo.email}
                                onChange={(e) => updateField('userEmail', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm md:text-base font-medium text-gray-700">Experience Level</label>
                              <select
                                value={editableFields.experience || userInfo.experience}
                                onChange={(e) => updateField('experience', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              >
                                <option value="Fresher">Fresher</option>
                                <option value="0-1 years">0-1 years</option>
                                <option value="1-3 years">1-3 years</option>
                                <option value="3-5 years">3-5 years</option>
                                <option value="5+ years">5+ years</option>
                                <option value="10+ years">10+ years</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm md:text-base font-medium text-gray-700">Your Skills</label>
                              <input
                                type="text"
                                placeholder="React, Node.js, Python..."
                                value={editableFields.skills || userInfo.skills}
                                onChange={(e) => updateField('skills', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Company Contact Information */}
                        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-8">
                          <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Company Details
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm md:text-base font-medium text-gray-700">HR Contact Name</label>
                              <input
                                type="text"
                                placeholder="HR Representative Name"
                                value={editableFields.hrName || company.hrContacts?.[0]?.name || 'Hiring Manager'}
                                onChange={(e) => updateField('hrName', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm md:text-base font-medium text-gray-700">LinkedIn Profile</label>
                              <input
                                type="url"
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={editableFields.linkedinProfile || userInfo.linkedinProfile}
                                onChange={(e) => updateField('linkedinProfile', e.target.value)}
                                className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                          </div>
                        </div>                        {/* Advanced Customization */}
                        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                            className="w-full px-4 py-4 md:px-8 md:py-6 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                          >
                            <h4 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
                              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Advanced Customization
                            </h4>
                            <svg className={`w-5 h-5 md:w-6 md:h-6 text-gray-500 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {isAdvancedOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 md:p-8 bg-white">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                    <input
                                      type="text"
                                      placeholder="Your Portfolio URL"
                                      value={editableFields.portfolioLink || userInfo.portfolioLink}
                                      onChange={(e) => updateField('portfolioLink', e.target.value)}
                                      className="px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="GitHub Profile"
                                      value={editableFields.githubProfile || userInfo.githubProfile}
                                      onChange={(e) => updateField('githubProfile', e.target.value)}
                                      className="px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Key Achievement 1"
                                      value={editableFields.achievement1 || ''}
                                      onChange={(e) => updateField('achievement1', e.target.value)}
                                      className="px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Key Achievement 2"
                                      value={editableFields.achievement2 || ''}
                                      onChange={(e) => updateField('achievement2', e.target.value)}
                                      className="px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Tech Stack/Specialization"
                                      value={editableFields.techStack || ''}
                                      onChange={(e) => updateField('techStack', e.target.value)}
                                      className="px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Specific Interest Area"
                                      value={editableFields.specificArea || ''}
                                      onChange={(e) => updateField('specificArea', e.target.value)}
                                      className="px-4 py-3 md:px-5 md:py-4 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Template Preview */}
                        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-8">
                          <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Preview
                          </h4>
                          <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200">
                            <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-800 font-mono leading-relaxed max-h-64 md:max-h-96 overflow-y-auto">
                              {fillTemplate(selectedTemplate)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                    <div className="text-center max-w-lg mx-auto p-12">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Choose a Template</h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        Select from role-specific templates crafted for {selectedRole} positions, or choose from our general outreach templates.
                      </p>
                      <div className="flex items-center justify-center gap-8 text-base text-gray-500">
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Customizable
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Ready
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, portalContainer);
};

export default TemplateModal;
