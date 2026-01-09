'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

export default function FeatureCardsSection({ handleRedirect }) {
  const features = [
    {
      title: "Turn Your Resume into an Interview Magnet",
      subtitle: "AI-powered ATS Resume Review",
      description: "Get an instant ATS score and see exactly why recruiters are skipping your resume. HireLift guides you step-by-step to fix weak sections, missing keywords, and formatting issues - so your resume actually gets shortlisted, not ignored.",
      bgColor: "from-green-400 to-emerald-500",
      image: "/resume_review.webp",
      link: "/audit"
    },
    {
      title: "Reach Recruiters Who Are Actually Hiring",
      subtitle: "Direct HR access",
      description: "Stop applying into black holes. Get access to 100+ verified HR contacts and curated job openings. Connect directly with hiring managers who are actively looking for fresh talent - no middlemen, no guessing.",
      bgColor: "from-blue-600 to-indigo-700",
      image: "/hr_directory.webp",
      link: "/company-search"
    },
    {
      title: "Apply to Jobs That Don’t Ghost You",
      subtitle: "Fresh Verified Job Listings",  
      description: "Tired of waiting for replies? Apply to fresh, verified job listings updated regularly. More real opportunities, more responses, more interview calls without paying a rupee.",
      bgColor: "from-green-400 to-teal-500",
      image: "/free_jobs.webp",
      link: "/jobs"
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Everything You Need to Go From <span className='text-red-400'> 'Applicant' </span> to <span className='text-green-400'> 'Hired' </span>
          </h2>
        </motion.div>

        {/* Feature Cards */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 md:p-12 text-white overflow-hidden relative`}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <div className="text-sm font-semibold mb-2 opacity-90">
                    {feature.subtitle}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-lg leading-relaxed mb-8 text-white/90">
                    {feature.description}
                  </p>
                  <button 
                    onClick={() => handleRedirect(feature.link)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span>Try it now</span>
                    <FaArrowRight />
                  </button>
                </div>
                
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 aspect-video flex items-center justify-center">
                    <Image src={feature.image} alt={feature.title} width={500} height={300} className="rounded-xl shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
