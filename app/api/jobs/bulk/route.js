import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

// Helper function to verify JWT token and get user
// async function verifyAuth(request) {
//   try {
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { user: null, error: 'No token provided' };
//     }

//     const token = authHeader.substring(7);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     await connectDB();
//     const user = await User.findById(decoded.userId);
    
//     if (!user) {
//       return { user: null, error: 'User not found' };
//     }

//     return { user, error: null };
//   } catch (error) {
//     return { user: null, error: 'Invalid token' };
//   }
// }

// POST /api/jobs/bulk - Bulk create jobs (admin only)
export async function POST(request) {
  try {
    // Check authentication and admin status
    // const { user, error } = await verifyAuth(request);
    // if (error || !user || user.email !== 'websiteads074@gmail.com') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    await connectDB();
    
    const jobsData = await request.json();
    
    // Validate input is array
    if (!Array.isArray(jobsData)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          message: 'Request body must be an array of job objects'
        },
        { status: 400 }
      );
    }
    
    // Limit bulk upload size
    if (jobsData.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many jobs',
          message: 'Maximum 100 jobs allowed per bulk upload'
        },
        { status: 400 }
      );
    }
    
    if (jobsData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Empty array',
          message: 'At least one job is required'
        },
        { status: 400 }
      );
    }
    
    // Required fields for validation
    const requiredFields = ['title', 'company', 'location', 'description', 'jobType', 'url'];
    
    // Results tracking
    const results = {
      added: 0,
      updated: 0,
      errors: [],
      processed: 0
    };
    
    // Process each job
    for (let i = 0; i < jobsData.length; i++) {
      const jobData = jobsData[i];
      results.processed++;
      
      try {
        // Validate required fields
        const missingFields = requiredFields.filter(field => !jobData[field] || !jobData[field].toString().trim());
        
        if (missingFields.length > 0) {
          results.errors.push({
            index: i,
            title: jobData.title || 'Unknown',
            error: 'Missing required fields',
            details: `Missing: ${missingFields.join(', ')}`
          });
          continue;
        }
        
        // Set defaults for manual jobs
        const processedJobData = {
          ...jobData,
          source: 'manual',
          postedBy: session.user.id,
          status: jobData.status || 'active'
        };
        
        // Validate job type
        const validJobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
        if (!validJobTypes.includes(processedJobData.jobType)) {
          results.errors.push({
            index: i,
            title: jobData.title,
            error: 'Invalid job type',
            details: `Must be one of: ${validJobTypes.join(', ')}`
          });
          continue;
        }
        
        // Validate work mode if provided
        if (processedJobData.workMode) {
          const validWorkModes = ['remote', 'hybrid', 'onsite'];
          if (!validWorkModes.includes(processedJobData.workMode)) {
            results.errors.push({
              index: i,
              title: jobData.title,
              error: 'Invalid work mode',
              details: `Must be one of: ${validWorkModes.join(', ')}`
            });
            continue;
          }
        }
        
        // Validate experience level if provided
        if (processedJobData.experienceLevel) {
          const validLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];
          if (!validLevels.includes(processedJobData.experienceLevel)) {
            results.errors.push({
              index: i,
              title: jobData.title,
              error: 'Invalid experience level',
              details: `Must be one of: ${validLevels.join(', ')}`
            });
            continue;
          }
        }
        
        // Validate URL format
        if (processedJobData.url) {
          try {
            new URL(processedJobData.url);
          } catch (urlError) {
            results.errors.push({
              index: i,
              title: jobData.title,
              error: 'Invalid URL format',
              details: 'URL must be a valid HTTP/HTTPS URL'
            });
            continue;
          }
        }
        
        // Validate tags array if provided
        if (processedJobData.tags && !Array.isArray(processedJobData.tags)) {
          results.errors.push({
            index: i,
            title: jobData.title,
            error: 'Invalid tags format',
            details: 'Tags must be an array of strings'
          });
          continue;
        }
        
        // Sanitize text fields
        processedJobData.title = processedJobData.title.trim().substring(0, 200);
        processedJobData.company = processedJobData.company.trim().substring(0, 100);
        processedJobData.location = processedJobData.location.trim().substring(0, 100);
        processedJobData.description = processedJobData.description.trim().substring(0, 10000);
        
        if (processedJobData.tags) {
          processedJobData.tags = processedJobData.tags
            .map(tag => tag.toString().trim().substring(0, 50))
            .filter(tag => tag.length > 0)
            .slice(0, 20); // Limit to 20 tags
        }
        
        // Check for existing job with same title and company
        const existingJob = await Job.findOne({
          title: new RegExp(`^${processedJobData.title}$`, 'i'),
          company: new RegExp(`^${processedJobData.company}$`, 'i'),
          source: 'manual'
        });
        
        if (existingJob) {
          // Update existing job
          const updatedJob = await Job.findByIdAndUpdate(
            existingJob._id,
            { ...processedJobData, updatedAt: new Date() },
            { new: true, runValidators: true }
          );
          
          if (updatedJob) {
            results.updated++;
          } else {
            results.errors.push({
              index: i,
              title: jobData.title,
              error: 'Update failed',
              details: 'Failed to update existing job'
            });
          }
        } else {
          // Create new job
          const job = new Job(processedJobData);
          await job.save();
          results.added++;
        }
        
      } catch (error) {
        console.error(`Error processing job ${i}:`, error);
        
        let errorMessage = 'Unknown error occurred';
        
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(e => e.message);
          errorMessage = `Validation error: ${validationErrors.join(', ')}`;
        } else if (error.code === 11000) {
          errorMessage = 'Duplicate job detected';
        } else {
          errorMessage = error.message;
        }
        
        results.errors.push({
          index: i,
          title: jobData.title || 'Unknown',
          error: 'Processing error',
          details: errorMessage
        });
      }
    }
    
    // Determine response status
    const hasErrors = results.errors.length > 0;
    const hasSuccesses = results.added > 0 || results.updated > 0;
    
    let status = 200;
    if (hasErrors && !hasSuccesses) {
      status = 400; // All failed
    } else if (hasErrors && hasSuccesses) {
      status = 207; // Partial success
    }
    
    return NextResponse.json({
      success: !hasErrors || hasSuccesses,
      message: `Processed ${results.processed} jobs: ${results.added} added, ${results.updated} updated, ${results.errors.length} errors`,
      results
    }, { status });
    
  } catch (error) {
    console.error('Error in bulk job upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Bulk upload failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// GET /api/jobs/bulk - Get bulk upload template/documentation (admin only)
export async function GET(request) {
  try {
    // Check authentication and admin status
    // const session = await getServerSession();
    // if (!session?.user?.email || session.user.email !== 'websiteads074@gmail.com') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const template = {
      title: "Software Engineer",
      company: "Example Tech Corp",
      location: "San Francisco, CA",
      description: "<p>We are looking for a talented software engineer...</p>",
      tags: ["javascript", "react", "node.js"],
      salaryRange: {
        min: 80000,
        max: 120000,
        currency: "USD",
        period: "yearly"
      },
      jobType: "full-time",
      workMode: "remote",
      experienceLevel: "mid",
      url: "https://example.com/jobs/software-engineer",
      isFeatured: false,
      companyLogo: "https://example.com/logo.png"
    };
    
    const documentation = {
      description: "Bulk upload API for creating multiple jobs",
      endpoint: "/api/jobs/bulk",
      method: "POST",
      maxJobs: 100,
      requiredFields: ["title", "company", "location", "description", "jobType", "url"],
      optionalFields: ["tags", "salaryRange", "workMode", "experienceLevel", "isFeatured", "companyLogo"],
      validValues: {
        jobType: ["full-time", "part-time", "contract", "internship", "freelance"],
        workMode: ["remote", "hybrid", "onsite"],
        experienceLevel: ["entry", "mid", "senior", "lead", "executive"]
      },
      example: [template]
    };
    
    return NextResponse.json({
      success: true,
      documentation,
      template: [template]
    });
    
  } catch (error) {
    console.error('Error getting bulk upload documentation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get documentation'
      },
      { status: 500 }
    );
  }
}