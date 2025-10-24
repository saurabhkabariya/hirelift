'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '../../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { usePageLoading } from '@/hooks/usePageLoading';
import { getAllTemplates, POPULAR_ROLES } from '@/data/emailTemplates';
import TemplateEditor from '@/components/TemplateEditor';
import TemplatePreview from '@/components/TemplatePreview';
import FeedbackButton from '@/components/feedback/FeedbackButton';

export default function PlaygroundPage() {
  const { user } = useAuth();
  const { navigateWithLoading } = usePageLoading();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editableTemplate, setEditableTemplate] = useState(null);  const [templateType, setTemplateType] = useState('email'); // 'email' or 'linkedin'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'general', or specific role
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  const allTemplates = getAllTemplates();
  
  // Flatten all templates with metadata for easier handling
  const flattenedTemplates = React.useMemo(() => {
    const templates = [];
    
    // Add general templates
    if (allTemplates.general) {
      allTemplates.general.email?.forEach(template => {
        templates.push({
          ...template,
          category: 'general',
          roleType: 'General',
          templateType: 'email'
        });
      });
      
      allTemplates.general.linkedin?.forEach(template => {
        templates.push({
          ...template,
          category: 'general',
          roleType: 'General',
          templateType: 'linkedin'
        });
      });
    }
    
    // Add role-specific templates
    if (allTemplates.roleSpecific) {
      Object.entries(allTemplates.roleSpecific).forEach(([role, roleTemplates]) => {
        roleTemplates.email?.forEach(template => {
          templates.push({
            ...template,
            category: 'role-specific',
            roleType: role,
            templateType: 'email'
          });
        });
        
        roleTemplates.linkedin?.forEach(template => {
          templates.push({
            ...template,
            category: 'role-specific',
            roleType: role,
            templateType: 'linkedin'
          });
        });
      });
    }
    
    return templates;
  }, [allTemplates]);  // Filter templates based on current filters
  const filteredTemplates = React.useMemo(() => {
    return flattenedTemplates.filter(template => {
      // Type filter
      if (template.templateType !== templateType) return false;
      
      // Category filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'general' && template.category !== 'general') return false;
        if (categoryFilter !== 'general' && template.roleType !== categoryFilter) return false;
      }
        // Search filter
      if (debouncedSearchTerm && !template.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) && 
          !template.roleType.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [flattenedTemplates, templateType, categoryFilter, debouncedSearchTerm]);
  // Handle filtering loading state
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [templateType, categoryFilter, debouncedSearchTerm]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);
    const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditableTemplate({ ...template });
    
    // Add a small success animation feedback
    if (typeof window !== 'undefined') {
      const element = document.querySelector(`[data-template-id="${template.id}"]`);
      if (element) {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 200);
      }
    }
  };
  
  const handleTemplateEdit = (field, value) => {
    if (editableTemplate) {
      setEditableTemplate({
        ...editableTemplate,
        [field]: value
      });
    }
  };
  
  const handleSaveTemplate = () => {
    // Here you would typically save to a backend or local storage
    console.log('Saving template:', editableTemplate);
    // For now, just update the selected template
    setSelectedTemplate(editableTemplate);
  };
    const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };
  // Template Card Component
  const TemplateCard = ({ template, isSelected, isFavorited, onSelect, onToggleFavorite }) => (
    <motion.div
      data-template-id={template.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative h-full bg-white/70 backdrop-blur-sm rounded-2xl p-6 border cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-cyan-500 shadow-xl bg-cyan-50/80' 
          : 'border-gray-200 hover:border-cyan-300 shadow-lg hover:shadow-xl'
      }`}
    >
      {/* Favorite Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
          isFavorited 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }`}
      >
        <svg className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.button>

      {/* Template Type Badge */}
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
        template.templateType === 'email' 
          ? 'bg-cyan-100 text-cyan-700' 
          : 'bg-cyan-100 text-cyan-700'
      }`}>
        {template.templateType === 'email' ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )}
        {template.templateType.charAt(0).toUpperCase() + template.templateType.slice(1)}
      </div>

      <h3 className="font-bold text-gray-800 mb-2 text-lg">{template.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.subject || template.content?.substring(0, 100) + '...'}</p>
      
      {/* Role Badge */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          template.category === 'general' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {template.roleType}
        </span>
        
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );    return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Clean Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full"></div>
        <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full"></div>
      </div>      <Header />

      {/* Navigation Breadcrumb - Enhanced mobile layout */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/95 backdrop-blur-md border-b border-cyan-200/50 mt-20"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4 py-3">            <nav className="flex items-center gap-2 text-xs sm:text-sm w-full lg:w-auto overflow-hidden">
              <Link href="/dashboard" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors truncate flex-shrink-0">
                Dashboard
              </Link>
              <span className="text-gray-400 flex-shrink-0">•</span>
              <span className="text-cyan-700 font-semibold truncate min-w-0">Cold Outreach Playground</span>
            </nav>

            {/* Quick Action Buttons - Improved mobile layout */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center sm:items-center gap-2 sm:gap-3 w-full lg:w-auto"
            >              {user?.isPremium ? (
                <Link href="/company-search" className="w-full xs:w-auto sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full xs:w-auto sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Company Search</span>
                  </motion.button>
                </Link>
              ) : (
                <Link href="/pricing" className="w-full xs:w-auto sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full xs:w-auto sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap relative"
                    title="Company Search - Premium Feature"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Company Search</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </motion.button>
                </Link>
              )}

              {/* View Mode Toggle - Better mobile spacing */}
              <div className="flex bg-gray-100 rounded-xl p-1 w-full xs:w-auto justify-center xs:justify-start">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 xs:flex-none p-1.5 sm:p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white text-cyan-600 shadow-md' : 'text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 xs:flex-none p-1.5 sm:p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white text-cyan-600 shadow-md' : 'text-gray-600'
                  }`}
                  title="List View"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>      {/* Page Title Section - Enhanced mobile responsiveness */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </motion.div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-700 to-cyan-800 bg-clip-text text-transparent">
                  Cold Outreach Playground
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Design, customize, and test your outreach templates</p>
              </div>
            </div>
            
            {/* Stats - Better mobile stacking */}
            <div className="flex flex-col xs:flex-row sm:flex-row lg:flex-col xl:flex-row items-stretch xs:items-center sm:items-center gap-2 sm:gap-3 text-sm w-full lg:w-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm flex-1 xs:flex-none text-center xs:text-left">
                <span className="text-gray-600">Templates:</span>
                <span className="font-bold text-cyan-600 ml-1">{flattenedTemplates.length}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm flex-1 xs:flex-none text-center xs:text-left">
                <span className="text-gray-600">Filtered:</span>
                <span className="font-bold text-cyan-600 ml-1">{filteredTemplates.length}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm flex-1 xs:flex-none text-center xs:text-left">
                <span className="text-gray-600">Favorites:</span>
                <span className="font-bold text-cyan-600 ml-1">{favorites.size}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel - Collapsible */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-md border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Search Templates</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Template Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Template Type</label>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setTemplateType('email')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        templateType === 'email'
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </button>
                    <button
                      onClick={() => setTemplateType('linkedin')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        templateType === 'linkedin'
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

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="all">All Templates</option>
                    <option value="general">General Templates</option>
                    {POPULAR_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quick Actions</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setFavorites(new Set())}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Favorites
                    </button>                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setDebouncedSearchTerm('');
                        setCategoryFilter('all');
                        setTemplateType('email');
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Template Library */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-6 sm:p-8"
          >            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Template Library</h2>
              <div className="flex items-center gap-3">
                {isFiltering && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 text-sm text-cyan-600"
                  >
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Filtering...
                  </motion.div>
                )}
                <div className="text-sm text-gray-500">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>{/* Template Grid/List */}
            {filteredTemplates.length > 0 ? (
              <motion.div                layout
                className={`${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6'
                    : 'space-y-4'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <TemplateCard
                        template={template}
                        isSelected={selectedTemplate?.id === template.id}
                        isFavorited={favorites.has(template.id)}
                        onSelect={() => handleTemplateSelect(template)}
                        onToggleFavorite={() => toggleFavorite(template.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No templates found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setDebouncedSearchTerm('');
                      setCategoryFilter('all');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>          {/* Template Editor and Preview */}
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 xl:gap-8"
            >
              <div className="order-2 xl:order-1">
                <TemplateEditor
                  template={editableTemplate}
                  onEdit={handleTemplateEdit}
                  onSave={handleSaveTemplate}
                />
              </div>
              <div className="order-1 xl:order-2">
                <TemplatePreview
                  template={editableTemplate}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}
