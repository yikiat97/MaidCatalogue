import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAdminSession = () => {
  const navigate = useNavigate();

  // Handle unauthorized access by redirecting to login
  const handleUnauthorizedAccess = useCallback((action = 'perform this action') => {
    // Clear any stored data
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    
    // Show error message briefly
    alert(`Access denied or session expired. You cannot ${action}. Redirecting to login...`);
    
    // Redirect to admin login after a short delay
    setTimeout(() => {
      navigate('/system-access');
    }, 2000);
  }, [navigate]);

  // Check if response indicates unauthorized access
  const checkAuthStatus = useCallback((response, action = 'perform this action') => {
    if (response.status === 401 || response.status === 403) {
      handleUnauthorizedAccess(action);
      return true; // Indicates unauthorized
    }
    return false; // Authorized
  }, [handleUnauthorizedAccess]);

  // Authenticated fetch wrapper that includes credentials and handles session timeouts
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        credentials: 'include', // Crucial for cookie-based sessions
        ...options
      });

      if (checkAuthStatus(response, 'access this resource')) {
        return { response, isUnauthorized: true };
      }

      return { response, isUnauthorized: false };
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
        handleUnauthorizedAccess('access this resource');
        return { response: null, isUnauthorized: true, error };
      }
      return { response: null, isUnauthorized: false, error };
    }
  }, [checkAuthStatus, handleUnauthorizedAccess]);

  return {
    handleUnauthorizedAccess,
    checkAuthStatus,
    authenticatedFetch
  };
};
