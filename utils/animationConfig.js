'use client';

// Mobile-optimized animation configurations
export const getMobileAnimationConfig = (isMobile) => {
  if (isMobile) {
    return {
      // Reduced motion for mobile
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: "easeOut" },
      // Simplified viewport settings
      viewport: { once: true, margin: "-20px" },
      // Reduced scale animations
      hover: { scale: 1.01 },
      tap: { scale: 0.99 }
    };
  } else {
    return {
      // Full animations for desktop
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
      viewport: { once: true, margin: "-50px" },
      hover: { scale: 1.02, y: -2 },
      tap: { scale: 0.98 }
    };
  }
};

// Stagger configurations for mobile vs desktop
export const getStaggerConfig = (isMobile) => {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isMobile ? 0.05 : 0.1,
          delayChildren: isMobile ? 0.1 : 0.2,
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: isMobile ? 10 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: isMobile ? 0.3 : 0.5,
          ease: "easeOut"
        }
      }
    }
  };
};