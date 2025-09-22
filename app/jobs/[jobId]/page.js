import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import JobDetail from '@/components/JobDetail';

// This function runs on the server
async function getJob(jobId) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching job:', error);
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
  const job = await getJob(params.jobId);
  
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
  const job = await getJob(params.jobId);

  if (!job) {
    notFound();
  }

  return (
    <Suspense fallback={<JobDetailSkeleton />}>
      <JobDetail job={job} />
    </Suspense>
  );
}

// For static generation optimization
export async function generateStaticParams() {
  // We can't pre-generate all job pages since they're dynamic
  // Return empty array to generate on-demand
  return [];
}