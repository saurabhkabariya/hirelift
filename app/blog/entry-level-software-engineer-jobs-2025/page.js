'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaGraduationCap, FaDollarSign, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function EntryLevelSoftwareEngineerJobs() {
  const tableOfContents = [
    { id: "job-market", title: "2025 Entry-Level Tech Job Market" },
    { id: "top-companies", title: "Best Companies Hiring Fresh Grads" },
    { id: "salary-guide", title: "Salary Expectations US vs UK" },
    { id: "required-skills", title: "Essential Skills & Technologies" },
    { id: "application-strategy", title: "Application Strategy That Works" },
    { id: "interview-prep", title: "Interview Prep for Beginners" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <FaArrowLeft className="w-4 h-4" />Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              Entry-Level Jobs 2025
            </span>
            <span className="text-gray-500">Fresh Graduate Guide</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Entry-Level Software Engineer Jobs 2025: Complete Guide for CS Graduates in US & UK
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Land your first software engineering job in 2025. Discover top companies hiring fresh graduates, salary ranges ($80K-$120K in US, £30K-£50K in UK), required skills, and proven strategies to get hired without experience.
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />Career Advisors</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />18 min read</span>
              <span>Dec 15, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaShare className="w-4 h-4" />Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <FaBookmark className="w-4 h-4" />Save
              </button>
            </div>
          </div>
        </motion.header>

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="mb-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {tableOfContents.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {index + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none">
          
          <section id="job-market" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2025 Entry-Level Tech Job Market</h2>
            <p className="text-gray-700 mb-6">
              The entry-level software engineering market in 2025 is highly competitive but full of opportunities. With AI adoption accelerating, companies need developers who can adapt to new technologies quickly.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
                <h3 className="font-bold text-3xl mb-2">145,000+</h3>
                <p className="text-blue-100">Entry-level SWE openings in US</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
                <h3 className="font-bold text-3xl mb-2">38,000+</h3>
                <p className="text-green-100">Entry-level SWE openings in UK</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
                <h3 className="font-bold text-3xl mb-2">62%</h3>
                <p className="text-purple-100">Accept remote-first applicants</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaGraduationCap className="text-yellow-600 w-5 h-5" />
                What Employers Look for in Fresh Graduates (2025)
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Problem-solving skills:</strong> More important than specific tech stack</li>
                <li>• <strong>Portfolio projects:</strong> 2-3 solid GitHub projects beats 10 tutorials</li>
                <li>• <strong>Collaboration:</strong> Team projects, open-source contributions</li>
                <li>• <strong>Learning agility:</strong> Ability to pick up new frameworks quickly</li>
                <li>• <strong>Communication:</strong> Can explain technical concepts clearly</li>
              </ul>
            </div>
          </section>

          <section id="top-companies" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Companies Hiring Fresh Grads</h2>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaBriefcase className="w-6 h-6" />
                Top US Companies for Entry-Level SWE (2025)
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">1. Google (New Grad Program)</h4>
                    <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">Hiring Now</span>
                  </div>
                  <p className="text-blue-100 mb-2">TC: $140K - $180K • Locations: Mountain View, NYC, Seattle</p>
                  <p className="text-sm text-blue-100">Application Timeline: Aug-Oct for next year start</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">2. Microsoft (University Recruiting)</h4>
                    <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">Open</span>
                  </div>
                  <p className="text-blue-100 mb-2">TC: $130K - $160K • Locations: Redmond, Austin, NYC</p>
                  <p className="text-sm text-blue-100">Strong internship-to-fulltime pipeline</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">3. Amazon (SDE I New Grad)</h4>
                  <p className="text-blue-100 mb-2">TC: $120K - $150K • Locations: Seattle, Austin, Multiple</p>
                  <p className="text-sm text-blue-100">Highest volume of entry-level hires</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">4. Meta (Rotational Engineer)</h4>
                  <p className="text-blue-100 mb-2">TC: $135K - $175K • Locations: Menlo Park, NYC, Seattle</p>
                  <p className="text-sm text-blue-100">6-month rotational program</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">5. Palantir Technologies</h4>
                  <p className="text-blue-100 mb-2">TC: $140K - $170K • Locations: Palo Alto, Denver, NYC</p>
                  <p className="text-sm text-blue-100">Forward Deployed Engineer program</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="w-6 h-6" />
                Top UK Companies for Entry-Level SWE (2025)
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">1. Google UK (London)</h4>
                  <p className="text-indigo-100">£55K - £75K • Strong graduate program</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">2. Goldman Sachs (London, Birmingham)</h4>
                  <p className="text-indigo-100">£60K - £80K • Fintech focus</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">3. Deliveroo / Revolut</h4>
                  <p className="text-indigo-100">£45K - £60K • Fast-growing startups</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">4. ARM Holdings (Cambridge)</h4>
                  <p className="text-indigo-100">£40K - £55K • Hardware/software</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">5. Monzo / Starling Bank</h4>
                  <p className="text-indigo-100">£45K - £60K • Digital banking</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-4">Startup & Scale-up Opportunities</h3>
              <p className="text-gray-700 mb-4">
                Don't overlook startups! They often offer:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Equity compensation (0.1% - 1% for early engineers)</li>
                <li>• Faster learning curve and responsibility</li>
                <li>• More flexible tech stack and modern practices</li>
                <li>• Easier to get interview opportunities</li>
              </ul>
            </div>
          </section>

          <section id="salary-guide" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Salary Expectations US vs UK</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaDollarSign className="w-8 h-8 text-blue-600" />
                  <h3 className="font-bold text-blue-900 text-xl">United States</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Big Tech (FAANG)</p>
                    <p className="text-2xl font-bold text-blue-600">$120K - $180K</p>
                    <p className="text-xs text-gray-500">Total Compensation (Base + Stock + Bonus)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mid-size Tech Companies</p>
                    <p className="text-2xl font-bold text-blue-600">$90K - $130K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Startups (Series A-C)</p>
                    <p className="text-2xl font-bold text-blue-600">$80K - $110K</p>
                    <p className="text-xs text-gray-500">+ Equity (0.1% - 0.5%)</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-semibold text-gray-700">Top Paying Cities:</p>
                    <ul className="text-sm text-gray-600 mt-2">
                      <li>• San Francisco Bay Area: +25% average</li>
                      <li>• Seattle: +15% average</li>
                      <li>• NYC: +10% average</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-green-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaDollarSign className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-green-900 text-xl">United Kingdom</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Big Tech (FAANG UK)</p>
                    <p className="text-2xl font-bold text-green-600">£50K - £75K</p>
                    <p className="text-xs text-gray-500">Base + Bonus</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Financial Services</p>
                    <p className="text-2xl font-bold text-green-600">£45K - £65K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Startups & Scale-ups</p>
                    <p className="text-2xl font-bold text-green-600">£35K - £50K</p>
                    <p className="text-xs text-gray-500">+ Equity options</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-semibold text-gray-700">Top Paying Cities:</p>
                    <ul className="text-sm text-gray-600 mt-2">
                      <li>• London: +20% average</li>
                      <li>• Cambridge: +10% average</li>
                      <li>• Manchester: Regional average</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3">💡 Salary Negotiation Tips for New Grads</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Always negotiate - companies expect it and budget 5-15% flexibility</li>
                <li>• Research using Levels.fyi, Glassdoor, Blind for accurate data</li>
                <li>• Focus on total compensation, not just base salary</li>
                <li>• If you have competing offers, mention it (without being aggressive)</li>
                <li>• Ask for signing bonus if base salary can't move</li>
              </ul>
            </div>
          </section>

          <section id="required-skills" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Essential Skills & Technologies</h2>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-purple-900 mb-4">Core Programming Languages (Pick 1-2)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Python</h4>
                  <p className="text-sm text-gray-600">Most in-demand for AI/ML, data, backend</p>
                  <p className="text-xs text-purple-600 mt-2">Demand: ★★★★★ (Very High)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">JavaScript/TypeScript</h4>
                  <p className="text-sm text-gray-600">Essential for web development (React, Node.js)</p>
                  <p className="text-xs text-purple-600 mt-2">Demand: ★★★★★ (Very High)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Java</h4>
                  <p className="text-sm text-gray-600">Enterprise, Android, backend systems</p>
                  <p className="text-xs text-purple-600 mt-2">Demand: ★★★★☆ (High)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Go/Rust</h4>
                  <p className="text-sm text-gray-600">Systems programming, cloud infrastructure</p>
                  <p className="text-xs text-purple-600 mt-2">Demand: ★★★☆☆ (Growing)</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-900 mb-4">Must-Have Technical Skills</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">1. Data Structures & Algorithms</h4>
                  <p className="text-sm text-gray-700">Arrays, LinkedLists, Trees, Graphs, Sorting, Searching</p>
                  <p className="text-xs text-green-600 mt-1">Practice: LeetCode Easy/Medium (75 problems minimum)</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">2. Web Development Fundamentals</h4>
                  <p className="text-sm text-gray-700">HTML, CSS, JavaScript, REST APIs, HTTP</p>
                  <p className="text-xs text-green-600 mt-1">Build: 2-3 full-stack projects</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">3. Version Control (Git)</h4>
                  <p className="text-sm text-gray-700">Branching, merging, pull requests, collaboration</p>
                  <p className="text-xs text-green-600 mt-1">Must: Active GitHub with clean commit history</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">4. Database Knowledge</h4>
                  <p className="text-sm text-gray-700">SQL (PostgreSQL/MySQL), NoSQL (MongoDB) basics</p>
                  <p className="text-xs text-green-600 mt-1">Learn: CRUD operations, joins, indexing</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">5. Cloud Basics (Optional but Strong Plus)</h4>
                  <p className="text-sm text-gray-700">AWS/GCP/Azure fundamentals, Docker basics</p>
                  <p className="text-xs text-green-600 mt-1">Certifications: AWS Cloud Practitioner adds value</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-bold text-orange-900 mb-4">2025 Hot Skills (Competitive Advantage)</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold text-orange-800">• AI/ML Fundamentals</p>
                  <p className="text-sm">LangChain, OpenAI API, prompt engineering</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">• React/Next.js</p>
                  <p className="text-sm">Modern frontend frameworks</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">• Mobile Development</p>
                  <p className="text-sm">React Native, Flutter</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">• DevOps Basics</p>
                  <p className="text-sm">CI/CD, Docker, Kubernetes</p>
                </div>
              </div>
            </div>
          </section>

          <section id="application-strategy" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Application Strategy That Works</h2>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">📈 The Numbers Game Strategy</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2">100+</p>
                  <p className="text-blue-100">Applications submitted</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2">10-15</p>
                  <p className="text-blue-100">Phone screens expected</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2">2-3</p>
                  <p className="text-blue-100">Offers (if prepared well)</p>
                </div>
              </div>
              <p className="mt-4 text-blue-100 text-sm">
                Reality: Entry-level has ~5-10% response rate. Volume + quality is key.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-green-900 mb-3">Step 1: Build Your Foundation (Before Applying)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Polish LinkedIn profile (use keywords: Software Engineer, Full-stack Developer)</li>
                  <li>✓ Create ATS-friendly resume (use HireLift's free checker)</li>
                  <li>✓ Build 2-3 portfolio projects (deploy them live)</li>
                  <li>✓ Contribute to 1-2 open-source projects</li>
                  <li>✓ Solve 50+ LeetCode problems (focus on Easy/Medium)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-blue-900 mb-3">Step 2: Strategic Application Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Apply to company career pages directly (better than job boards)</li>
                  <li>✓ Get referrals through LinkedIn (cold message alumni, 2nd connections)</li>
                  <li>✓ Attend virtual career fairs and university recruiting events</li>
                  <li>✓ Use HireLift to find HR contacts and send personalized emails</li>
                  <li>✓ Apply early in posting (first 24-48 hours = highest response rate)</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-purple-900 mb-3">Step 3: Follow-up & Networking</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Follow up 1 week after applying (polite email to recruiter)</li>
                  <li>✓ Connect with recruiters on LinkedIn after applying</li>
                  <li>✓ Engage with company content (comment on posts)</li>
                  <li>✓ Join Discord/Slack communities for your target companies</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="interview-prep" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Interview Prep for Beginners</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-orange-900 mb-4">6-Week Preparation Plan</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4">
                  <p className="font-semibold text-orange-800">Weeks 1-2: Data Structures Foundation</p>
                  <p className="text-sm text-gray-700">Focus: Arrays, Strings, HashMaps, LinkedLists</p>
                  <p className="text-xs text-orange-600">Practice: 3 problems daily (LeetCode Easy)</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <p className="font-semibold text-orange-800">Weeks 3-4: Algorithms & Problem Patterns</p>
                  <p className="text-sm text-gray-700">Focus: Two pointers, Sliding window, BFS/DFS</p>
                  <p className="text-xs text-orange-600">Practice: 2 Easy + 1 Medium daily</p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <p className="font-semibold text-orange-800">Weeks 5-6: Mock Interviews & Behavioral</p>
                  <p className="text-sm text-gray-700">Focus: Timed practice, explain your thinking aloud</p>
                  <p className="text-xs text-orange-600">Practice: 2 mock interviews per week + STAR stories</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready to Launch Your Career?</h3>
              <p className="text-lg mb-6">
                Get your resume reviewed by experts who've helped 1000+ fresh graduates land jobs at top tech companies.
              </p>
              <Link href="/audit" className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50">
                Free Resume Review →
              </Link>
            </div>
          </section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FaGraduationCap className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fresh Graduate Success Team</h3>
              <p className="text-gray-600 mb-4">
                Career advisors with 10+ years helping computer science graduates land their first tech jobs. We've placed 3,000+ entry-level engineers at top companies.
              </p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">More Career Guides</Link>
                <Link href="/company-search" className="text-green-600 hover:underline">Find Companies Hiring</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      <RelatedArticles currentSlug="entry-level-software-engineer-jobs-2025" category="Entry-Level Jobs" />
    </div>
  );
}
