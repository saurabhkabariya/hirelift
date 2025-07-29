'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { getAllTemplates, POPULAR_ROLES } from '@/data/emailTemplates';
import TemplateEditor from '@/components/TemplateEditor';
import TemplatePreview from '@/components/TemplatePreview';
import TemplateDragCard from '@/components/TemplateDragCard';
import FeedbackButton from '@/components/feedback/FeedbackButton';

export default function PlaygroundPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editableTemplate, setEditableTemplate] = useState(null);
  const [templateType, setTemplateType] = useState('email'); // 'email' or 'linkedin'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'general', or specific role
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [favorites, setFavorites] = useState(new Set());
  const [templateOrder, setTemplateOrder] = useState([]);
  
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
  }, [allTemplates]);
  
  // Filter templates based on current filters
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
      if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !template.roleType.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [flattenedTemplates, templateType, categoryFilter, searchTerm]);
  
  // Initialize template order
  useEffect(() => {
    if (filteredTemplates.length > 0 && templateOrder.length === 0) {
      setTemplateOrder(filteredTemplates.map(t => t.id));
    }
  }, [filteredTemplates, templateOrder.length]);
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditableTemplate({ ...template });
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
    
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTemplateOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Sort templates according to drag order
  const orderedTemplates = React.useMemo(() => {
    if (templateOrder.length === 0) return filteredTemplates;
    
    const ordered = [];
    const templatesMap = new Map(filteredTemplates.map(t => [t.id, t]));
    
    templateOrder.forEach(id => {
      if (templatesMap.has(id)) {
        ordered.push(templatesMap.get(id));
      }
    });
    
    // Add any new templates that aren't in the order yet
    filteredTemplates.forEach(template => {
      if (!templateOrder.includes(template.id)) {
        ordered.push(template);
      }
    });
    
    return ordered;
  }, [filteredTemplates, templateOrder]);
    return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Background elements - matching dashboard */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header - matching dashboard structure */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass sticky top-0 z-50 backdrop-blur-lg shadow-sm border-b border-opacity-20 border-[var(--gray-300)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xl shadow-md mr-2">
                  <span className="z-10">H</span>
                </div>
                <h1 className="text-2xl font-bold gradient-text">
                  HireLift
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Breadcrumb - matching dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 backdrop-blur-md border-b border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Dashboard
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-blue-700 font-semibold">Cold Outreach Playground</span>
            </nav>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </motion.button>
              </Link>

              <Link href="/company-search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Company Search</span>
                </motion.button>
              </Link>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Page Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Cold Outreach Playground
                </h1>
                <p className="text-gray-600">Design, customize, and test your outreach templates</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters and Template Library */}
          <motion.div
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 400 }}
            className="flex-shrink-0 bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden"
          >
            <div className="p-6">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Template Type Toggle */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Template Type</label>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setTemplateType('email')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          templateType === 'email'
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
                        onClick={() => setTemplateType('linkedin')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
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
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                    >
                      <option value="all">All Templates</option>
                      <option value="general">General Templates</option>
                      {POPULAR_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Library Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Templates:</span>
                        <span className="font-medium text-blue-600">{flattenedTemplates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Filtered:</span>
                        <span className="font-medium text-indigo-600">{filteredTemplates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Favorites:</span>
                        <span className="font-medium text-purple-600">{favorites.size}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {sidebarCollapsed && (
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => setTemplateType('email')}
                    className={`p-3 rounded-xl transition-all ${
                      templateType === 'email' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTemplateType('linkedin')}
                    className={`p-3 rounded-xl transition-all ${
                      templateType === 'linkedin' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Template Library */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Template Library</h2>
                <div className="text-sm text-gray-500">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </div>
              </div>

              {/* Template Grid/List */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedTemplates.map(t => t.id)}
                  strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
                >
                  <div className={`${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }`}>
                    {orderedTemplates.map((template) => (
                      <TemplateDragCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate?.id === template.id}
                        isFavorited={favorites.has(template.id)}
                        onSelect={() => handleTemplateSelect(template)}
                        onToggleFavorite={() => toggleFavorite(template.id)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No templates found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                </div>
              )}
            </div>

            {/* Template Editor and Preview */}
            {selectedTemplate && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TemplateEditor
                  template={editableTemplate}
                  onEdit={handleTemplateEdit}
                  onSave={handleSaveTemplate}
                />
                <TemplatePreview
                  template={editableTemplate}
                />
              </div>
            )}          </div>
        </div>
      </div>
      
      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}
