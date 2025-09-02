import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  UserCheck, 
  LogOut, 
  Bell,
  Menu,
  BarChart3,
  Activity,
  Star,
  Plus
} from 'lucide-react';
import AdminLogo from '../../components/admin/AdminLogo';
import { StatsCard, QuickActionCard, ActivityCard } from '../../components/admin/dashboard';
import useDashboardData from '../../hooks/useDashboardData';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const {
    totalMaids,
    availableMaids,
    employedMaids,
    totalUsers,
    totalRecommendations,
    recentActivity,
    maidStats,
    loading,
    error,
    refetch
  } = useDashboardData();

  // Brand colors - matching catalogue design
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

  // Helper function to get nav link classes
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "flex items-center space-x-3 px-3 py-2 rounded-lg text-primary-orange bg-orange-50 border border-orange-200"
      : "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100";
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: brandColors.primary }}></div>
        </div>
      </div>
    );
  }

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
              <UserCheck className="w-5 h-5" />
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Overview of your maid agency system</p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={refetch}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Refresh
              </button>
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={refetch}
                className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          ) : null}

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Maids"
              value={totalMaids}
              subtitle={`${availableMaids} available • ${employedMaids} employed`}
              icon={Users}
              trend="up"
              trendValue="12"
              loading={loading}
              onClick={() => window.location.href = '/admin'}
            />
            <StatsCard
              title="Active Users"
              value={totalUsers}
              subtitle="Registered customers"
              icon={UserCheck}
              trend="up"
              trendValue="8"
              color={brandColors.success}
              loading={loading}
              onClick={() => window.location.href = '/userManagement'}
            />
            <StatsCard
              title="Recommendations"
              value={totalRecommendations}
              subtitle="Active recommendations"
              icon={Star}
              trend="up"
              trendValue="15"
              color={brandColors.warning}
              loading={loading}
            />
            <StatsCard
              title="Avg Salary"
              value={`$${maidStats.avgSalary}`}
              subtitle="Average maid salary"
              icon={BarChart3}
              trend="down"
              trendValue="3"
              color="#6366f1"
              loading={loading}
            />
          </div>

          {/* Detailed Stats and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Nationality Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maid Nationalities</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2"></div>
                        <div className="w-8 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(maidStats.nationalities).map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{country}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              backgroundColor: brandColors.primary,
                              width: `${totalMaids > 0 ? (count / totalMaids) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <ActivityCard
              title="Recent Activity"
              activities={recentActivity}
              loading={loading}
              color={brandColors.primary}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionCard
                title="Add New Maid"
                description="Register a new maid profile"
                icon={Plus}
                loading={loading}
                onClick={() => window.location.href = '/admin'}
              />
              <QuickActionCard
                title="Manage Users"
                description="View and manage customers"
                icon={Users}
                loading={loading}
                onClick={() => window.location.href = '/userManagement'}
                color={brandColors.success}
              />
              <QuickActionCard
                title="View Analytics"
                description="System performance metrics"
                icon={BarChart3}
                loading={loading}
                color="#6366f1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;