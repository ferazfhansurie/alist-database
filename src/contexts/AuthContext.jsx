import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      const userData = data.user;
      
      // Store auth data
      localStorage.setItem('authToken', 'auth-token-' + userData.id);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  };

  // Registration is disabled for internal system
  const register = async (name, email, password) => {
    throw new Error('User registration is disabled. Please contact your administrator.');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      throw new Error(error.message || 'Failed to change password');
    }
  };

  // Role-based access control helpers
  const canEdit = () => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'editor';
  };

  const canView = () => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'editor' || user.role === 'viewer';
  };

  const canCopy = () => {
    if (!user) return false;
    // Viewers cannot copy data
    return user.role === 'admin' || user.role === 'editor';
  };

  const canDelete = () => {
    if (!user) return false;
    // Only admins can delete
    return user.role === 'admin';
  };

  const isViewer = () => {
    if (!user) return false;
    return user.role === 'viewer';
  };

  const isEditor = () => {
    if (!user) return false;
    return user.role === 'editor';
  };

  const isAdmin = () => {
    if (!user) return false;
    return user.role === 'admin';
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    changePassword,
    // Role-based access control
    canEdit,
    canView,
    canCopy,
    canDelete,
    isViewer,
    isEditor,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
