import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TemplateDragCard = ({ 
  template, 
  isSelected, 
  isFavorited, 
  onSelect, 
  onToggleFavorite, 
  viewMode
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: template.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const getRoleColor = (roleType) => {
    const colors = {
      'General': 'from-gray-500 to-gray-600',
      'Frontend Developer': 'from-blue-500 to-blue-600',
      'Backend Developer': 'from-green-500 to-green-600',
      'Full Stack Developer': 'from-purple-500 to-purple-600',
      'Data Scientist': 'from-orange-500 to-orange-600',
      'DevOps Engineer': 'from-red-500 to-red-600',
      'UI/UX Designer': 'from-pink-500 to-pink-600',
      'Product Manager': 'from-indigo-500 to-indigo-600',
      'Machine Learning Engineer': 'from-yellow-500 to-yellow-600',
      'Mobile App Developer': 'from-cyan-500 to-cyan-600',
      'React Developer': 'from-sky-500 to-sky-600',
    };
    return colors[roleType] || 'from-gray-500 to-gray-600';
  };

  const getTemplateTypeIcon = (templateType) => {
    if (templateType === 'email') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    }
  };
  if (viewMode === 'list') {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        whileHover={{ scale: isDragging ? 1 : 1.02, y: isDragging ? 0 : -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className={`bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-pointer ${
          isSelected 
            ? 'border-blue-300 bg-blue-50/80 shadow-lg ring-2 ring-blue-200' 
            : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
        } ${isDragging ? 'shadow-2xl rotate-2 z-50' : ''}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Drag Handle */}
              <div 
                {...attributes}
                {...listeners}
                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>

              {/* Template Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">{template.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    template.templateType === 'email' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getTemplateTypeIcon(template.templateType)}
                    {template.templateType === 'email' ? 'Email' : 'LinkedIn'}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-white bg-gradient-to-r ${getRoleColor(template.roleType)}`}>
                    {template.roleType}
                  </span>
                  {template.subject && (
                    <span className="truncate max-w-md">
                      Subject: {template.subject.replace(/{[^}]+}/g, '...')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`p-2 rounded-xl transition-colors ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
              
              <div className="text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  // Grid view
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      whileHover={{ scale: isDragging ? 1 : 1.05, y: isDragging ? 0 : -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isSelected 
          ? 'border-blue-300 bg-blue-50/80 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-blue-200 hover:shadow-xl'
      } ${isDragging ? 'shadow-2xl rotate-2 z-50' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Favorite Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-3 right-3 p-1.5 rounded-xl transition-colors z-10 ${
          isFavorited 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }`}
      >
        <svg className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.button>

      <div className="p-6 pt-12">
        {/* Template Type Badge */}
        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
          template.templateType === 'email' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {getTemplateTypeIcon(template.templateType)}
          {template.templateType === 'email' ? 'Email' : 'LinkedIn'}
        </div>

        {/* Template Name */}
        <h3 className="font-semibold text-gray-800 text-lg mb-3 line-clamp-2">
          {template.name}
        </h3>

        {/* Role Badge */}
        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-white text-sm font-medium bg-gradient-to-r ${getRoleColor(template.roleType)} mb-4`}>
          {template.roleType}
        </div>

        {/* Template Preview */}
        {template.subject && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            <span className="font-medium">Subject:</span> {template.subject.replace(/{[^}]+}/g, '...')}
          </p>
        )}

        <p className="text-sm text-gray-500 line-clamp-3">
          {template.template.replace(/{[^}]+}/g, '...').substring(0, 120)}...
        </p>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center"
          >
            <div className="bg-blue-500 text-white p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TemplateDragCard;
