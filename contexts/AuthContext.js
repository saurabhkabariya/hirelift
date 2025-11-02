'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { isTokenExpired, isTokenExpiringSoon } from '@/utils/tokenUtils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      
      // Check if token is expired or expiring soon
      if (storedToken && (isTokenExpired(storedToken) || isTokenExpiringSoon(storedToken))) {
        validateAndRefreshUser();
      }
    }
  }, []);

  // Set up automatic token refresh check
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(token)) {
        validateAndRefreshUser();
      } else if (isTokenExpiringSoon(token)) {
        validateAndRefreshUser();
      }
    };

    // Check every 30 minutes
    const interval = setInterval(checkTokenExpiry, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      // Send to backend to save/update user
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
          displayName: user.displayName || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(typeof error === 'string' ? error : (error.message || 'Google sign-in failed'));
      return { success: false, error: typeof error === 'string' ? error : (error.message || 'Google sign-in failed') };
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };    } catch (error) {
      console.error('Email sign-in error:', error);
      setError(typeof error === 'string' ? error : (error.message || 'Login failed'));
      return { success: false, error: typeof error === 'string' ? error : (error.message || 'Login failed') };
    }
  };
  // Sign up with email/password
  const signUpWithEmail = async (email, password, skipEmailVerification = false, firstName = '', lastName = '') => {
    try {
      setError(null);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          skipEmailVerification,
          firstName,
          lastName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }      // Auto-login after successful signup
      return await signInWithEmail(email, password);
      
    } catch (error) {
      console.error('Email signup error:', error);
      setError(typeof error === 'string' ? error : (error.message || 'Signup failed'));
      return { success: false, error: typeof error === 'string' ? error : (error.message || 'Signup failed') };
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);    } catch (error) {
      console.error('Sign out error:', error);
      setError(typeof error === 'string' ? error : (error.message || 'Sign out failed'));
    }
  };
  // Validate stored token and user data
  const validateAndRefreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setToken(null);
        setUser(null);
        return false;
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      
      if (!res.ok) {
        // If token is expired/invalid, try to refresh if user has Firebase auth
        if (res.status === 401 && auth.currentUser) {
          try {
            // Get fresh Firebase token
            const firebaseToken = await auth.currentUser.getIdToken(true);
            
            // Re-authenticate with backend using fresh Firebase token
            const refreshResponse = await fetch('/api/auth/google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: auth.currentUser.email,
                firebaseUid: auth.currentUser.uid,
                displayName: auth.currentUser.displayName || '',
              }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              
              // Store new token and update state
              localStorage.setItem('token', refreshData.token);
              localStorage.setItem('user', JSON.stringify(refreshData.user));
              setToken(refreshData.token);
              setUser(refreshData.user);
              
              return true;
            }
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
          }
        }
        
        // Clear invalid token and user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        return false;
      }
      
      const data = await res.json();
      
      if (data.user) {
        setToken(storedToken); // Ensure token state is updated
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        setToken(null);
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('Error validating token:', err);
      // Clear potentially corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  // Refetch user from backend with better error handling
  const refetchUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setToken(null);
        return;
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      
      if (!res.ok) {
        return;
      }
      
      const data = await res.json();
      
      if (data.user) {
        // Also check trial status to ensure it's up-to-date
        if (data.user.isTrialActive || data.user.hasClaimedTrial) {
          try {
            const trialResponse = await fetch('/api/trial/status', {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            
            if (trialResponse.ok) {
              const trialData = await trialResponse.json();
              // The trial API will have already updated the user if trial expired
              // So we'll refetch user data again if needed
              if (trialData.trialStatus.isExpired && data.user.isTrialActive) {
                setTimeout(() => refetchUser(), 1000); // Refetch after 1 second
                return;
              }
            }
          } catch (trialError) {
            // Silent fail for trial status check
          }
        }
        
        setToken(storedToken); // Ensure token state is current
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return data.user;
      }
    } catch (err) {
      // Silent error handling for production
    }
  };
  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } else {
        // Check for stored JWT token and validate it
        await validateAndRefreshUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const value = {
    user,
    loading,
    error,
    token,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    setError,
    refetchUser,
    validateAndRefreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 