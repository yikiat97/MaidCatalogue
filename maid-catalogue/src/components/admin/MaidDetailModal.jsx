// MaidDetailModal.js (Complete version with all fields)
import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, X, Camera, Save } from 'lucide-react';
import API_CONFIG from '../../config/api.js';

const MaidDetailModal = ({ maidId, onClose, onError, onSuccess, onRefresh }) => {
  const [maid, setMaid] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const imageInputRef = useRef(null);

  useEffect(() => {
    const fetchMaid = async () => {
      try {
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.MAIDS}/${maidId}`), {
      credentials: 'include'
    });
        const data = await response.json();
        setMaid(data);
        setFormData({
          ...data,
          maidDetails: data.maidDetails || {
            description: '',
            restDay: '',
            englishRating: 0,
            chineseRating: 0,
            dialectRating: 0,
            highestEducation: '',
            religion: '',
            employmentHistory: ''
          },
          employmentDetails: data.employmentDetails?.length ? data.employmentDetails : [],
          skills: data.skills?.length ? data.skills : [''],
          languages: data.languages?.length ? data.languages : [''],
          type: data.type?.length ? data.type : ['']
        });
      } catch (error) {
        console.error('Error fetching maid details:', error);
      }
    };

    if (maidId) fetchMaid();

    // Cleanup function to revoke any preview URLs when component unmounts
    return () => {
      if (formData?.imagePreviewUrl) {
        URL.revokeObjectURL(formData.imagePreviewUrl);
      }
    };
  }, [maidId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      maidDetails: {
        ...formData.maidDetails,
        [name]: value
      }
    });
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

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleLanguageChange = (index, value) => {
    const updated = [...formData.languages];
    updated[index] = value;
    setFormData(prev => ({ ...prev, languages: updated }));
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updated = formData[field].filter((_, i) => i !== index);
      
      // If removing a language, also reset its rating if applicable
      if (field === 'languages') {
        const removedLang = formData.languages[index];
        let updatedMaidDetails = { ...formData.maidDetails };
        
        if (['English', 'Chinese', 'Dialect'].includes(removedLang)) {
          const ratingKey = removedLang.toLowerCase() === 'chinese' 
            ? 'chineseRating' 
            : `${removedLang.toLowerCase()}Rating`;
          updatedMaidDetails[ratingKey] = 0;
        }
        
        setFormData({ 
          ...formData, 
          [field]: updated,
          maidDetails: updatedMaidDetails
        });
      } else {
        setFormData({ ...formData, [field]: updated });
      }
    }
  };

  const handleEmploymentDetailChange = (index, field, value) => {
    const updated = [...formData.employmentDetails];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, employmentDetails: updated });
  };

  const addEmploymentDetail = () => {
    setFormData({
      ...formData,
      employmentDetails: [
        ...(formData.employmentDetails || []),
        {
          country: '',
          startDate: '',
          endDate: '',
          employerDescription: '',
          noOfFamilyMember: '',
          reasonOfLeaving: '',
          mainJobScope: ''
        }
      ]
    });
  };

  const removeEmploymentDetail = (index) => {
    const updated = formData.employmentDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, employmentDetails: updated });
  };

  const handleImageChange = (file) => {
    if (!file) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -5);
    const extension = file.name.split('.').pop();
    const filename = file.name.split('.')[0].replace(/\s+/g, '') + timestamp + '.' + extension;

    // Clean up previous preview URL if it exists
    if (formData.imagePreviewUrl) {
      URL.revokeObjectURL(formData.imagePreviewUrl);
    }

    // Create a preview URL for the selected file
    const previewUrl = URL.createObjectURL(file);

    // Store the file object, metadata, and preview URL in formData
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: filename, // Store the filename for backend
      imagePreviewUrl: previewUrl // Store the preview URL for display
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      if (onError) {
        onError('Full Name is required.');
      } else {
        alert('Full Name is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.country || formData.country.trim() === '') {
      if (onError) {
        onError('Country is required.');
      } else {
        alert('Country is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.supplier || formData.supplier.trim() === '') {
      if (onError) {
        onError('Supplier is required.');
      } else {
        alert('Supplier is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.DOB || formData.DOB.trim() === '') {
      if (onError) {
        onError('Date of Birth is required.');
      } else {
        alert('Date of Birth is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.Religion || formData.Religion.trim() === '') {
      if (onError) {
        onError('Religion is required.');
      } else {
        alert('Religion is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.maritalStatus || formData.maritalStatus.trim() === '') {
      if (onError) {
        onError('Marital Status is required.');
      } else {
        alert('Marital Status is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.salary || formData.salary === null || formData.salary === undefined || formData.salary === '') {
      if (onError) {
        onError('Salary is required.');
      } else {
        alert('Salary is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.loan || formData.loan === null || formData.loan === undefined || formData.loan === '') {
      if (onError) {
        onError('Loan Amount is required.');
      } else {
        alert('Loan Amount is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.height || formData.height === null || formData.height === undefined || formData.height === '') {
      if (onError) {
        onError('Height is required.');
      } else {
        alert('Height is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.weight || formData.weight === null || formData.weight === undefined || formData.weight === '') {
      if (onError) {
        onError('Weight is required.');
      } else {
        alert('Weight is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.maidDetails?.restDay || formData.maidDetails.restDay === null || formData.maidDetails.restDay === undefined || formData.maidDetails.restDay === '') {
      if (onError) {
        onError('Rest Days is required. Please specify the number of rest days per month.');
      } else {
        alert('Rest Days is required. Please specify the number of rest days per month.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.skills || formData.skills.length === 0 || !formData.skills.some(skill => skill.trim() !== '')) {
      if (onError) {
        onError('At least one skill is required.');
      } else {
        alert('At least one skill is required.');
      }
      setIsSubmitting(false);
      return;
    }

    if (!formData.type || formData.type.length === 0 || !formData.type.some(type => type.trim() !== '')) {
      if (onError) {
        onError('At least one type is required.');
      } else {
        alert('At least one type is required.');
      }
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      // Handle image upload if there's a new image file
      if (formData.imageFile instanceof File) {
        // Create FormData for the maid update with image
        const maidFormData = new FormData();
        
        // Add the image file
        maidFormData.append('image', formData.imageFile);
        
        // Prepare maid data
        const maidData = {
          ...formData,
          salary: parseFloat(formData.salary) || 0,
          loan: parseFloat(formData.loan) || 0,
          height: parseFloat(formData.height) || 0,
          weight: parseFloat(formData.weight) || 0,
          NumChildren: formData.NumChildren !== null && formData.NumChildren !== undefined && formData.NumChildren !== '' ? parseInt(formData.NumChildren) : 0,
          DOB: formData.DOB,
          skills: formData.skills.filter(skill => skill.trim() !== ''),
          languages: formData.languages.filter(lang => lang.trim() !== ''),
          type: formData.type.filter(t => t.trim() !== ''),
          maidDetails: {
            ...formData.maidDetails,
            restDay: parseInt(formData.maidDetails.restDay) || 0
          },
          employmentDetails: formData.employmentDetails.map(detail => ({
            ...detail,
            noOfFamilyMember: parseInt(detail.noOfFamilyMember) || 0,
            startDate: detail.startDate || null,
            endDate: detail.endDate || null
          }))
        };

        // Add all form data as JSON string (except image which is handled separately)
        maidFormData.append('data', JSON.stringify(maidData));

        // Send directly to maid update endpoint
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.MAID}/${maidId}`), {
          method: 'PUT',
          credentials: 'include',
          body: maidFormData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Maid updated:', result);
          if (onSuccess) {
            onSuccess('Maid updated successfully!');
          } else {
            alert('Maid updated successfully!');
          }
          // Refresh the maid list to show updated content
          if (onRefresh) {
            onRefresh();
          }
          onClose();
        } else {
          const errorData = await response.json();
          
          // Handle different error message formats
          let errorMessage = 'Failed to update maid';
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Format: { message: "Validation failed", errors: ["error1", "error2"] }
            errorMessage = errorData.errors.join(', ');
          } else if (errorData.message) {
            // Format: { message: "error message" }
            errorMessage = errorData.message;
          }
          
          throw new Error(errorMessage);
        }
      } else {
        // No new image file, send as JSON without image
        const submitData = {
          ...formData,
          imageUrl,
          salary: parseFloat(formData.salary) || 0,
          loan: parseFloat(formData.loan) || 0,
          height: parseFloat(formData.height) || 0,
          weight: parseFloat(formData.weight) || 0,
          NumChildren: formData.NumChildren !== null && formData.NumChildren !== undefined && formData.NumChildren !== '' ? parseInt(formData.NumChildren) : 0,
          DOB: formData.DOB,
          skills: formData.skills.filter(skill => skill.trim() !== ''),
          languages: formData.languages.filter(lang => lang.trim() !== ''),
          type: formData.type.filter(t => t.trim() !== ''),
          maidDetails: {
            ...formData.maidDetails,
            restDay: parseInt(formData.maidDetails.restDay) || 0
          },
          employmentDetails: formData.employmentDetails.map(detail => ({
            ...detail,
            noOfFamilyMember: parseInt(detail.noOfFamilyMember) || 0,
            startDate: detail.startDate || null,
            endDate: detail.endDate || null
          }))
        };

        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.MAID}/${maidId}`), {
          method: 'PUT',              
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Maid updated:', result);
          if (onSuccess) {
            onSuccess('Maid updated successfully!');
          } else {
            alert('Maid updated successfully!');
          }
          // Refresh the maid list to show updated content
          if (onRefresh) {
            onRefresh();
          }
          onClose();
        } else {
          const errorData = await response.json();
          
          // Handle different error message formats
          let errorMessage = 'Failed to update maid';
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
      console.error('Error updating maid:', error);
      if (onError) {
        onError(`Error updating maid: ${error.message}`);
      } else {
        alert('Error updating maid. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'skills', label: 'Skills & Languages' },
    { id: 'details', label: 'Additional Details' },
    { id: 'employment', label: 'Employment History' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">Edit Maid Details - {formData.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Photo Section */}
                <div className="flex items-start gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div className="relative">
                      <img 
                        src={formData.imagePreviewUrl || (formData.imageUrl ? API_CONFIG.buildImageUrl(formData.imageUrl) : '/placeholder.jpg')} 
                        alt={formData.name} 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" 
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={(e) => handleImageChange(e.target.files[0])}
                      accept="image/*"
                      className="hidden"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Choose File
                    </button>
                    {formData.imageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          // Clean up preview URL
                          if (formData.imagePreviewUrl) {
                            URL.revokeObjectURL(formData.imagePreviewUrl);
                          }
                          // Clear the selected file
                          setFormData(prev => ({
                            ...prev,
                            imageFile: null,
                            imagePreviewUrl: null
                          }));
                        }}
                        className="ml-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                    {formData.imageFile && (
                      <div className="mt-2">
                        <p className="text-sm text-blue-600 font-medium">New image selected (not saved yet)</p>
                        <p className="text-xs text-gray-500 mt-1">File: {formData.imageFile.name}</p>
                      </div>
                    )}
                    {formData.imageUrl && !formData.imageFile && (
                      <p className="mt-2 text-sm text-gray-500">Current: {formData.imageUrl}</p>
                    )}
                  </div>
                </div>

                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select 
                      name="country" 
                      value={formData.country} 
                      onChange={handleInputChange}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Country</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="India">India</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input 
                      name="DOB" 
                      type="date"
                      value={formData.DOB ? formData.DOB.slice(0, 10) : ''} 
                      onChange={handleInputChange}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
                    <input 
                      name="height" 
                      type="number" 
                      min="100"
                      max="200"
                      value={formData.height} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                    <input 
                      name="weight" 
                      type="number"
                      min="30"
                      max="150" 
                      value={formData.weight} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Religion *</label>
                     <select 
                       name="Religion" 
                       value={formData.Religion} 
                       onChange={handleInputChange} 
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="">Select Religion</option>
                       <option value="Muslim">Muslim</option>
                       <option value="Christian">Christian</option>
                       <option value="Buddhist">Buddhist</option>
                       <option value="Hindu">Hindu</option>
                       <option value="Others">Others</option>
                     </select>
                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
                    <select 
                      name="maritalStatus" 
                      value={formData.maritalStatus} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Children</label>
                    <input 
                      name="NumChildren" 
                      type="number"
                      min="0"
                      max="20" 
                      value={formData.NumChildren} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary ($) *</label>
                    <input 
                      name="salary" 
                      type="number"
                      min="0" 
                      value={formData.salary} 
                      onChange={handleInputChange}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan ($) *</label>
                    <input
                      type="number"
                      name="loan"
                      value={formData.loan}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID *</label>
                    <input 
                      name="supplier" 
                      value={formData.supplier || ''} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="e.g., ID-2"
                    />
                  </div>
                </div>

                {/* Status Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center space-x-2">
                    <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                          formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`} style={{ marginTop: '2px' }} />
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.isActive ? 'Published' : 'Draft'}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isEmployed"
                      checked={formData.isEmployed}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Is Employed</span>
                  </label>
                </div>
              </div>
            )}

            {/* Skills & Languages Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Skills *</label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('skills')}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Skill
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          list="skills-list"
                          value={skill}
                          onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Select or type a skill"
                        />
                        {formData.skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('skills', index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <datalist id="skills-list">
                    <option value="Cooking" />
                    <option value="Housekeeping" />
                    <option value="Childcare" />
                    <option value="Babysitting" />
                    <option value="Elderly Care" />
                    <option value="Dog(s)" />
                    <option value="Cat(s)" />
                    <option value="Caregiving" />
                    <option value="Cleaning" />
                  </datalist>
                </div>

                {/* Languages with Ratings */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Languages</label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('languages')}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Language
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.languages.map((language, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            list="languages-list"
                            value={language}
                            onChange={(e) => handleLanguageChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Select a language"
                          />
                          {formData.languages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('languages', index)}
                              className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* Show rating if language is English, Chinese or Dialect */}
                        {['English', 'Chinese', 'Dialect'].includes(language) && (
                          <div className="ml-4">
                            <label className="block text-sm text-gray-600 mb-1">
                              {language} Rating
                            </label>
                            <select
                              value={formData.maidDetails[
                                language.toLowerCase() === 'chinese'
                                  ? 'chineseRating'
                                  : `${language.toLowerCase()}Rating`
                              ] || 0}
                              onChange={(e) =>
                                handleRatingChange(
                                  language.toLowerCase() === 'chinese'
                                    ? 'chineseRating'
                                    : `${language.toLowerCase()}Rating`,
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                              <option value={0}>Select rating</option>
                              {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <datalist id="languages-list">
                    <option value="English" />
                    <option value="Chinese" />
                    <option value="Dialect" />
                    <option value="Malay" />
                    <option value="Tamil" />
                    <option value="Hindi" />
                    <option value="Bengali" />
                    <option value="Tagalog" />
                  </datalist>
                </div>

                {/* Type/Category */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Type/Category *</label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('type')}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Type
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.type.map((type, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={type}
                          onChange={(e) => handleArrayChange('type', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Type</option>
                          <option value="Transfer">Transfer</option>
                          <option value="New/Fresh">New/Fresh</option>
                          <option value="Ex-Singapore">Ex-Singapore</option>
                          <option value="Ex-Hongkong">Ex-Hongkong</option>
                          <option value="Ex-Taiwan">Ex-Taiwan</option>
                          <option value="Ex-Middle East">Ex-Middle East</option>
                        </select>
                        {formData.type.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('type', index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.maidDetails.description || ''} 
                    onChange={handleDetailChange} 
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Brief description about the maid..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Rest Days (per month) *</label>
                     <input 
                       name="restDay" 
                       type="number"
                       min="0"
                       max="31" 
                       value={formData.maidDetails.restDay || ''} 
                       onChange={handleDetailChange} 
                       required
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                     />
                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Education</label>
                    <select 
                      name="highestEducation" 
                      value={formData.maidDetails.highestEducation || ''} 
                      onChange={handleDetailChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Education</option>
                      <option value="Primary School">Primary School</option>
                      <option value="Secondary School">Secondary School</option>
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                    </select>
                  </div>
                  {/* <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion (Additional Details)</label>
                    <input 
                      name="religion" 
                      value={formData.maidDetails.religion || ''} 
                      onChange={handleDetailChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional religious information" 
                    />
                  </div> */}
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment History Summary</label>
                  <textarea 
                    name="employmentHistory" 
                    value={formData.maidDetails.employmentHistory || ''} 
                    onChange={handleDetailChange} 
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Brief employment history..."
                  />
                </div> */}
              </div>
            )}

            {/* Employment History Tab */}
            {activeTab === 'employment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Employment Records</h4>
                  <button
                    type="button"
                    onClick={addEmploymentDetail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Employment
                  </button>
                </div>

                {formData.employmentDetails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No employment history recorded.</p>
                    <p className="text-sm mt-2">Click "Add Employment" to add employment records.</p>
                  </div>
                ) : (
                  formData.employmentDetails.map((employment, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-700">Employment #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeEmploymentDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            value={employment.country || ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'country', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Singapore"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Family Members</label>
                          <input
                            type="number"
                            value={employment.noOfFamilyMember || ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'noOfFamilyMember', e.target.value)}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={employment.startDate ? employment.startDate.slice(0, 10) : ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={employment.endDate ? employment.endDate.slice(0, 10) : ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Description</label>
                          <input
                            type="text"
                            value={employment.employerDescription || ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'employerDescription', e.target.value)}
                            placeholder="e.g., 2 kids (ages 5 and 8), elderly parents"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                          <input
                            type="text"
                            value={employment.reasonOfLeaving || ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'reasonOfLeaving', e.target.value)}
                            placeholder="e.g., Contract finished, Family reasons"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Main Job Scope</label>
                          <textarea
                            value={employment.mainJobScope || ''}
                            onChange={(e) => handleEmploymentDetailChange(index, 'mainJobScope', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe main responsibilities..."
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Maid ID: {maidId}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaidDetailModal;