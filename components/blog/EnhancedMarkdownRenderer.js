'use client';

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaLightbulb } from 'react-icons/fa';

/**
 * Enhanced Markdown Renderer optimized for AI chatbot parsing
 * Uses semantic HTML, better heading hierarchy, and structured formatting
 */
export default function EnhancedMarkdownRenderer({ content, withTableOfContents = true }) {
  const [headings, setHeadings] = React.useState([]);

  const renderContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null;
    let inCodeBlock = false;
    let codeBlockContent = '';

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ol') {
          elements.push(
            <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-2 mb-6 pl-4">
              {currentList.map((item, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-6 pl-4">
              {currentList.map((item, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const parseInlineFormatting = (text) => {
      // Handle bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      // Handle italic text
      const italicRegex = /_(.*?)_/g;
      // Handle inline code
      const codeRegex = /`(.*?)`/g;
      // Handle links
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;

      let result = text;

      // Replace links first
      result = result.replace(linkRegex, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

      // Replace bold
      result = result.replace(boldRegex, '<strong class="font-bold text-gray-900">$1</strong>');

      // Replace italic
      result = result.replace(italicRegex, '<em class="italic text-gray-800">$1</em>');

      // Replace inline code
      result = result.replace(codeRegex, '<code class="bg-gray-100 text-red-600 px-2 py-1 rounded font-mono text-sm">$1</code>');

      return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    const extractHeadings = (line) => {
      let level = 0;
      let text = line;

      if (line.startsWith('# ')) {
        level = 1;
        text = line.replace(/^# /, '');
      } else if (line.startsWith('## ')) {
        level = 2;
        text = line.replace(/^## /, '');
      } else if (line.startsWith('### ')) {
        level = 3;
        text = line.replace(/^### /, '');
      }

      if (level > 0) {
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return { level, text, id };
      }
      return null;
    };

    // First pass: collect headings
    const allHeadings = [];
    lines.forEach(line => {
      const heading = extractHeadings(line.trim());
      if (heading) {
        allHeadings.push(heading);
      }
    });
    setHeadings(allHeadings);

    // Second pass: render content
    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        if (elements.length > 0 && elements[elements.length - 1].type !== 'div') {
          elements.push(
            <div key={`space-${index}`} className="my-2" />
          );
        }
        return;
      }

      // Code block handling
      if (trimmed.startsWith('```')) {
        flushList();
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock && codeBlockContent) {
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm leading-6">
              <code>{codeBlockContent}</code>
            </pre>
          );
          codeBlockContent = '';
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent += (codeBlockContent ? '\n' : '') + line;
        return;
      }

      // Callout blocks
      if (trimmed.startsWith('> **')) {
        flushList();
        const calloutText = trimmed.replace(/^>\s\*\*/, '').replace(/\*\*/, '');
        const calloutType = calloutText.includes('Note:') ? 'info' : 
                           calloutText.includes('Warning:') ? 'warning' :
                           calloutText.includes('Tip:') ? 'tip' : 'info';

        const calloutConfig = {
          info: { bg: 'bg-blue-50', border: 'border-blue-300', icon: FaInfoCircle, color: 'text-blue-600' },
          warning: { bg: 'bg-amber-50', border: 'border-amber-300', icon: FaExclamationTriangle, color: 'text-amber-600' },
          tip: { bg: 'bg-green-50', border: 'border-green-300', icon: FaLightbulb, color: 'text-green-600' }
        };

        const config = calloutConfig[calloutType];
        const IconComponent = config.icon;

        elements.push(
          <div key={`callout-${index}`} className={`${config.bg} border-l-4 ${config.border} rounded p-4 my-6 flex gap-3`}>
            <IconComponent className={`${config.color} w-5 h-5 flex-shrink-0 mt-1`} />
            <p className="text-gray-700">{calloutText}</p>
          </div>
        );
        return;
      }

      // Headers with IDs for TOC linking
      if (trimmed.startsWith('# ')) {
        flushList();
        const heading = extractHeadings(trimmed);
        elements.push(
          <h1
            key={`h1-${index}`}
            id={heading.id}
            className="text-4xl font-bold text-gray-900 mt-12 mb-8 border-b-2 border-blue-100 pb-4 scroll-mt-24"
          >
            {heading.text}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        const heading = extractHeadings(trimmed);
        elements.push(
          <h2
            key={`h2-${index}`}
            id={heading.id}
            className="text-3xl font-bold text-gray-900 mt-10 mb-6 scroll-mt-24"
          >
            {heading.text}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        const heading = extractHeadings(trimmed);
        elements.push(
          <h3
            key={`h3-${index}`}
            id={heading.id}
            className="text-2xl font-semibold text-gray-800 mt-8 mb-4 scroll-mt-24"
          >
            {heading.text}
          </h3>
        );
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const listItem = trimmed.replace(/^[•-]\s/, '');
        currentList.push(listItem);
        listType = 'ul';
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmed)) {
        const item = trimmed.replace(/^\d+\.\s/, '');
        currentList.push(item);
        listType = 'ol';
      }
      // Horizontal rule
      else if (trimmed === '---' || trimmed === '***') {
        flushList();
        elements.push(<hr key={`hr-${index}`} className="my-8 border-gray-300" />);
      }
      // Regular paragraphs
      else {
        flushList();
        elements.push(
          <p key={`p-${index}`} className="text-gray-700 leading-relaxed mb-6 text-base">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const renderedContent = renderContent(content);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <div className="flex-1 prose prose-lg max-w-none">
        <article className="text-gray-700 space-y-6">
          {renderedContent}
        </article>
      </div>

      {/* Table of Contents - Sticky sidebar */}
      {withTableOfContents && headings && headings.length > 0 && (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">
              On This Page
            </h4>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                    heading.level === 1
                      ? 'font-semibold text-gray-900 hover:text-blue-600 hover:bg-blue-50'
                      : heading.level === 2
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 ml-2'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 ml-4'
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
