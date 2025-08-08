'use client';

import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sara K.",
      role: "BTech Student, Delhi",
      quote: "Got hired in 2 weeks after using HireLift. The ATS optimization was a game-changer!",
      result: "5% → 95% ATS Score"
    },
    {
      name: "Sagar R.",
      role: "2025 Graduate", 
      quote: "The HR contacts and templates actually work. Got 3x more interviews immediately.",
      result: "0 → 12 interviews/month"
    },
    {
      name: "Priya S.",
      role: "BE Student, Rajkot",
      quote: "After months of rejections, I landed my dream role in just 1 month with HireLift.",
      result: "Rejected → Hired"
    }
  ];
  return (
    <section id='testimonials' className="py-20 px-6 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-blue-50/30"></div>
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">100+</span> People Already Got Hired
          </h2>
          <p className="text-gray-700 text-lg">Real results from real job seekers</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <div className="mb-4">
                <div className="text-gray-900 font-bold text-lg">{testimonial.name}</div>
                <div className="text-blue-600 text-sm">{testimonial.role}</div>
              </div>
              
              <blockquote className="text-gray-700 mb-4 italic">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                <div className="text-green-700 font-bold text-sm">{testimonial.result}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
