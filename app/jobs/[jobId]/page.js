import { Suspense } from 'react';
import JobDetail from '@/components/JobDetail.jsx';
import { connectDB } from '@/lib/mongodb';
import Job from '@/models/Job';
import { fetchRemoteOkJobs } from '@/lib/remoteok';

// Serialize job data for client component
function serializeJob(job) {
  if (!job) return null;
  
  // Convert MongoDB document to plain object
  const serialized = {
    _id: job._id ? job._id.toString() : job._id,
    id: job._id ? job._id.toString() : job.id,
    externalId: job.externalId,
    source: job.source,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    shortDescription: job.shortDescription,
    tags: job.tags || [],
    jobType: job.jobType,
    workMode: job.workMode,
    experienceLevel: job.experienceLevel,
    formattedSalary: job.formattedSalary,
    salaryRange: job.salaryRange,
    url: job.url,
    companyLogo: job.companyLogo,
    isFeatured: job.isFeatured,
    status: job.status,
    viewCount: job.viewCount,
    createdAt: job.createdAt ? job.createdAt.toString() : job.createdAt,
    updatedAt: job.updatedAt ? job.updatedAt.toString() : job.updatedAt,
    expiresAt: job.expiresAt ? job.expiresAt.toString() : job.expiresAt,
    daysAgo: job.daysAgo,
    __v: job.__v
  };
  
  return serialized;
}

// This function runs on the server - using direct DB queries instead of HTTP requests
async function getJob(jobId) {
  try {
    await connectDB();
    let job = null;
    
    // First try to find in manual jobs by MongoDB _id
    if (jobId.length === 24) { // MongoDB ObjectId length
      job = await Job.findById(jobId).lean();
      if (job) {
        // Convert MongoDB _id to string and add source info
        job.id = job._id.toString();
        job.source = job.source || 'manual';
        return job;
      }
    }
    
    // If not found, try to find by externalId (for RemoteOK jobs)
    job = await Job.findOne({ externalId: jobId, source: 'remoteok' }).lean();
    if (job) {
      job.id = job._id.toString();
      return job;
    }
    
    // If still not found, check RemoteOK jobs directly (cached)
    try {
      const remoteOkJobs = await fetchRemoteOkJobs();
      const remoteJob = remoteOkJobs.find(j => j.externalId === jobId || j.id === jobId);
      
      if (remoteJob) {
        return remoteJob;
      }
    } catch (error) {
      console.error('Error fetching RemoteOK jobs:', error);
      // Continue to return null if RemoteOK fails
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching job directly:', error);
    console.error('Job ID:', jobId);
    return null;
  }
}

// Loading component
function JobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation Bar Skeleton */}
      <div className="w-full bg-white/90 backdrop-blur-enhanced shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="w-3/4 h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-1/2 h-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex gap-3 mb-6">
            <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
              <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <div className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { jobId } = await params;
  const job = await getJob(jobId);
  
  if (!job) {
    return {
      title: 'Job Not Found | HireLift',
      description: 'The job you are looking for could not be found.'
    };
  }

  return {
    title: `${job.title} at ${job.company} | HireLift Jobs`,
    description: job.shortDescription || `${job.title} position at ${job.company} in ${job.location}. Apply now through HireLift.`,
    keywords: [job.title, job.company, job.location, ...(job.tags || [])].join(', '),
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.shortDescription || `${job.title} position at ${job.company} in ${job.location}`,
      type: 'website',
      images: job.companyLogo ? [{ url: job.companyLogo }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.company}`,
      description: job.shortDescription || `${job.title} position at ${job.company} in ${job.location}`
    }
  };
}

// Main page component
export default async function JobDetailPage({ params }) {
  const { jobId } = await params;
  
  // Try to get job data server-side
  let job = null;
  try {
    job = await getJob(jobId);
  } catch (error) {
    console.error('Server-side job fetch failed:', error);
    // Let the component handle client-side fallback
  }

  // Always render JobDetail component - it will handle the not found case
  const serializedJob = job ? serializeJob(job) : null;

  return (
    <Suspense fallback={<JobDetailSkeleton />}>
      <JobDetail job={serializedJob} jobId={jobId} />
    </Suspense>
  );
}

// For static generation optimization
export async function generateStaticParams() {
  // Return empty array to enable dynamic rendering on-demand
  // This ensures all job pages are rendered dynamically at request time
  return [];
}

// Ensure this page is dynamically rendered
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 300; // Revalidate every 5 minutes