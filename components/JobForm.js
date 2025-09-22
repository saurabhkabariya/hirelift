import React, { useState, useRef, useEffect } from "react";

const jobTypes = ["full-time", "part-time", "contract", "internship", "freelance"];
const workModes = ["remote", "hybrid", "onsite"];
const experienceLevels = ["entry", "mid", "senior", "lead", "executive"];
const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
const salaryPeriods = ["yearly", "monthly", "hourly"];

// Common tech tags for job posting
const COMMON_TAGS = [
  "JavaScript", "Python", "React", "Node.js", "TypeScript", "Java", "C++", "PHP", "Ruby", "Go",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
  "Frontend", "Backend", "Full Stack", "DevOps", "Machine Learning", "Data Science", "Mobile",
  "iOS", "Android", "Flutter", "React Native", "Vue.js", "Angular", "Express", "Django", "Flask",
  "Spring", "Laravel", "Ruby on Rails", "API", "REST", "GraphQL", "Microservices", "Agile", "Scrum"
];

export default function JobForm({ initialValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    title: initialValues.title || "",
    company: initialValues.company || "",
    location: initialValues.location || "",
    description: initialValues.description || "",
    shortDescription: initialValues.shortDescription || "",
    tags: initialValues.tags || [],
    salaryRange: {
      min: initialValues.salaryRange?.min || "",
      max: initialValues.salaryRange?.max || "",
      currency: initialValues.salaryRange?.currency || "USD",
      period: initialValues.salaryRange?.period || "yearly"
    },
    jobType: initialValues.jobType || "full-time",
    workMode: initialValues.workMode || "remote",
    experienceLevel: initialValues.experienceLevel || "mid",
    url: initialValues.url || "",
    companyLogo: initialValues.companyLogo || "",
    isFeatured: initialValues.isFeatured || false,
    status: initialValues.status || "draft"
  });

  const [submitting, setSubmitting] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object properties (like salaryRange.min)
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? (value ? Number(value) : '') : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleTagToggle = (tag) => {
    const updatedTags = form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag];
    setForm({ ...form, tags: updatedTags });
  };

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
  };

  const addCustomTag = () => {
    if (tagSearchTerm.trim() && !form.tags.includes(tagSearchTerm.trim())) {
      setForm({ ...form, tags: [...form.tags, tagSearchTerm.trim()] });
      setTagSearchTerm("");
      setShowTagDropdown(false);
    }
  };

  // Filter tags based on search term
  const filteredTags = COMMON_TAGS.filter(tag =>
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase()) &&
    !form.tags.includes(tag)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title.trim()) {
      alert("Please enter a job title");
      return;
    }
    
    if (!form.company.trim()) {
      alert("Please enter a company name");
      return;
    }
    
    if (!form.url.trim()) {
      alert("Please enter an application URL");
      return;
    }
    
    if (form.tags.length === 0) {
      alert("Please add at least one skill tag");
      return;
    }
    
    setSubmitting(true);
    
    const data = {
      ...form,
      source: 'manual',
      salaryRange: {
        ...form.salaryRange,
        min: form.salaryRange.min ? Number(form.salaryRange.min) : undefined,
        max: form.salaryRange.max ? Number(form.salaryRange.max) : undefined
      }
    };
    
    await onSubmit(data);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Job Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Job Title *</label>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            required 
            placeholder="e.g., Senior React Developer"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Company *</label>
          <input 
            name="company" 
            value={form.company} 
            onChange={handleChange} 
            required 
            placeholder="e.g., TechCorp Solutions"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Location *</label>
          <input 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            required 
            placeholder="e.g., Remote, New York, USA"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Application URL *</label>
          <input 
            name="url" 
            type="url"
            value={form.url} 
            onChange={handleChange} 
            required 
            placeholder="https://company.com/careers/job-id"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
      </div>

      {/* Job Type and Work Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Job Type</label>
          <select 
            name="jobType" 
            value={form.jobType} 
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white capitalize"
          >
            {jobTypes.map(type => (
              <option key={type} value={type} className="capitalize">
                {type.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Work Mode</label>
          <select 
            name="workMode" 
            value={form.workMode} 
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white capitalize"
          >
            {workModes.map(mode => (
              <option key={mode} value={mode} className="capitalize">
                {mode}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Experience Level</label>
          <select 
            name="experienceLevel" 
            value={form.experienceLevel} 
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white capitalize"
          >
            {experienceLevels.map(level => (
              <option key={level} value={level} className="capitalize">
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Range */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Salary Range (Optional)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">Min Salary</label>
            <input 
              name="salaryRange.min" 
              type="number"
              value={form.salaryRange.min} 
              onChange={handleChange} 
              placeholder="50000"
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">Max Salary</label>
            <input 
              name="salaryRange.max" 
              type="number"
              value={form.salaryRange.max} 
              onChange={handleChange} 
              placeholder="80000"
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">Currency</label>
            <select 
              name="salaryRange.currency" 
              value={form.salaryRange.currency} 
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-2">Period</label>
            <select 
              name="salaryRange.period" 
              value={form.salaryRange.period} 
              onChange={handleChange}
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white capitalize"
            >
              {salaryPeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills/Tags */}
      <div>
        <label className="block text-sm font-semibold text-blue-700 mb-2">Required Skills/Technologies *</label>
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search skills (e.g., React, Python, AWS) or type custom..."
            value={tagSearchTerm}
            onChange={(e) => setTagSearchTerm(e.target.value)}
            onFocus={() => setShowTagDropdown(true)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomTag();
              }
            }}
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white"
          />
          
          {showTagDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {tagSearchTerm && !filteredTags.includes(tagSearchTerm) && (
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-blue-100 text-blue-600 font-medium"
                >
                  + Add "{tagSearchTerm}"
                </button>
              )}
              {filteredTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-blue-50 last:border-b-0"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {form.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-semibold text-blue-700 mb-2">Job Description *</label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          required 
          rows="8"
          placeholder="Detailed job description, responsibilities, requirements, benefits..."
          className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white resize-vertical" 
        />
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Company Logo URL</label>
          <input 
            name="companyLogo" 
            type="url"
            value={form.companyLogo} 
            onChange={handleChange} 
            placeholder="https://company.com/logo.png"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Short Description</label>
          <input 
            name="shortDescription" 
            value={form.shortDescription} 
            onChange={handleChange} 
            maxLength="300"
            placeholder="Brief summary for job listings (auto-generated if empty)"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white" 
          />
        </div>
      </div>

      {/* Status and Featured */}
      <div className="flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-blue-700">
            Featured Job (appears at top of listings)
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-blue-700 mb-2">Status</label>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange}
            className="border-2 border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white capitalize"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={submitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {initialValues.title ? 'Update Job' : 'Add Job'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}