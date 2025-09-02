// Mock data for admin management pages - centralized fallback system
// Easy to disable/remove when real API integration is complete

// ============================================================================
// CONFIGURATION - Set to false to disable all mock data
// ============================================================================
export const MOCK_ADMIN_DATA_ENABLED = true;

// Helper function to check if mock data should be used
export const isMockDataEnabled = () => MOCK_ADMIN_DATA_ENABLED;

// ============================================================================
// MOCK MAID DATA - Enhanced for admin management
// ============================================================================
export const mockMaidsAdmin = [
  {
    id: 'ADM_001',
    name: 'Maria Santos',
    country: 'Philippines',
    salary: 650,
    DOB: '1992-03-15',
    skills: ['Cooking', 'Housekeeping', 'Childcare'],
    languages: ['English', 'Filipino', 'Mandarin'],
    type: ['Experienced'],
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=400&fit=crop&crop=face',
    height: 158,
    weight: 52,
    // Admin-specific fields
    status: 'available',
    supplierId: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    notes: 'Excellent with children, speaks multiple languages',
    contractStatus: 'active',
    workHistory: [
      { employer: 'Tan Family', duration: '2022-2023', location: 'Singapore', rating: 5 }
    ]
  },
  {
    id: 'ADM_002',
    name: 'Siti Nurhaliza',
    country: 'Indonesia',
    salary: 580,
    DOB: '1995-07-22',
    skills: ['Housekeeping', 'Cooking', 'Elderly Care'],
    languages: ['English', 'Indonesian', 'Malay'],
    type: ['Transfer'],
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop&crop=face',
    height: 160,
    weight: 48,
    status: 'available',
    supplierId: 2,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-10T16:45:00Z',
    notes: 'Previous experience with elderly care, very gentle',
    contractStatus: 'active',
    workHistory: [
      { employer: 'Lee Family', duration: '2023-2024', location: 'Singapore', rating: 4 }
    ]
  },
  {
    id: 'ADM_003',
    name: 'Thida Win',
    country: 'Myanmar',
    salary: 520,
    DOB: '1988-11-08',
    skills: ['Cooking', 'Babysitting', 'Housekeeping'],
    languages: ['English', 'Burmese'],
    type: ['New/Fresh'],
    imageUrl: 'https://images.unsplash.com/photo-1594824350830-78b7dc8b7b33?w=300&h=400&fit=crop&crop=face',
    height: 155,
    weight: 50,
    status: 'employed',
    supplierId: 1,
    createdAt: '2024-01-10T11:20:00Z',
    updatedAt: '2024-01-25T13:30:00Z',
    notes: 'First-time worker, eager to learn and very motivated',
    contractStatus: 'active',
    workHistory: []
  },
  {
    id: 'ADM_004',
    name: 'Priya Sharma',
    country: 'India',
    salary: 600,
    DOB: '1990-05-14',
    skills: ['Cooking', 'Childcare', 'Caregiving'],
    languages: ['English', 'Hindi', 'Tamil'],
    type: ['Experienced'],
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=400&fit=crop&crop=face',
    height: 162,
    weight: 54,
    status: 'available',
    supplierId: 3,
    createdAt: '2024-01-20T14:45:00Z',
    updatedAt: '2024-02-05T10:15:00Z',
    notes: 'Excellent cook, specializes in Indian cuisine',
    contractStatus: 'active',
    workHistory: [
      { employer: 'Kumar Family', duration: '2021-2023', location: 'Singapore', rating: 5 }
    ]
  },
  {
    id: 'ADM_005',
    name: 'Rashida Begum',
    country: 'Bangladesh',
    salary: 480,
    DOB: '1993-09-30',
    skills: ['Housekeeping', 'Cooking', 'Elderly Care'],
    languages: ['English', 'Bengali'],
    type: ['Transfer'],
    imageUrl: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=400&fit=crop&crop=face',
    height: 157,
    weight: 49,
    status: 'available',
    supplierId: 2,
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2024-02-20T12:00:00Z',
    notes: 'Very reliable, good with elderly care',
    contractStatus: 'active',
    workHistory: [
      { employer: 'Wong Family', duration: '2023', location: 'Singapore', rating: 4 }
    ]
  },
  {
    id: 'ADM_006',
    name: 'Carmen Reyes',
    country: 'Philippines',
    salary: 680,
    DOB: '1986-01-20',
    skills: ['Cooking', 'Childcare', 'Housekeeping', 'Elderly Care'],
    languages: ['English', 'Filipino', 'Cantonese'],
    type: ['Experienced'],
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=400&fit=crop&crop=face',
    height: 160,
    weight: 53,
    status: 'employed',
    supplierId: 1,
    createdAt: '2024-01-05T15:20:00Z',
    updatedAt: '2024-01-30T09:45:00Z',
    notes: 'Highly experienced, multilingual, excellent references',
    contractStatus: 'active',
    workHistory: [
      { employer: 'Chen Family', duration: '2020-2023', location: 'Singapore', rating: 5 },
      { employer: 'Lim Family', duration: '2018-2020', location: 'Singapore', rating: 5 }
    ]
  },
  {
    id: 'ADM_007',
    name: 'Dewi Lestari',
    country: 'Indonesia',
    salary: 560,
    DOB: '1995-02-28',
    skills: ['Housekeeping', 'Cooking', 'Dog(s)', 'Cat(s)'],
    languages: ['English', 'Indonesian'],
    type: ['New/Fresh'],
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=400&fit=crop&crop=face',
    height: 157,
    weight: 49,
    status: 'available',
    supplierId: 3,
    createdAt: '2024-02-10T12:15:00Z',
    updatedAt: '2024-02-25T14:30:00Z',
    notes: 'Great with pets, first overseas assignment',
    contractStatus: 'active',
    workHistory: []
  },
  {
    id: 'ADM_008',
    name: 'Nurul Hassan',
    country: 'Malaysia',
    salary: 720,
    DOB: '1989-06-12',
    skills: ['Cooking', 'Childcare', 'Elderly Care', 'Cat(s)'],
    languages: ['English', 'Malay', 'Mandarin'],
    type: ['Experienced'],
    imageUrl: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2b?w=300&h=400&fit=crop&crop=face',
    height: 163,
    weight: 55,
    status: 'available',
    supplierId: 1,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-02-01T16:20:00Z',
    notes: 'Premium helper, excellent with children and elderly',
    contractStatus: 'active',
    workHistory: [
      { employer: 'Abdullah Family', duration: '2021-2024', location: 'Malaysia', rating: 5 }
    ]
  }
];

