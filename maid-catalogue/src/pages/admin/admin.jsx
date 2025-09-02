import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api.js';

import { Search, Home, Package, Users, UserCheck, ShoppingCart, Store, Settings, LogOut, Bell, X, Plus, Trash2, Filter, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import AddMaidModal from '../../components/admin/AddMaidModal';
import MaidDetailModal from '../../components/admin/MaidDetailModal';
import LinkGeneratorModal from '../../components/admin/LinkGeneratorModal';
import AdminLogo from '../../components/admin/AdminLogo';


const Dashboard = () => {
  const navigate = useNavigate();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { userId: userIdParam } = useParams(); // ✅ use clearer alias
  const [userId, setUserId] = useState(null);
  const [recommendedIds, setRecommendedIds] = useState([]);
  
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

  // Manual logout function that redirects to login
  const handleLogout = async () => {
    try {
      // Call logout endpoint
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        credentials: 'include'
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

  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    country: '',
    salary: '',
    loan: '',
    DOB: '',
    height: '',
    weight: '',
    Religion: '',
    maritalStatus: '',
    NumChildren: '',
    skills: [],
    languages: [],
    type: [],
    isActive: true,
    isEmployed: false,
    supplier: '',
    maidDetails: {
      description: '',
      restDay: '',
      englishRating: '',
      chineseRating: '',
      dialectRating: '',
      highestEducation: '',
      religion: '',
      employmentHistory: ''
    },
    employmentDetails: []
  });

  // Enhanced filters with range bars and checkboxes
  const [filters, setFilters] = useState({
    nationality: [],
    skills: [],
    languages: [],
    type: [],
    maritalStatus: [],
    religion: [],
    availability: [],
    ageRange: [1, 65],
    heightRange: [100, 200],
    weightRange: [40, 200],
    salaryRange: [400, 2000],
    loanRange: [0, 10000],
    numChildrenRange: [0, 10]
  });

  // Options for filters
  const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
  const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
  const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
  const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];
  const maritalStatusOptions = ['Single', 'Married', 'Widowed', 'Divorced'];
  const religionOptions = ['Christian', 'Muslim', 'Buddhist', 'Hindu', 'Catholic', 'Others'];
  const availabilityOptions = ['Available', 'Employed', 'Draft'];

  const [maids, setMaids] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchMaids = async () => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.MAIDS), {
        credentials: 'include'
      });
      
      // Check if response indicates unauthorized access
      if (checkAuthStatus(response, 'view maids')) {
        return; // Exit early if unauthorized
      }
      
      const data = await response.json();

      const formatted = data.map((maid) => ({
        id: maid.id,
        supplier: maid.supplier,
        imageUrl: maid.imageUrl,
        name: maid.name,
        nationality: maid.country,
        religion: maid.Religion,
        ageWeightHeight: `${calculateAge(maid.DOB)}yo/${maid.height}cm/${maid.weight}kg`,
        maritalStatus: `${maid.maritalStatus}/${maid.NumChildren}`,
        availability: maid.isEmployed ? 'Employed' : (maid.isActive ? 'Available' : 'Draft'),
        // Add raw values for filtering
        age: calculateAge(maid.DOB),
        height: maid.height,
        weight: maid.weight,
        salary: maid.salary,
        loan: maid.loan,
        numChildren: maid.NumChildren,
        skills: maid.skills || [],
        languages: maid.languages || [],
        type: maid.type || []
      }));

      setMaids(formatted);
    } catch (err) {
      console.error('Failed to fetch maids:', err);
      // Check if it's an auth error
      if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
        handleUnauthorizedAccess('view maids');
      }
    }
  };

  // Search function
  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      // If search is empty, fetch all maids
      fetchMaids();
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.ADMIN.SEARCH_MAIDS, { query }), {
        credentials: 'include'
      });
      
      // Check if response indicates unauthorized access
      if (checkAuthStatus(response, 'search maids')) {
        setIsSearching(false);
        return; // Exit early if unauthorized
      }
      
      const data = await response.json();

      const formatted = data.map((maid) => ({
        id: maid.id,
        supplier: maid.supplier,
        imageUrl: maid.imageUrl,
        name: maid.name,
        nationality: maid.country,
        religion: maid.Religion,
        ageWeightHeight: `${calculateAge(maid.DOB)}yo/${maid.height}cm/${maid.weight}kg`,
        maritalStatus: `${maid.maritalStatus}/${maid.NumChildren}`,
        availability: maid.isEmployed ? 'Employed' : (maid.isActive ? 'Available' : 'Draft'),
        // Add raw values for filtering
        age: calculateAge(maid.DOB),
        height: maid.height,
        weight: maid.weight,
        salary: maid.salary,
        loan: maid.loan,
        numChildren: maid.NumChildren,
        skills: maid.skills || [],
        languages: maid.languages || [],
        type: maid.type || []
      }));

      setMaids(formatted);
    } catch (err) {
      console.error('Failed to search maids:', err);
      // Check if it's an auth error
      if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
        handleUnauthorizedAccess('search maids');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useRef(null);
  
  useEffect(() => {
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }
    
    debouncedSearch.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // 300ms delay

    return () => {
      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    // Check session validity on page load
    const checkInitialSession = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.MAIDS), {
          method: 'HEAD', // Lightweight check
          credentials: 'include'
        });
        
        if (response.status === 401 || response.status === 403) {
          handleUnauthorizedAccess('access the admin page');
          return; // Don't fetch maids if unauthorized
        }
        
        // If authorized, proceed with normal operations
        fetchMaids();
      } catch (error) {
        console.error('Initial session check failed:', error);
        // If we can't even check, assume unauthorized
        handleUnauthorizedAccess('access the admin page');
        return;
      }
    };
    
    checkInitialSession();
    clearMessages(); // Clear any existing messages when component mounts
  }, []);

  useEffect(() => {
    if (userIdParam) {
      setUserId(Number(userIdParam));
    } else {
      setUserId(null); // reset if no param
      setRecommendedIds([]);
    }

    // Load recommended maids for that user
    if (userIdParam) {
      fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.USER.RECOMMENDATIONS}/user/${userIdParam}`), {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSelectedItems(data.map(m => m.id))
            console.log(data)
          } else {
            setSelectedItems([])
            console.log('No recommendations found or invalid data format')
          }
        })
        .catch(err => {
          console.error('Failed to fetch recommendations:', err);
          setSelectedItems([])
        });
    }
      
  }, [userIdParam]);

  const toggleRecommendation = async (maidId) => {
    if (!userId) return;

    await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.USER.RECOMMENDATIONS}/${userId}/${maidId}`), {
      method: 'POST',
      credentials: 'include'
    });

    setRecommendedIds(prev =>
      prev.includes(maidId)
        ? prev.filter(id => id !== maidId)
        : [...prev, maidId]
    );
  };

  function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
  
  const handleGenerateLink = async () => {
  if (selectedItems.length === 0) {
    return alert('No maid selected in the list');
  }

  const generateLinkBody = {
    userId:userId,
    filters: {},             // optional filters
    maidIds: selectedItems,
  };
  console.log(generateLinkBody)

  try {
          const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.GENERATE_LINK), {
        method: 'POST',
        credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(generateLinkBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Link generated:', result);
      setGeneratedLink(result.url);
      setShowLinkModal(true); // ✅ open modal only after successful generation
    } else {
      alert('Failed to Generate link');
      throw new Error('Failed to Generate link');
    }

  } catch (error) {
    console.error('Error Generate link:', error);
    alert('Error Generate link. Please try again.');
  }
};

  
  
  const handleDeleteMaid = async (maidId) => {
    const confirm = window.confirm('Are you sure you want to delete this maid?');
    if (!confirm) return;
  
    try {
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.MAIDS}/${maidId}`), {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete maid');
      }
  
      alert('Maid deleted successfully!');
      // Refresh the maid list after deletion
      setMaids(prev => prev.filter(m => m.id !== maidId));
    } catch (err) {
      console.error(err);
      alert('Error deleting maid');
    }
  };
  
  
  const handleSelectItem = (id) => {
    console.log(id)

    const updateRecommendMaidForUser = toggleRecommendation(id)


    setSelectedItems(prev => {
      const updated = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      console.log('Updated selectedItems:', updated); // ✅ correct log
      return updated;
    });
  };
  
    // Handle array field changes (skills, languages, type)
    const handleArrayFieldChange = (fieldName, indexOrValue, value) => {
      // If only 2 parameters are passed, treat as array replacement
      if (value === undefined) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: indexOrValue
        }));
      } else {
        // If 3 parameters are passed, treat as single field update
        setFormData(prev => ({
          ...prev,
          [fieldName]: prev[fieldName].map((item, i) => i === indexOrValue ? value : item)
        }));
      }
    };
  
    const handleLanguageChange = (index, value) => {
      const updated = [...formData.languages];
      updated[index] = value;
      setFormData(prev => ({ ...prev, languages: updated }));
    };
  
    const handleRatingChange = (fieldName, value) => {
      setFormData(prev => ({
        ...prev,
        maidDetails: {
          ...prev.maidDetails,
          [fieldName]: parseInt(value)
        }
      }));
    };
  
  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  const removeArrayField = (field, index) => {
    setFormData(prev => {
      const updatedArray = prev[field].filter((_, i) => i !== index);
  
      // Check if we're removing a language and it's one of the 3 rated languages
      if (field === 'languages') {
        const removedLang = prev.languages[index];
  
        let updatedMaidDetails = { ...prev.maidDetails };
        if (['English', 'Chinese', 'Dialect'].includes(removedLang)) {
          const ratingKey =
            removedLang.toLowerCase() === 'chinese'
              ? 'chineseRating'
              : `${removedLang.toLowerCase()}Rating`;
  
          // Reset the rating
          updatedMaidDetails[ratingKey] = 0;
        }
  
        return {
          ...prev,
          languages: updatedArray,
          maidDetails: updatedMaidDetails
        };
      }
  
      // Default for other fields
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };
  
    // Handle employment details array
    const handleEmploymentDetailChange = (index, field, value) => {
      setFormData(prev => ({
        ...prev,
        employmentDetails: prev.employmentDetails.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    };
  
    // Add new employment detail
    const addEmploymentDetail = () => {
      setFormData(prev => ({
        ...prev,
        employmentDetails: [...prev.employmentDetails, {
          country: '',
          startDate: null,
          endDate: null,
          employerDescription: '',
          noOfFamilyMember: '',
          reasonOfLeaving: '',
          mainJobScope: ''
        }]
      }));
    };
  
    // Remove employment detail
    const removeEmploymentDetail = (index) => {
      setFormData(prev => ({
        ...prev,
        employmentDetails: prev.employmentDetails.filter((_, i) => i !== index)
      }));
    };
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      console.log('handleInputChange called:', { name, value, type, checked });
      
      if (name.startsWith('maidDetails.')) {
        const field = name.replace('maidDetails.', '');
        setFormData(prev => ({
          ...prev,
          maidDetails: {
            ...prev.maidDetails,
            [field]: type === 'checkbox' ? checked : value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      }
      
      // Debug: log the updated formData after state update
      setTimeout(() => {
        console.log('formData after update:', formData);
      }, 0);
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      setError('Full Name is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.country || formData.country.trim() === '') {
      setError('Country is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.supplier || formData.supplier.trim() === '') {
      setError('Supplier is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.DOB || formData.DOB.trim() === '') {
      setError('Date of Birth is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.Religion || formData.Religion.trim() === '') {
      setError('Religion is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.maritalStatus || formData.maritalStatus.trim() === '') {
      setError('Marital Status is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.salary || formData.salary === null || formData.salary === undefined || formData.salary === '') {
      setError('Monthly Salary is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.loan || formData.loan === null || formData.loan === undefined || formData.loan === '') {
      setError('Loan Amount is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.height || formData.height === null || formData.height === undefined || formData.height === '') {
      setError('Height is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.weight || formData.weight === null || formData.weight === undefined || formData.weight === '') {
      setError('Weight is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.maidDetails?.restDay || formData.maidDetails.restDay === null || formData.maidDetails.restDay === undefined || formData.maidDetails.restDay === '') {
      setError('Rest Days is required. Please specify the number of rest days per month.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.skills || formData.skills.length === 0 || !formData.skills.some(skill => skill.trim() !== '')) {
      setError('At least one skill is required.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.type || formData.type.length === 0 || !formData.type.some(t => t.trim() !== '')) {
      setError('At least one type/category is required.');
      setIsSubmitting(false);
      return;
    }

    // Debug: log the current formData state right before submission
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Current formData state:', formData);
    console.log('formData.name:', formData.name);
    console.log('formData.country:', formData.country);
    console.log('formData.supplier:', formData.supplier);
    console.log('formData.DOB:', formData.DOB);
    console.log('formData.skills:', formData.skills);
    console.log('formData.languages:', formData.languages);
    console.log('formData.type:', formData.type);
    console.log('=== END DEBUG ===');

    try {
      // 🖼️ Handle image upload if there's a new image file
      let imageUrl = formData.imageUrl; // Default to existing URL if no new file

      // Prepare maid data with proper formatting
      const maidData = {
        ...formData,
        NumChildren: formData.NumChildren !== null && formData.NumChildren !== undefined && formData.NumChildren !== '' ? parseInt(formData.NumChildren) : 0,
        salary: parseInt(formData.salary) || 500, // Default to minimum required salary
        DOB: formData.DOB,
        maritalStatus: formData.maritalStatus || 'Single',
        loan: parseInt(formData.loan) || 0,
        height: parseInt(formData.height) || 160, // Default to valid height
        weight: parseInt(formData.weight) || 55, // Default to valid weight
        skills: formData.skills && formData.skills.length > 0 && formData.skills.some(skill => skill.trim() !== '')
          ? formData.skills.filter(skill => skill.trim() !== '')
          : ['Cooking'], // Default skill if none provided
        languages: formData.languages && formData.languages.length > 0 && formData.languages.some(lang => lang.trim() !== '')
          ? formData.languages.filter(lang => lang.trim() !== '')
          : ['English'], // Default language if none provided
        type: formData.type && formData.type.length > 0 && formData.type.some(t => t.trim() !== '')
          ? formData.type.filter(t => t.trim() !== '')
          : ['New/Fresh'], // Default type if none provided
        isActive: formData.isActive ?? false,
        isEmployed: formData.isEmployed ?? false,
        supplier: formData.supplier || 'Default Supplier',
        maidDetails: {
          description: formData.maidDetails?.description || '',
          restDay: parseInt(formData.maidDetails?.restDay) || 0,
          highestEducation: formData.maidDetails?.highestEducation || '',
          englishRating: parseInt(formData.maidDetails?.englishRating) || 0,
          chineseRating: parseInt(formData.maidDetails?.chineseRating) || 0,
          dialectRating: parseInt(formData.maidDetails?.dialectRating) || 0,
          religion: formData.maidDetails?.religion || '',
          employmentHistory: formData.maidDetails?.employmentHistory || ''
        },
        employmentDetails: formData.employmentDetails && formData.employmentDetails.length > 0
          ? formData.employmentDetails.map(detail => ({
              country: detail.country || 'Singapore',
              startDate: detail.startDate || null,
              endDate: detail.endDate || null,
              employerDescription: detail.employerDescription || 'Default description',
              noOfFamilyMember: parseInt(detail.noOfFamilyMember) || 1,
              reasonOfLeaving: detail.reasonOfLeaving || 'Contract finished',
              mainJobScope: detail.mainJobScope || 'General housekeeping'
            }))
          : []
      };

      // Debug logging - show what we're working with
      console.log('Original formData:', formData);
      console.log('Processed maidData:', maidData);
      console.log('Key fields check:');
      console.log('- name:', maidData.name);
      console.log('- country:', maidData.country);
      console.log('- supplier:', maidData.supplier);
      console.log('- DOB:', maidData.DOB);
      console.log('- skills:', maidData.skills);
      console.log('- languages:', maidData.languages);
      console.log('- type:', maidData.type);

      if (formData.imageFile) {
        // Create FormData for the maid creation with image
        const maidFormData = new FormData();
        
        // Add the image file
        maidFormData.append('image', formData.imageFile);
        
        // Add all form data as JSON string (except image which is handled separately)
        maidFormData.append('data', JSON.stringify(maidData));

        // Debug logging
        console.log('Sending maid data with image:', maidData);
        console.log('FormData contents:');
        for (let [key, value] of maidFormData.entries()) {
          console.log(`${key}:`, value);
        }

        // Send directly to maid creation endpoint
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.MAID), {
          method: 'POST',
          credentials: 'include',
          body: maidFormData,
        });

        // Check if response indicates unauthorized access
        if (checkAuthStatus(response, 'add maids')) {
          return; // Exit early if unauthorized
        }

        if (response.ok) {
          const result = await response.json();
          console.log('Maid added successfully:', result);
          setSuccess('Maid added successfully!');
          resetForm();
          setIsModalOpen(false);
          // Refresh the maid list to show the newly added maid
          fetchMaids();
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(null), 3000);
        } else {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          throw new Error(errorData.message || 'Failed to add maid');
        }
      } else {
        // No new image file, send as JSON without image
        const submitData = {
          ...maidData,
          imageUrl
        };

        // Debug logging
        console.log('Sending maid data without image:', submitData);

        // Submit maid record without image
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.MAID), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });

        // Check if response indicates unauthorized access
        if (checkAuthStatus(response, 'add maids')) {
          return; // Exit early if unauthorized
        }

        if (response.ok) {
          const result = await response.json();
          console.log('Maid added successfully:', result);
          setSuccess('Maid added successfully!');
          resetForm();
          setIsModalOpen(false);
          // Refresh the maid list to show the newly added maid
          fetchMaids();
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(null), 3000);
        } else {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          
          // Handle different error message formats
          let errorMessage = 'Failed to add maid';
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Format: { message: "Validation failed", errors: ["error1", "error2"] }
            errorMessage = errorData.errors.join(', ');
          } else if (errorData.message) {
            // Format: { message: "error message" }
            errorMessage = errorData.message;
          }
          
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error adding maid:', error);
      setError(`Error adding maid: ${error.message}`);
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
      const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const resetForm = () => {
    setFormData({
        name: '',
        imageUrl: '',
        country: '',
        salary: '',
        loan: '',
        DOB: '',
        height: '',
        weight: '',
        Religion: '',
        maritalStatus: '',
        NumChildren: '',
        skills: [], // Empty skills array
        languages: [], // Empty languages array
        type: [], // Empty type array
        isActive: true,
        isEmployed: false,
        supplier: '',
        maidDetails: {
          description: '',
          restDay: '',
          highestEducation: '',
          englishRating: '',
          chineseRating: '',
          dialectRating: '',
          religion: '',
          employmentHistory: ''
        },
        employmentDetails: []
      });
      clearMessages(); // Clear any existing error/success messages
    };
  
    const getAvailabilityColor = (status) => {
      switch(status) {
        case 'Available': return 'text-green-600 bg-green-50';
        case 'Employed': return 'text-red-600 bg-red-50';
        case 'Draft': return 'text-gray-600 bg-gray-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

  // Handle checkbox changes
  const handleCheckboxChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  // Handle range changes
  const handleRangeChange = (category, index, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? parseInt(value) : item)
    }));
  };

  // Custom Range Slider Component
  // Improved range slider with touch support for mobile
  const RangeSlider = ({ label, range, min, max, step = 1, unit = '', onChange }) => {
    const [localRange, setLocalRange] = useState(range);
    const [isDragging, setIsDragging] = useState(false);
    const [activeThumb, setActiveThumb] = useState(null);
    const sliderRef = useRef(null);

    useEffect(() => {
      if (!isDragging) setLocalRange(range);
    }, [range, isDragging]);

    const percent = (v) => ((v - min) / (max - min)) * 100;
    
    const getValue = (clientX) => {
      if (!sliderRef.current) return min;
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let pct = (clientX - left) / width;
      pct = Math.max(0, Math.min(1, pct));
      const raw = min + pct * (max - min);
      return Math.round(raw / step) * step;
    };

    const updateValue = (clientX, thumb) => {
      const val = getValue(clientX);
      const next = [...localRange];
      if (thumb === 0) {
        next[0] = Math.min(val, localRange[1] - step);
      } else {
        next[1] = Math.max(val, localRange[0] + step);
      }
      setLocalRange(next);
    };

    const handleStart = (e, thumb) => {
      e.preventDefault();
      setIsDragging(true);
      setActiveThumb(thumb);
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateValue(clientX, thumb);
    };

    const handleMove = (e) => {
      if (!isDragging || activeThumb === null) return;
      e.preventDefault();
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateValue(clientX, activeThumb);
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setActiveThumb(null);
        onChange(0, localRange[0]);
        onChange(1, localRange[1]);
      }
    };

    // Add event listeners
    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        
        return () => {
          document.removeEventListener('mousemove', handleMove);
          document.removeEventListener('mouseup', handleEnd);
          document.removeEventListener('touchmove', handleMove);
          document.removeEventListener('touchend', handleEnd);
        };
      }
    }, [isDragging, handleMove, handleEnd]);

    const onTrackClick = (e) => {
      if (isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const val = getValue(clientX);
      const next = [...localRange];
      const d0 = Math.abs(val - localRange[0]);
      const d1 = Math.abs(val - localRange[1]);
      if (d0 < d1) {
        next[0] = Math.min(val, localRange[1] - step);
      } else {
        next[1] = Math.max(val, localRange[0] + step);
      }
      setLocalRange(next);
      onChange(0, next[0]);
      onChange(1, next[1]);
    };

    const leftPct = percent(localRange[0]);
    const rightPct = percent(localRange[1]);

    return (
      <div className="space-y-2 lg:space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs lg:text-sm font-medium text-gray-700">{label}</label>
          <span className="text-xs lg:text-sm font-semibold text-gray-600">
            {localRange[0]}{unit} - {localRange[1]}{unit}
          </span>
        </div>
        
        <div
          ref={sliderRef}
          onClick={onTrackClick}
          onTouchStart={onTrackClick}
          className="relative h-8 lg:h-10 flex items-center cursor-pointer select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Background track */}
          <div className="absolute w-full h-2 lg:h-3 bg-gray-200 rounded-full" />
          
          {/* Active track */}
          <div 
            className="absolute h-2 lg:h-3 bg-blue-500 rounded-full transition-all duration-150"
            style={{
              left: `${leftPct}%`,
              width: `${rightPct - leftPct}%`,
              transition: isDragging ? 'none' : 'all 0.15s ease'
            }}
          />
          
          {/* Thumbs */}
          {[0, 1].map(idx => (
            <div
              key={idx}
              onMouseDown={e => handleStart(e, idx)}
              onTouchStart={e => handleStart(e, idx)}
              className="absolute w-6 h-6 lg:w-7 lg:h-7 bg-blue-500 rounded-full border-3 border-white shadow-lg cursor-grab transition-all duration-150 hover:scale-110 active:cursor-grabbing active:scale-105"
              style={{
                left: `${idx === 0 ? leftPct : rightPct}%`,
                transform: 'translateX(-50%)',
                zIndex: activeThumb === idx ? 3 : 2,
                touchAction: 'none'
              }}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

  // Checkbox Group Component
  const CheckboxGroup = ({ label, options, selected, onChange }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="max-h-20 lg:max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onChange(option)}
                className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs lg:text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      nationality: [],
      skills: [],
      languages: [],
      type: [],
      maritalStatus: [],
      religion: [],
      availability: [],
      ageRange: [18, 65],
      heightRange: [100, 200],
      weightRange: [40, 200],
      salaryRange: [400, 2000],
      loanRange: [0, 10000],
      numChildrenRange: [0, 10]
    });
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    count += filters.nationality.length;
    count += filters.skills.length;
    count += filters.languages.length;
    count += filters.type.length;
    count += filters.maritalStatus.length;
    count += filters.religion.length;
    count += filters.availability.length;
    // Add range filters that are not at default values
    if (filters.ageRange[0] !== 1 || filters.ageRange[1] !== 65) count++;
    if (filters.heightRange[0] !== 100 || filters.heightRange[1] !== 200) count++;
    if (filters.weightRange[0] !== 40 || filters.weightRange[1] !== 200) count++;
    if (filters.salaryRange[0] !== 400 || filters.salaryRange[1] !== 2000) count++;
    if (filters.loanRange[0] !== 0 || filters.loanRange[1] !== 10000) count++;
    if (filters.numChildrenRange[0] !== 0 || filters.numChildrenRange[1] !== 10) count++;
    return count;
  };

  // Filter maids based on current filters
  const filteredMaids = maids.filter((maid) => {
    // console.log(maid)
    // Nationality filter
    if (filters.nationality.length > 0 && !filters.nationality.includes(maid.nationality)) {
      return false;
    }
    
    // Availability filter
    if (filters.availability.length > 0 && !filters.availability.includes(maid.availability)) {
      return false;
    }
    
    // Skills filter
    if (filters.skills.length > 0 && !filters.skills.some(skill => maid.skills.includes(skill))) {
      return false;
    }
    
    // Languages filter
    if (filters.languages.length > 0 && !filters.languages.some(lang => maid.languages.includes(lang))) {
      return false;
    }
    
    // Type filter
    if (filters.type.length > 0 && !filters.type.some(type => maid.type.includes(type))) {
      return false;
    }
    
    // Marital Status filter
    if (filters.maritalStatus.length > 0 && !filters.maritalStatus.includes(maid.maritalStatus.split('/')[0])) {
      return false;
    }
    
    // Religion filter
    if (filters.religion.length > 0 && !filters.religion.includes(maid.religion)) {
      return false;
    }
    
    // Age range filter
    if (maid.age < filters.ageRange[0] || maid.age > filters.ageRange[1]) {
      return false;
    }
    
    // Height range filter
    if (maid.height < filters.heightRange[0] || maid.height > filters.heightRange[1]) {
      return false;
    }
    
    // Weight range filter
    if (maid.weight < filters.weightRange[0] || maid.weight > filters.weightRange[1]) {
      return false;
    }
    
    // Salary range filter (extract number from salary string)
    if (maid.salary < filters.salaryRange[0] || maid.salary > filters.salaryRange[1]) {
      return false;
    }
    
    // Loan range filter
    if (maid.loan < filters.loanRange[0] || maid.loan > filters.loanRange[1]) {
      return false;
    }
    
    // Number of children range filter
    if (maid.numChildren < filters.numChildrenRange[0] || maid.numChildren > filters.numChildrenRange[1]) {
      return false;
    }
    
    return true;
  });


  

  return (
    <div className="flex h-screen bg-gray-50">
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #d1d5db;
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #d1d5db;
        }
      `}</style>
      
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
              <h1 className="text-xl font-bold text-gray-800">SYSTEM<span className="text-gray-600">ADMIN</span></h1>
              <p className="text-xs text-gray-500">MANAGEMENT PORTAL</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-6 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-600 bg-blue-50">
              <Package className="w-5 h-5" />
              <span>Maid Management</span>
            </a>
            <a href="/userManagement" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
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
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search maid name or ID..."
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {searchQuery && !isSearching && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
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
                      <path fillRule="evenodd" d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] bg-green-50 border-l-4 border-green-400 p-4 mx-4 rounded-md shadow-lg max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setSuccess(null)}
                    className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Filters */}
        <div className="bg-white border-b flex-shrink-0">
          {/* Filter Header */}
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="text-base lg:text-lg font-semibold text-gray-800">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearAllFilters}
                  className="px-2 lg:px-3 py-1 lg:py-1 text-xs lg:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-1 px-2 lg:px-3 py-1 lg:py-1 text-xs lg:text-sm text-blue-600 hover:text-blue-800"
                >
                  <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3 lg:w-4 lg:h-4" /> : <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters (Always Visible) - More Compact on Mobile */}
          <div className="px-4 lg:px-6 py-3 lg:py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <CheckboxGroup
                label="Nationality"
                options={countryOptions}
                selected={filters.nationality}
                onChange={(value) => handleCheckboxChange('nationality', value)}
              />
              <CheckboxGroup
                label="Availability"
                options={availabilityOptions}
                selected={filters.availability}
                onChange={(value) => handleCheckboxChange('availability', value)}
              />
              <RangeSlider
                label="Age"
                range={filters.ageRange}
                min={1}
                max={65}
                unit="yo"
                onChange={(index, value) => handleRangeChange('ageRange', index, value)}
              />
              <RangeSlider
                label="Salary"
                range={filters.salaryRange}
                min={400}
                max={2000}
                step={50}
                unit="$"
                onChange={(index, value) => handleRangeChange('salaryRange', index, value)}
              />
            </div>
          </div>

          {/* Expanded Filters - More Compact on Mobile */}
          {isExpanded && (
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-t bg-gray-50 max-h-96 lg:max-h-none overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Left Column */}
                <div className="space-y-3 lg:space-y-4">
                  <CheckboxGroup
                    label="Skills"
                    options={skillsetOptions}
                    selected={filters.skills}
                    onChange={(value) => handleCheckboxChange('skills', value)}
                  />
                  <CheckboxGroup
                    label="Languages"
                    options={languageOptions}
                    selected={filters.languages}
                    onChange={(value) => handleCheckboxChange('languages', value)}
                  />
                </div>

                {/* Middle Column */}
                <div className="space-y-3 lg:space-y-4">
                  <CheckboxGroup
                    label="Type"
                    options={typeOptions}
                    selected={filters.type}
                    onChange={(value) => handleCheckboxChange('type', value)}
                  />
                  <CheckboxGroup
                    label="Marital Status"
                    options={maritalStatusOptions}
                    selected={filters.maritalStatus}
                    onChange={(value) => handleCheckboxChange('maritalStatus', value)}
                  />
                  <CheckboxGroup
                    label="Religion"
                    options={religionOptions}
                    selected={filters.religion}
                    onChange={(value) => handleCheckboxChange('religion', value)}
                  />
                </div>

                {/* Right Column - Range Sliders */}
                <div className="space-y-4 lg:space-y-6">
                  <RangeSlider
                    label="Height"
                    range={filters.heightRange}
                    min={100}
                    max={200}
                    unit="cm"
                    onChange={(index, value) => handleRangeChange('heightRange', index, value)}
                  />
                  <RangeSlider
                    label="Weight"
                    range={filters.weightRange}
                    min={40}
                    max={200}
                    unit="kg"
                    onChange={(index, value) => handleRangeChange('weightRange', index, value)}
                  />
                  <RangeSlider
                    label="Loan Amount"
                    range={filters.loanRange}
                    min={0}
                    max={10000}
                    step={500}
                    unit="$"
                    onChange={(index, value) => handleRangeChange('loanRange', index, value)}
                  />
                  <RangeSlider
                    label="Number of Children"
                    range={filters.numChildrenRange}
                    min={0}
                    max={10}
                    onChange={(index, value) => handleRangeChange('numChildrenRange', index, value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Section - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border-b space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                    Maids Count: ({filteredMaids.length})
                  </h2>
                  {/* <button className="px-3 lg:px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50">
                    Delete
                  </button> */}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Maid</span>
                  </button>
                  <button className="px-3 lg:px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm" onClick={handleGenerateLink}>
                    Select to recommend
                  </button>
                </div>
              </div>

              {/* Mobile Cards View */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredMaids.map((maid, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {maid.imageUrl ? (
                            <img 
                              src={API_CONFIG.buildImageUrl(maid.imageUrl)} 
                              alt={maid.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-sm ${maid.imageUrl ? 'hidden' : ''}`}>
                            👩
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{maid.name}</p>
                          <p className="text-sm text-gray-500">#{maid.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedItems.includes(maid.id)}
                          onChange={() => handleSelectItem(maid.id)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId({id: maid.id, name: maid.name});
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Nationality</p>
                        <p className="font-medium">{maid.nationality}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Salary</p>
                        <p className="font-medium">${maid.salary}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Religion</p>
                        <p className="font-medium">{maid.religion}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Age/W/H</p>
                        <p className="font-medium">{maid.ageWeightHeight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Marital/Children</p>
                        <p className="font-medium">{maid.maritalStatus}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Availability</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(maid.availability)}`}>
                          {maid.availability}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <button
                        onClick={() => setSelectedMaid(maid.id)}
                        className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                        <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                        <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                        <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Religion</th>
                        <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/W/H</th>
                        <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital/Children</th>
                        <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                        <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommend</th>
                        <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMaids.map((maid, index) => (
                        <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedMaid(maid.id)}>
                          <td className="px-3 py-4 text-sm text-gray-900 truncate" title={maid.supplier}>
                            {maid.supplier}
                          </td>
                          <td className="px-3 py-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              {maid.imageUrl ? (
                                <img 
                                  src={API_CONFIG.buildImageUrl(maid.imageUrl)} 
                                  alt={maid.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center text-sm ${maid.imageUrl ? 'hidden' : ''}`}>
                                👩
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm font-medium text-gray-900 truncate" title={maid.name}>
                            {maid.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 truncate" title={maid.nationality}>
                            {maid.nationality}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 truncate" title={`$${maid.salary}`}>
                            ${maid.salary}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 truncate" title={maid.religion}>
                            {maid.religion}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 truncate" title={maid.ageWeightHeight}>
                            {maid.ageWeightHeight}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 truncate" title={maid.maritalStatus}>
                            {maid.maritalStatus}
                          </td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(maid.availability)}`}>
                              {maid.availability}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={selectedItems.includes(maid.id)}
                              onChange={() => handleSelectItem(maid.id)}
                              onClick={(e) => e.stopPropagation()} // Prevents triggering row click
                            />
                          </td>
                          <td className="px-3 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId({id: maid.id, name: maid.name});
                              }}
                              className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Maid Modal */}
        {isModalOpen && (
          <AddMaidModal
          formData={formData}
          handleInputChange={handleInputChange}
          handleArrayFieldChange={handleArrayFieldChange}
          handleLanguageChange={handleLanguageChange}
          handleRatingChange={handleRatingChange}
          addArrayField={addArrayField}
          removeArrayField={removeArrayField}
          handleEmploymentDetailChange={handleEmploymentDetailChange}
          addEmploymentDetail={addEmploymentDetail}
          removeEmploymentDetail={removeEmploymentDetail}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          setIsModalOpen={(open) => {
            setIsModalOpen(open);
            if (!open) {
              clearMessages(); // Clear messages when modal is closed
              resetForm(); // Reset form data when modal is closed
            }
          }}
          />
        )}

        {/* update Maid Modal */}
        {selectedMaid && (
          <MaidDetailModal 
            maidId={selectedMaid} 
            onClose={() => {
              setSelectedMaid(null);
              clearMessages(); // Clear messages when modal is closed
            }}
            onError={(errorMessage) => {
              setError(errorMessage);
              setTimeout(() => setError(null), 5000);
            }}
            onSuccess={(successMessage) => {
              setSuccess(successMessage);
              setTimeout(() => setSuccess(null), 3000);
            }}
            onRefresh={fetchMaids}
          />
        )}

        {/* Link Generator Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Generated Link
                </h3>
                <div className="bg-gray-100 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700 break-all">{generatedLink}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      setShowLinkModal(false);
                      setGeneratedLink('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Maid
                </h3>
                
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete maid with ID: <span className="font-semibold text-gray-700">{deleteConfirmId.id}</span>
                  <br />and name <span className="font-semibold text-gray-700">{deleteConfirmId.name}</span>?
                  <br />
                  This action cannot be undone.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        await handleDeleteMaid(deleteConfirmId.id);
                        setDeleteConfirmId(null);
                      } catch (error) {
                        console.error('Error deleting maid:', error);
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 min-w-[80px]"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;