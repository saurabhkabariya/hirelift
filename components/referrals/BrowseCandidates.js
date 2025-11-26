'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CandidatePointsBadge, PointsLeaderboard } from '@/components/PointsComponents';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Star, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Eye,
  Clock,
  X,
  Building2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Calendar,
  Loader
} from 'lucide-react';

const BrowseCandidates = ({ onAuthRequired }) => {
  const { token, user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    skills: '',
    location: '',
    minExperience: 0,
    maxExperience: 20,
    availability: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    skills: [],
    locations: [],
    roles: []
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Send Request Modal States
  const [showSendRequestModal, setShowSendRequestModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({
    candidateId: '',
    message: '',
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    urgencyLevel: 'medium',
    expectedSalaryRange: '',
    workLocation: '',
    workType: 'hybrid',
    contactEmail: '',
    contactPhone: '',
    referralBonus: '',
    additionalNotes: ''
  });
  const [requestErrors, setRequestErrors] = useState({});
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch candidates
  const fetchCandidates = async (page = 1) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      
      if (filters.query) searchParams.append('q', filters.query);
      if (filters.skills) searchParams.append('skills', filters.skills);
      if (filters.location) searchParams.append('location', filters.location);
      if (filters.minExperience > 0) searchParams.append('minExperience', filters.minExperience);
      if (filters.maxExperience < 20) searchParams.append('maxExperience', filters.maxExperience);
      if (filters.availability) searchParams.append('availability', filters.availability);
      
      searchParams.append('page', page);
      searchParams.append('limit', '12');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/referrals/search?${searchParams}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data.profiles || []);
        setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
        setAvailableFilters(data.filters || { skills: [], locations: [], roles: [] });
        setIsAuthenticated(data.authenticated || false);
        setAuthMessage(data.message || null);
      } else {
        console.error('Failed to fetch candidates');
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []); // Run on mount regardless of token

  // Also fetch when user authentication status changes
  useEffect(() => {
    if (user !== undefined) { // Only run when user state is determined (not initial undefined)
      fetchCandidates();
    }
  }, [user]);

  const handleSearch = () => {
    fetchCandidates(1);
  };

  const handlePageChange = (page) => {
    fetchCandidates(page);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'immediate': return 'bg-green-100 text-green-800';
      case '2weeks': return 'bg-yellow-100 text-yellow-800';
      case '1month': return 'bg-orange-100 text-orange-800';
      case '2months': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'immediate': return 'Available Now';
      case '2weeks': return '2 Weeks Notice';
      case '1month': return '1 Month Notice';
      case '2months': return '2 Months Notice';
      case 'not-looking': return 'Not Looking';
      default: return 'Flexible';
    }
  };

  // Send Request Functions
  const openSendRequestModal = (candidate) => {
    // Check if user is authenticated
    if (!user || !token) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    
    setRequestForm({
      candidateId: candidate._id,
      message: `Hi ${candidate.fullName.split(' ')[0]},\n\nI came across your profile and I'm impressed by your background in ${candidate.skills.slice(0, 2).join(' and ')}. I have an exciting opportunity that might be a great fit for your experience.\n\nWould you be interested in learning more?\n\nBest regards,`,
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      urgencyLevel: 'medium',
      expectedSalaryRange: '',
      workLocation: candidate.location || '',
      workType: 'hybrid',
      contactEmail: user?.email || '',
      contactPhone: '',
      referralBonus: '',
      additionalNotes: ''
    });
    setRequestErrors({});
    setRequestSuccess(false);
    setShowSendRequestModal(true);
  };

  const closeSendRequestModal = () => {
    setShowSendRequestModal(false);
    setSelectedCandidate(null);
    setSendingRequest(false);
    setRequestSuccess(false);
    setRequestForm({
      candidateId: '',
      message: '',
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      urgencyLevel: 'medium',
      expectedSalaryRange: '',
      workLocation: '',
      workType: 'hybrid',
      contactEmail: '',
      contactPhone: '',
      referralBonus: '',
      additionalNotes: ''
    });
    setRequestErrors({});
  };

  const validateRequestForm = () => {
    const errors = {};
    
    if (!requestForm.message.trim()) {
      errors.message = 'Message is required';
    } else if (requestForm.message.trim().length < 50) {
      errors.message = 'Message should be at least 50 characters';
    }
    
    if (!requestForm.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!requestForm.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    
    if (!requestForm.jobDescription.trim()) {
      errors.jobDescription = 'Job description is required';
    } else if (requestForm.jobDescription.trim().length < 100) {
      errors.jobDescription = 'Job description should be at least 100 characters';
    }
    
    if (!requestForm.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(requestForm.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    
    if (requestForm.contactPhone && !/^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(requestForm.contactPhone.replace(/\s/g, ''))) {
      errors.contactPhone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  const handleSendRequest = async () => {
    const errors = validateRequestForm();
    setRequestErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setSendingRequest(true);
    
    try {
      const response = await fetch('/api/referrals/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidateId: requestForm.candidateId,
          message: requestForm.message,
          jobDetails: {
            companyName: requestForm.companyName,
            jobTitle: requestForm.jobTitle,
            jobDescription: requestForm.jobDescription,
            expectedSalaryRange: requestForm.expectedSalaryRange,
            workLocation: requestForm.workLocation,
            workType: requestForm.workType,
            referralBonus: requestForm.referralBonus
          },
          urgencyLevel: requestForm.urgencyLevel,
          contactInfo: {
            email: requestForm.contactEmail,
            phone: requestForm.contactPhone
          },
          additionalNotes: requestForm.additionalNotes
        })
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format');
      }
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRequestSuccess(true);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          closeSendRequestModal();
        }, 3000);
      } else {
        // Handle API errors
        const errorMessage = data.message || 'Failed to send request. Please try again.';
        setRequestErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error('Error sending request:', error);
      
      let errorMessage = 'Network error. Please check your connection and try again.';
      
      // Handle specific error types
      if (error.message.includes('invalid response format')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Server response error. Please try again.';
      }
      
      setRequestErrors({ submit: errorMessage });
    } finally {
      setSendingRequest(false);
    }
  };

  const handleRequestFormChange = (field, value) => {
    setRequestForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (requestErrors[field]) {
      setRequestErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 xs:mb-8">
        <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-2">Browse Candidates</h1>
        <p className="text-gray-600 text-sm xs:text-base">Find and connect with talented professionals</p>
      </div>

      {/* Authentication Banner for Unauthenticated Users */}
      {authMessage && !isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 xs:mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                {authMessage}
                <button 
                  onClick={() => window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname)}
                  className="ml-2 font-medium text-blue-600 hover:text-blue-800 underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-sm border border-gray-200 p-4 xs:p-6 mb-6 xs:mb-8">
        <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidates by name, skills, company..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 xs:pl-12 pr-3 xs:pr-4 py-2 xs:py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 xs:px-4 py-2 xs:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center xs:justify-start text-sm xs:text-base"
          >
            <Filter className="h-4 w-4 mr-1 xs:mr-2" />
            Filters
          </button>
          
          <button
            onClick={handleSearch}
            className="px-4 xs:px-6 py-2 xs:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm xs:text-base font-medium"
          >
            Search
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 xs:mt-6 p-3 xs:p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">Skills</label>
                <input
                  type="text"
                  placeholder="e.g., React, Node.js, Python"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base"
                />
              </div>
              
              <div className="sm:col-span-1">
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base"
                />
              </div>
              
              <div className="sm:col-span-2 xl:col-span-1">
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm xs:text-base"
                >
                  <option value="">Any</option>
                  <option value="immediate">Available Now</option>
                  <option value="2weeks">2 Weeks Notice</option>
                  <option value="1month">1 Month Notice</option>
                  <option value="2months">2 Months Notice</option>
                </select>
              </div>
              
              <div className="sm:col-span-2 xl:col-span-3">
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                  Experience: {filters.minExperience} - {filters.maxExperience} years
                </label>
                <div className="flex items-center space-x-2 xs:space-x-4">
                  <span className="text-xs xs:text-sm text-gray-500 w-8 xs:w-10 text-center">{filters.minExperience}</span>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.minExperience}
                    onChange={(e) => setFilters({ ...filters, minExperience: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs xs:text-sm text-gray-500 text-center">to</span>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.maxExperience}
                    onChange={(e) => setFilters({ ...filters, maxExperience: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs xs:text-sm text-gray-500 w-8 xs:w-10 text-center">{filters.maxExperience}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 xs:mb-6">
        <p className="text-gray-600 text-sm xs:text-base">
          {loading ? 'Searching...' : `${pagination.total} candidates found`}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 xs:h-72"></div>
            </div>
          ))}
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6 mb-6 xs:mb-8">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white border border-gray-200 rounded-lg xs:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 xs:p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3 xs:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {candidate.fullName}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2 text-sm xs:text-base line-clamp-2">{candidate.headline}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-2">
                  {/* Referral Points Badge */}
                  <CandidatePointsBadge 
                    points={candidate.referralPoints || 0} 
                    className="text-right" 
                    showPoints={true}
                    size="small"
                  />
                  
                  {/* Rating */}
                  {candidate.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 xs:h-4 xs:w-4 text-yellow-400 fill-current" />
                      <span className="text-xs xs:text-sm text-gray-600">{candidate.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 xs:space-y-2 mb-3 xs:mb-4 flex-1">
                <div className="flex items-center text-xs xs:text-sm text-gray-600">
                  <MapPin className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0" />
                  <span className="truncate">{candidate.location}</span>
                </div>
                
                <div className="flex items-center text-xs xs:text-sm text-gray-600">
                  <Briefcase className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0" />
                  <span>{candidate.yearsOfExperience} years experience</span>
                </div>
                
                <div className="flex items-center text-xs xs:text-sm text-gray-600">
                  <Clock className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2 flex-shrink-0" />
                  <span className={`px-2 py-0.5 xs:py-1 rounded-full text-xs ${getAvailabilityColor(candidate.availability)}`}>
                    {getAvailabilityText(candidate.availability)}
                  </span>
                </div>
              </div>

              <div className="mb-3 xs:mb-4">
                <p className="text-gray-700 text-xs xs:text-sm line-clamp-3">{candidate.summary}</p>
              </div>

              <div className="mb-3 xs:mb-4">
                <div className="flex flex-wrap gap-1 xs:gap-1.5">
                  {candidate.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 xs:py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="px-2 py-0.5 xs:py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{candidate.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Referral Stats */}
              {(candidate.totalReferrals > 0 || candidate.referralPoints > 0) && (
                <div className="mb-3 xs:mb-4 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      {candidate.totalReferrals > 0 && (
                        <span className="text-green-700">
                          <strong>{candidate.totalReferrals}</strong> successful referrals
                        </span>
                      )}
                      <span className="text-blue-700">
                        <strong>{candidate.referralPoints || 0}</strong> reward points
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col xs:flex-row gap-2 xs:gap-2 mt-auto">
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md xs:rounded-lg text-xs xs:text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <Eye className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                  View Profile
                </button>
                
                <button
                  onClick={() => openSendRequestModal(candidate)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md xs:rounded-lg text-xs xs:text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                  Send Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && candidates.length === 0 && (
        <div className="text-center py-8 xs:py-12 lg:py-16">
          <div className="max-w-md mx-auto px-4">
            <Search className="h-10 w-10 xs:h-12 xs:w-12 text-gray-400 mx-auto mb-3 xs:mb-4" />
            <h3 className="text-lg xs:text-xl font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 text-sm xs:text-base">
              Try adjusting your search criteria or browse all candidates.
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-0 xs:space-x-2 py-4">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-3 py-2 bg-white border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm order-3 xs:order-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1 hidden xs:inline">Previous</span>
          </button>

          <div className="flex space-x-1 order-1 xs:order-2">
            {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2.5 xs:px-3 py-2 rounded-md text-sm ${
                    pagination.current === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="px-3 py-2 bg-white border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm order-2 xs:order-3"
          >
            <span className="mr-1 hidden xs:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Enhanced Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[95vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 group z-10"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col xs:flex-row items-start space-y-3 xs:space-y-0 xs:space-x-3 sm:space-x-4 pr-8 sm:pr-12">
                <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <span className="text-lg xs:text-xl sm:text-2xl font-bold text-white">
                    {selectedCandidate.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 w-full xs:w-auto">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 break-words leading-tight">{selectedCandidate.fullName}</h2>
                  <p className="text-blue-100 text-sm xs:text-base sm:text-lg font-medium mb-2 break-words leading-tight">{selectedCandidate.headline}</p>
                  <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 text-blue-100 text-xs xs:text-sm sm:text-base">
                    <div className="flex items-center min-w-0">
                      <MapPin className="h-3 w-3 xs:h-4 xs:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate text-xs xs:text-sm">{selectedCandidate.location}</span>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <Briefcase className="h-3 w-3 xs:h-4 xs:w-4 mr-1 flex-shrink-0" />
                      <span className="text-xs xs:text-sm">{selectedCandidate.yearsOfExperience} years</span>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <Clock className="h-3 w-3 xs:h-4 xs:w-4 mr-1 flex-shrink-0" />
                      <span className="px-1.5 xs:px-2 py-0.5 xs:py-1 bg-white/20 rounded-full text-xs">
                        {getAvailabilityText(selectedCandidate.availability)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-3 min-h-full">
                {/* Main Content */}
                <div className="xl:col-span-2 p-3 xs:p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Professional Summary */}
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-6">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-start xs:items-center">
                      <div className="w-1.5 xs:w-2 h-5 xs:h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-2 xs:mr-3 flex-shrink-0 mt-1 xs:mt-0"></div>
                      <span className="leading-tight">Professional Summary</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm xs:text-base">{selectedCandidate.summary}</p>
                  </div>

                  {/* Skills */}
                  <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-6">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-start xs:items-center flex-wrap gap-1">
                      <div className="w-1.5 xs:w-2 h-5 xs:h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-2 xs:mr-3 flex-shrink-0 mt-1 xs:mt-0"></div>
                      <span className="leading-tight">Technical Skills</span>
                      <span className="text-xs xs:text-sm font-normal text-gray-500">({selectedCandidate.skills.length} skills)</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 xs:gap-2 sm:gap-3">
                      {selectedCandidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md xs:rounded-lg text-xs xs:text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Details */}
                  <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-6">
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-start xs:items-center">
                      <div className="w-1.5 xs:w-2 h-5 xs:h-6 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full mr-2 xs:mr-3 flex-shrink-0 mt-1 xs:mt-0"></div>
                      <span className="leading-tight">Experience & Background</span>
                    </h3>
                    <div className="space-y-3 xs:space-y-4">
                      <div className="bg-gray-50 rounded-md xs:rounded-lg p-3 xs:p-4">
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm xs:text-base">Years of Experience</h4>
                          <span className="px-2 xs:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs xs:text-sm font-medium self-start xs:self-auto">
                            {selectedCandidate.yearsOfExperience} years
                          </span>
                        </div>
                      </div>
                      
                      {selectedCandidate.currentPosition && (
                        <div className="bg-gray-50 rounded-md xs:rounded-lg p-3 xs:p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm xs:text-base">Current Position</h4>
                          <p className="text-gray-700 font-medium text-sm xs:text-base break-words">{selectedCandidate.currentPosition}</p>
                          {selectedCandidate.currentCompany && (
                            <p className="text-gray-600 mt-1 text-xs xs:text-sm break-words">at {selectedCandidate.currentCompany}</p>
                          )}
                        </div>
                      )}

                      {selectedCandidate.desiredRoles && selectedCandidate.desiredRoles.length > 0 && (
                        <div className="bg-gray-50 rounded-md xs:rounded-lg p-3 xs:p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm xs:text-base">Desired Roles</h4>
                          <div className="flex flex-wrap gap-1.5 xs:gap-2">
                            {selectedCandidate.desiredRoles.map((role, idx) => (
                              <span
                                key={idx}
                                className="px-2 xs:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs xs:text-sm font-medium"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="bg-gray-50 p-3 xs:p-4 sm:p-6 border-t xl:border-t-0 xl:border-l border-gray-200 space-y-3 xs:space-y-4 sm:space-y-6">
                  {/* Contact & Links */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 shadow-sm">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 mb-3 xs:mb-4">Contact Information</h3>
                    <div className="space-y-2 xs:space-y-3">
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-2 xs:mr-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs xs:text-sm">Email available after connection</span>
                      </div>
                      
                      {selectedCandidate.linkedinUrl && (
                        <a
                          href={selectedCandidate.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-2 xs:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <span className="text-xs xs:text-sm">LinkedIn Profile</span>
                        </a>
                      )}

                      {selectedCandidate.githubUrl && (
                        <a
                          href={selectedCandidate.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <svg className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-2 xs:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span className="text-xs xs:text-sm">GitHub Profile</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 shadow-sm">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 mb-3 xs:mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 xs:gap-4">
                      <div className="text-center">
                        <div className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-600">{selectedCandidate.skills.length}</div>
                        <div className="text-xs xs:text-sm text-gray-600">Technical Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600">{selectedCandidate.yearsOfExperience}+</div>
                        <div className="text-xs xs:text-sm text-gray-600">Years Experience</div>
                      </div>
                      {selectedCandidate.averageRating > 0 && (
                        <div className="text-center col-span-2 xl:col-span-1">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                            <span className="text-lg xs:text-xl sm:text-2xl font-bold text-yellow-600">{selectedCandidate.averageRating.toFixed(1)}</span>
                          </div>
                          <div className="text-xs xs:text-sm text-gray-600">Average Rating</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 xs:space-y-3 sticky bottom-0 bg-gray-50 pt-2 xs:pt-3">
                    <button
                      onClick={() => openSendRequestModal(selectedCandidate)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center group text-xs xs:text-sm sm:text-base"
                    >
                      <Send className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1.5 xs:mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                      Send Referral Request
                    </button>
                    
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="w-full bg-gray-100 text-gray-700 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 border border-gray-200 text-xs xs:text-sm sm:text-base"
                    >
                      Close Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Request Modal */}
      {showSendRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[95vh] overflow-hidden shadow-2xl animate-slideUp flex flex-col">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <button
                onClick={closeSendRequestModal}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 group z-10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
              
              <div className="pr-8 sm:pr-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Send Referral Request</h2>
                <p className="text-blue-100 text-sm sm:text-base">
                  {requestForm.candidateId && candidates.find(c => c._id === requestForm.candidateId) ? (
                    <>Send a professional referral request to {candidates.find(c => c._id === requestForm.candidateId)?.fullName}</>
                  ) : (
                    'Send a professional referral request'
                  )}
                </p>
              </div>
            </div>

            {/* Success State */}
            {requestSuccess && (
              <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Request Sent Successfully!</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    Your referral request has been sent. The candidate will receive a notification and can respond directly.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">This modal will close automatically in a few seconds...</p>
                </div>
              </div>
            )}

            {/* Form Content */}
            {!requestSuccess && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6">
                  {/* General Error */}
                  {requestErrors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Error sending request</h4>
                        <p className="text-sm text-red-700 mt-1">{requestErrors.submit}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Personal Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Personal Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={requestForm.message}
                          onChange={(e) => handleRequestFormChange('message', e.target.value)}
                          placeholder="Write a personal message to the candidate..."
                          rows="6"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none ${
                            requestErrors.message ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {requestErrors.message && (
                          <p className="text-red-600 text-xs mt-1">{requestErrors.message}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          {requestForm.message.length}/1000 characters (minimum 50)
                        </p>
                      </div>

                      {/* Company Information */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                          <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                          Company & Role Details
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={requestForm.companyName}
                              onChange={(e) => handleRequestFormChange('companyName', e.target.value)}
                              placeholder="Acme Corp"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                requestErrors.companyName ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {requestErrors.companyName && (
                              <p className="text-red-600 text-xs mt-1">{requestErrors.companyName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={requestForm.jobTitle}
                              onChange={(e) => handleRequestFormChange('jobTitle', e.target.value)}
                              placeholder="Senior Software Engineer"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                requestErrors.jobTitle ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {requestErrors.jobTitle && (
                              <p className="text-red-600 text-xs mt-1">{requestErrors.jobTitle}</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={requestForm.jobDescription}
                            onChange={(e) => handleRequestFormChange('jobDescription', e.target.value)}
                            placeholder="Provide details about the role, responsibilities, required skills, and company culture..."
                            rows="4"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none ${
                              requestErrors.jobDescription ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {requestErrors.jobDescription && (
                            <p className="text-red-600 text-xs mt-1">{requestErrors.jobDescription}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {requestForm.jobDescription.length}/2000 characters (minimum 100)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Job Details */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                          Additional Details
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                              <select
                                value={requestForm.urgencyLevel}
                                onChange={(e) => handleRequestFormChange('urgencyLevel', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="low">Low - Flexible Timeline</option>
                                <option value="medium">Medium - Within 2 weeks</option>
                                <option value="high">High - ASAP</option>
                                <option value="urgent">Urgent - Immediate</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                              <select
                                value={requestForm.workType}
                                onChange={(e) => handleRequestFormChange('workType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">On-site</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary Range</label>
                              <input
                                type="text"
                                value={requestForm.expectedSalaryRange}
                                onChange={(e) => handleRequestFormChange('expectedSalaryRange', e.target.value)}
                                placeholder="$80,000 - $120,000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                              <input
                                type="text"
                                value={requestForm.workLocation}
                                onChange={(e) => handleRequestFormChange('workLocation', e.target.value)}
                                placeholder="New York, NY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Bonus</label>
                            <input
                              type="text"
                              value={requestForm.referralBonus}
                              onChange={(e) => handleRequestFormChange('referralBonus', e.target.value)}
                              placeholder="$5,000 bonus upon successful hire"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                          Contact Information
                        </h3>

                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Contact Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={requestForm.contactEmail}
                              onChange={(e) => handleRequestFormChange('contactEmail', e.target.value)}
                              placeholder="recruiter@company.com"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                requestErrors.contactEmail ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {requestErrors.contactEmail && (
                              <p className="text-red-600 text-xs mt-1">{requestErrors.contactEmail}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                            <input
                              type="tel"
                              value={requestForm.contactPhone}
                              onChange={(e) => handleRequestFormChange('contactPhone', e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                requestErrors.contactPhone ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {requestErrors.contactPhone && (
                              <p className="text-red-600 text-xs mt-1">{requestErrors.contactPhone}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                            <textarea
                              value={requestForm.additionalNotes}
                              onChange={(e) => handleRequestFormChange('additionalNotes', e.target.value)}
                              placeholder="Any additional information or special requirements..."
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={closeSendRequestModal}
                      className="sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSendRequest}
                      disabled={sendingRequest}
                      className="sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
                    >
                      {sendingRequest ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Referral Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCandidates;