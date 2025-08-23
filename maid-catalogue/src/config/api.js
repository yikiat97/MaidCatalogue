import { currentEnv } from './environments.js';

// API Configuration
const API_CONFIG = {
  // Base URL - Dynamically loaded from environment config
  BASE_URL: currentEnv.API_BASE_URL,
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      LOGOUT: '/api/auth/logout',
      PROFILE: '/api/auth/profile',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      CALLBACK: '/api/user/auth/callback',
      SIMPLE_CALLBACK: '/api/user/auth/simple-callback',
    },
    
    // Admin endpoints
    ADMIN: {
      LOGIN: '/api/admin/auth/login',
      CALLBACK: '/api/admin/auth/callback',
      MAIDS: '/api/admin/maids',
      MAID: '/api/admin/maid',
      USERS: '/api/user/users',
      GENERATE_LINK: '/api/admin/generate-link',
      SEARCH_MAIDS: '/api/admin/maids/search',
    },
    
    // Catalogue endpoints
    CATALOGUE: {
      MAIDS: '/api/catalogue/maids',
      TOP_MAIDS: '/api/catalogue/top-maids',
      USER_FAVORITES: '/api/catalogue/user/favorites',
    },
    
    // User endpoints
    USER: {
      RECOMMENDATIONS: '/api/user/recommendation',
      RECOMMENDED: '/api/user/recommended',
      FAVORITES: '/api/user/favorites',
      GENERATE_LINK: '/api/user/generate-link',
    },
  },
  
  // Helper function to build full URL
  buildUrl: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
  
  // Helper function to build URL with query parameters
  buildUrlWithParams: (endpoint, params) => {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },
  
  // Helper function to build image URL
  buildImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_CONFIG.BASE_URL}${imagePath}`;
  },
  
  // Get current base URL
  getBaseUrl: () => {
    return currentEnv.API_BASE_URL;
  },
  
  // Get current environment
  getEnvironment: () => {
    return currentEnv.NODE_ENV;
  },
};

export default API_CONFIG; 