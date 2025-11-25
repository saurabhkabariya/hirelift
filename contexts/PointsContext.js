'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const { token } = useAuth();
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchPointsData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/referrals/points', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.balance) {
          setPointsData({
            current: data.balance.current || 0,
            totalEarned: data.balance.totalEarned || 0,
            totalSpent: data.balance.totalSpent || 0,
            stats: data.balance.stats || {}
          });
        } else {
          // Fallback for new users with no data
          setPointsData({
            current: 0,
            totalEarned: 0,
            totalSpent: 0,
            stats: {}
          });
        }
        setError(null);
      } else {
        console.error('Failed to fetch points data');
        setError('Failed to fetch points data');
      }
    } catch (error) {
      console.error('Error fetching points data:', error);
      setError('Error fetching points data');
    } finally {
      setLoading(false);
    }
  };

  const refreshPoints = async () => {
    await fetchPointsData();
  };

  const updatePointsLocally = (newPoints, reason = '') => {
    if (pointsData) {
      const previousPoints = pointsData.current;
      
      setPointsData(prev => ({
        ...prev,
        current: Math.max(0, prev.current + newPoints),
        totalEarned: newPoints > 0 ? prev.totalEarned + newPoints : prev.totalEarned,
        totalSpent: newPoints < 0 ? prev.totalSpent + Math.abs(newPoints) : prev.totalSpent
      }));
      
      // Show notification for points earned
      if (newPoints > 0) {
        showNotification(`🎉 Earned ${newPoints} points! ${reason}`, 'success');
      }
    }
  };

  useEffect(() => {
    fetchPointsData();
  }, [token]);

  // Auto-refresh every 30 seconds to sync with server
  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(fetchPointsData, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const value = {
    pointsData,
    loading,
    error,
    refreshPoints,
    updatePointsLocally,
    fetchPointsData,
    notifications,
    showNotification,
    removeNotification
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
              text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm
              animate-in slide-in-from-right duration-300 pointer-events-auto
            `}
          >
            <span className="text-sm font-medium">{notification.message}</span>
            <button 
              onClick={() => removeNotification(notification.id)}
              className="ml-auto hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </PointsContext.Provider>
  );
};