'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaQuestionCircle, FaLightbulb, FaBookmark, FaCode } from 'react-icons/fa';

/**
 * Quick Answer Section - Optimized for SGE Featured Snippets
 * AI chatbots extract these first for direct answers
 */
export function QuickAnswer({ answer, keypoints }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl shadow-md p-8 mb-12 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <FaLightbulb className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Answer</h3>
          <p className="text-gray-800 leading-relaxed text-base mb-4">
            {answer}
          </p>
          {keypoints && keypoints.length > 0 && (
            <div className="mt-4 space-y-2">
              {keypoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <FaCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-sm text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * FAQ Section - Optimized for SGE FAQ Schema and AI Q&A
 * Each FAQ item is independently parseable for AI extraction
 */
export function FAQSection({ faqs }) {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="my-12 bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <FaQuestionCircle className="text-blue-600" />
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600">Common questions about this topic, answered by industry experts</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={false}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
            layout
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-blue-50 transition-colors flex items-center justify-between font-semibold text-gray-900"
            >
              <span className="text-lg">{faq.question}</span>
              <span className={`transform transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {expandedIndex === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 py-4 bg-white border-t border-gray-200"
              >
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p>{faq.answer}</p>
                  {faq.details && (
                    <div className="mt-4 pl-4 border-l-4 border-blue-300 bg-blue-50 rounded">
                      <p className="text-sm text-gray-800">{faq.details}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* FAQ Schema for search engines */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>
    </motion.section>
  );
}

/**
 * Key Takeaways Box - Optimized for AI extraction
 * Bulleted format is easily parseable by AI chatbots
 */
export function KeyTakeaways({ takeaways, title = "Key Takeaways" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-lg p-8 my-12 shadow-md"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FaBookmark className="text-amber-600" />
        {title}
      </h3>
      <ul className="space-y-3">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start gap-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm font-bold flex-shrink-0 mt-1">
              {index + 1}
            </span>
            <span className="text-gray-800 leading-relaxed">{takeaway}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * Code/Example Block - Optimized for AI parsing
 * Clear formatting for AI to understand technical examples
 */
export function ExampleBlock({ title, description, examples }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 rounded-xl overflow-hidden shadow-lg my-8 border border-gray-700"
    >
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
        <h4 className="text-white font-bold text-lg flex items-center gap-2">
          <FaCode className="w-5 h-5" />
          {title}
        </h4>
        {description && <p className="text-blue-100 text-sm mt-2">{description}</p>}
      </div>

      <div className="p-6 space-y-4">
        {examples.map((example, idx) => (
          <div key={idx} className="bg-gray-800 rounded p-4">
            {example.label && (
              <p className="text-amber-300 text-xs font-semibold mb-2 uppercase">{example.label}</p>
            )}
            <pre className="text-gray-100 text-sm overflow-x-auto font-mono">
              <code>{example.content}</code>
            </pre>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Table of Contents - Improves both UX and AI navigation
 * AI can understand document structure better with explicit ToC
 */
export function TableOfContents({ headings }) {
  const [activeId, setActiveId] = React.useState('');

  React.useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      
      for (let element of headingElements) {
        if (element.getBoundingClientRect().top <= 100) {
          setActiveId(element.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-md max-w-xs"
    >
      <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
        Contents
      </h4>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToSection(heading.id)}
            className={`block w-full text-left px-3 py-2 rounded transition-all text-sm ${
              activeId === heading.id
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            } ${heading.level === 3 ? 'pl-6' : ''}`}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </motion.div>
  );
}

/**
 * Comparison Table - Optimized for AI parsing
 * Structured data format makes it easy for AI to extract and compare
 */
export function ComparisonTable({ title, rows, columns }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-8 overflow-x-auto"
    >
      <h4 className="text-xl font-bold text-gray-900 mb-4">{title}</h4>
      <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-cyan-600">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-white font-semibold border-b-2 border-blue-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ridx) => (
            <tr
              key={ridx}
              className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                ridx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              {row.map((cell, cidx) => (
                <td
                  key={cidx}
                  className="px-4 py-3 text-gray-700 text-sm"
                >
                  {typeof cell === 'object' ? (
                    <div className="flex items-center gap-2">
                      {cell.icon && <span>{cell.icon}</span>}
                      <span>{cell.text}</span>
                    </div>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
