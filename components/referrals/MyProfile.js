'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Calendar,
  Clock
} from 'lucide-react';

const MyProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState('basic');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Debug formData changes
  useEffect(() => {
    if (formData.skills || formData.desiredRoles) {
      console.log('FormData updated - Skills:', formData.skills, 'DesiredRoles:', formData.desiredRoles);
    }
  }, [formData.skills, formData.desiredRoles]);

  useEffect(() => {
    fetchProfile();
  }, [token, user]);

  const fetchProfile = async () => {
    if (!token || !user || !user.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/referrals/profiles?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile loaded - Skills:', data.profile?.skills, 'DesiredRoles:', data.profile?.desiredRoles);
        
        setProfile(data.profile);
        setFormData(data.profile || getDefaultFormData());
      } else if (response.status === 404) {
        // No profile exists yet - this is expected for new users
        console.log('No referral profile found. User can create a new one.');
        setProfile(null);
        setFormData(getDefaultFormData());
      } else {
        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        console.error('Error fetching profile:', response.status, errorData);
      }
    } catch (error) {
      console.error('Network error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultFormData = () => ({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    headline: '',
    summary: '',
    location: '',
    phone: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [],
    yearsOfExperience: 0,
    currentPosition: '',
    currentCompany: '',
    desiredRoles: [],
    salaryExpectation: { min: 0, max: 0, currency: 'INR' },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    availability: 'immediate',
    visibility: 'public'
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('=== SAVING PROFILE ===');
      console.log('Skills to save:', formData.skills);
      console.log('DesiredRoles to save:', formData.desiredRoles);
      console.log('Full formData:', {
        skills: formData.skills,
        desiredRoles: formData.desiredRoles,
        fullName: formData.fullName,
        headline: formData.headline
      });
      
      const url = profile ? '/api/referrals/profiles' : '/api/referrals/profiles';
      const method = profile ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('=== SAVE SUCCESS ===');
        console.log('Returned profile:', data.profile);
        console.log('Saved skills:', data.profile?.skills);
        console.log('Saved desiredRoles:', data.profile?.desiredRoles);
        
        setProfile(data.profile);
        setEditing(false);
        // Refetch to ensure we have the latest data
        await fetchProfile();
      } else {
        const errorData = await response.json();
        console.error('=== SAVE FAILED ===');
        console.error('Error:', errorData);
        alert(errorData.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('=== SAVE ERROR ===');
      console.error('Network error:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile) {
      alert('No profile to delete');
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/referrals/profiles', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProfile(null);
        setFormData(getDefaultFormData());
        setShowDeleteConfirm(false);
        setEditing(false);
        alert('Profile deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert(errorData.error || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  const addArrayItem = (field, newItem) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), newItem]
    });
  };

  const updateArrayItem = (field, index, updatedItem) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = {
      ...newArray[index], // Preserve existing properties
      ...updatedItem      // Apply updates
    };
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 xs:p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 xs:gap-0 mb-4 xs:mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm xs:text-base text-gray-600">
            {profile ? 'Manage your candidate profile' : 'Create your candidate profile to get referrals'}
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 flex-shrink-0">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-3 xs:px-4 py-2 rounded-md xs:rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm xs:text-base"
              >
                <Edit3 className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                {profile ? 'Edit Profile' : 'Create Profile'}
              </button>
              {profile && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-3 xs:px-4 py-2 rounded-md xs:rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm xs:text-base"
                >
                  <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                  Delete Profile
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(profile || getDefaultFormData());
                }}
                className="bg-gray-200 text-gray-700 px-3 xs:px-4 py-2 rounded-md xs:rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-sm xs:text-base order-2 xs:order-1"
              >
                <X className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-3 xs:px-4 py-2 rounded-md xs:rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 text-sm xs:text-base order-1 xs:order-2"
              >
                <Save className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs for editing */}
      {editing && (
        <div className="mb-4 xs:mb-6 border-b border-gray-200">
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex -mb-px space-x-6 lg:space-x-8">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
              { id: 'projects', label: 'Projects' },
              { id: 'skills', label: 'Skills & Certifications' },
              { id: 'preferences', label: 'Preferences' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-3 xs:py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation - Horizontal Scroll */}
          <nav className="sm:hidden flex overflow-x-auto scrollbar-hide py-2 -mb-px">
            <div className="flex space-x-1 min-w-max px-1">
              {[
                { id: 'basic', label: 'Basic', fullLabel: 'Basic Info' },
                { id: 'experience', label: 'Experience', fullLabel: 'Experience' },
                { id: 'education', label: 'Education', fullLabel: 'Education' },
                { id: 'projects', label: 'Projects', fullLabel: 'Projects' },
                { id: 'skills', label: 'Skills', fullLabel: 'Skills & Certifications' },
                { id: 'preferences', label: 'Preferences', fullLabel: 'Preferences' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg font-medium text-xs xs:text-sm flex-shrink-0 ${
                    activeSection === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  title={tab.fullLabel}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Profile Display or Edit Form */}
      {!editing ? (
        <ProfileDisplay profile={profile} />
      ) : (
        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          activeSection={activeSection}
          addArrayItem={addArrayItem}
          updateArrayItem={updateArrayItem}
          removeArrayItem={removeArrayItem}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Profile
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete your profile? This action cannot be undone and you will lose all your profile information, including:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              <li>• Personal and contact information</li>
              <li>• Work experience and education</li>
              <li>• Skills and projects</li>
              <li>• Job preferences</li>
            </ul>
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 order-2 xs:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center order-1 xs:order-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Profile'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Display Component
const ProfileDisplay = ({ profile }) => {
  console.log('ProfileDisplay received profile:', profile);
  console.log('Profile skills in display:', profile?.skills);
  
  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No profile created yet</h3>
        <p className="text-gray-600">
          Create your candidate profile to start receiving referral opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900">{profile.fullName}</h4>
            <p className="text-blue-600">{profile.headline}</p>
            <p className="text-gray-600 mt-2">{profile.summary}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {profile.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {profile.email}
            </div>
            {profile.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {profile.phone}
              </div>
            )}
            {profile.linkedinUrl && (
              <div className="flex items-center text-gray-600">
                <Linkedin className="h-4 w-4 mr-2" />
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn Profile
                </a>
              </div>
            )}
            {profile.githubUrl && (
              <div className="flex items-center text-gray-600">
                <Github className="h-4 w-4 mr-2" />
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub Profile
                </a>
              </div>
            )}
            {profile.portfolioUrl && (
              <div className="flex items-center text-gray-600">
                <ExternalLink className="h-4 w-4 mr-2" />
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Desired Roles */}
      {profile.desiredRoles && profile.desiredRoles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Desired Roles</h3>
          <div className="flex flex-wrap gap-2">
            {profile.desiredRoles.map((role, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Experience</h3>
          <div className="space-y-4">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="flex">
                <Briefcase className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(exp.startDate).toLocaleDateString()} - {
                      exp.isCurrentPosition ? 'Present' : new Date(exp.endDate).toLocaleDateString()
                    }
                  </p>
                  {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Education</h3>
          <div className="space-y-4">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="flex">
                <GraduationCap className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.field && (
                    <p className="text-sm text-gray-600">{edu.field}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ''} - {
                      edu.endDate ? new Date(edu.endDate).toLocaleDateString() : ''
                    }
                  </p>
                  {edu.grade && (
                    <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Projects</h3>
          <div className="space-y-4">
            {profile.projects.map((project, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-gray-700 mt-1">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, techIdx) => (
                      <span key={techIdx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Job Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Experience:</span>
              <span className="text-gray-600">
                {profile.yearsOfExperience || 0} year{(profile.yearsOfExperience || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Availability:</span>
              <span className="text-gray-600 capitalize">
                {(profile.availability || 'immediate').replace('-', ' ')}
              </span>
            </div>
            {profile.currentPosition && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">Current Role:</span>
                <span className="text-gray-600">{profile.currentPosition}</span>
              </div>
            )}
            {profile.currentCompany && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">Company:</span>
                <span className="text-gray-600">{profile.currentCompany}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {profile.salaryExpectation && (profile.salaryExpectation.min > 0 || profile.salaryExpectation.max > 0) && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">Salary Range:</span>
                <span className="text-gray-600">
                  {profile.salaryExpectation.min > 0 ? 
                    `${profile.salaryExpectation.currency} ${profile.salaryExpectation.min.toLocaleString()}` : 
                    'Not specified'
                  }
                  {profile.salaryExpectation.min > 0 && profile.salaryExpectation.max > 0 && ' - '}
                  {profile.salaryExpectation.max > 0 ? 
                    `${profile.salaryExpectation.currency} ${profile.salaryExpectation.max.toLocaleString()}` : 
                    ''
                  }
                </span>
              </div>
            )}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Profile Visibility:</span>
              <span className="text-gray-600 capitalize">
                {profile.visibility || 'public'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Form Component
const ProfileForm = ({ formData, setFormData, activeSection, addArrayItem, updateArrayItem, removeArrayItem }) => {
  const [skillInput, setSkillInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  // Skills management functions
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = formData.skills || [];
      const newSkills = [...currentSkills, skillInput.trim()];
      setFormData({ ...formData, skills: newSkills });
      setSkillInput('');
      console.log('Added skill:', skillInput.trim(), 'New skills array:', newSkills);
    }
  };

  const handleRemoveSkill = (index) => {
    const currentSkills = formData.skills || [];
    const newSkills = currentSkills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
    console.log('Removed skill at index:', index, 'New skills array:', newSkills);
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Desired Roles management functions
  const handleAddRole = () => {
    if (roleInput.trim()) {
      const currentRoles = formData.desiredRoles || [];
      const newRoles = [...currentRoles, roleInput.trim()];
      setFormData({ ...formData, desiredRoles: newRoles });
      setRoleInput('');
      console.log('Added role:', roleInput.trim(), 'New roles array:', newRoles);
    }
  };

  const handleRemoveRole = (index) => {
    const currentRoles = formData.desiredRoles || [];
    const newRoles = currentRoles.filter((_, i) => i !== index);
    setFormData({ ...formData, desiredRoles: newRoles });
    console.log('Removed role at index:', index, 'New roles array:', newRoles);
  };

  const handleRoleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRole();
    }
  };
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Headline *</label>
          <input
            type="text"
            value={formData.headline || ''}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="e.g., Full Stack Developer with 5+ years experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary *</label>
        <textarea
          value={formData.summary || ''}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows="4"
          placeholder="Brief overview of your background, skills, and career goals..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, State/Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedinUrl || ''}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            type="url"
            value={formData.githubUrl || ''}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
          <input
            type="url"
            value={formData.portfolioUrl || ''}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            placeholder="https://yourwebsite.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.yearsOfExperience || 0}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
          <select
            value={formData.availability || 'immediate'}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="immediate">Available Immediately</option>
            <option value="2weeks">2 Weeks Notice</option>
            <option value="1month">1 Month Notice</option>
            <option value="2months">2 Months Notice</option>
            <option value="not-looking">Not Looking</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      {/* Skills Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills * <span className="text-gray-500">({(formData.skills || []).length} added)</span>
        </label>
        
        {/* Display existing skills */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 border border-gray-200 rounded-md bg-gray-50">
          {(formData.skills || []).length === 0 ? (
            <span className="text-gray-400 text-sm">No skills added yet</span>
          ) : (
            (formData.skills || []).map((skill, index) => (
              <span 
                key={`skill-${index}-${skill}`} 
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-blue-600 hover:text-red-600 transition-colors"
                  title="Remove skill"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        
        {/* Add new skill input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a skill (e.g., JavaScript, Python, etc.)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!skillInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Desired Roles Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Desired Roles <span className="text-gray-500">({(formData.desiredRoles || []).length} added)</span>
        </label>
        
        {/* Display existing roles */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 border border-gray-200 rounded-md bg-gray-50">
          {(formData.desiredRoles || []).length === 0 ? (
            <span className="text-gray-400 text-sm">No roles added yet</span>
          ) : (
            (formData.desiredRoles || []).map((role, index) => (
              <span 
                key={`role-${index}-${role}`}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(index)}
                  className="ml-2 text-green-600 hover:text-red-600 transition-colors"
                  title="Remove role"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        
        {/* Add new role input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a desired role (e.g., Frontend Developer, Product Manager, etc.)"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyPress={handleRoleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddRole}
            disabled={!roleInput.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Work Experience</h3>
        <button
          type="button"
          onClick={() => addArrayItem('experience', {
            company: '',
            position: '',
            description: '',
            startDate: '',
            endDate: '',
            isCurrentPosition: false,
            location: ''
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Experience
        </button>
      </div>
      
      {(formData.experience || []).map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => updateArrayItem('experience', index, { company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => updateArrayItem('experience', index, { position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => updateArrayItem('experience', index, { description: e.target.value })}
              rows="3"
              placeholder="Describe your responsibilities and achievements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={exp.startDate || ''}
                onChange={(e) => updateArrayItem('experience', index, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={exp.endDate || ''}
                onChange={(e) => updateArrayItem('experience', index, { endDate: e.target.value })}
                disabled={exp.isCurrentPosition}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateArrayItem('experience', index, { location: e.target.value })}
                placeholder="City, Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exp.isCurrentPosition || false}
                onChange={(e) => updateArrayItem('experience', index, { 
                  isCurrentPosition: e.target.checked,
                  endDate: e.target.checked ? '' : exp.endDate
                })}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Current Position</span>
            </label>
            <button
              type="button"
              onClick={() => removeArrayItem('experience', index)}
              className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Education</h3>
        <button
          type="button"
          onClick={() => addArrayItem('education', {
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            grade: ''
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Education
        </button>
      </div>
      
      {(formData.education || []).map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => updateArrayItem('education', index, { institution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => updateArrayItem('education', index, { degree: e.target.value })}
                placeholder="e.g., Bachelor's, Master's, PhD"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={edu.field || ''}
                onChange={(e) => updateArrayItem('education', index, { field: e.target.value })}
                placeholder="e.g., Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={edu.startDate || ''}
                onChange={(e) => updateArrayItem('education', index, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={edu.endDate || ''}
                onChange={(e) => updateArrayItem('education', index, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade/GPA</label>
              <input
                type="text"
                value={edu.grade || ''}
                onChange={(e) => updateArrayItem('education', index, { grade: e.target.value })}
                placeholder="e.g., 3.8/4.0, First Class"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => removeArrayItem('education', index)}
              className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Projects</h3>
        <button
          type="button"
          onClick={() => addArrayItem('projects', {
            title: '',
            description: '',
            technologies: [],
            link: '',
            startDate: '',
            endDate: '',
            isOngoing: false
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>
      
      {(formData.projects || []).map((project, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => updateArrayItem('projects', index, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => updateArrayItem('projects', index, { link: e.target.value })}
                placeholder="https://github.com/username/project"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={project.description || ''}
              onChange={(e) => updateArrayItem('projects', index, { description: e.target.value })}
              rows="3"
              placeholder="Describe the project, your role, and key achievements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(project.technologies || []).map((tech, techIndex) => (
                <span key={techIndex} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                  {tech}
                  <button
                    type="button"
                    onClick={() => {
                      const newTechs = project.technologies.filter((_, i) => i !== techIndex);
                      updateArrayItem('projects', index, { technologies: newTechs });
                    }}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a technology and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  e.preventDefault();
                  const newTechs = [...(project.technologies || []), e.target.value.trim()];
                  updateArrayItem('projects', index, { technologies: newTechs });
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={project.startDate || ''}
                onChange={(e) => updateArrayItem('projects', index, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={project.endDate || ''}
                onChange={(e) => updateArrayItem('projects', index, { endDate: e.target.value })}
                disabled={project.isOngoing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={project.isOngoing || false}
                onChange={(e) => updateArrayItem('projects', index, { 
                  isOngoing: e.target.checked,
                  endDate: e.target.checked ? '' : project.endDate
                })}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Ongoing Project</span>
            </label>
            <button
              type="button"
              onClick={() => removeArrayItem('projects', index)}
              className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Job Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
          <select
            value={formData.yearsOfExperience || 0}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>0 - Fresher</option>
            <option value={1}>1 Year</option>
            <option value={2}>2 Years</option>
            <option value={3}>3 Years</option>
            <option value={4}>4 Years</option>
            <option value={5}>5 Years</option>
            <option value={6}>6+ Years</option>
            <option value={10}>10+ Years</option>
            <option value={15}>15+ Years</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <select
            value={formData.availability || 'immediate'}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="immediate">Immediate</option>
            <option value="2weeks">2 Weeks Notice</option>
            <option value="1month">1 Month Notice</option>
            <option value="2months">2 Months Notice</option>
            <option value="not-looking">Not Looking</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
        <input
          type="text"
          value={formData.currentPosition || ''}
          onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
          placeholder="e.g., Senior Software Engineer"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
        <input
          type="text"
          value={formData.currentCompany || ''}
          onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
          placeholder="e.g., Google, Microsoft, Startup Inc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Salary Expectation</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="number"
              value={formData.salaryExpectation?.min || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                salaryExpectation: { 
                  ...formData.salaryExpectation, 
                  min: parseInt(e.target.value) || 0 
                } 
              })}
              placeholder="Min salary"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.salaryExpectation?.max || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                salaryExpectation: { 
                  ...formData.salaryExpectation, 
                  max: parseInt(e.target.value) || 0 
                } 
              })}
              placeholder="Max salary"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={formData.salaryExpectation?.currency || 'INR'}
              onChange={(e) => setFormData({ 
                ...formData, 
                salaryExpectation: { 
                  ...formData.salaryExpectation, 
                  currency: e.target.value 
                } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
        <select
          value={formData.visibility || 'public'}
          onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="public">Public - Visible to all</option>
          <option value="private">Private - Only to approved connections</option>
        </select>
      </div>
    </div>
  );

  const sections = {
    basic: renderBasicInfo,
    experience: renderExperienceSection,
    education: renderEducationSection,
    projects: renderProjectsSection,
    skills: renderSkillsSection,
    preferences: renderPreferencesSection
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {sections[activeSection] ? sections[activeSection]() : renderBasicInfo()}
    </div>
  );
};

export default MyProfile;