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
      // Supplier endpoints
      SUPPLIERS: '/api/admin/suppliers',
      SUPPLIER: '/api/admin/supplier',
      SEARCH_SUPPLIERS: '/api/admin/suppliers/search',
    },
    
    // Catalogue endpoints
    CATALOGUE: {
      MAIDS: '/api/catalogue/maids',
      MAID_DETAIL: '/api/catalogue/maids', // Used with ID parameter: /api/catalogue/maids/{id}
      TOP_MAIDS: '/api/catalogue/top-maids',
      SEARCH_MAIDS: '/api/catalogue/maids/search',
      FILTER_MAIDS: '/api/catalogue/maids/filter',
      BATCH_MAIDS: '/api/catalogue/maids/batch',
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
    // Handle proxy mode (empty BASE_URL) vs direct mode (full BASE_URL)
    const baseUrl = API_CONFIG.BASE_URL;
    let fullUrl;
    
    if (!baseUrl || baseUrl === '') {
      // Proxy mode: use relative URL
      fullUrl = endpoint;
    } else {
      // Direct mode: use absolute URL
      fullUrl = `${baseUrl}${endpoint}`;
    }
    
    // Add query parameters if any
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      fullUrl += `?${queryParams.toString()}`;
    }
    
    return fullUrl;
  },
  
  // Helper function to build image URL
  buildImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_CONFIG.BASE_URL}${imagePath}`;
  },
  
  // Helper function to build maid detail URL with ID
  buildMaidDetailUrl: (maidId) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATALOGUE.MAID_DETAIL}/${maidId}`;
  },
  
  // Helper function to build search URL with query parameters
  buildSearchUrl: (query, filters = {}) => {
    const params = { q: query, ...filters };
    return API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.CATALOGUE.SEARCH_MAIDS, params);
  },
  
  // Helper function to build filter URL
  buildFilterUrl: () => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATALOGUE.FILTER_MAIDS}`;
  },
  
  // Helper function to build batch maids URL
  buildBatchMaidsUrl: () => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATALOGUE.BATCH_MAIDS}`;
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