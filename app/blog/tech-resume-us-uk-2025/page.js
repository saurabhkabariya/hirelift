'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaFileAlt, FaCheck, FaTimes } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function TechResumeUSUK2025() {
  const toc = [
    { id: "us-vs-uk", title: "US vs UK Resume Differences" },
    { id: "ats-keywords", title: "ATS Keywords for Tech Roles" },
    { id: "format-guide", title: "Perfect Resume Format" },
    { id: "experience-section", title: "Writing Impact Statements" },
    { id: "skills-section", title: "Skills Section Best Practices" },
    { id: "common-mistakes", title: "Mistakes to Avoid" }
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
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">Resume Guide 2025</span>
            <span className="text-gray-500">Tech Careers</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tech Resume for US & UK Markets 2025: ATS-Optimized Format & Keywords
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create a perfect software engineer resume that passes ATS and impresses hiring managers. Learn format differences, essential keywords, and proven templates for US/UK tech companies.
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />Resume Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />16 min read</span>
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
            {toc.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {index + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose prose-lg max-w-none">
          
          <section id="us-vs-uk" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">US vs UK Resume Differences</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 text-xl mb-4 flex items-center gap-2">
                  <FaFileAlt className="w-5 h-5" />
                  US Tech Resume (2025)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Length:</strong> 1 page (0-5 yrs), 2 pages (5+ yrs)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Title:</strong> "Resume" or no title</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Photo:</strong> Never include</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Personal Info:</strong> No age, marital status, photo</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Focus:</strong> Impact metrics, achievements, quantifiable results</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Format:</strong> Reverse chronological preferred</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <h3 className="font-bold text-green-900 text-xl mb-4 flex items-center gap-2">
                  <FaFileAlt className="w-5 h-5" />
                  UK Tech CV (2025)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Length:</strong> 2 pages standard (can be longer)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Title:</strong> "Curriculum Vitae" or "CV"</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Photo:</strong> Optional (not common in tech)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Personal Info:</strong> More acceptable than US</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>Focus:</strong> Detailed responsibilities + achievements</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <p><strong>References:</strong> "Available upon request" acceptable</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="ats-keywords" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ATS Keywords for Tech Roles</h2>
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">🎯 Essential Keywords by Role</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-bold mb-2">Full-Stack Developer</h4>
                    <p className="text-sm text-purple-100">React, Node.js, JavaScript, TypeScript, REST API, MongoDB, PostgreSQL, Git, Agile, CI/CD, Docker</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-bold mb-2">Backend Engineer</h4>
                    <p className="text-sm text-purple-100">Python, Java, Go, Microservices, SQL, NoSQL, AWS, System Design, API Development, Performance Optimization</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-bold mb-2">Frontend Developer</h4>
                    <p className="text-sm text-purple-100">React, Vue, Angular, Next.js, HTML5, CSS3, JavaScript, Responsive Design, UI/UX, Webpack, Testing</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-bold mb-2">DevOps Engineer</h4>
                    <p className="text-sm text-purple-100">Kubernetes, Docker, AWS/GCP/Azure, Terraform, Jenkins, CI/CD, Linux, Monitoring, Ansible, Infrastructure as Code</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-bold mb-2">Data Engineer</h4>
                    <p className="text-sm text-purple-100">Python, SQL, Spark, Airflow, ETL, Data Warehousing, BigQuery, Snowflake, Data Pipeline, Kafka</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-bold mb-2">Mobile Developer</h4>
                    <p className="text-sm text-purple-100">React Native, Flutter, Swift, Kotlin, iOS, Android, Firebase, App Store, Play Store, Mobile UI</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="font-bold text-yellow-900 mb-3">💡 Keyword Optimization Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use exact phrases from job descriptions (e.g., "Full Stack" not "Full-Stack")</li>
                <li>• Include both acronyms and full terms (AWS and Amazon Web Services)</li>
                <li>• Place keywords in context, not just listed</li>
                <li>• Update keywords for each application (tailor to job posting)</li>
                <li>• Use industry-standard tool names (React not "Facebook's UI library")</li>
              </ul>
            </div>
          </section>

          <section id="format-guide" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Perfect Resume Format</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">Standard Section Order (US/UK)</h3>
              <ol className="space-y-2 text-blue-800">
                <li>1. <strong>Header:</strong> Name, Email, Phone, LinkedIn, GitHub, Location (City, State/Country)</li>
                <li>2. <strong>Summary/Profile:</strong> 2-3 lines (optional but recommended for senior roles)</li>
                <li>3. <strong>Experience:</strong> Most recent first, 3-5 bullet points each</li>
                <li>4. <strong>Projects:</strong> 2-3 significant projects (especially important for juniors)</li>
                <li>5. <strong>Skills:</strong> Categorized (Languages, Frameworks, Tools, Cloud)</li>
                <li>6. <strong>Education:</strong> Degree, University, Year, GPA (if 3.5+)</li>
                <li>7. <strong>Certifications:</strong> AWS, Google Cloud, etc. (if relevant)</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <FaCheck className="w-5 h-5" />
                  Do This
                </h3>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>✓ Use standard fonts (Arial, Calibri, Helvetica)</li>
                  <li>✓ Font size 10-12pt for body, 14-16pt for name</li>
                  <li>✓ 0.5-1 inch margins</li>
                  <li>✓ Consistent formatting throughout</li>
                  <li>✓ Save as .pdf (unless .docx requested)</li>
                  <li>✓ File name: FirstName_LastName_Resume.pdf</li>
                  <li>✓ Use bullet points for achievements</li>
                  <li>✓ Quantify results (improved by 40%, reduced by 2 hours)</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <FaTimes className="w-5 h-5" />
                  Avoid This
                </h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>✗ Creative templates with graphics/colors</li>
                  <li>✗ Tables for layout (ATS can't parse)</li>
                  <li>✗ Headers/footers for important info</li>
                  <li>✗ Uncommon fonts or font mixing</li>
                  <li>✗ Photos or headshots</li>
                  <li>✗ Personal pronouns (I, me, my)</li>
                  <li>✗ Spelling/grammar errors</li>
                  <li>✗ Generic objective statements</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="experience-section" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Writing Impact Statements</h2>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-purple-900 mb-4">The XYZ Formula (Google's Method)</h3>
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500 mb-4">
                <p className="font-mono text-sm text-gray-800 mb-2">
                  "Accomplished [X] as measured by [Y], by doing [Z]"
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">❌ Weak:</p>
                  <p className="text-gray-700">"Worked on backend API development"</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">✅ Strong:</p>
                  <p className="text-gray-700">"Developed 15 RESTful APIs serving 2M+ requests/day, reducing response time by 40% through database query optimization and Redis caching"</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">❌ Weak:</p>
                  <p className="text-gray-700">"Responsible for React frontend"</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">✅ Strong:</p>
                  <p className="text-gray-700">"Built responsive React dashboard used by 10K+ daily users, improving page load time by 60% using code splitting and lazy loading"</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-bold text-orange-900 mb-3">Action Verbs for Tech Resumes</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-orange-800 mb-2">Development:</p>
                  <p>Engineered, Developed, Built, Designed, Implemented, Created, Programmed</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800 mb-2">Improvement:</p>
                  <p>Optimized, Enhanced, Improved, Reduced, Increased, Streamlined, Accelerated</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800 mb-2">Leadership:</p>
                  <p>Led, Mentored, Coordinated, Collaborated, Spearheaded, Managed, Architected</p>
                </div>
              </div>
            </div>
          </section>

          <section id="skills-section" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills Section Best Practices</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">Categorized Skills Format (Recommended)</h3>
              <div className="bg-white rounded-lg p-5 space-y-3 font-mono text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Languages:</p>
                  <p className="text-gray-600">JavaScript, TypeScript, Python, Java, SQL</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Frontend:</p>
                  <p className="text-gray-600">React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Backend:</p>
                  <p className="text-gray-600">Node.js, Express, Django, FastAPI, GraphQL</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Database:</p>
                  <p className="text-gray-600">PostgreSQL, MongoDB, Redis, MySQL</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">DevOps/Cloud:</p>
                  <p className="text-gray-600">AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD, GitHub Actions</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Tools:</p>
                  <p className="text-gray-600">Git, VS Code, Jira, Figma, Postman</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="font-bold text-yellow-900 mb-3">⚠️ Skills Section Mistakes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Don't rate skills with stars/bars (subjective and wastes space)</li>
                <li>• Don't list every tool you've touched once (focus on proficient skills)</li>
                <li>• Don't include outdated tech (jQuery, Flash) unless job requires it</li>
                <li>• Don't mix soft skills with technical skills (put those in cover letter)</li>
                <li>• Don't lie about skills - you'll be tested in interviews</li>
              </ul>
            </div>
          </section>

          <section id="common-mistakes" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                <h3 className="font-bold text-red-800 mb-2">1. Using the Same Resume for Every Application</h3>
                <p className="text-gray-700">Tailor your resume for each job - match keywords and emphasize relevant experience. Takes 10 minutes, increases response rate by 300%.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                <h3 className="font-bold text-red-800 mb-2">2. Missing GitHub/Portfolio Links</h3>
                <p className="text-gray-700">For developers, your code is proof. Include GitHub with pinned repos and live project demos. Recruiters check 80% of the time.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                <h3 className="font-bold text-red-800 mb-2">3. Listing Responsibilities Instead of Achievements</h3>
                <p className="text-gray-700">"Managed database" → "Optimized database queries reducing response time by 65% and saving $50K/year in server costs"</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                <h3 className="font-bold text-red-800 mb-2">4. Poor Email Address</h3>
                <p className="text-gray-700">Use firstname.lastname@gmail.com, not coolcoder2000@yahoo.com. Professional email = professional impression.</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                <h3 className="font-bold text-red-800 mb-2">5. Employment Gaps Without Explanation</h3>
                <p className="text-gray-700">If you have gaps, briefly explain (freelance projects, learning new skills, personal projects). Honesty builds trust.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8 mt-8">
              <h3 className="text-2xl font-bold mb-4">🎯 Get Your Resume Reviewed by Experts</h3>
              <p className="text-lg mb-6">
                Use HireLift's free ATS checker to analyze your tech resume and get instant feedback on formatting, keywords, and impact statements.
              </p>
              <Link href="/audit" className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50">
                Free ATS Resume Check →
              </Link>
            </div>
          </section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Optimization Experts</h3>
              <p className="text-gray-600 mb-4">
                Former recruiters from Google, Amazon, and Microsoft who've reviewed 50,000+ tech resumes. We know what gets interviews.
              </p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">More Resume Tips</Link>
                <Link href="/audit" className="text-green-600 hover:underline">Professional Review</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      <RelatedArticles currentSlug="tech-resume-us-uk-2025" category="Resume Optimization" />
    </div>
  );
}
