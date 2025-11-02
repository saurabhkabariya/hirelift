'use client';

import { useState, useEffect } from 'react';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';

export default function TrialCountdown({ className = '', compact = false, showIcon = true }) {
  const { trialStatus, loading } = useTrialStatus();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining
  useEffect(() => {
    if (!trialStatus.isTrialActive || !trialStatus.trialEndDate) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(trialStatus.trialEndDate).getTime();
      const timeDiff = endTime - now;

      if (timeDiff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [trialStatus.trialEndDate, trialStatus.isTrialActive]);

  // Don't show if not loading, not on trial, or trial is expired
  if (loading || !trialStatus.isTrialActive || trialStatus.isExpired) {
    return null;
  }

  const { days, hours, minutes, seconds } = timeRemaining;
  const totalDays = days;

  // Determine background color based on days remaining
  const getBackgroundColor = () => {
    if (totalDays >= 6) return 'bg-green-100 border-green-300 text-green-800'; // 7, 6 days - Green
    if (totalDays >= 3) return 'bg-yellow-100 border-yellow-300 text-yellow-800'; // 5, 4, 3 days - Yellow  
    return 'bg-red-100 border-red-300 text-red-800'; // 2, 1, 0 days - Red
  };

  // Get icon based on urgency
  const getIcon = () => {
    if (totalDays >= 6) return <Clock className="w-4 h-4" />;
    if (totalDays >= 3) return <AlertTriangle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Format time display
  const formatTime = () => {
    if (compact) {
      if (totalDays > 0) {
        return `${totalDays}d ${hours}h`;
      }
      return `${hours}h ${minutes}m`;
    }

    if (totalDays > 0) {
      return `${totalDays} day${totalDays > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    return `${minutes} minute${minutes > 1 ? 's' : ''}, ${seconds} second${seconds > 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${getBackgroundColor()}
        border-2 rounded-lg px-3 py-2 
        ${compact ? 'text-xs' : 'text-sm'} 
        font-medium flex items-center gap-2 
        ${className}
      `}
    >
      {showIcon && getIcon()}
      <div className="flex gap-1">
        <span className={`font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
          Trial expires in:
        </span>
        <span className={`font-mono ${compact ? 'text-xs' : 'text-sm'} font-bold`}>
          {formatTime()}
        </span>
      </div>
    </motion.div>
  );
}