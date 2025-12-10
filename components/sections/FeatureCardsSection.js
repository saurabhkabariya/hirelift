'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

export default function FeatureCardsSection({ handleRedirect }) {
  const features = [
    {
      title: "Turn Your Potential into a Professional Resume",
      subtitle: "AI-powered ATS Resume Review",
      description: "Get instant ATS score analysis that reveals exactly why recruiters ignore your resume. Our AI guides you step-by-step to optimize every section turning rejections into interview calls.",
      bgColor: "from-green-400 to-emerald-500",
      image: "/resume_review.webp",
      link: "/audit"
    },
    {
      title: "Matches That Actually Want *You*",
      subtitle: "Direct HR access + curated jobs",
      description: "Stop applying to black holes. Access 100+ HR contacts and verified job listings. Connect directly with hiring managers who are actively looking for talent like you.",
      bgColor: "from-blue-600 to-indigo-700",
      image: "/hr_directory.webp",
      link: "/company-search"
    },
    {
      title: "Fresh and verified Jobs. (Avoid ghosting)",
      subtitle: "Free Jobs Listing",  
      description: "Stop waiting for responses. Apply to our fresh and verified jobs to get responses. Get more replies, more interviews, and more offers.",
      bgColor: "from-green-400 to-teal-500",
      image: "/free_jobs.webp",
      link: "/jobs"
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Everything You Need to Go From 'Applicant' to 'Hired'
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors"
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
