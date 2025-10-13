'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, onExpiry }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onExpiry) onExpiry();
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [targetDate, onExpiry]);

  return (
    <div className="inline-flex items-center gap-1 sm:gap-2 font-mono text-orange-800 font-bold text-sm sm:text-base">
      <span className="bg-orange-200 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm md:text-base">
        {timeLeft.hours.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm md:text-base">:</span>
      <span className="bg-orange-200 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm md:text-base">
        {timeLeft.minutes.toString().padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm md:text-base">:</span>
      <span className="bg-orange-200 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm md:text-base">
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}