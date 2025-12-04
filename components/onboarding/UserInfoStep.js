'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  MapPin, 
  Target, 
  GraduationCap,
  Calendar,
  Building,
  Users,
  TrendingUp,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const UserInfoStep = ({ onComplete, user }) => {
  const { refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    currentRole: user?.currentRole || '',
    company: user?.company || '',
    experience: user?.experience || '',
    targetRole: user?.targetRole || '',
    industry: user?.industry || '',
    careerGoal: user?.careerGoal || '',
    jobSearchStatus: user?.jobSearchStatus || ''
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [showEmotionalMessage, setShowEmotionalMessage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Form sections for better UX
  const sections = [
    {
      title: "Let's Get Personal",
      subtitle: "Tell us who you are",
      icon: User,
      fields: ['fullName', 'email']
    },
    {
      title: "Your Professional Story",
      subtitle: "Where are you now in your career?",
      icon: Briefcase,
      fields: ['industry']
    },
    {
      title: "Your Career Dreams",
      subtitle: "Where do you want to go?",
      icon: Target,
      fields: ['targetRole', 'careerGoal', 'jobSearchStatus']
    }
  ];

  const experienceOptions = [
    { value: 'fresher', label: '🎓 Fresh Graduate (0 years)', description: 'Just starting your career journey' },
    { value: 'entry', label: '🌱 Entry Level (1-2 years)', description: 'Building your professional foundation' },
    { value: 'junior', label: '🚀 Junior Professional (2-4 years)', description: 'Growing your expertise' },
    { value: 'mid', label: '💼 Mid-Level (4-7 years)', description: 'Established in your field' },
    { value: 'senior', label: '🎯 Senior Professional (7-10 years)', description: 'Leading projects and teams' },
    { value: 'expert', label: '👑 Expert/Executive (10+ years)', description: 'Strategic leadership role' }
  ];

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 
    'Retail', 'Consulting', 'Marketing', 'Sales', 'Human Resources',
    'Engineering', 'Design', 'Media', 'Real Estate', 'Government',
    'Non-Profit', 'Legal', 'Hospitality', 'Transportation', 'Other'
  ];

  const careerGoalOptions = [
    { value: 'promotion', label: '📈 Get Promoted', description: 'Advance to a higher role in my current company' },
    { value: 'switch', label: '🔄 Switch Companies', description: 'Find a better opportunity elsewhere' },
    { value: 'career-change', label: '🎯 Career Change', description: 'Transition to a different field or role' },
    { value: 'remote', label: '🏠 Find Remote Work', description: 'Secure a fully remote position' },
    { value: 'salary-increase', label: '💰 Increase Salary', description: 'Get better compensation package' },
    { value: 'startup', label: '🚀 Join a Startup', description: 'Work in a fast-paced startup environment' },
    { value: 'corporate', label: '🏢 Join Large Corporation', description: 'Work for an established enterprise' },
    { value: 'freelance', label: '💼 Freelance/Consulting', description: 'Start independent consulting career' }
  ];

  const jobSearchStatusOptions = [
    { value: 'active', label: '🔥 Actively Searching', description: 'Applying to jobs daily, ready to interview' },
    { value: 'passive', label: '👀 Passively Looking', description: 'Open to opportunities, not urgently searching' },
    { value: 'exploring', label: '🤔 Just Exploring', description: 'Curious about what\'s out there' },
    { value: 'preparing', label: '📚 Preparing to Search', description: 'Getting ready to start job hunting' }
  ];

  // Show emotional message after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmotionalMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateSection = (sectionIndex) => {
    const section = sections[sectionIndex];
    const newErrors = {};
    let isValid = true;

    // Define optional fields that should not be validated
    const optionalFields = ['phone', 'location', 'currentRole', 'company', 'experience'];

    section.fields.forEach(field => {
      // Skip validation for optional fields
      if (optionalFields.includes(field)) {
        return;
      }
      
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevSection = () => {
    setCurrentSection(prev => Math.max(0, prev - 1));
  };

  const saveProfileData = async (profileData) => {
    if (!user) {
      toast.error('User authentication required');
      return false;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return false;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to save profile`);
      }

      // Refresh user data
      await refetchUser();
      return true;
    } catch (error) {
      console.error('Profile save error:', error);
      
      // More specific error messages based on error type
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      } else if (error.message.includes('401') || error.message.includes('authentication')) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(error.message || 'Failed to save profile. Please try again.');
      }
      
      return false;
    }
  };

  const handleComplete = async () => {
    if (validateSection(currentSection)) {
      setSaving(true);
      
      try {
        // Save profile data to backend
        const saved = await saveProfileData(formData);
        
        setSaving(false);
        
        if (saved) {
          setCompleting(true);
          toast.success('Profile saved successfully!');
          
          // Add a small delay to show the toast and then proceed
          setTimeout(() => {
            setCompleting(false); // Reset completing state
            onComplete(formData);
          }, 1500); // 1.5 second delay to show success message
        } else {
          // Reset completing state if save failed
          setCompleting(false);
        }
      } catch (error) {
        console.error('Profile completion error:', error);
        setSaving(false);
        setCompleting(false);
        toast.error('Failed to save profile. Please try again.');
      }
    }
  };

  const currentSectionData = sections[currentSection];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(((currentSection + 1) / sections.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Emotional message */}
        {showEmotionalMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-8 text-center"
          >
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-amber-800 font-medium">
              We know job searching can feel overwhelming. That's why we're here to support you every step of the way. 💪
            </p>
          </motion.div>
        )}

        {/* Section header and form content */}
        <motion.div
          key={`section-${currentSection}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Section header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentSectionData.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentSectionData.title}
            </h2>
            <p className="text-lg text-gray-600">
              {currentSectionData.subtitle}
            </p>
          </div>

          {/* Form content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Section 0: Personal Information */}
            {currentSection === 0 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. John Smith"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.fullName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    disabled={!!user?.email}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      user?.email ? 'bg-gray-50 cursor-not-allowed' : ''
                    } ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. New York, NY or Remote"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.location ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </>
            )}

            {/* Section 1: Professional Information */}
            {currentSection === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={(e) => handleInputChange('currentRole', e.target.value)}
                    placeholder="e.g. Software Engineer, Marketing Manager"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.currentRole ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.currentRole && <p className="text-red-500 text-xs mt-1">{errors.currentRole}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g. Google, Unemployed, Freelancing"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.company ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience (Optional)
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {experienceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('experience', option.value)}
                        className={`text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all ${
                          formData.experience === option.value 
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                            : ''
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.industry ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select your industry</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                </div>
              </>
            )}

            {/* Section 2: Career Goals */}
            {currentSection === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => handleInputChange('targetRole', e.target.value)}
                    placeholder="e.g. Senior Software Engineer, Product Manager"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.targetRole ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.targetRole && <p className="text-red-500 text-xs mt-1">{errors.targetRole}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Career Goal *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {careerGoalOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('careerGoal', option.value)}
                        className={`text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all ${
                          formData.careerGoal === option.value 
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                            : ''
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.careerGoal && <p className="text-red-500 text-xs mt-1">{errors.careerGoal}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Search Status *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {jobSearchStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('jobSearchStatus', option.value)}
                        className={`text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all ${
                          formData.jobSearchStatus === option.value 
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                            : ''
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.jobSearchStatus && <p className="text-red-500 text-xs mt-1">{errors.jobSearchStatus}</p>}
                </div>
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNextSection}
              disabled={saving || completing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </>
              ) : completing ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Completing...
                </>
              ) : (
                <>
                  {currentSection === sections.length - 1 ? 'Complete' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          </div>
        </motion.div>

        {/* Encouragement message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            ✨ This information helps us personalize your HireLift experience
          </p>
          <p className="text-sm text-gray-500 mt-1">
            We take your privacy seriously. Your data is secure and never shared.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UserInfoStep;