// Environment Configuration
const ENVIRONMENTS = {
  development: {
    API_BASE_URL: 'http://localhost:3000',
    API_PORT: 3000,
    NODE_ENV: 'development',
  },
  
  staging: {
    API_BASE_URL: 'http://yikiat.com',
    API_PORT: 3000,
    NODE_ENV: 'staging',
  },
  
  production: {
    API_BASE_URL: 'http://yikiat.com',
    API_PORT: 3000,
    NODE_ENV: 'production',
  },
};

// Get current environment (default to development)
const getCurrentEnvironment = () => {
  const env = import.meta.env?.VITE_NODE_ENV || 'development';
  return ENVIRONMENTS[env] || ENVIRONMENTS.development;
};

// Export current environment config
export const currentEnv = getCurrentEnvironment();

// Export all environments
export default ENVIRONMENTS; 