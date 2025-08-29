# API Configuration Guide

This directory contains configuration files for managing API endpoints and environment-specific settings.

## Files

### 1. `environments.js`
Contains environment-specific configurations for development, staging, and production.

### 2. `api.js`
Contains all API endpoints and helper functions for building URLs.

## Usage

### Basic Usage

```javascript
import API_CONFIG from '../config/api.js';

// Build a simple URL
const loginUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
// Result: http://localhost:3000/api/auth/login

// Build URL with query parameters
const maidsUrl = API_CONFIG.buildUrlWithParams(
  API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS, 
  { page: 1, limit: 20 }
);
// Result: http://localhost:3000/api/catalogue/maids?page=1&limit=20

// Build image URL
const imageUrl = API_CONFIG.buildImageUrl('/uploads/maid.jpg');
// Result: http://localhost:3000/uploads/maid.jpg
```

### Environment Switching

To switch environments, update the `environments.js` file:

```javascript
// For production
production: {
  API_BASE_URL: 'https://yourdomain.com',
  API_PORT: 443,
  NODE_ENV: 'production',
}
```

### Using in Components

```javascript
import API_CONFIG from '../config/api.js';

// In your fetch calls
const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
});
```

## Benefits

1. **Centralized Configuration**: All API URLs in one place
2. **Easy Environment Switching**: Change base URL for different environments
3. **Type Safety**: Consistent endpoint naming
4. **Maintainability**: Update URLs in one place
5. **Helper Functions**: Built-in functions for common URL operations

## Migration Steps

1. Replace hardcoded URLs with `API_CONFIG.buildUrl()`
2. Use endpoint constants instead of string literals
3. Update environment configurations as needed
4. Test in different environments

## Example Migration

**Before:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  // ... options
});
```

**After:**
```javascript
import API_CONFIG from '../config/api.js';

const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
  // ... options
});
``` 