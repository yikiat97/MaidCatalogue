// Authentication utility functions
// These functions provide convenient access to authentication operations

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// ⚠️ SECURITY WARNING: These token functions are deprecated due to security risks
// The application now uses HttpOnly cookies for authentication
// localStorage token storage is vulnerable to XSS attacks

// Token management utilities (DEPRECATED - use cookie-based auth)
export const getToken = () => {
  console.warn('⚠️ getToken() is deprecated: localStorage tokens are insecure. Use cookie-based auth instead.');
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  console.warn('⚠️ setToken() is deprecated: localStorage tokens are insecure. Use cookie-based auth instead.');
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeToken = () => {
  console.warn('⚠️ removeToken() is deprecated: localStorage tokens are insecure. Use cookie-based auth instead.');
  localStorage.removeItem(TOKEN_KEY);
};

// User data management utilities
// ⚠️ SECURITY NOTE: User data in localStorage should be non-sensitive only
// Sensitive data should remain server-side and accessed via HttpOnly cookies
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

// Authentication status check (updated for cookie-based auth)
export const isAuthenticated = () => {
  // Since we use cookie-based auth, check if user data exists
  // Real authentication status is validated server-side via HttpOnly cookies
  const user = getUser();
  return !!user;
};

// Clear all authentication data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};

// Get authorization header for API requests (updated for cookie-based auth)
export const getAuthHeader = () => {
  // For cookie-based authentication, no Authorization header needed
  // Authentication is handled via HttpOnly cookies sent automatically
  console.info('Using cookie-based authentication - no Authorization header needed');
  return {};
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

// Validate password strength (enhanced security requirements)
export const validatePassword = (password) => {
  const errors = [];

  // Minimum length requirement (increased for security)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Maximum length to prevent DoS attacks
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  // Require lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Require uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Require number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Require special character for enhanced security
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }

  // Check for common weak patterns
  const commonPatterns = [
    /(.)\1{3,}/, // Same character repeated 4+ times
    /123456|654321|abcdef|qwerty|password/i, // Common sequences
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns that are easily guessable');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

// Calculate password strength score (0-4)
const calculatePasswordStrength = (password) => {
  let score = 0;

  // Length bonus
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety bonus
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score++;

  // Ensure score doesn't exceed 4
  return Math.min(score, 4);
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