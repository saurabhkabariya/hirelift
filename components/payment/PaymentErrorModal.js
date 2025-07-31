import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, CreditCard, MessageCircle } from 'lucide-react';

export default function PaymentErrorModal({ 
  isOpen, 
  error, 
  onClose, 
  onRetry, 
  onContactSupport 
}) {
  if (!isOpen) return null;

  const getErrorDetails = (error) => {
    const errorMessage = error?.message || 'An unexpected error occurred';
    
    // Common error patterns and user-friendly messages
    const errorPatterns = {
      'insufficient_balance': {
        title: 'Insufficient Balance',
        message: 'Your account does not have sufficient balance for this transaction.',
        suggestion: 'Please add funds to your account and try again.',
        icon: CreditCard,
        color: 'text-orange-500'
      },
      'card_declined': {
        title: 'Card Declined',
        message: 'Your card was declined by the bank.',
        suggestion: 'Please try a different card or contact your bank.',
        icon: CreditCard,
        color: 'text-red-500'
      },
      'authentication_failed': {
        title: 'Authentication Failed',
        message: 'Payment authentication failed.',
        suggestion: 'Please check your login status and try again.',
        icon: AlertCircle,
        color: 'text-yellow-500'
      },
      'network_error': {
        title: 'Network Error',
        message: 'Unable to connect to payment servers.',
        suggestion: 'Please check your internet connection and try again.',
        icon: RefreshCw,
        color: 'text-blue-500'
      }
    };

    // Check for pattern matches
    for (const [pattern, details] of Object.entries(errorPatterns)) {
      if (errorMessage.toLowerCase().includes(pattern.replace('_', ' '))) {
        return details;
      }
    }

    // Default error details
    return {
      title: 'Payment Error',
      message: errorMessage,
      suggestion: 'Please try again or contact support if the problem persists.',
      icon: AlertCircle,
      color: 'text-red-500'
    };
  };

  const errorDetails = getErrorDetails(error);
  const IconComponent = errorDetails.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-16 h-16 mx-auto mb-6 ${errorDetails.color} relative`}
        >
          <IconComponent className="w-16 h-16" />
          
          {/* Error pulse animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full ${errorDetails.color.replace('text', 'bg')}/20`}
          />
        </motion.div>

        {/* Error Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-3 text-center"
        >
          {errorDetails.title}
        </motion.h3>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-4 text-center"
        >
          {errorDetails.message}
        </motion.p>

        {/* Suggestion */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 mb-8 text-center bg-gray-50 p-3 rounded-lg"
        >
          💡 {errorDetails.suggestion}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col space-y-3"
        >
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
          
          <div className="flex space-x-3">
            {onContactSupport && (
              <button
                onClick={onContactSupport}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Support
              </button>
            )}
            
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-gray-400 text-center mt-6"
        >
          Error ID: {Date.now().toString(36).toUpperCase()}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
