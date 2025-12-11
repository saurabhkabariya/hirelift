import Link from "next/link";

export const metadata = {
  title: "Submit Your Job Posting | Post Jobs for Free | HireLift",
  description: "Post your job openings on HireLift for free. Reach thousands of qualified job seekers in India across all industries. Easy job posting with instant visibility.",
  keywords: [
    "post jobs", "job posting", "submit jobs", "free job posting", "job board",
    "hire talent", "recruit candidates", "employer portal", "post job openings",
    "job advertisement", "company hiring", "recruitment platform India",
    "free job ads", "hire employees", "job vacancy posting", "talent acquisition"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${'https://www.hirelift.tech'}/post-job`,
    title: "Submit Your Job Posting | Post Jobs for Free | HireLift",
    description: "Post your job openings on HireLift for free. Reach thousands of qualified job seekers in India.",
    images: [
      {
        url: `${'https://www.hirelift.tech'}/og-post-job.jpg`,
        width: 1200,
        height: 630,
        alt: "Post Jobs for Free - HireLift Employer Portal"
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Your Job Opening
          </h1>
          <p className="text-xl text-gray-600">
            Reach thousands of qualified candidates across India - Completely Free
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🚧 Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              Our job posting feature is under development. For now, browse our existing opportunities or contact us directly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/jobs" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Jobs
              </Link>
              <Link 
                href="/contact" 
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">🎯 Targeted Reach</h3>
            <p className="text-gray-600">Connect with job seekers actively looking for opportunities in your industry.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">💰 Free Posting</h3>
            <p className="text-gray-600">Post your job openings completely free with no hidden charges or fees.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">⚡ Quick Setup</h3>
            <p className="text-gray-600">Easy job posting process with instant visibility to thousands of candidates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}