// ============================================================================
// MOCK USER DATA - For user management
// ============================================================================
export const mockUsersAdmin = [
  {
    id: 'USR_001',
    name: 'John Tan',
    email: 'john.tan@email.com',
    phone: '+65 9123 4567',
    registrationDate: '2024-01-15',
    status: 'active',
    lastLogin: '2024-02-28T10:30:00Z',
    favorites: [
      {
        maidId: 'ADM_001',
        addedDate: '2024-02-10',
        maid: {
          name: 'Maria Santos',
          country: 'Philippines',
          imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=400&fit=crop&crop=face'
        }
      },
      {
        maidId: 'ADM_004',
        addedDate: '2024-02-15',
        maid: {
          name: 'Priya Sharma',
          country: 'India',
          imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=400&fit=crop&crop=face'
        }
      }
    ],
    recommendations: [
      {
        id: 1,
        createdDate: '2024-02-20',
        recommendationMaids: [
          {
            maidId: 'ADM_002',
            recommendationId: 1,
            maid: {
              name: 'Siti Nurhaliza',
              country: 'Indonesia',
              imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop&crop=face'
            }
          },
          {
            maidId: 'ADM_005',
            recommendationId: 1,
            maid: {
              name: 'Rashida Begum',
              country: 'Bangladesh',
              imageUrl: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=400&fit=crop&crop=face'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'USR_002',
    name: 'Sarah Wong',
    email: 'sarah.wong@email.com',
    phone: '+65 8765 4321',
    registrationDate: '2024-01-20',
    status: 'active',
    lastLogin: '2024-02-27T15:45:00Z',
    favorites: [
      {
        maidId: 'ADM_006',
        addedDate: '2024-02-05',
        maid: {
          name: 'Carmen Reyes',
          country: 'Philippines',
          imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=400&fit=crop&crop=face'
        }
      }
    ],
    recommendations: [
      {
        id: 2,
        createdDate: '2024-02-18',
        recommendationMaids: [
          {
            maidId: 'ADM_008',
            recommendationId: 2,
            maid: {
              name: 'Nurul Hassan',
              country: 'Malaysia',
              imageUrl: 'https://images.unsplash.com/photo-1574701148212-8518049c7b2b?w=300&h=400&fit=crop&crop=face'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'USR_003',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+65 9876 5432',
    registrationDate: '2024-02-01',
    status: 'active',
    lastLogin: '2024-02-26T09:20:00Z',
    favorites: [
      {
        maidId: 'ADM_003',
        addedDate: '2024-02-12',
        maid: {
          name: 'Thida Win',
          country: 'Myanmar',
          imageUrl: 'https://images.unsplash.com/photo-1594824350830-78b7dc8b7b33?w=300&h=400&fit=crop&crop=face'
        }
      },
      {
        maidId: 'ADM_007',
        addedDate: '2024-02-20',
        maid: {
          name: 'Dewi Lestari',
          country: 'Indonesia',
          imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=400&fit=crop&crop=face'
        }
      }
    ],
    recommendations: [
      {
        id: 3,
        createdDate: '2024-02-22',
        recommendationMaids: [
          {
            maidId: 'ADM_001',
            recommendationId: 3,
            maid: {
              name: 'Maria Santos',
              country: 'Philippines',
              imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=400&fit=crop&crop=face'
            }
          },
          {
            maidId: 'ADM_004',
            recommendationId: 3,
            maid: {
              name: 'Priya Sharma',
              country: 'India',
              imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=400&fit=crop&crop=face'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'USR_004',
    name: 'Linda Lim',
    email: 'linda.lim@email.com',
    phone: '+65 8123 9876',
    registrationDate: '2024-01-25',
    status: 'inactive',
    lastLogin: '2024-02-15T11:30:00Z',
    favorites: [],
    recommendations: []
  },
  {
    id: 'USR_005',
    name: 'David Kumar',
    email: 'david.kumar@email.com',
    phone: '+65 9234 5678',
    registrationDate: '2024-02-10',
    status: 'active',
    lastLogin: '2024-02-28T14:15:00Z',
    favorites: [
      {
        maidId: 'ADM_002',
        addedDate: '2024-02-25',
        maid: {
          name: 'Siti Nurhaliza',
          country: 'Indonesia',
          imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop&crop=face'
        }
      }
    ],
    recommendations: []
  }
];

// ============================================================================
// MOCK SUPPLIERS DATA - For suppliers management
// ============================================================================
export const mockSuppliersAdmin = [
  {
    id: 1,
    companyName: 'Asia Maid Services Pte Ltd',
    contactPerson: 'John Lim Wei Ming',
    email: 'john.lim@asiamaid.com.sg',
    phone: '+65 6123 4567',
    mobile: '+65 9123 4567',
    address: '123 Orchard Road, #12-34, Singapore 238874',
    status: 'active',
    maidsCount: 45,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20',
    licenseNumber: 'EAS-2024-001',
    website: 'https://asiamaid.com.sg',
    notes: 'Premium supplier with excellent track record',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    commissionRate: 15.5
  },
  {
    id: 2,
    companyName: 'Premier Helpers International',
    contactPerson: 'Sarah Wong Li Hua',
    email: 'sarah.wong@premierhelpers.sg',
    phone: '+65 6876 5432',
    mobile: '+65 9876 5432',
    address: '456 Raffles Place, #08-15, Singapore 048623',
    status: 'active',
    maidsCount: 32,
    createdAt: '2024-02-20',
    updatedAt: '2024-02-25',
    licenseNumber: 'EAS-2024-002',
    website: 'https://premierhelpers.sg',
    notes: 'Specializes in experienced helpers from Philippines',
    contractStartDate: '2024-02-01',
    contractEndDate: '2025-01-31',
    commissionRate: 12.0
  },
  {
    id: 3,
    companyName: 'Global Care Solutions',
    contactPerson: 'Michael Tan Boon Kiat',
    email: 'michael.tan@globalcare.com.sg',
    phone: '+65 6765 4321',
    mobile: '+65 8765 4321',
    address: '789 Marina Bay Sands, #25-12, Singapore 018956',
    status: 'inactive',
    maidsCount: 18,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    licenseNumber: 'EAS-2024-003',
    website: 'https://globalcare.com.sg',
    notes: 'Currently under review - license renewal pending',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    commissionRate: 10.0
  },
  {
    id: 4,
    companyName: 'Reliable Domestic Services',
    contactPerson: 'Jennifer Lee Mei Ling',
    email: 'jennifer.lee@reliabledomestic.sg',
    phone: '+65 6555 1234',
    mobile: '+65 9555 1234',
    address: '321 Tanjong Pagar Road, #15-20, Singapore 088539',
    status: 'active',
    maidsCount: 28,
    createdAt: '2024-01-28',
    updatedAt: '2024-02-28',
    licenseNumber: 'EAS-2024-004',
    website: 'https://reliabledomestic.sg',
    notes: 'Strong network in Indonesia and Myanmar',
    contractStartDate: '2024-02-01',
    contractEndDate: '2025-01-31',
    commissionRate: 13.5
  },
  {
    id: 5,
    companyName: 'Excellence Maid Agency',
    contactPerson: 'Robert Ng Wee Heng',
    email: 'robert.ng@excellencemaid.sg',
    phone: '+65 6333 7890',
    mobile: '+65 8333 7890',
    address: '567 Clementi Road, #10-05, Singapore 129823',
    status: 'pending',
    maidsCount: 12,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-28',
    licenseNumber: 'EAS-2024-005',
    website: 'https://excellencemaid.sg',
    notes: 'New supplier - application under review',
    contractStartDate: '2024-03-01',
    contractEndDate: '2025-02-28',
    commissionRate: 11.0
  }
];

// ============================================================================
// MOCK API RESPONSE GENERATORS - Simulate real API responses
// ============================================================================

export const createMockMaidsResponse = (page = 1, limit = 20) => {
  if (!isMockDataEnabled()) return null;
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMaids = mockMaidsAdmin.slice(startIndex, endIndex);
  
  return {
    maids: paginatedMaids,
    total: mockMaidsAdmin.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(mockMaidsAdmin.length / limit)
  };
};

export const createMockUsersResponse = (page = 1, limit = 10) => {
  if (!isMockDataEnabled()) return null;
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = mockUsersAdmin.slice(startIndex, endIndex);
  
  return {
    users: paginatedUsers,
    total: mockUsersAdmin.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(mockUsersAdmin.length / limit)
  };
};

export const createMockSuppliersResponse = () => {
  if (!isMockDataEnabled()) return null;
  
  return mockSuppliersAdmin;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Get mock data by ID
export const getMockMaidById = (id) => {
  if (!isMockDataEnabled()) return null;
  return mockMaidsAdmin.find(maid => maid.id === id);
};

export const getMockUserById = (id) => {
  if (!isMockDataEnabled()) return null;
  return mockUsersAdmin.find(user => user.id === id);
};

export const getMockSupplierById = (id) => {
  if (!isMockDataEnabled()) return null;
  return mockSuppliersAdmin.find(supplier => supplier.id === id);
};

// Search functions
export const searchMockMaids = (query) => {
  if (!isMockDataEnabled()) return null;
  
  const lowercaseQuery = query.toLowerCase();
  return mockMaidsAdmin.filter(maid => 
    maid.name.toLowerCase().includes(lowercaseQuery) ||
    maid.country.toLowerCase().includes(lowercaseQuery) ||
    maid.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchMockUsers = (query) => {
  if (!isMockDataEnabled()) return null;
  
  const lowercaseQuery = query.toLowerCase();
  return mockUsersAdmin.filter(user => 
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchMockSuppliers = (query) => {
  if (!isMockDataEnabled()) return null;
  
  const lowercaseQuery = query.toLowerCase();
  return mockSuppliersAdmin.filter(supplier => 
    supplier.companyName.toLowerCase().includes(lowercaseQuery) ||
    supplier.contactPerson.toLowerCase().includes(lowercaseQuery) ||
    supplier.email.toLowerCase().includes(lowercaseQuery)
  );
};

// ============================================================================
// MOCK DASHBOARD STATISTICS - Generate realistic dashboard data
// ============================================================================

export const createMockDashboardStats = () => {
  if (!isMockDataEnabled()) return null;

  // Calculate statistics from mock maid data
  const availableMaids = mockMaidsAdmin.filter(maid => maid.status === 'available').length;
  const employedMaids = mockMaidsAdmin.filter(maid => maid.status === 'employed').length;
  
  // Calculate nationality distribution
  const nationalityStats = mockMaidsAdmin.reduce((acc, maid) => {
    acc[maid.country] = (acc[maid.country] || 0) + 1;
    return acc;
  }, {});

  // Calculate skills distribution
  const skillsStats = mockMaidsAdmin.reduce((acc, maid) => {
    if (maid.skills && Array.isArray(maid.skills)) {
      maid.skills.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Calculate average salary
  const validSalaries = mockMaidsAdmin.filter(maid => maid.salary && !isNaN(maid.salary));
  const avgSalary = validSalaries.length > 0 
    ? Math.round(validSalaries.reduce((sum, maid) => sum + parseFloat(maid.salary), 0) / validSalaries.length)
    : 0;

  // Count total recommendations from mock users
  const totalRecommendations = mockUsersAdmin.reduce((total, user) => {
    if (user.recommendations && user.recommendations.length > 0) {
      return total + (user.recommendations[0].recommendationMaids?.length || 0);
    }
    return total;
  }, 0);

  // Generate recent activity (simulated but realistic)
  const recentActivity = [
    { 
      type: 'maid_added', 
      count: 2, 
      timeframe: 'today',
      trending: 15
    },
    { 
      type: 'user_registered', 
      count: 1, 
      timeframe: 'today',
      trending: 8
    },
    { 
      type: 'recommendations_made', 
      count: 5, 
      timeframe: 'this week',
      trending: 20
    },
    { 
      type: 'maids_employed', 
      count: 1, 
      timeframe: 'this week',
      trending: 5
    }
  ];

  return {
    totalMaids: mockMaidsAdmin.length,
    availableMaids,
    employedMaids,
    totalUsers: mockUsersAdmin.length,
    totalRecommendations,
    recentActivity,
    maidStats: {
      nationalities: nationalityStats,
      skills: skillsStats,
      avgSalary
    }
  };
};

// ============================================================================
// HOW TO DISABLE/REMOVE MOCK DATA
// ============================================================================
/*

TO DISABLE MOCK DATA:
1. Set MOCK_ADMIN_DATA_ENABLED = false at the top of this file
2. All admin pages will automatically fall back to real API calls

TO COMPLETELY REMOVE MOCK DATA:
1. Delete this entire file: src/data/mockAdminData.js
2. Remove imports from admin management pages:
   - userManagement.jsx
   - SuppliersManagement.jsx
   - Any future maidManagement.jsx
3. Remove fallback mock data calls from those pages

The system is designed to gracefully handle both scenarios.

*/