import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Search, Home, Package, Users, UserCheck, ShoppingCart, Store, Settings, LogOut, Bell, X, Plus, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import AddMaidModal from '../../components/admin/AddMaidModal';
import MaidDetailModal from '../../components/admin/MaidDetailModal';
import LinkGeneratorModal from '../../components/admin/LinkGeneratorModal';


const Dashboard = () => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
const { userId: userIdParam } = useParams(); // ✅ use clearer alias
const [userId, setUserId] = useState(null);
  const [recommendedIds, setRecommendedIds] = useState([]);
  


  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    country: '',
    salary: '',
    loan: '',
    DOB: '',
    maritalStatus: '',
    skills: [''],
    languages: [''],
    type: [''],
    isActive: true,
    isEmployed: false,
    supplier: '',
    maidDetails: {
      description: '',
      restDay: '',
      englishRating: 0,
      chineseRating: 0,
      dialectRating: 0,
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
  const availabilityOptions = ['Available', 'Employed'];

  const [maids, setMaids] = useState([]);


    useEffect(() => {
    const fetchMaids = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/maids');
        const data = await response.json();
  
        const formatted = data.map((maid) => ({
          id:maid.id,
          supplier: maid.supplier,
          photo: '👩', 
          name: maid.name,
          nationality: maid.country,
          //salary: maid.salary,// `$${maid.salary} + ${maid.maidDetails?.restDay ?? 0} OFF`,
          religion: maid.Religion,
          ageWeightHeight: `${calculateAge(maid.DOB)}yo/${maid.height}cm/${maid.weight}kg`,
          maritalStatus: `${maid.maritalStatus}/${maid.NumChildren}`,
          availability: maid.isEmployed ? 'Employed' : 'Available',
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
        // console.log(data)
        console.log(formatted)
      } catch (err) {
        console.error('Failed to fetch maids:', err);
      }
    };
  
    fetchMaids();
  }, []);


    useEffect(() => {
    if (userIdParam) {
      setUserId(Number(userIdParam));
    } else {
      setUserId(null); // reset if no param
      setRecommendedIds([]);
    }

    // Load recommended maids for that user
    fetch(`http://localhost:3000/api/user/recommendation/user/${userIdParam}`)
      .then(res => res.json())
      .then(data => {
        // setRecommendedIds(data.map(m => m.id));
        setSelectedItems(data.map(m => m.id))
        console.log(data)
      });
      
  }, [userIdParam]);

  const toggleRecommendation = async (maidId) => {
    if (!userId) return;

    await fetch(`http://localhost:3000/api/user/recommendation/${userId}/${maidId}`, {
      method: 'POST',
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
    const response = await fetch(`http://localhost:3000/api/user/generate-link`, {
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
      const response = await fetch(`http://localhost:3000/api/maids/${maidId}`, {
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
    const handleArrayFieldChange = (fieldName, index, value) => {
      setFormData(prev => ({
        ...prev,
        [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
      }));
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
    };
  
  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      let imageUrl = formData.imageUrl;
  
      // 🖼 Upload image if it's a File object
      if (formData.imageFile instanceof File) {
        // const uploadData = new FormData();
        // uploadData.append('file', formData.imageFile);
  
        const uploadData = new FormData();
        uploadData.append('file', formData.imageFile);
        uploadData.append('customFilename', formData.customFilename); // pass renamed filename
  
        const uploadResponse = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: uploadData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
  
        const uploadResult = await uploadResponse.json();
        console.log(uploadResult)
        imageUrl = uploadResult.filePath; // assume backend returns { url: "/uploads/image.jpg" }
      }
  
      // 🧹 Clean & prepare final maid data
      const submitData = {
        ...formData,
        imageUrl,
        NumChildren:  parseInt(formData.NumChildren),
        salary: parseInt(formData.salary),
        DOB: formData.DOB,
        maritalStatus:formData.maritalStatus,
        loan: parseInt(formData.loan),
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        languages: formData.languages.filter(lang => lang.trim() !== ''),
        type: formData.type.filter(t => t.trim() !== ''),
        maidDetails: {
          ...formData.maidDetails,
          restDay: parseInt(formData.maidDetails.restDay)
        },
        employmentDetails: formData.employmentDetails
        // .map(detail => ({
        //   ...detail,
        //   noOfFamilyMember: parseInt(detail.noOfFamilyMember),
        //   startDate: detail.startDate ? new Date(detail.startDate).toISOString() : null,
        //   endDate: detail.endDate ? new Date(detail.endDate).toISOString() : null
        // }))
      };
  
      // 📨 Submit maid record
      const response = await fetch('http://localhost:3000/api/maid', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Maid added successfully:', result);
        resetForm();
        setIsModalOpen(false);
        alert('Maid added successfully!');
      } else {
        throw new Error('Failed to add maid');
      }
    } catch (error) {
      console.error('Error adding maid:', error);
      alert('Error adding maid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
    const resetForm = () => {
      setFormData({
        name: '',
        imageUrl: '',
        country: '',
        salary: '',
        loan:'',
        DOB: '',
        skills: [''],
        languages: [''],
        type: [''],
        isActive: true,
        isEmployed: false,
        supplier: '',
        maidDetails: {
          description: '',
          restDay: '',
          highestEducation: '',
          englishRating: 0,
          chineseRating: 0,
          dialectRating: 0,
          religion: '',
          employmentHistory: ''
        },
        employmentDetails: [
        //   {
        //   country: '',
        //   startDate: null,
        //   endDate: null,
        //   employerDescription: '',
        //   noOfFamilyMember: '',
        //   reasonOfLeaving: '',
        //   mainJobScope: ''
        // }
      ]
      });
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
  const RangeSlider = ({ label, range, min, max, step = 1, unit = '', onChange }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm text-gray-500">
            {range[0]}{unit} - {range[1]}{unit}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={range[0]}
            onChange={(e) => onChange(0, e.target.value)}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={range[1]}
            onChange={(e) => onChange(1, e.target.value)}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="relative h-2 bg-gray-200 rounded-lg">
            <div 
              className="absolute h-2 bg-blue-500 rounded-lg"
              style={{
                left: `${((range[0] - min) / (max - min)) * 100}%`,
                width: `${((range[1] - range[0]) / (max - min)) * 100}%`
              }}
            />
          </div>
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
        <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onChange(option)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
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
                  placeholder="Search supplier, maid"
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

        {/* Enhanced Filters */}
        <div className="bg-white border-b">
          {/* Filter Header */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters (Always Visible) */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
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

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
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
                <div className="space-y-4">
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
                <div className="space-y-6">
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

        {/* Products Section */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Products ({filteredMaids.length})
                </h2>
                <button className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50">
                  Delete
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Maid</span>
                </button>
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50" onClick={handleGenerateLink}>
                  Select to recommend
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden table-fixed">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Religion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Weight/Height</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital Status/Children</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommend</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
              </table>

              {/* Scrollable Tbody */}
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMaids.map((maid, index) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedMaid(maid.id)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.supplier}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                            {maid.photo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{maid.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.nationality}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.salary}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.religion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.ageWeightHeight}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.maritalStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(maid.availability)}`}>
                            {maid.availability}
                          </span>
                        </td>
<td className="px-6 py-4 whitespace-nowrap">
  <input
    type="checkbox"
    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    checked={selectedItems.includes(maid.id)}
    onChange={() => handleSelectItem(maid.id)}
    onClick={(e) => e.stopPropagation()} // Prevents triggering row click
  />
</td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
          setIsModalOpen={setIsModalOpen}
          />
        )}

        {/* update Maid Modal */}
        {selectedMaid && (
          <MaidDetailModal maidId={selectedMaid} onClose={() => setSelectedMaid(null)} />
        )}

        {/* Link Generator Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Generated Link
                </h3>
                <div className="bg-gray-100 p-3 rounded-md mb-4">
                  <p className="text-sm text-gray-700 break-all">{generatedLink}</p>
                </div>
                <div className="flex justify-center space-x-3">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
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
                
                <div className="flex justify-center space-x-3">
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