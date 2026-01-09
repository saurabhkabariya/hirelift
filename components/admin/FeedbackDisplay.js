'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaStar, FaUser, FaClock, FaTag, FaEye, FaCheck, FaTimes, FaComments } from 'react-icons/fa';

const categoryColors = {
  general: 'bg-blue-100 text-blue-800 border-blue-200',
  bug: 'bg-red-100 text-red-800 border-red-200',
  feature: 'bg-green-100 text-green-800 border-green-200',
  ui: 'bg-purple-100 text-purple-800 border-purple-200',
  performance: 'bg-orange-100 text-orange-800 border-orange-200'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200'
};

export default function FeedbackDisplay() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedback?admin=true');
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setFeedbacks(prev => 
          prev.map(feedback => 
            feedback._id === feedbackId 
              ? { ...feedback, status: newStatus }
              : feedback
          )
        );
        if (selectedFeedback && selectedFeedback._id === feedbackId) {
          setSelectedFeedback(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      if (filter === 'all') return true;
      return feedback.status === filter || feedback.category === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-900 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FaComments className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">User Feedback</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{feedbacks.length} total submissions</p>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1 xs:flex-initial"
          >
            <option value="all">All Feedback</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="general">General</option>
            <option value="bug">Bug Reports</option>
            <option value="feature">Feature Requests</option>
            <option value="ui">UI/UX</option>
            <option value="performance">Performance</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1 xs:flex-initial"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredFeedbacks.map((feedback, index) => (
            <motion.div
              key={feedback._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedFeedback(feedback)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{feedback.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[feedback.category] || categoryColors.general}`}>
                        {feedback.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[feedback.status]}`}>
                        {feedback.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {feedback.rating && (
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                    </div>
                  )}
                  <FaClock className="w-3 h-3" />
                  <span>{formatDate(feedback.createdAt)}</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                {feedback.message}
              </p>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFeedbackStatus(feedback._id, 'reviewed');
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  <FaEye className="w-3 h-3 mr-1 inline" />
                  Mark Reviewed
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFeedbackStatus(feedback._id, 'resolved');
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                >
                  <FaCheck className="w-3 h-3 mr-1 inline" />
                  Resolve
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFeedbacks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <FaComments className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No feedback found for the selected filter.</p>
          </motion.div>
        )}
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedFeedback(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Feedback Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedFeedback.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedFeedback.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[selectedFeedback.category] || categoryColors.general}`}>
                    <FaTag className="w-3 h-3 mr-1 inline" />
                    {selectedFeedback.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedFeedback.status]}`}>
                    {selectedFeedback.status}
                  </span>
                  {selectedFeedback.rating && (
                    <div className="flex items-center gap-1">
                      {renderStars(selectedFeedback.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({selectedFeedback.rating}/5)</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Message</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>

                {selectedFeedback.userAgent && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Info</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {selectedFeedback.userAgent}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFeedbackStatus(selectedFeedback._id, 'reviewed')}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                  >
                    <FaEye className="w-4 h-4 mr-2 inline" />
                    Mark as Reviewed
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFeedbackStatus(selectedFeedback._id, 'resolved')}
                    className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                  >
                    <FaCheck className="w-4 h-4 mr-2 inline" />
                    Mark as Resolved
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
