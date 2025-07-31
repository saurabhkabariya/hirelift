import { motion } from 'framer-motion';
import { Loader2, CreditCard, Shield, Check } from 'lucide-react';

export default function PaymentLoadingModal({ isOpen, stage = 'preparing' }) {
  if (!isOpen) return null;

  const stages = {
    preparing: {
      icon: CreditCard,
      title: 'Preparing Payment',
      description: 'Setting up your subscription...',
      color: 'text-blue-500'
    },
    processing: {
      icon: Shield,
      title: 'Processing Payment',
      description: 'Securely processing your payment...',
      color: 'text-purple-500'
    },
    completing: {
      icon: Check,
      title: 'Almost Done',
      description: 'Activating your premium account...',
      color: 'text-green-500'
    }
  };

  const currentStage = stages[stage];
  const IconComponent = currentStage.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-16 h-16 mx-auto mb-6 ${currentStage.color} relative`}
        >
          <motion.div
            animate={{ rotate: stage === 'preparing' || stage === 'processing' ? 360 : 0 }}
            transition={{ duration: 2, repeat: stage === 'completing' ? 0 : Infinity, ease: "linear" }}
          >
            {stage === 'completing' ? (
              <IconComponent className="w-16 h-16" />
            ) : (
              <Loader2 className="w-16 h-16" />
            )}
          </motion.div>
          
          {/* Pulse animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full ${currentStage.color.replace('text', 'bg')}/20`}
          />
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {currentStage.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          {currentStage.description}
        </motion.p>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center space-x-2"
        >
          {Object.keys(stages).map((key, index) => {
            const isActive = key === stage;
            const isCompleted = Object.keys(stages).indexOf(stage) > index;
            
            return (
              <div
                key={key}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? currentStage.color.replace('text', 'bg')
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            );
          })}
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center text-sm text-gray-500"
        >
          <Shield className="w-4 h-4 mr-2" />
          Secured by Razorpay
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Additional loading states for inline use
export function PaymentButton({ 
  children, 
  isLoading, 
  onClick, 
  disabled, 
  className = '',
  variant = 'primary'
}) {
  const baseClasses = "relative overflow-hidden transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 focus:ring-blue-500",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/20 flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </motion.div>
      )}
      
      <motion.span
        animate={{ opacity: isLoading ? 0.7 : 1 }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.span>
    </button>
  );
}
