'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaGlobe, FaLaptop, FaChartLine } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function RemoteDeveloperJobs2025() {
  const tableOfContents = [
    { id: "market-overview", title: "Remote Developer Market 2025" },
    { id: "top-companies", title: "Companies Hiring Remote Developers" },
    { id: "salary-ranges", title: "Remote Developer Salaries" },
    { id: "job-boards", title: "Best Remote Job Boards" },
    { id: "skills-demand", title: "Most In-Demand Skills" },
    { id: "application-tips", title: "How to Land Remote Jobs" }
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
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Remote Jobs 2025
            </span>
            <span className="text-gray-500">Work From Anywhere</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Remote Developer Jobs 2025: $100K-$200K Opportunities for US & UK Developers
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover 500+ companies hiring remote developers worldwide. Learn salary expectations, best job boards, required skills, and proven strategies to land high-paying work-from-anywhere positions.
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />Remote Work Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />20 min read</span>
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
          
          <section id="market-overview" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Remote Developer Market 2025</h2>
            <p className="text-gray-700 mb-6">
              The remote work revolution has permanently transformed software development. In 2025, 78% of tech companies offer fully remote positions, with competitive salaries matching or exceeding on-site roles.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
                <FaGlobe className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">350K+</h3>
                <p className="text-blue-100">Remote dev jobs globally</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
                <FaLaptop className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">68%</h3>
                <p className="text-green-100">Companies now remote-first</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
                <FaChartLine className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">$140K</h3>
                <p className="text-purple-100">Avg remote dev salary (US)</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Why Remote Developer Jobs Are Booming in 2025</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Global Talent Pool:</strong> Companies can hire best talent anywhere</li>
                <li>• <strong>Cost Savings:</strong> No office = bigger salaries and benefits</li>
                <li>• <strong>Productivity Proven:</strong> Remote devs 22% more productive (2024 studies)</li>
                <li>• <strong>AI Tools:</strong> GitHub Copilot, ChatGPT make async collaboration seamless</li>
                <li>• <strong>Developer Preference:</strong> 91% of developers want remote/hybrid options</li>
              </ul>
            </div>
          </section>

          <section id="top-companies" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Companies Hiring Remote Developers</h2>
            
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6">🌎 Fully Remote Tech Companies (Hiring Globally)</h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">1. GitLab</h4>
                    <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">All-Remote</span>
                  </div>
                  <p className="text-indigo-100 mb-2">$120K - $220K USD • 1,500+ employees, 65+ countries</p>
                  <p className="text-sm text-indigo-100">Roles: Full-stack, Backend, DevOps, Security Engineers</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">2. Automattic (WordPress)</h4>
                  <p className="text-indigo-100 mb-2">$90K - $180K USD • Work from anywhere</p>
                  <p className="text-sm text-indigo-100">Roles: JavaScript, PHP, React, Mobile Engineers</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">3. Toptal</h4>
                  <p className="text-indigo-100 mb-2">$60-$200/hour • Freelance platform for top 3%</p>
                  <p className="text-sm text-indigo-100">Selective: Must pass technical screening</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">4. Zapier</h4>
                  <p className="text-indigo-100 mb-2">$130K - $200K USD • 100% remote since 2011</p>
                  <p className="text-sm text-indigo-100">Roles: Full-stack, Backend, Platform Engineers</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-2">5. Doist (Todoist, Twist)</h4>
                  <p className="text-indigo-100 mb-2">$80K - $150K USD • Async-first culture</p>
                  <p className="text-sm text-indigo-100">Roles: Mobile, Web, Backend Engineers</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6">🏢 FAANG & Big Tech (Remote Options)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Meta (Facebook)</h4>
                  <p className="text-sm text-blue-100">Remote for certain roles • Adjusted salary by location</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Amazon (AWS)</h4>
                  <p className="text-sm text-blue-100">Hybrid/Remote for senior engineers • Growing remote teams</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Microsoft</h4>
                  <p className="text-sm text-blue-100">Flexible remote policy • Many remote-eligible roles</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Salesforce</h4>
                  <p className="text-sm text-blue-100">"Digital First" policy • Remote anywhere in US/UK</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-4">Fast-Growing Remote-First Startups</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                <li>• <strong>Notion</strong> - Productivity software</li>
                <li>• <strong>Linear</strong> - Project management</li>
                <li>• <strong>Vercel</strong> - Frontend cloud platform</li>
                <li>• <strong>Supabase</strong> - Open-source Firebase alternative</li>
                <li>• <strong>Cal.com</strong> - Scheduling infrastructure</li>
                <li>• <strong>Railway</strong> - Infrastructure platform</li>
              </ul>
            </div>
          </section>

          <section id="salary-ranges" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Remote Developer Salaries 2025</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">💰 Salary by Experience Level (US-based remote)</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Junior Developer (0-2 years)</h4>
                    <span className="text-2xl font-bold text-blue-600">$80K - $120K</span>
                  </div>
                  <p className="text-sm text-gray-600">Common roles: Junior Full-stack, Frontend, Backend</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Mid-Level Developer (3-5 years)</h4>
                    <span className="text-2xl font-bold text-green-600">$110K - $170K</span>
                  </div>
                  <p className="text-sm text-gray-600">Most common remote dev positions</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Senior Developer (5-10 years)</h4>
                    <span className="text-2xl font-bold text-purple-600">$150K - $250K</span>
                  </div>
                  <p className="text-sm text-gray-600">High demand for remote senior engineers</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Staff/Principal (10+ years)</h4>
                    <span className="text-2xl font-bold text-red-600">$200K - $400K</span>
                  </div>
                  <p className="text-sm text-gray-600">Architecture, technical leadership roles</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-900 mb-4">🇬🇧 UK Remote Developer Salaries</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Junior (0-2 yrs)</p>
                  <p className="text-2xl font-bold text-green-600">£35K - £55K</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Mid-Level (3-5 yrs)</p>
                  <p className="text-2xl font-bold text-green-600">£55K - £85K</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Senior (5-10 yrs)</p>
                  <p className="text-2xl font-bold text-green-600">£75K - £120K</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Lead/Principal (10+ yrs)</p>
                  <p className="text-2xl font-bold text-green-600">£100K - £180K</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Note: London-based remote roles often pay 10-15% more than regional positions
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-purple-900 mb-4">💡 Salary Factors for Remote Developers</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Location-based vs Global pay:</strong> Some companies adjust salary by your location, others pay the same worldwide</li>
                <li>• <strong>Time zone requirements:</strong> Overlap with company HQ = higher pay</li>
                <li>• <strong>Specialized skills:</strong> AI/ML, blockchain, security = 20-40% premium</li>
                <li>• <strong>Contract vs Full-time:</strong> Contractors can earn 30-50% more hourly but no benefits</li>
              </ul>
            </div>
          </section>

          <section id="job-boards" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Remote Job Boards 2025</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl text-blue-900">1. We Work Remotely</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Top Pick</span>
                </div>
                <p className="text-gray-700 mb-2">Largest remote job board with 3M+ visitors monthly</p>
                <p className="text-sm text-blue-600">→ weworkremotely.com • Free to browse • Quality roles</p>
              </div>

              <div className="bg-white border-2 border-green-300 rounded-lg p-6">
                <h3 className="font-bold text-xl text-green-900 mb-2">2. Remote.co</h3>
                <p className="text-gray-700 mb-2">Curated remote jobs + company profiles</p>
                <p className="text-sm text-green-600">→ remote.co • Verified companies • Good filters</p>
              </div>

              <div className="bg-white border-2 border-purple-300 rounded-lg p-6">
                <h3 className="font-bold text-xl text-purple-900 mb-2">3. RemoteOK</h3>
                <p className="text-gray-700 mb-2">50K+ remote jobs, aggregated from multiple sources</p>
                <p className="text-sm text-purple-600">→ remoteok.com • Salary transparency • Tags & filters</p>
              </div>

              <div className="bg-white border-2 border-orange-300 rounded-lg p-6">
                <h3 className="font-bold text-xl text-orange-900 mb-2">4. FlexJobs</h3>
                <p className="text-gray-700 mb-2">Vetted remote & flexible jobs (paid subscription)</p>
                <p className="text-sm text-orange-600">→ flexjobs.com • $14.95/mo • Scam-free guarantee</p>
              </div>

              <div className="bg-white border-2 border-pink-300 rounded-lg p-6">
                <h3 className="font-bold text-xl text-pink-900 mb-2">5. AngelList (Wellfound)</h3>
                <p className="text-gray-700 mb-2">Startup remote jobs + equity information</p>
                <p className="text-sm text-pink-600">→ wellfound.com • See salary ranges • Direct to founders</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">🔥 Pro Tip: Hidden Remote Job Sources</h3>
              <ul className="space-y-2 text-cyan-50">
                <li>• Company career pages (search "remote" in job title)</li>
                <li>• LinkedIn Jobs (filter by "Remote" location)</li>
                <li>• Twitter: Follow @RemoteOK, @remotejobs, @remoteco</li>
                <li>• Slack communities: RemoteWorking.io, Tech Ladies</li>
                <li>• HackerNews "Who's Hiring" threads (monthly)</li>
              </ul>
            </div>
          </section>

          <section id="skills-demand" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Most In-Demand Skills for Remote Developers</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-orange-900 mb-4">🔥 Hottest Tech Stacks (2025)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Full-Stack JavaScript</h4>
                  <p className="text-sm text-gray-700">React/Next.js + Node.js/Express</p>
                  <p className="text-xs text-orange-600 mt-1">Demand: ★★★★★ • Avg Salary: $130K</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Python Full-Stack</h4>
                  <p className="text-sm text-gray-700">Django/FastAPI + React</p>
                  <p className="text-xs text-blue-600 mt-1">Demand: ★★★★★ • Avg Salary: $135K</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Cloud Native (DevOps)</h4>
                  <p className="text-sm text-gray-700">AWS/GCP + Docker + Kubernetes</p>
                  <p className="text-xs text-green-600 mt-1">Demand: ★★★★★ • Avg Salary: $150K</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">AI/ML Engineering</h4>
                  <p className="text-sm text-gray-700">Python + TensorFlow/PyTorch + LLMs</p>
                  <p className="text-xs text-purple-600 mt-1">Demand: ★★★★★ • Avg Salary: $160K+</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4">Essential Remote Work Skills (Beyond Coding)</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Async Communication:</strong> Clear writing, documentation, Slack/Discord etiquette</li>
                <li>• <strong>Self-Management:</strong> Time tracking, productivity without supervision</li>
                <li>• <strong>Video Communication:</strong> Professional presence in Zoom/Google Meet</li>
                <li>• <strong>Git Collaboration:</strong> Clean PRs, code reviews, version control best practices</li>
                <li>• <strong>Remote Tools:</strong> Figma, Notion, Linear, GitHub, Loom</li>
              </ul>
            </div>
          </section>

          <section id="application-tips" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Land Remote Developer Jobs</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-green-900 mb-3">1. Optimize Your Remote-Ready Resume</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Add "Remote Work Experience" section (even if freelance)</li>
                  <li>✓ Highlight async communication skills & timezone flexibility</li>
                  <li>✓ Include remote collaboration tools (Slack, Zoom, GitHub)</li>
                  <li>✓ Mention home office setup (shows you're prepared)</li>
                  <li>✓ Use HireLift's ATS checker for remote job keywords</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-blue-900 mb-3">2. Build a Strong Remote Portfolio</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Create live deployed projects (not just GitHub repos)</li>
                  <li>✓ Write technical blog posts (shows communication skills)</li>
                  <li>✓ Contribute to open-source (proves collaboration ability)</li>
                  <li>✓ Record Loom videos explaining your code (async demo)</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-purple-900 mb-3">3. Network in Remote Communities</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Join remote-first Slack/Discord groups</li>
                  <li>✓ Attend virtual conferences & meetups</li>
                  <li>✓ Engage with remote companies on Twitter/LinkedIn</li>
                  <li>✓ Build relationships before applying</li>
                </ul>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-orange-900 mb-3">4. Ace the Remote Interview</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Test tech setup beforehand (camera, mic, internet)</li>
                  <li>✓ Professional background & lighting</li>
                  <li>✓ Prepare examples of remote collaboration success</li>
                  <li>✓ Ask about team timezone overlap & communication norms</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8 mt-8">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready for Your Remote Career?</h3>
              <p className="text-lg mb-6">
                Get your resume optimized for remote positions and discover companies hiring developers worldwide.
              </p>
              <div className="flex gap-4">
                <Link href="/audit" className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50">
                  Free Resume Review →
                </Link>
                <Link href="/company-search" className="inline-block px-8 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-lg hover:bg-white/20 border border-white/30">
                  Find Remote Companies →
                </Link>
              </div>
            </div>
          </section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaGlobe className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remote Work Specialists</h3>
              <p className="text-gray-600 mb-4">
                Written by developers who've worked remotely for 10+ years at companies like GitLab, Automattic, and Zapier. We've helped 2,000+ developers transition to remote careers.
              </p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">More Remote Guides</Link>
                <Link href="/pricing" className="text-green-600 hover:underline">Premium Job Matching</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      <RelatedArticles currentSlug="remote-developer-jobs-2025" category="Remote Work" />
    </div>
  );
}
