import React, { useState,useEffect  } from 'react';
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
  User
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('favorites');
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/user/users?page=${page}&limit=${limit}`);
      const data = await response.json();

      const enrichedUsers = data.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        favorites: u.favorites.map(f => ({
          id: f.maid.id,
          name: f.maid.name,
          nationality: f.maid.country,
          imageUrl: '😊'
        })),
        recommendations: u.recommendations.flatMap(r =>
          r.recommendationMaids.map(rm => ({
            id: rm.maid.id,
            name: rm.maid.name,
            nationality: rm.maid.country,
            imageUrl: '😊'
          }))
        )
      }));

      setUsers(enrichedUsers);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
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
    
    const maid = availableMaids.find(m => m.id === maidId);
    if (!maid) return;

    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        const alreadyRecommended = user.recommendations.some(r => r.id === maidId);
        if (!alreadyRecommended) {
          return {
            ...user,
            recommendations: [...user.recommendations, maid]
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

    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          recommendations: user.recommendations.filter(r => r.id !== maidId)
        };
      }
      return user;
    }));

    // Update selectedUser to reflect changes
    setSelectedUser({
      ...selectedUser,
      recommendations: selectedUser.recommendations.filter(r => r.id !== maidId)
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
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
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <ShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Store className="w-5 h-5" />
              <span>Manage Store</span>
            </a>
          </div>

          <div className="mt-12 px-6 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Customer Management</h2>
              <p className="text-gray-600 text-sm mt-1">Manage customer profiles and their maid preferences</p>
            </div>
            
            <div className="overflow-x-auto">
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
                  {filteredUsers.map((user) => (
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
                          <span className="text-sm text-gray-900">{user.favorites.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-900">{user.recommendations.length}</span>
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
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button 
                  disabled={(page * limit) >= total} 
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'favorites'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites ({selectedUser.favorites.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'recommendations'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Recommendations ({selectedUser.recommendations.length})
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'favorites' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Customer's Favorite Maids</h4>
                  {selectedUser.favorites.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No favorites yet</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedUser.favorites.map((maid) => (
                        <div key={maid.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                              {maid.imageUrl}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{maid.name}</p>
                              <p className="text-sm text-gray-500">{maid.nationality}</p>
                              <p className="text-xs text-gray-400">ID: {maid.id}</p>
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
  className="cursor-pointer hover:bg-gray-100 p-4 rounded"
>
  add maid
</div>
                    </div>
                  </div>

                  {selectedUser.recommendations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recommendations yet</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedUser.recommendations.map((maid) => (
                        <div key={maid.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                              {maid.imageUrl}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{maid.name}</p>
                              <p className="text-sm text-gray-500">{maid.nationality}</p>
                              <p className="text-xs text-gray-400">ID: {maid.id}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveRecommendation(maid.id)}
                              className="text-red-500 hover:text-red-700"
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