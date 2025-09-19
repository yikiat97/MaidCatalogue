import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  UserCheck, 
  ShoppingCart, 
  Store, 
  Settings, 
  LogOut, 
  Search, 
  Bell,
  X,
  Heart,
  Star,
  Plus,
  Trash2,
  Mail,
  User,
  Menu
} from 'lucide-react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import API_CONFIG from '../../config/api.js';
import ViewMaidModal from '../../components/admin/ViewMaidModal';

/**
 * 🚨 CRITICAL SECURITY WARNING 🚨
 *
 * This admin component has significant security vulnerabilities that MUST be addressed:
 *
 * 1. CLIENT-SIDE ONLY AUTHORIZATION:
 *    - Admin access is only validated on the frontend
 *    - Malicious users can bypass these checks
 *    - All server endpoints MUST implement proper admin role verification
 *
 * 2. MISSING SERVER-SIDE VALIDATION:
 *    - API endpoints must verify admin role before processing requests
 *    - JWT tokens or session data must be validated server-side
 *    - Implement proper RBAC (Role-Based Access Control) on the backend
 *
 * 3. REQUIRED SERVER-SIDE FIXES:
 *    - Add middleware to verify admin role for all admin endpoints
 *    - Implement proper session management with HttpOnly cookies
 *    - Add rate limiting to prevent admin API abuse
 *    - Log all admin actions for security audit
 *    - Add CSRF protection for state-changing operations
 *
 * 4. IMMEDIATE ACTIONS REQUIRED:
 *    - Review and secure all admin API endpoints
 *    - Implement proper authentication middleware
 *    - Add authorization checks in backend controllers
 *    - Audit all admin operations for proper access control
 *
 * DO NOT use this in production without proper server-side security!
 */

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingRecommendation, setDeletingRecommendation] = useState(null);
  const [activeTab, setActiveTab] = useState('favorites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMaidId, setSelectedMaidId] = useState(null);
  const [showMaidModal, setShowMaidModal] = useState(false);
  const navigate = useNavigate();

     useEffect(() => {
     // Check session validity on page load
     const checkInitialSession = async () => {
       try {
         // Debug: Check session state (sanitized for security)
         console.log('Checking admin authentication state...');
         
         const url = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.USERS);
         const response = await fetch(url, {
           method: 'HEAD', // Lightweight check
           credentials: 'include',
           headers: {
             'Content-Type': 'application/json',
           },
         });
         
         console.log('Admin authentication check completed with status:', response.status);
        
        if (response.status === 401 || response.status === 403) {
          handleUnauthorizedAccess('access the user management page');
          return; // Don't fetch users if unauthorized
        }
        
        // If authorized, proceed with normal operations
        fetchUsers();
      } catch (error) {
        console.error('Initial session check failed:', error);
        // If we can't even check, assume unauthorized
        handleUnauthorizedAccess('access the user management page');
        return;
      }
    };
    
    checkInitialSession();
  }, [page, limit]);

     const fetchUsers = async () => {
     setLoading(true);
     try {
       const url = API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.ADMIN.USERS, { page, limit });
       console.log('Fetching users data...');
       const response = await fetch(url, {
         credentials: 'include',
         headers: {
           'Content-Type': 'application/json',
         },
       });
       
       console.log('Fetch users response status:', response.status);
      
      // Check if response indicates unauthorized access
      if (checkAuthStatus(response, 'view users')) {
        setLoading(false);
        return; // Exit early if unauthorized
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
             const data = await response.json();
       console.log('Users data received successfully');
       setUsers(data.users || []);
       setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Check if it's an auth error
      if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
        handleUnauthorizedAccess('view users');
      } else {
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [availableMaids] = useState([
    { id: 'ID-6', name: 'Emma', nationality: 'Indonesia', imageUrl: '😊' },
    { id: 'ID-7', name: 'Sophia', nationality: 'Philippines', imageUrl: '😊' },
    { id: 'ID-8', name: 'Lisa', nationality: 'Myanmar', imageUrl: '😊' }
  ]);

  // Handle unauthorized access by redirecting to login
  const handleUnauthorizedAccess = (action = 'perform this action') => {
    // Clear any stored data
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    
    // Show error message briefly
    setError(`Access denied or session expired. You cannot ${action}. Redirecting to login...`);
    
    // Redirect to admin login after a short delay
    setTimeout(() => {
      navigate('/system-access');
    }, 2000);
  };

  // Check if response indicates unauthorized access
  const checkAuthStatus = (response, action = 'perform this action') => {
    if (response.status === 401 || response.status === 403) {
      handleUnauthorizedAccess(action);
      return true; // Indicates unauthorized
    }
    return false; // Authorized
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRecommendation = (maidId) => {
    if (!selectedUser) return;
    
    console.log('Adding recommendation...'); // Debug log
    const maid = availableMaids.find(m => m.id === maidId);
    if (!maid) return;

    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        // Check if user already has recommendations
        if (user.recommendations && user.recommendations.length > 0) {
          const existingRecommendation = user.recommendations[0];
          const alreadyRecommended = existingRecommendation.recommendationMaids.some(rm => rm.maidId === maidId);
          
          if (!alreadyRecommended) {
            return {
              ...user,
              recommendations: [{
                ...existingRecommendation,
                recommendationMaids: [...existingRecommendation.recommendationMaids, {
                  maidId: maidId,
                  recommendationId: existingRecommendation.id,
                  maid: maid
                }]
              }]
            };
          }
        } else {
          // Create new recommendation structure
          return {
            ...user,
            recommendations: [{
              id: Date.now(), // Temporary ID
              recommendationMaids: [{
                maidId: maidId,
                recommendationId: Date.now(),
                maid: maid
              }]
            }]
          };
        }
      }
      return user;
    }));

    // Update selectedUser to reflect changes
    const updatedUser = users.find(u => u.id === selectedUser.id);
    if (updatedUser) {
      setSelectedUser({
        ...updatedUser,
        recommendations: [...updatedUser.recommendations, maid]
      });
    }
  };

  const handleViewMaid = (maidId) => {
    setSelectedMaidId(maidId);
    setShowMaidModal(true);
  };

  const handleCloseMaidModal = () => {
    setShowMaidModal(false);
    setSelectedMaidId(null);
  };

  const handleRemoveRecommendation = async (maidId) => {
    if (!selectedUser) return;

    console.log('Removing recommendation...'); // Debug log

    setDeletingRecommendation(maidId);

    try {
      // Call backend API to delete the recommendation
      const response = await fetch(
        API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.DELETE_RECOMMENDATION}/${selectedUser.id}/recommendations/${maidId}`),
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleUnauthorizedAccess('delete recommendation');
          return;
        }
        throw new Error('Failed to delete recommendation');
      }

      // If successful, update local state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          if (user.recommendations && user.recommendations.length > 0) {
            const existingRecommendation = user.recommendations[0];
            return {
              ...user,
              recommendations: [{
                ...existingRecommendation,
                recommendationMaids: existingRecommendation.recommendationMaids.filter(rm => rm.maidId !== maidId)
              }]
            };
          }
        }
        return user;
      }));

      // Update selectedUser to reflect changes
      if (selectedUser.recommendations && selectedUser.recommendations.length > 0) {
        const existingRecommendation = selectedUser.recommendations[0];
        setSelectedUser({
          ...selectedUser,
          recommendations: [{
            ...existingRecommendation,
            recommendationMaids: existingRecommendation.recommendationMaids.filter(rm => rm.maidId !== maidId)
          }]
        });
      }

      setSuccess('Recommendation deleted successfully');
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      setError('Failed to delete recommendation');
    } finally {
      setDeletingRecommendation(null);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout successful');
        setSuccess('You have been logged out successfully. Redirecting to login...');
      } else {
        console.error('Logout failed');
        setError('Logout failed. Redirecting to login...');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed due to network error. Redirecting to login...');
    }
    
    // Always clear local data and redirect after a short delay
    setTimeout(() => {
      // Clear any stored data
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      navigate('/system-access');
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg text-gray-600 hover:text-gray-800"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out lg:transition-none`}>
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">EASY<span className="text-gray-600">HIRE</span></h1>
              <p className="text-xs text-gray-500">MAID SOLUTIONS 女佣介</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-6 space-y-2">
            <a href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="/admin/maidManagement" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Package className="w-5 h-5" />
              <span>Maid Management</span>
            </a>
            <a href="/admin/userManagement" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-600 bg-blue-50">
              <Users className="w-5 h-5" />
              <span>Users Management</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <UserCheck className="w-5 h-5" />
              <span>Suppliers</span>
            </a>
          </div>

          <div className="mt-12 px-6 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

              {/* Main Content */}
        <div className="flex-1 overflow-hidden lg:ml-0">
          {/* Header */}
          <div className="bg-white border-b px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] bg-red-50 border-l-4 border-red-400 p-4 mx-4 rounded-md shadow-lg max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] bg-green-500 text-white p-4 mx-4 rounded-lg shadow-lg max-w-md animate-bounce">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccess(null)}
                    className="inline-flex text-white hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-500"
                  >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L10 11.414l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            
          )}

        {/* Users Table */}
        <div className="p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 lg:p-6 border-b">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Customer Management</h2>
              <p className="text-gray-600 text-sm mt-1">Manage customer profiles and their maid preferences</p>
            </div>
            
            {/* Mobile Cards View */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">#{user.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-gray-900">
                          {user.favorites ? user.favorites.length : 0} favorites
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-900">
                          {user.recommendations && user.recommendations.length > 0 
                            ? user.recommendations[0].recommendationMaids.length 
                            : 0} recommendations
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Favorites</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    console.log('User data loaded for management'); // Debug log
                    return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-sm text-gray-900">
                            {user.favorites ? user.favorites.length : 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-900">
                            {user.recommendations && user.recommendations.length > 0 
                              ? user.recommendations[0].recommendationMaids.length 
                              : 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 lg:p-6 border-t">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button 
                disabled={(page * limit) >= total} 
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 lg:px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-4 lg:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'favorites'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites ({selectedUser.favorites ? selectedUser.favorites.length : 0})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`px-4 lg:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'recommendations'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Recommendations ({selectedUser.recommendations && selectedUser.recommendations.length > 0 
                      ? selectedUser.recommendations[0].recommendationMaids.length 
                      : 0})
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 lg:p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'favorites' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Customer's Favorite Maids</h4>
                  {(!selectedUser.favorites || selectedUser.favorites.length === 0) ? (
                    <p className="text-gray-500 text-center py-8">No favorites yet</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedUser.favorites.map((favorite) => (
                        <div 
                          key={favorite.maidId} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewMaid(favorite.maidId)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden">
                              {favorite.maid?.imageUrl ? (
                                <img 
                                  src={API_CONFIG.buildImageUrl(favorite.maid.imageUrl)} 
                                  alt={favorite.maid.name || 'Maid'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center text-xl ${favorite.maid?.imageUrl ? 'hidden' : ''}`}>
                                😊
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{favorite.maid?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{favorite.maid?.country || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">ID: {favorite.maidId}</p>
                            </div>
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Recommended Maids</h4>
                    <div className="flex items-center space-x-2">
                      <div
                        onClick={() => navigate(`/admin/${selectedUser.id}`)}
                        className="cursor-pointer hover:bg-gray-100 p-2 lg:p-4 rounded text-sm lg:text-base"
                      >
                        add maid
                      </div>
                    </div>
                  </div>

                  {(!selectedUser.recommendations || selectedUser.recommendations.length === 0 || 
                    !selectedUser.recommendations[0].recommendationMaids || 
                    selectedUser.recommendations[0].recommendationMaids.length === 0) ? (
                    <p className="text-gray-500 text-center py-8">No recommendations yet</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedUser.recommendations[0].recommendationMaids.map((recommendation) => (
                        <div 
                          key={recommendation.maidId} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewMaid(recommendation.maidId)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden">
                              {recommendation.maid?.imageUrl ? (
                                <img 
                                  src={API_CONFIG.buildImageUrl(recommendation.maid.imageUrl)} 
                                  alt={recommendation.maid?.name || 'Maid'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center text-xl ${recommendation.maid?.imageUrl ? 'hidden' : ''}`}>
                                😊
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{recommendation.maid?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{recommendation.maid?.country || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">ID: {recommendation.maidId}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from opening
                                handleRemoveRecommendation(recommendation.maidId);
                              }}
                              disabled={deletingRecommendation === recommendation.maidId}
                              className={`p-1 ${
                                deletingRecommendation === recommendation.maidId
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-red-500 hover:text-red-700'
                              }`}
                            >
                              {deletingRecommendation === recommendation.maidId ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Maid Modal */}
      {showMaidModal && selectedMaidId && (
        <ViewMaidModal
          maidId={selectedMaidId}
          onClose={handleCloseMaidModal}
        />
      )}
    </div>
  );
};

export default UserManagement;