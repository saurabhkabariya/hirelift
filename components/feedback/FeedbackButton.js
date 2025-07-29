'use client';

import { useState } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton({ 
  variant = 'floating', // 'floating', 'button', 'minimal'
  text = 'Feedback',
  className = ''
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonVariants = {
    floating: `fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-3 group`,
    button: `bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 px-4 py-2`,
    minimal: `text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50`
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${buttonVariants[variant]} ${className}`}
        title="Share your feedback"
      >
        {variant === 'floating' ? (
          <>
            <MessageSquare className="w-5 h-5" />
            <span className="hidden group-hover:inline-block transition-all duration-300">
              {text}
            </span>
          </>
        ) : variant === 'minimal' ? (
          <>
            <Heart className="w-4 h-4" />
            <span className="text-sm">{text}</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{text}</span>
          </>
        )}
      </button>

      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
