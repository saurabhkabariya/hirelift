import JobsSchema from '@/components/seo/JobsSchema';

export const metadata = {
  title: "Free Jobs in India | Browse Latest Job Openings | HireLift",
  description: "Discover thousands of free job opportunities in India. Browse latest jobs across all industries, locations & experience levels. Apply directly with ATS-optimized resumes. Updated daily.",
  keywords: [
    // Core job search keywords
    "free jobs", "jobs in India", "job search", "latest jobs", "job openings", 
    "job opportunities", "job vacancies", "employment", "career opportunities",
    "job listings", "job portal", "job finder", "job board", "naukri",
    
    // Location-based keywords
    "jobs Mumbai", "jobs Delhi", "jobs Bangalore", "jobs Chennai", "jobs Hyderabad",
    "jobs Pune", "jobs Kolkata", "jobs Ahmedabad", "jobs Gurgaon", "jobs Noida",
    "remote jobs India", "work from home jobs", "hybrid jobs",
    
    // Industry-specific keywords
    "IT jobs", "software developer jobs", "data scientist jobs", "marketing jobs",
    "sales jobs", "finance jobs", "HR jobs", "engineering jobs", "design jobs",
    "content writer jobs", "digital marketing jobs", "business analyst jobs",
    
    // Experience level keywords
    "fresher jobs", "entry level jobs", "experienced jobs", "senior jobs",
    "junior jobs", "mid level jobs", "internship", "graduate jobs",
    
    // Job type keywords
    "full time jobs", "part time jobs", "contract jobs", "freelance jobs",
    "permanent jobs", "temporary jobs", "project based jobs"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${ 'https://www.hirelift.tech'}/jobs`,
    title: "Free Jobs in India | Browse Latest Job Openings | HireLift",
    description: "Discover thousands of free job opportunities in India. Browse latest jobs across all industries, locations & experience levels. Apply directly with ATS-optimized resumes.",
    siteName: "HireLift",
    images: [
      {
        url: `${ 'https://www.hirelift.tech'}/og-jobs.jpg`,
        width: 1200,
        height: 630,
        alt: "Free Jobs in India - HireLift Job Portal",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Jobs in India | Browse Latest Job Openings | HireLift",
    description: "Discover thousands of free job opportunities in India. Browse latest jobs across all industries, locations & experience levels.",
    images: {
      url: `${ 'https://www.hirelift.tech'}/twitter-jobs.jpg`,
      alt: "Free Jobs in India - HireLift Job Portal"
    }
  },
  alternates: {
    canonical: `${ 'https://www.hirelift.tech'}/jobs`
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function JobsLayout({ children }) {
  return (
    <>
      <JobsSchema />
      {children}
    </>
  );
}