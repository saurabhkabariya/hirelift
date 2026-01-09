'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState({
    requests: {
      newReceived: 0,
      statusChanged: 0,
      total: 0
    },
    dashboard: {
      pendingActions: 0,
      awaitingUpdates: 0,
      recentActivity: 0,
      total: 0
    },
    activity: {
      recentReceived: 0,
      recentSent: 0,
      weeklyTotal: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = async (force = false) => {
    // Don't fetch if no token, no user, or already loading (unless forced)
    if (!token || !user || (!force && loading)) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } else {
        // Only log errors for authenticated users, not 404s for guests
        if (response.status !== 404) {
          console.error('Failed to fetch notifications:', response.statusText);
          setError('Failed to fetch notifications');
        }
      }
    } catch (error) {
      // Silently handle errors for unauthenticated users
      if (user) {
        console.error('Error fetching notifications:', error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as viewed
  const markAsViewed = async (type) => {
    // Don't mark if no token or user
    if (!token || !user) return;
    
    try {
      const response = await fetch('/api/notifications/mark-viewed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      
      if (response.ok) {
        // Reset appropriate notification counts
        setNotifications(prev => {
          const updated = { ...prev };
          
          if (type === 'requests' || type === 'all') {
            updated.requests = {
              newReceived: 0,
              statusChanged: 0,
              total: 0
            };
          }
          
          if (type === 'dashboard' || type === 'all') {
            updated.dashboard = {
              ...updated.dashboard,
              recentActivity: 0,
              total: updated.dashboard.pendingActions + updated.dashboard.awaitingUpdates
            };
          }
          
          return updated;
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking notifications as viewed:', error);
      return false;
    }
  };

  // Refresh notifications manually
  const refreshNotifications = () => {
    fetchNotifications(true);
  };

  // Auto-fetch notifications when user/token changes
  useEffect(() => {
    if (token && user) {
      fetchNotifications();
    }
  }, [token, user]);

  // Periodic refresh every 30 seconds
  useEffect(() => {
    // Only set up interval if user is authenticated
    if (!token || !user) return;
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [token, user]);

  // Refresh when tab becomes visible
  useEffect(() => {
    if (!token) return;
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token]);

  // Calculate total notification count across all types
  const totalNotifications = notifications.requests.total + notifications.dashboard.total;

  const value = {
    notifications,
    loading,
    error,
    totalNotifications,
    fetchNotifications,
    refreshNotifications,
    markAsViewed,
    
    // Convenience methods
    hasNewRequests: notifications.requests.total > 0,
    hasDashboardNotifications: notifications.dashboard.total > 0,
    hasAnyNotifications: totalNotifications > 0,
    
    // Quick access to important counts
    pendingActions: notifications.dashboard.pendingActions,
    awaitingUpdates: notifications.dashboard.awaitingUpdates,
    newRequestsCount: notifications.requests.newReceived,
    statusChangesCount: notifications.requests.statusChanged,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}