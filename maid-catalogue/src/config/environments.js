// Environment Configuration
const ENVIRONMENTS = {
  development: {
    API_BASE_URL: '', // Use Vite proxy - routes /api to https://easyhiresg.com/api
    API_PORT: 3000,
    NODE_ENV: 'development',
  },
  
  staging: {
    API_BASE_URL: 'https://easyhiresg.com',
    API_PORT: 3000,
    NODE_ENV: 'staging',
  },
  
  production: {
    API_BASE_URL: 'https://easyhiresg.com', // Direct API calls to easyhiresg.com
    API_PORT: 3000,
    NODE_ENV: 'production',
  },
};

// Get current environment (default to development)
const getCurrentEnvironment = () => {
  // Check for environment variable override first
  const envOverride = import.meta.env?.VITE_API_BASE_URL;
  
  let environment;
  
  // Use Vite's built-in environment detection for reliable results
  if (import.meta.env.DEV) {
    // Development mode: use proxy (empty BASE_URL)
    environment = ENVIRONMENTS.development;
    console.log('🔧 Environment: DEVELOPMENT (using Vite proxy)');
  } else {
    // Production mode: use full URLs
    const prodEnv = import.meta.env?.VITE_NODE_ENV || 'production';
    environment = ENVIRONMENTS[prodEnv] || ENVIRONMENTS.production;
    console.log(`🚀 Environment: ${prodEnv.toUpperCase()} (direct API calls)`);
  }
  
  // Override API_BASE_URL if environment variable is provided
  if (envOverride) {
    console.log(`🔗 API_BASE_URL overridden by VITE_API_BASE_URL: ${envOverride}`);
    environment = {
      ...environment,
      API_BASE_URL: envOverride
    };
  }
  
  console.log(`🌐 Final API Configuration: ${environment.API_BASE_URL || 'proxy'}`);
  
  return environment;
};

// Export current environment config
export const currentEnv = getCurrentEnvironment();

// Export all environments
export default ENVIRONMENTS; 