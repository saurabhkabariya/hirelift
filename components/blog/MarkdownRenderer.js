'use client';

import React from 'react';

// Enhanced markdown renderer component
export default function MarkdownRenderer({ content }) {
  const renderContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-6 pl-4">
            {currentList.map((item, index) => (
              <li key={index} className="text-gray-700 leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
        listType = null;
      }
    };

    const parseInlineFormatting = (text) => {
      // Handle bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      let result = text;
      const boldMatches = [];
      let match;
      
      while ((match = boldRegex.exec(text)) !== null) {
        boldMatches.push({
          full: match[0],
          content: match[1],
          index: match.index
        });
      }
      
      // Replace from end to start to maintain indices
      boldMatches.reverse().forEach((match, idx) => {
        const before = result.substring(0, match.index);
        const after = result.substring(match.index + match.full.length);
        result = before + `<strong>${match.content}</strong>` + after;
      });
      
      return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        flushList();
        return;
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${index}`} className="text-4xl font-bold text-gray-900 mt-12 mb-8 border-b-2 border-blue-100 pb-4">
            {trimmed.replace(/^# /, '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-3xl font-bold text-gray-900 mt-10 mb-6">
            {trimmed.replace(/^## /, '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            {trimmed.replace(/^### /, '')}
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
        flushList();
        const item = trimmed.replace(/^\d+\.\s/, '');
        currentList.push(item);
        listType = 'ol';
      }
      // Regular paragraphs
      else {
        flushList();
        
        // Special formatting for bold paragraphs
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          elements.push(
            <p key={`bold-p-${index}`} className="font-bold text-gray-900 mb-6 text-lg">
              {trimmed.replace(/^\*\*|\*\*$/g, '')}
            </p>
          );
        } else {
          elements.push(
            <p key={`p-${index}`} className="mb-6 text-gray-700 leading-relaxed text-lg">
              {parseInlineFormatting(trimmed)}
            </p>
          );
        }
      }
    });

    flushList(); // Flush any remaining list
    return elements;
  };

  return (
    <div className="prose prose-lg max-w-none">
      <div className="space-y-4">
        {renderContent(content)}
      </div>
    </div>
  );
}
