'use client';

import { motion } from 'framer-motion';
import { CheckCircle, DollarSign } from 'lucide-react';

export default function ValueStack({ title = "What You Get FREE", totalValue = "Infinity" }) {
  const items = [
    { name: "First ATS Resume Score with Breakdown & Fix Suggestions", value: 10, description: "Comprehensive ATS analysis" },
    { name: "Access to Verified Job listings", value: 20, description: "Highly active job listings" },
    { name: "Premium Templates Bundle", value: 20, description: "Proven job application templates" },
    { name: "Premium HR Contact List", value: "Infinity", description: "High quality HR contacts" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{title}</h3>
      
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">{item.name}</span>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
            <div className="text-green-700 font-bold">${item.value}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="border-t border-green-200 pt-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span className="text-gray-900">Total Value:</span>
          <div className="flex items-center gap-1 text-green-700">
            <span>${totalValue}</span>
          </div>
        </div>
        <p className="text-center text-green-800 font-bold mt-2 text-xl">
          🎉 Yours FREE Today (Limited Time)
        </p>
      </div>
    </motion.div>
  );
}