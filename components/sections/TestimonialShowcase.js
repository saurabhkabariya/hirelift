'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

export default function TestimonialShowcase() {
  const testimonials = [
    {
      name: "Ross Mayor",
      role: "Software Engineer - 1 month ago",
      quote: "Freelance freshers used to not working within resume and I needed help. HireLift transformed it, completely got my ATS score from 35% to 92%. Landed 5 interviews in 2 weeks!",
      avatar: "RM"
    },
    {
      name: "Richie Buyers",
      role: "Frontend Developer - 2 months ago",
      quote: "I was ready to give up after 200 applications with zero responses. HireLift's HR directory helped me connect directly with hiring managers. Got hired within a month!",
      avatar: "RB"
    },
    {
      name: "Mike Brown",
      role: "Data Analyst - 3 months ago",
      quote: "The cold email templates were incredible! I reached out to 20 hiring managers and got 8 responses. Landed interviews at top companies and chose my favorite offer!",
      avatar: "MB"
    },
    {
      name: "Alex Butler",
      role: "Full Stack Developer - 3 months ago",
      quote: "Best investment in my career. The email templates and HR contacts helped me bypass the black hole. Got my dream job at a Fortune 500 company!",
      avatar: "AB"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white dark:text-white mb-4">
            From <span className='text-red-400'> "Rejected" </span> to <span className='text-green-400'> "Offer Letter" </span>
          </h2>
          <p className="text-xl text-white dark:text-gray-300">
            Testimonials have more success stories
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <FaQuoteLeft className="text-2xl text-blue-400 mb-4" />
              
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
