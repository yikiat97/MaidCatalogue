// Authentication utility functions
// These functions provide convenient access to authentication operations

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Token management utilities
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// User data management utilities
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Authentication status check
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Clear all authentication data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};

// Get authorization header for API requests
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Create authenticated fetch wrapper
export const authenticatedFetch = async (url, options = {}) => {
  const authHeader = getAuthHeader();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
    credentials: 'include',
  };

  return fetch(url, config);
};

// Utility to check if authentication error occurred
export const isAuthError = (response) => {
  return response.status === 401 || response.status === 403;
};

// Format user display name
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.name) {
    return user.name;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
};

// Get user initials for avatar
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  
  if (user.name) {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  isAuthenticated,
  clearAuthData,
  getAuthHeader,
  authenticatedFetch,
  isAuthError,
  getUserDisplayName,
  getUserInitials,
  isValidEmail,
  validatePassword,
};