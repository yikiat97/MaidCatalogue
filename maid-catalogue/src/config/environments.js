// Environment Configuration
const ENVIRONMENTS = {
  development: {
    API_BASE_URL: '', // Use Vite proxy - routes /api to https://yikiat.com/api
    API_PORT: 3000,
    NODE_ENV: 'development',
  },
  
  staging: {
    API_BASE_URL: 'https://yikiat.com',
    API_PORT: 3000,
    NODE_ENV: 'staging',
  },
  
  production: {
    API_BASE_URL: 'https://yikiat.com',
    API_PORT: 3000,
    NODE_ENV: 'production',
  },
};

// Get current environment (default to development)
const getCurrentEnvironment = () => {
  // Use Vite's built-in environment detection for reliable results
  if (import.meta.env.DEV) {
    // Development mode: use proxy (empty BASE_URL)
    return ENVIRONMENTS.development;
  } else {
    // Production mode: use full URLs
    const prodEnv = import.meta.env?.VITE_NODE_ENV || 'production';
    return ENVIRONMENTS[prodEnv] || ENVIRONMENTS.production;
  }
};

// Export current environment config
export const currentEnv = getCurrentEnvironment();

// Export all environments
export default ENVIRONMENTS; 