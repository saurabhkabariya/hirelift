'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setUser(null);    } catch (error) {
      console.error('Sign out error:', error);
      setError(typeof error === 'string' ? error : (error.message || 'Sign out failed'));
    }
  };
  // Validate stored token and user data
  const validateAndRefreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔍 No token found, clearing user data');
        setUser(null);
        return false;
      }

      console.log('🔄 Validating stored token...');
      
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        console.error('❌ Token validation failed:', res.status, res.statusText);
        // Clear invalid token and user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        return false;
      }
      
      const data = await res.json();
      
      if (data.user) {
        console.log('✅ Token validated, user data refreshed');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        console.warn('⚠️ No user data in response');
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('❌ Error validating token:', err);
      // Clear potentially corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return false;
    }
  };

  // Refetch user from backend with better error handling
  const refetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔍 No token found, skipping user refetch');
        return;
      }

      console.log('🔄 Refetching user data...');
      
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        console.error('❌ Failed to refetch user:', res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      
      if (data.user) {
        console.log('✅ User data refreshed:', {
          email: data.user.email,
          isPremium: data.user.isPremium,
          previousIsPremium: user?.isPremium
        });
        
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return data.user;
      } else {
        console.warn('⚠️ No user data in response');
      }
    } catch (err) {
      console.error('❌ Error refetching user:', err);
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