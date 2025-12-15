'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaCheckCircle, FaArrowLeft, FaCode, FaLightbulb, FaRocket } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function SoftwareEngineerInterviewGuide() {
  const tableOfContents = [
    { id: "faang-overview", title: "FAANG Interview Process 2025" },
    { id: "coding-questions", title: "Top 50 Coding Interview Questions" },
    { id: "system-design", title: "System Design Interview Guide" },
    { id: "behavioral", title: "Behavioral Interview Questions" },
    { id: "salary-negotiation", title: "Salary Negotiation Tips US/UK" },
    { id: "preparation-timeline", title: "3-Month Preparation Roadmap" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              Interview Prep 2025
            </span>
            <span className="text-gray-500">Featured Guide</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Software Engineer Interview Questions 2025: Complete FAANG Guide for US & UK
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master software engineering interviews at Google, Amazon, Meta, Apple, and Microsoft. 150+ questions, system design patterns, and insider tips from engineers who got offers at $200K+ TC.
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />Senior Engineers</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />22 min read</span>
              <span>Dec 15, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaShare className="w-4 h-4" />Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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
          
          <section id="faang-overview" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">FAANG Interview Process 2025</h2>
            <p className="text-gray-700 mb-6">
              Landing a software engineering role at FAANG companies (Facebook/Meta, Amazon, Apple, Netflix, Google) requires strategic preparation. The 2025 interview landscape has evolved with increased focus on system design, behavioral assessments, and real-world problem-solving.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                <h3 className="font-bold text-2xl mb-2">$185K - $350K</h3>
                <p className="text-blue-100">Average TC for SWE at FAANG (US)</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                <h3 className="font-bold text-2xl mb-2">£75K - £150K</h3>
                <p className="text-green-100">Average TC for SWE at FAANG (UK)</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaLightbulb className="text-yellow-600" />
                2025 Interview Trends
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>AI/ML Integration:</strong> 40% more questions on ML system design</li>
                <li>• <strong>Remote Assessment:</strong> Virtual whiteboarding and online coding platforms</li>
                <li>• <strong>Behavioral Focus:</strong> Leadership principles and cultural fit weighted 35%+</li>
                <li>• <strong>Live Coding:</strong> Real-time collaborative coding replacing take-home tests</li>
              </ul>
            </div>
          </section>

          <section id="coding-questions" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top 50 Coding Interview Questions</h2>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <FaCode className="w-5 h-5" />
                Array & String Manipulation (High Frequency)
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="border-l-4 border-purple-400 pl-4">
                  <p className="font-semibold">1. Two Sum (LeetCode Easy)</p>
                  <p className="text-sm text-gray-600">Asked at: Google, Amazon, Meta • Difficulty: Easy • Success Rate: 89%</p>
                  <p className="mt-2">Given an array of integers, return indices of two numbers that add up to target.</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <p className="font-semibold">2. Longest Substring Without Repeating Characters</p>
                  <p className="text-sm text-gray-600">Asked at: Amazon, Microsoft • Difficulty: Medium • Success Rate: 72%</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <p className="font-semibold">3. Container With Most Water</p>
                  <p className="text-sm text-gray-600">Asked at: Google, Meta • Difficulty: Medium • Success Rate: 68%</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">Linked Lists & Trees (FAANG Favorites)</h3>
              <div className="space-y-3 text-gray-700">
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="font-semibold">4. Reverse Linked List</p>
                  <p className="text-sm text-gray-600">Asked at: All FAANG • Difficulty: Easy • Must-Know</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="font-semibold">5. Binary Tree Maximum Path Sum</p>
                  <p className="text-sm text-gray-600">Asked at: Google, Amazon • Difficulty: Hard • Success Rate: 45%</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="font-semibold">6. Validate Binary Search Tree</p>
                  <p className="text-sm text-gray-600">Asked at: Meta, Microsoft • Difficulty: Medium • Success Rate: 65%</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-900 mb-4">Dynamic Programming (High Value)</h3>
              <div className="space-y-3 text-gray-700">
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="font-semibold">7. Climbing Stairs (Entry DP)</p>
                  <p className="text-sm text-gray-600">Asked at: Google, Amazon • Difficulty: Easy • DP Foundation</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="font-semibold">8. Coin Change</p>
                  <p className="text-sm text-gray-600">Asked at: Meta, Amazon • Difficulty: Medium • Success Rate: 58%</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="font-semibold">9. Longest Increasing Subsequence</p>
                  <p className="text-sm text-gray-600">Asked at: Google, Microsoft • Difficulty: Medium • Success Rate: 52%</p>
                </div>
              </div>
            </div>
          </section>

          <section id="system-design" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">System Design Interview Guide</h2>
            <p className="text-gray-700 mb-6">
              System design interviews are critical for senior roles (L4+ at Google, SDE2+ at Amazon). Expected for candidates with 2+ years experience in US/UK markets.
            </p>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">🏗️ Most Asked System Design Questions 2025</h3>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="font-semibold">1. Design YouTube / Video Streaming Platform</p>
                  <p className="text-sm text-indigo-100">Focus: CDN, video encoding, recommendation systems</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="font-semibold">2. Design URL Shortener (like Bit.ly)</p>
                  <p className="text-sm text-indigo-100">Focus: Hash functions, database sharding, rate limiting</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="font-semibold">3. Design Instagram / Social Media Feed</p>
                  <p className="text-sm text-indigo-100">Focus: News feed algorithm, caching, scalability</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="font-semibold">4. Design Uber / Ride-Sharing App</p>
                  <p className="text-sm text-indigo-100">Focus: Geolocation, matching algorithm, real-time updates</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">System Design Framework (RESHADED)</h3>
              <ol className="space-y-2 text-blue-800">
                <li><strong>R</strong> - Requirements (Functional & Non-functional)</li>
                <li><strong>E</strong> - Estimation (Traffic, Storage, Bandwidth)</li>
                <li><strong>S</strong> - System Interface (API Design)</li>
                <li><strong>H</strong> - High-level Design (Architecture diagram)</li>
                <li><strong>A</strong> - API & Database Schema</li>
                <li><strong>D</strong> - Deep Dive (Specific components)</li>
                <li><strong>E</strong> - Edge Cases & Trade-offs</li>
                <li><strong>D</strong> - Discussion (Scale, Reliability, Security)</li>
              </ol>
            </div>
          </section>

          <section id="behavioral" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Behavioral Interview Questions</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-orange-900 mb-4">Amazon Leadership Principles (Most Common)</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-orange-800">1. Tell me about a time you failed</p>
                  <p className="text-sm mt-1">Framework: STAR (Situation, Task, Action, Result) • Show growth mindset</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">2. Describe a time you disagreed with a team member</p>
                  <p className="text-sm mt-1">Focus: Have Backbone; Disagree and Commit principle</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800">3. Tell me about your most challenging project</p>
                  <p className="text-sm mt-1">Highlight: Ownership, Dive Deep, Deliver Results</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-purple-900 mb-4">Google's Googleyness & Leadership</h3>
              <ul className="space-y-2 text-purple-800">
                <li>• How do you handle ambiguity in project requirements?</li>
                <li>• Describe a time you helped a struggling teammate</li>
                <li>• Tell me about an innovative solution you created</li>
                <li>• How do you prioritize when everything is urgent?</li>
              </ul>
            </div>
          </section>

          <section id="salary-negotiation" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Salary Negotiation Tips US/UK</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border-2 border-green-300 rounded-lg p-6">
                <h3 className="font-bold text-green-800 mb-4">🇺🇸 US Market (2025)</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Junior SWE (0-2 yrs)</p>
                    <p className="text-lg text-green-600">$95K - $140K TC</p>
                  </div>
                  <div>
                    <p className="font-semibold">Mid-Level SWE (3-5 yrs)</p>
                    <p className="text-lg text-green-600">$150K - $220K TC</p>
                  </div>
                  <div>
                    <p className="font-semibold">Senior SWE (5+ yrs)</p>
                    <p className="text-lg text-green-600">$200K - $400K TC</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
                <h3 className="font-bold text-blue-800 mb-4">🇬🇧 UK Market (2025)</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Junior SWE (0-2 yrs)</p>
                    <p className="text-lg text-blue-600">£35K - £55K</p>
                  </div>
                  <div>
                    <p className="font-semibold">Mid-Level SWE (3-5 yrs)</p>
                    <p className="text-lg text-blue-600">£60K - £95K</p>
                  </div>
                  <div>
                    <p className="font-semibold">Senior SWE (5+ yrs)</p>
                    <p className="text-lg text-blue-600">£90K - £160K</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="font-bold text-green-900 mb-3">Negotiation Scripts That Work</h3>
              <div className="space-y-3 text-gray-700">
                <p className="italic">"I'm excited about this opportunity. Based on my research and experience with [specific skills], I was expecting a total compensation in the range of $X to $Y. Can we explore options to get closer to that range?"</p>
                <p className="italic">"I have another offer at $X. Your company is my top choice because [specific reasons]. Is there flexibility in the compensation package?"</p>
              </div>
            </div>
          </section>

          <section id="preparation-timeline" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3-Month Preparation Roadmap</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-red-900 mb-3">Month 1: Foundations</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Week 1-2: Data structures (Arrays, LinkedLists, Trees, Graphs)</li>
                  <li>• Week 3-4: Algorithms (Sorting, Searching, DFS, BFS)</li>
                  <li>• Daily: Solve 2-3 easy LeetCode problems</li>
                  <li>• Resources: NeetCode 150, Blind 75</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-green-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-yellow-900 mb-3">Month 2: Advanced Topics</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Week 1-2: Dynamic Programming, Greedy Algorithms</li>
                  <li>• Week 3-4: System Design basics (Grokking System Design)</li>
                  <li>• Daily: 2 medium + 1 hard problem</li>
                  <li>• Mock interviews: 2 per week</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-blue-900 mb-3">Month 3: Interview Simulation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Week 1-2: Company-specific questions (Google, Amazon, etc.)</li>
                  <li>• Week 3-4: Full mock interviews, behavioral prep</li>
                  <li>• Daily: Review mistakes, optimize solutions</li>
                  <li>• Apply to companies, schedule interviews</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8 mt-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaRocket className="w-6 h-6" />
                Start Your FAANG Journey Today
              </h3>
              <p className="text-lg mb-6">
                Get personalized resume review and interview preparation guidance from engineers who cracked FAANG interviews.
              </p>
              <Link href="/audit" className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50">
                Get Free Resume Review →
              </Link>
            </div>
          </section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Senior Engineering Team</h3>
              <p className="text-gray-600 mb-4">
                Written by engineers from Google, Meta, and Amazon with 50+ combined years of interviewing experience. We've helped 5,000+ candidates land FAANG offers.
              </p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">More Guides</Link>
                <Link href="/audit" className="text-green-600 hover:underline">Free Prep Assessment</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      <RelatedArticles currentSlug="software-engineer-interview-questions-2025" category="Interview Prep" />
    </div>
  );
}
