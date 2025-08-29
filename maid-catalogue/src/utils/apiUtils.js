/**
 * API Utilities for consistent error handling and request management
 */

/**
 * Enhanced API request handler with comprehensive error handling
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} The response data or throws an error
 */
export const apiRequest = async (url, options = {}) => {
  try {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete defaultOptions.headers['Content-Type'];
    }

    const response = await fetch(url, defaultOptions);

    // Handle authentication errors
    if (response.status === 401) {
      console.warn('Authentication required - redirecting to login');
      // Could trigger a global auth state update here
      throw new APIError('Authentication required', response.status, 'UNAUTHORIZED');
    }

    if (response.status === 403) {
      throw new APIError('Access forbidden', response.status, 'FORBIDDEN');
    }

    // Handle not found
    if (response.status === 404) {
      throw new APIError('Resource not found', response.status, 'NOT_FOUND');
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new APIError(
        `Too many requests. ${retryAfter ? `Please wait ${retryAfter} seconds before trying again.` : 'Please try again later.'}`,
        response.status,
        'RATE_LIMITED',
        { retryAfter }
      );
    }

    // Handle server errors
    if (response.status >= 500) {
      throw new APIError('Server error occurred', response.status, 'SERVER_ERROR');
    }

    // Handle client errors
    if (!response.ok) {
      let errorMessage = 'Request failed';
      let errorDetails = {};
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData.details || {};
      } catch (parseError) {
        // If we can't parse the error response, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new APIError(errorMessage, response.status, 'CLIENT_ERROR', errorDetails);
    }

    // Parse successful response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    console.error('API request failed:', error);
    throw new APIError(
      error.message || 'Network error occurred',
      0,
      'NETWORK_ERROR'
    );
  }
};

/**
 * Custom API Error class for better error handling
 */
export class APIError extends Error {
  constructor(message, status = 0, code = 'UNKNOWN', details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  isAuthError() {
    return this.code === 'UNAUTHORIZED' || this.code === 'FORBIDDEN';
  }

  isNetworkError() {
    return this.code === 'NETWORK_ERROR';
  }

  isServerError() {
    return this.code === 'SERVER_ERROR' || this.status >= 500;
  }

  isClientError() {
    return this.code === 'CLIENT_ERROR' && this.status >= 400 && this.status < 500;
  }
}

/**
 * Handle API errors consistently across components
 * @param {APIError|Error} error - The error to handle
 * @param {Object} options - Options for error handling
 */
export const handleAPIError = (error, options = {}) => {
  const { 
    showAlert = true, 
    logError = true,
    onAuthError = null,
    onNetworkError = null,
    onServerError = null,
    customMessage = null
  } = options;

  if (logError) {
    console.error('API Error:', error);
  }

  let userMessage = customMessage || error.message || 'An error occurred';

  if (error instanceof APIError) {
    if (error.isAuthError() && onAuthError) {
      onAuthError(error);
      return;
    }
    
    if (error.isNetworkError() && onNetworkError) {
      onNetworkError(error);
      return;
    }
    
    if (error.isServerError() && onServerError) {
      onServerError(error);
      return;
    }

    // Customize messages based on error type
    switch (error.code) {
      case 'UNAUTHORIZED':
        userMessage = 'Please log in to continue';
        break;
      case 'FORBIDDEN':
        userMessage = 'You do not have permission to perform this action';
        break;
      case 'NOT_FOUND':
        userMessage = 'The requested resource was not found';
        break;
      case 'RATE_LIMITED':
        userMessage = error.message; // Already includes retry info
        break;
      case 'NETWORK_ERROR':
        userMessage = 'Network connection failed. Please check your internet connection.';
        break;
      case 'SERVER_ERROR':
        userMessage = 'Server error occurred. Please try again later.';
        break;
    }
  }

  if (showAlert) {
    // Could be replaced with a toast notification system
    alert(userMessage);
  }

  return {
    message: userMessage,
    error,
    handled: true
  };
};

/**
 * Retry wrapper for API requests
 * @param {Function} apiCall - The API call function
 * @param {Object} options - Retry options
 */
export const retryAPICall = async (apiCall, options = {}) => {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (400-499) except for rate limiting
      if (error instanceof APIError && error.isClientError() && error.code !== 'RATE_LIMITED') {
        throw error;
      }
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      console.log(`API request failed, retrying attempt ${attempt + 1}/${maxRetries} in ${waitTime}ms`);
    }
  }
  
  throw lastError;
};