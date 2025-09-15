import { createContext, useContext, useState, useEffect } from 'react';
import API_CONFIG from '../config/api.js';

// Create the authentication context
const AuthContext = createContext();

// User storage utilities (cookie-based authentication, no tokens)
const USER_KEY = 'user_data';

const getStoredUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};
const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
const removeStoredUser = () => localStorage.removeItem(USER_KEY);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state by checking with server
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get user profile using cookies (no token needed)
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
            setStoredUser(data.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function (uses cookies, no tokens)
  const login = async (credentials) => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (response.ok) {
        // Call simple-callback to get user data
        const callbackResponse = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.SIMPLE_CALLBACK), {
          method: 'POST',
          credentials: 'include',
        });
        
        if (callbackResponse.ok) {
          const userData = await callbackResponse.json();
          
          // Store authentication data
          setStoredUser(userData.user);
          
          // Update state
          setIsAuthenticated(true);
          setUser(userData.user);
          
          return { success: true, user: userData.user };
        } else {
          // Callback failed but initial login succeeded
          console.warn('Simple callback failed, but login was successful');
          
          // Try to get user data from initial login response
          const loginData = await response.json();
          const fallbackUser = loginData.user || { role: 'user' }; // Default role if no user data
          
          // Store authentication data
          setStoredUser(fallbackUser);
          
          // Update state
          setIsAuthenticated(true);
          setUser(fallbackUser);
          
          return { success: true, user: fallbackUser };
        }
      }
      
      const data = await response.json();
      return { 
        success: false, 
        error: data.message || 'Login failed' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  // Signup function (uses cookies, no tokens)
  const signup = async (userData) => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.message || 'Signup failed' 
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  // Logout function (uses cookies, no tokens)
  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookies
      await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state
      removeStoredUser();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Get user profile (uses cookies, no tokens)
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setStoredUser(data.user);
          setUser(data.user);
          setIsAuthenticated(true);
          return { success: true, user: data.user };
        }
      } else {
        // If profile fetch fails, session might be invalid
        if (response.status === 401) {
          await logout();
        }
        return { success: false, error: 'Failed to fetch profile' };
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setStoredUser(userData);
    setUser(userData);
  };

  // Check if user data exists (for initial authentication check)
  const hasUserData = () => !!getStoredUser();

  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
    logout,
    fetchUserProfile,
    updateUser,
    hasUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;