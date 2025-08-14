'use client';

import { motion } from 'framer-motion';

export default function SEOContentSection() {
  return (
    <section className="py-20 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How to Optimize Your Resume for ATS Systems
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn the proven strategies that help professionals pass Applicant Tracking Systems and land more interviews
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Understanding ATS Score</h3>
            <p className="text-gray-700 mb-4">
              ATS (Applicant Tracking System) score determines if your resume reaches human recruiters. 
              Over 98% of Fortune 500 companies use ATS to filter resumes automatically.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Keywords matching job descriptions</li>
              <li>• Proper formatting and structure</li>
              <li>• Contact information placement</li>
              <li>• File format compatibility</li>
            </ul>
          </motion.article>

          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Resume Keywords Optimization</h3>
            <p className="text-gray-700 mb-4">
              Strategic keyword placement increases your ATS score by 65%. Our AI analyzes job descriptions 
              and identifies the most important keywords for your target role.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Industry-specific terminology</li>
              <li>• Technical skills matching</li>
              <li>• Action verbs optimization</li>
              <li>• Soft skills integration</li>
            </ul>
          </motion.article>

          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Direct HR Outreach Strategy</h3>
            <p className="text-gray-700 mb-4">
              Bypass the ATS entirely by connecting directly with hiring managers and HR professionals. 
              This strategy increases response rates by 300%.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• LinkedIn outreach templates</li>
              <li>• Email campaign strategies</li>
              <li>• Follow-up timing optimization</li>
              <li>• Relationship building techniques</li>
            </ul>
          </motion.article>

          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Application Best Practices</h3>
            <p className="text-gray-700 mb-4">
              Modern job applications require strategic timing, personalized approaches, and multi-channel 
              outreach to maximize success rates.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Optimal application timing</li>
              <li>• Cover letter customization</li>
              <li>• Portfolio presentation</li>
              <li>• Interview preparation</li>
            </ul>
          </motion.article>

          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Career Advancement Strategies</h3>
            <p className="text-gray-700 mb-4">
              Beyond just getting hired, learn how to position yourself for rapid career growth and 
              higher compensation in your target industry.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Skill gap analysis</li>
              <li>• Professional networking</li>
              <li>• Personal branding</li>
              <li>• Salary negotiation</li>
            </ul>
          </motion.article>

          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Interview Success Framework</h3>
            <p className="text-gray-700 mb-4">
              Transform interviews from stressful experiences into confident conversations using our 
              proven framework and practice templates.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• STAR method mastery</li>
              <li>• Technical question prep</li>
              <li>• Behavioral interview guide</li>
              <li>• Salary discussion tactics</li>
            </ul>
          </motion.article>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've used HireLift to optimize their resumes, 
            connect with HR managers, and land their dream jobs faster.
          </p>
        </div>
      </div>
    </section>
  );
}
