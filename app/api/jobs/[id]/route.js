import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import { fetchRemoteOkJobs } from '@/lib/remoteok';
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

// GET /api/jobs/[id] - Get job by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    let job = null;
    
    // First try to find in manual jobs by MongoDB _id
    if (id.length === 24) { // MongoDB ObjectId length
      job = await Job.findById(id).lean();
    }
    
    // If not found, try to find by externalId (for RemoteOK jobs)
    if (!job) {
      job = await Job.findOne({ externalId: id, source: 'remoteok' }).lean();
    }
    
    // If still not found, check RemoteOK jobs directly
    if (!job) {
      const remoteOkJobs = await fetchRemoteOkJobs();
      job = remoteOkJobs.find(j => j.externalId === id);
    }
    
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
          message: `No job found with ID: ${id}`
        },
        { status: 404 }
      );
    }
    
    // Increment view count for manual jobs
    if (job._id && job.source === 'manual') {
      await Job.findByIdAndUpdate(job._id, { $inc: { viewCount: 1 } });
      job.viewCount = (job.viewCount || 0) + 1;
    }
    
    // Add related jobs (same company or similar tags)
    const relatedJobs = await findRelatedJobs(job, id);
    
    return NextResponse.json({
      success: true,
      data: {
        ...job,
        relatedJobs
      }
    });
    
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete job (admin only)
export async function DELETE(request, { params }) {
  try {
    // Check authentication and admin status
    const session = await getServerSession();
    if (!session?.user?.email || session.user.email !== 'websiteads074@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = params;
    
    // Only allow deletion of manual jobs
    const job = await Job.findOne({ _id: id, source: 'manual' });
    
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
          message: 'Job not found or cannot be deleted'
        },
        { status: 404 }
      );
    }
    
    await Job.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete job',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update job (admin only)
export async function PUT(request, { params }) {
  try {
    // Check authentication and admin status
    const session = await getServerSession();
    if (!session?.user?.email || session.user.email !== 'websiteads074@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = params;
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.source;
    delete updateData.externalId;
    delete updateData.rawRemote;
    delete updateData.createdAt;
    delete updateData.viewCount;
    
    // Only allow updating manual jobs
    const job = await Job.findOneAndUpdate(
      { _id: id, source: 'manual' },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found',
          message: 'Job not found or cannot be updated'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update job',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// Helper function to find related jobs
async function findRelatedJobs(currentJob, currentId, limit = 4) {
  try {
    // First, try to find jobs from the same company
    let relatedJobs = await Job.find({
      $and: [
        { company: new RegExp(currentJob.company, 'i') },
        { status: 'active' },
        { expiresAt: { $gt: new Date() } },
        currentJob._id ? { _id: { $ne: currentJob._id } } : { externalId: { $ne: currentId } }
      ]
    })
    .select('title company location tags jobType workMode createdAt _id externalId source')
    .limit(limit)
    .lean();
    
    // If we don't have enough related jobs, find by similar tags
    if (relatedJobs.length < limit && currentJob.tags && currentJob.tags.length > 0) {
      const tagRelatedJobs = await Job.find({
        $and: [
          { tags: { $in: currentJob.tags } },
          { status: 'active' },
          { expiresAt: { $gt: new Date() } },
          { company: { $ne: currentJob.company } }, // Different company
          currentJob._id ? { _id: { $ne: currentJob._id } } : { externalId: { $ne: currentId } }
        ]
      })
      .select('title company location tags jobType workMode createdAt _id externalId source')
      .limit(limit - relatedJobs.length)
      .lean();
      
      relatedJobs = [...relatedJobs, ...tagRelatedJobs];
    }
    
    // Also check RemoteOK jobs if we still need more
    if (relatedJobs.length < limit) {
      try {
        const remoteOkJobs = await fetchRemoteOkJobs();
        const remoteRelated = remoteOkJobs
          .filter(job => 
            job.externalId !== currentId &&
            (job.company.toLowerCase().includes(currentJob.company.toLowerCase()) ||
             (currentJob.tags && currentJob.tags.some(tag => 
               job.tags?.some(jobTag => jobTag.toLowerCase().includes(tag.toLowerCase()))
             )))
          )
          .slice(0, limit - relatedJobs.length)
          .map(job => ({
            title: job.title,
            company: job.company,
            location: job.location,
            tags: job.tags,
            jobType: job.jobType,
            workMode: job.workMode,
            createdAt: job.createdAt,
            externalId: job.externalId,
            source: job.source
          }));
        
        relatedJobs = [...relatedJobs, ...remoteRelated];
      } catch (remoteError) {
        console.warn('Error fetching RemoteOK related jobs:', remoteError);
      }
    }
    
    return relatedJobs.slice(0, limit);
    
  } catch (error) {
    console.error('Error finding related jobs:', error);
    return [];
  }
}