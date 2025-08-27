import { Metadata } from 'next'

export const metadata = {
  title: "Job Search Blog - ATS Resume Tips, Cold Email Templates & Career Advice | HireLift",
  description: "Expert job search advice for Indian job seekers. Learn ATS resume optimization, cold email strategies, HR networking tips, and proven career guidance. Updated weekly with latest job market trends.",
  keywords: [
    "job search blog", "career advice India", "ATS resume tips", "cold email strategies",
    "job search tips", "interview preparation", "salary negotiation", "career guidance",
    "job hunting tips", "resume writing tips", "linkedin tips", "job market trends India"
  ],
  openGraph: {
    title: "Job Search Blog - Expert Career Advice for Indian Job Seekers | HireLift",
    description: "Get expert job search advice, ATS resume tips, and career guidance specifically for Indian job market. Learn from successful job seekers and career experts.",
    url: "https://hirelift.vercel.app/blog"
  },
  alternates: {
    canonical: "https://hirelift.vercel.app/blog"
  }
}

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
