export const metadata = {
  title: 'Resume Job Matcher - AI-Powered Resume Analysis | HireLift',
  description: 'Match your resume with any job description instantly. Get AI-powered mismatch analysis and actionable suggestions to improve your chances. First match is free!',
  keywords: 'resume matcher, job match, resume analysis, ATS checker, resume scanner, job description match, resume optimization, career tools, job application help',
  openGraph: {
    title: 'Resume Job Matcher - Find Your Perfect Match',
    description: 'Upload your resume and paste any job description to get instant AI-powered match analysis. Identify gaps and improve your application.',
    type: 'website',
    url: 'https://hirelift.in/job-matcher',
    images: [
      {
        url: '/og-job-matcher.png',
        width: 1200,
        height: 630,
        alt: 'HireLift Resume Job Matcher',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Job Matcher - AI-Powered Analysis',
    description: 'Match your resume with any job description instantly. Get actionable suggestions to improve your chances.',
    images: ['/og-job-matcher.png'],
  },
  alternates: {
    canonical: 'https://hirelift.in/job-matcher',
  },
};

export default function JobMatcherLayout({ children }) {
  return <>{children}</>;
}
