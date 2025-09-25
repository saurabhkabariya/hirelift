import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import { fetchRemoteOkJobs, mergeJobSources } from '@/lib/remoteok';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

// Helper function to verify JWT token and get user
async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Invalid token' };
  }
}

// GET /api/jobs - List jobs with filters
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 per page
    const search = searchParams.get('q');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const company = searchParams.get('company');
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');
    const workMode = searchParams.get('workMode');
    const experienceLevel = searchParams.get('experienceLevel');
    const sort = searchParams.get('sort') || 'date'; // date, relevance
    const source = searchParams.get('source'); // manual, remoteok, or all (default)
    
    // Build filters object
    const filters = {
      search,
      tags,
      company,
      location,
      jobType,
      workMode,
      experienceLevel
    };
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key] || (Array.isArray(filters[key]) && filters[key].length === 0)) {
        delete filters[key];
      }
    });

    let allJobs = [];
    
    if (!source || source === 'all') {
      // Fetch both manual and RemoteOK jobs
      const [manualJobs, remoteOkJobs] = await Promise.all([
        fetchManualJobs(filters),
        fetchRemoteOkJobs()
      ]);
      
      // Apply filters to RemoteOK jobs as well
      const filteredRemoteOkJobs = applyFiltersToRemoteJobs(remoteOkJobs, filters);
      allJobs = mergeJobSources(manualJobs, filteredRemoteOkJobs);
    } else if (source === 'manual') {
      // Only manual jobs
      allJobs = await fetchManualJobs(filters);
    } else if (source === 'remoteok') {
      // Only RemoteOK jobs
      const remoteOkJobs = await fetchRemoteOkJobs();
      allJobs = applyFiltersToRemoteJobs(remoteOkJobs, filters);
    }
    
    // Sort jobs
    if (sort === 'date') {
      allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'relevance' && search) {
      // Simple relevance scoring based on search term matches
      allJobs = allJobs.map(job => ({
        ...job,
        relevanceScore: calculateRelevanceScore(job, search)
      })).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    
    // Apply pagination
    const total = allJobs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = allJobs.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      success: true,
      data: paginatedJobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      },
      filters: {
        applied: filters,
        available: await getAvailableFilters()
      }
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jobs',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create new job (admin only)
export async function POST(request) {
  try {
    // Check authentication and admin status
    const { user, error } = await verifyAuth(request);
    if (error || !user || user.email !== 'websiteads074@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const jobData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'description', 'jobType', 'url'];
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }
    
    // Set manual job defaults
    jobData.source = 'manual';
    jobData.postedBy = session.user.id;
    jobData.status = 'active';
    
    // Create job
    const job = new Job(jobData);
    await job.save();
    
    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
    
  } catch (error) {
    console.error('Error creating job:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate job',
          message: 'A job with this external ID already exists'
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create job',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// Helper function to fetch manual jobs with filters
async function fetchManualJobs(filters) {
  try {
    const jobs = await Job.findActiveJobs(filters)
      .select('-rawRemote') // Exclude raw data for performance
      .lean();
    
    // Add daysAgo calculation for each job
    const now = new Date();
    return jobs.map(job => {
      let daysAgo = 'Recently';
      
      if (job.createdAt) {
        try {
          const createdDate = new Date(job.createdAt);
          if (!isNaN(createdDate.getTime())) {
            const diffTime = Math.abs(now - createdDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) daysAgo = 'Today';
            else if (diffDays === 1) daysAgo = '1 day ago';
            else if (diffDays < 30) daysAgo = `${diffDays} days ago`;
            else if (diffDays < 365) {
              const months = Math.floor(diffDays / 30);
              daysAgo = months === 1 ? '1 month ago' : `${months} months ago`;
            } else {
              daysAgo = 'Over a year ago';
            }
          }
        } catch (error) {
          console.warn('Error calculating daysAgo for manual job:', error);
        }
      }
      
      return {
        ...job,
        daysAgo
      };
    });
    
  } catch (error) {
    console.error('Error fetching manual jobs:', error);
    return [];
  }
}

// Helper function to apply filters to RemoteOK jobs
function applyFiltersToRemoteJobs(jobs, filters) {
  return jobs.filter(job => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchable = `${job.title} ${job.description} ${job.company} ${job.tags?.join(' ')}`.toLowerCase();
      if (!searchable.includes(searchTerm)) return false;
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const jobTags = job.tags?.map(tag => tag.toLowerCase()) || [];
      const hasMatchingTag = filters.tags.some(tag => 
        jobTags.some(jobTag => jobTag.includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) return false;
    }
    
    // Company filter
    if (filters.company) {
      if (!job.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
    }
    
    // Location filter
    if (filters.location) {
      if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }
    
    // Job type filter
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    
    // Work mode filter
    if (filters.workMode && job.workMode !== filters.workMode) return false;
    
    // Experience level filter
    if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) return false;
    
    return true;
  });
}

// Calculate relevance score for search
function calculateRelevanceScore(job, searchTerm) {
  const search = searchTerm.toLowerCase();
  let score = 0;
  
  // Title matches are most important
  if (job.title.toLowerCase().includes(search)) score += 10;
  
  // Company matches
  if (job.company.toLowerCase().includes(search)) score += 5;
  
  // Tag matches
  if (job.tags?.some(tag => tag.toLowerCase().includes(search))) score += 3;
  
  // Description matches (less important)
  if (job.description.toLowerCase().includes(search)) score += 1;
  
  return score;
}

// Get available filter options
async function getAvailableFilters() {
  try {
    const [tags, companies, locations] = await Promise.all([
      Job.distinct('tags', { status: 'active' }),
      Job.distinct('company', { status: 'active' }),
      Job.distinct('location', { status: 'active' })
    ]);
    
    return {
      tags: tags.slice(0, 50), // Limit to top 50
      companies: companies.slice(0, 50),
      locations: locations.slice(0, 50),
      jobTypes: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      workModes: ['remote', 'hybrid', 'onsite'],
      experienceLevels: ['entry', 'mid', 'senior', 'lead', 'executive']
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {
      tags: [],
      companies: [],
      locations: [],
      jobTypes: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      workModes: ['remote', 'hybrid', 'onsite'],
      experienceLevels: ['entry', 'mid', 'senior', 'lead', 'executive']
    };
  }
}