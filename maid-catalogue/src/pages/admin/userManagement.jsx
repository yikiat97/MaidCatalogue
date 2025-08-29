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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('favorites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.ADMIN.USERS, { page, limit }), {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('Users data received:', data); // Debug log
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [page, limit]);

  const [searchQuery, setSearchQuery] = useState('');
  const [availableMaids] = useState([
    { id: 'ID-6', name: 'Emma', nationality: 'Indonesia', imageUrl: '😊' },
    { id: 'ID-7', name: 'Sophia', nationality: 'Philippines', imageUrl: '😊' },
    { id: 'ID-8', name: 'Lisa', nationality: 'Myanmar', imageUrl: '😊' }
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRecommendation = (maidId) => {
    if (!selectedUser) return;
    
    console.log('Adding recommendation for user:', selectedUser.id, 'maid:', maidId); // Debug log
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

  const handleRemoveRecommendation = (maidId) => {
    if (!selectedUser) return;

    console.log('Removing recommendation for user:', selectedUser.id, 'maid:', maidId); // Debug log

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
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Redirect to admin login page
        navigate('/system-access');
      } else {
        console.error('Logout failed');
        // Still redirect even if logout fails
        navigate('/system-access');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Redirect even if there's an error
      navigate('/system-access');
    }
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
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Package className="w-5 h-5" />
              <span>Maid Management</span>
            </a>
            <a href="/userManagement" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-600 bg-blue-50">
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
                    console.log('User data:', user); // Debug log
                    console.log('User recommendations:', user.recommendations); // Debug log
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
                        <div key={favorite.maidId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                              {favorite.maid?.imageUrl ? '🖼️' : '😊'}
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
                        <div key={recommendation.maidId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                              {recommendation.imageUrl ? '🖼️' : '😊'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{recommendation.maid?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{recommendation.maid?.country || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">ID: {recommendation.maidId}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveRecommendation(recommendation.maidId)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default UserManagement;