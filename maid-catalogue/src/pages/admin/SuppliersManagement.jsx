import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  UserCheck, 
  LogOut, 
  Bell,
  Menu,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Building2
} from 'lucide-react';
import API_CONFIG from '../../config/api.js';
import AdminLogo from '../../components/admin/AdminLogo';
import { createMockSuppliersResponse, isMockDataEnabled, searchMockSuppliers } from '../../data/mockAdminData.js';

// shadcn components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

// Modals (will create these next)
import AddSupplierModal from '../../components/admin/AddSupplierModal';
import EditSupplierModal from '../../components/admin/EditSupplierModal';
import DeleteSupplierModal from '../../components/admin/DeleteSupplierModal';

// Brand colors
const brandColors = {
  primary: '#ff914d',
  secondary: '#0c191b',
  primaryLight: '#ffa366',
  primaryDark: '#e67e22',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#0c191b',
  textSecondary: '#5a6c6f',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c'
};

const SuppliersManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Fetch suppliers data
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.SUPPLIERS), {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        throw new Error('Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      
      // Use centralized mock data as fallback
      if (isMockDataEnabled()) {
        console.warn('🔄 Using fallback mock data for suppliers management');
        const mockData = createMockSuppliersResponse();
        setSuppliers(mockData);
      } else {
        setSuppliers([]);
      }
    }
    setLoading(false);
  };

  // Search suppliers
  const handleSearch = async (query) => {
    if (!query.trim()) {
      fetchSuppliers();
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.ADMIN.SEARCH_SUPPLIERS, { query }), 
        { credentials: 'include' }
      );
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Error searching suppliers:', error);
      
      // Use mock search as fallback
      if (isMockDataEnabled()) {
        console.warn('🔄 Using fallback mock search for suppliers');
        const mockResults = searchMockSuppliers(query);
        setSuppliers(mockResults);
      }
    }
    setIsSearching(false);
  };


  // Helper function to get nav link classes
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "flex items-center space-x-3 px-3 py-2 rounded-lg text-primary-orange bg-orange-50 border border-orange-200"
      : "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100";
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  const handleRefresh = () => {
    fetchSuppliers();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out lg:transition-none`}>
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <AdminLogo size="medium" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">EASY<span className="text-gray-600">HIRE</span></h1>
              <p className="text-xs text-gray-500">MAID SOLUTIONS 女佣介</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-6 space-y-2">
            <Link to="/admin/dashboard" className={getNavLinkClass("/admin/dashboard")}>
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/maidManagement" className={getNavLinkClass("/admin/maidManagement")}>
              <Package className="w-5 h-5" />
              <span>Maid Management</span>
            </Link>
            <Link to="/admin/userManagement" className={getNavLinkClass("/admin/userManagement")}>
              <Users className="w-5 h-5" />
              <span>Users Management</span>
            </Link>
            <Link to="/admin/suppliers" className={getNavLinkClass("/admin/suppliers")}>
              <Building2 className="w-5 h-5" />
              <span>Suppliers</span>
            </Link>
          </div>

          <div className="mt-12 px-6 space-y-2">
            <Link to="/system-access" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </Link>
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
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search suppliers..."
                  className="w-full pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-orange"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                Refresh
              </Button>
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Suppliers ({suppliers.length})
                  </h2>
                </div>
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-orange hover:bg-primary-orange/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplier
                  </Button>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Manage your supplier network</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Maids</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">
                            {supplier.companyName}
                          </TableCell>
                          <TableCell>{supplier.contactPerson}</TableCell>
                          <TableCell>{supplier.email}</TableCell>
                          <TableCell>{supplier.phone}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {supplier.maidsCount || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(supplier.status)}>
                              {supplier.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(supplier)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(supplier)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Mobile Cards View */}
              <div className="lg:hidden p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suppliers.map((supplier) => (
                      <div key={supplier.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{supplier.companyName}</h3>
                            <p className="text-sm text-gray-500">{supplier.contactPerson}</p>
                          </div>
                          <Badge className={getStatusColor(supplier.status)}>
                            {supplier.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Email: </span>
                            <span className="text-gray-900">{supplier.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone: </span>
                            <span className="text-gray-900">{supplier.phone}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Maids: </span>
                            <Badge variant="secondary">{supplier.maidsCount || 0}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(supplier)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(supplier)}
                            className="flex-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddSupplierModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchSuppliers}
        />
      )}

      {showEditModal && selectedSupplier && (
        <EditSupplierModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSupplier(null);
          }}
          supplier={selectedSupplier}
          onSuccess={fetchSuppliers}
        />
      )}

      {showDeleteModal && selectedSupplier && (
        <DeleteSupplierModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedSupplier(null);
          }}
          supplier={selectedSupplier}
          onSuccess={fetchSuppliers}
        />
      )}
    </div>
  );
};

export default SuppliersManagement;