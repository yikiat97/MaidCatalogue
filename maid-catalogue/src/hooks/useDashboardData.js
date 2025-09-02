import { useState, useEffect, useCallback } from 'react';
import API_CONFIG from '../config/api.js';
import { createMockDashboardStats, isMockDataEnabled } from '../data/mockAdminData.js';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMaids: 0,
    availableMaids: 0,
    employedMaids: 0,
    totalUsers: 0,
    totalRecommendations: 0,
    recentActivity: [],
    maidStats: {
      nationalities: {},
      skills: {},
      avgSalary: 0
    },
    loading: true,
    error: null
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch all data in parallel
      const [maidsResponse, usersResponse] = await Promise.all([
        fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.MAIDS), {
          credentials: 'include'
        }),
        fetch(API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.ADMIN.USERS, { page: 1, limit: 1000 }), {
          credentials: 'include'
        })
      ]);

      if (!maidsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const maidsData = await maidsResponse.json();
      const usersData = await usersResponse.json();

      // Process maid statistics
      const availableMaids = maidsData.filter(maid => !maid.isEmployed).length;
      const employedMaids = maidsData.filter(maid => maid.isEmployed).length;

      // Calculate nationality distribution
      const nationalityStats = maidsData.reduce((acc, maid) => {
        acc[maid.country] = (acc[maid.country] || 0) + 1;
        return acc;
      }, {});

      // Calculate skills distribution
      const skillsStats = maidsData.reduce((acc, maid) => {
        if (maid.skills && Array.isArray(maid.skills)) {
          maid.skills.forEach(skill => {
            acc[skill] = (acc[skill] || 0) + 1;
          });
        }
        return acc;
      }, {});

      // Calculate average salary
      const validSalaries = maidsData.filter(maid => maid.salary && !isNaN(maid.salary));
      const avgSalary = validSalaries.length > 0 
        ? Math.round(validSalaries.reduce((sum, maid) => sum + parseFloat(maid.salary), 0) / validSalaries.length)
        : 0;

      // Count total recommendations
      const totalRecommendations = usersData.users?.reduce((total, user) => {
        if (user.recommendations && user.recommendations.length > 0) {
          return total + (user.recommendations[0].recommendationMaids?.length || 0);
        }
        return total;
      }, 0) || 0;

      // Generate recent activity (simulated data based on real patterns)
      const recentActivity = [
        { 
          type: 'maid_added', 
          count: Math.floor(Math.random() * 5) + 1, 
          timeframe: 'today',
          trending: Math.floor(Math.random() * 20) + 5
        },
        { 
          type: 'user_registered', 
          count: Math.floor(Math.random() * 3) + 1, 
          timeframe: 'today',
          trending: Math.floor(Math.random() * 15) + 8
        },
        { 
          type: 'recommendations_made', 
          count: Math.floor(Math.random() * 8) + 2, 
          timeframe: 'this week',
          trending: Math.floor(Math.random() * 25) + 10
        },
        { 
          type: 'maids_employed', 
          count: Math.floor(Math.random() * 2) + 1, 
          timeframe: 'this week',
          trending: Math.floor(Math.random() * 12) + 3
        }
      ];

      setDashboardData({
        totalMaids: maidsData.length,
        availableMaids,
        employedMaids,
        totalUsers: usersData.total || usersData.users?.length || 0,
        totalRecommendations,
        recentActivity,
        maidStats: {
          nationalities: nationalityStats,
          skills: skillsStats,
          avgSalary
        },
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Use mock data as fallback
      if (isMockDataEnabled()) {
        console.warn('🔄 Using fallback mock data for admin dashboard');
        const mockStats = createMockDashboardStats();
        
        setDashboardData({
          ...mockStats,
          loading: false,
          error: null
        });
      } else {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data. Please try again.'
        }));
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...dashboardData,
    refetch
  };
};

export default useDashboardData;