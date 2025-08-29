import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Camera, ChevronDown, ChevronUp, Edit, Save } from 'lucide-react';
import ImageUpload from './ImageUpload.jsx';

const EditMaidModal = ({
  maid,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    country: '',
    salary: '',
    loan: '',
    Religion: '',
    height: '',
    weight: '',
    DOB: '',
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
      englishRating: 0,
      chineseRating: 0,
      dialectRating: 0,
      highestEducation: '',
      religion: '',
      employmentHistory: ''
    },
    employmentDetails: []
  });

  const [expandedSections, setExpandedSections] = useState({
    photo: true,
    basic: true,
    physical: true,
    skills: true,
    maidDetails: true,
    employment: true
  });

  // Initialize form data when maid changes
  useEffect(() => {
    if (maid) {
      setFormData({
        name: maid.name || '',
        imageUrl: maid.imageUrl || '',
        country: maid.country || '',
        salary: maid.salary || '',
        loan: maid.loan || '',
        Religion: maid.Religion || '',
        height: maid.height || '',
        weight: maid.weight || '',
        DOB: maid.DOB ? new Date(maid.DOB).toISOString().split('T')[0] : '',
        maritalStatus: maid.maritalStatus || '',
        NumChildren: maid.NumChildren || '',
        skills: maid.skills || [],
        languages: maid.languages || [],
        type: maid.type || [],
        isActive: maid.isActive ?? true,
        isEmployed: maid.isEmployed ?? false,
        supplier: maid.supplier || '',
        maidDetails: {
          description: maid.maidDetails?.description || '',
          restDay: maid.maidDetails?.restDay || '',
          englishRating: maid.maidDetails?.englishRating || 0,
          chineseRating: maid.maidDetails?.chineseRating || 0,
          dialectRating: maid.maidDetails?.dialectRating || 0,
          highestEducation: maid.maidDetails?.highestEducation || '',
          religion: maid.maidDetails?.religion || '',
          employmentHistory: maid.maidDetails?.employmentHistory || ''
        },
        employmentDetails: maid.employmentDetails || []
      });
    }
  }, [maid]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayFieldChange = (field, newValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleMaidDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      maidDetails: {
        ...prev.maidDetails,
        [name]: value
      }
    }));
  };

  const handleEmploymentDetailChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      employmentDetails: prev.employmentDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const addEmploymentDetail = () => {
    setFormData(prev => ({
      ...prev,
      employmentDetails: [
        ...prev.employmentDetails,
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
    }));
  };

  const removeEmploymentDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      employmentDetails: prev.employmentDetails.filter((_, i) => i !== index)
    }));
  };

  // Handle image file selection
  const handleImageChange = (file) => {
    if (!file) return;
    
    // Store the file object for form submission
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: '' // Clear the old imageUrl since we have a new file
    }));
  };

  // Handle image removal
  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imageUrl: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      salary: Number(formData.salary),
      loan: Number(formData.loan),
      height: Number(formData.height),
      weight: Number(formData.weight),
      NumChildren: Number(formData.NumChildren),
      maidDetails: {
        ...formData.maidDetails,
        englishRating: Number(formData.maidDetails.englishRating),
        chineseRating: Number(formData.maidDetails.chineseRating),
        dialectRating: Number(formData.maidDetails.dialectRating),
        restDay: Number(formData.maidDetails.restDay)
      },
      employmentDetails: formData.employmentDetails.map(detail => ({
        ...detail,
        noOfFamilyMember: Number(detail.noOfFamilyMember)
      }))
    };

    await onSave(maid.id, submitData);
  };

  if (!isOpen || !maid) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-6">
            <h3 className="text-xl font-semibold text-gray-900">Edit Maid: {maid.name}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('photo')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Photo Upload</h4>
              {expandedSections.photo ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.photo && (
              <div className="space-y-4">
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 text-center">
                  Upload a new photo to replace the current one, or keep the existing photo.
                </p>
              </div>
            )}
          </div>

          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('basic')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
              {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.basic && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter maid's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Malaysia">Malaysia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status *
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion *
                  </label>
                  <select
                    name="Religion"
                    value={formData.Religion}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select religion</option>
                    <option value="Christian">Christian</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Catholic">Catholic</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    name="NumChildren"
                    value={formData.NumChildren}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Physical Information Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('physical')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Physical Information</h4>
              {expandedSections.physical ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.physical && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                    min="100"
                    max="250"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="160"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    min="30"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="55"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (SGD) *
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    min="300"
                    max="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (SGD)
                  </label>
                  <input
                    type="number"
                    name="loan"
                    value={formData.loan}
                    onChange={handleInputChange}
                    min="0"
                    max="50000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('skills')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Skills & Languages</h4>
              {expandedSections.skills ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.skills && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'].map((skill) => (
                      <label key={skill} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayFieldChange('skills', [...formData.skills, skill]);
                            } else {
                              handleArrayFieldChange('skills', formData.skills.filter(s => s !== skill));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['English', 'Chinese', 'Dialect', 'Malay', 'Tamil', 'Hindi', 'Bengali', 'Tagalog', 'Indonesian', 'Burmese'].map((language) => (
                      <label key={language} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayFieldChange('languages', [...formData.languages, language]);
                            } else {
                              handleArrayFieldChange('languages', formData.languages.filter(l => l !== language));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.type.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayFieldChange('type', [...formData.type, type]);
                            } else {
                              handleArrayFieldChange('type', formData.type.filter(t => t !== type));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Maid Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('maidDetails')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Additional Details</h4>
              {expandedSections.maidDetails ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.maidDetails && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.maidDetails.description}
                    onChange={handleMaidDetailChange}
                    rows="3"
                    maxLength="2000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description about the maid..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rest Days
                    </label>
                    <input
                      type="number"
                      name="restDay"
                      value={formData.maidDetails.restDay}
                      onChange={handleMaidDetailChange}
                      min="0"
                      max="31"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Education
                    </label>
                    <input
                      type="text"
                      name="highestEducation"
                      value={formData.maidDetails.highestEducation}
                      onChange={handleMaidDetailChange}
                      maxLength="500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., High School, College"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment History
                  </label>
                  <textarea
                    name="employmentHistory"
                    value={formData.maidDetails.employmentHistory}
                    onChange={handleMaidDetailChange}
                    rows="3"
                    maxLength="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Previous work experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language Ratings (0-5)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">English</label>
                      <input
                        type="number"
                        name="englishRating"
                        value={formData.maidDetails.englishRating}
                        onChange={handleMaidDetailChange}
                        min="0"
                        max="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Chinese</label>
                      <input
                        type="number"
                        name="chineseRating"
                        value={formData.maidDetails.chineseRating}
                        onChange={handleMaidDetailChange}
                        min="0"
                        max="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Dialect</label>
                      <input
                        type="number"
                        name="dialectRating"
                        value={formData.maidDetails.dialectRating}
                        onChange={handleMaidDetailChange}
                        min="0"
                        max="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employment Details Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('employment')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Employment History</h4>
              {expandedSections.employment ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.employment && (
              <div className="space-y-4">
                {formData.employmentDetails.map((detail, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Employment #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeEmploymentDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={detail.country}
                          onChange={(e) => handleEmploymentDetailChange(index, 'country', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Singapore"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Family Members *
                        </label>
                        <input
                          type="number"
                          name="noOfFamilyMember"
                          value={detail.noOfFamilyMember}
                          onChange={(e) => handleEmploymentDetailChange(index, 'noOfFamilyMember', e.target.value)}
                          required
                          min="1"
                          max="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="4"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={detail.startDate}
                          onChange={(e) => handleEmploymentDetailChange(index, 'startDate', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={detail.endDate}
                          onChange={(e) => handleEmploymentDetailChange(index, 'endDate', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Job Scope *
                      </label>
                      <input
                        type="text"
                        name="mainJobScope"
                        value={detail.mainJobScope}
                        onChange={(e) => handleEmploymentDetailChange(index, 'mainJobScope', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Housekeeping, Childcare"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employer Description *
                      </label>
                      <textarea
                        name="employerDescription"
                        value={detail.employerDescription}
                        onChange={(e) => handleEmploymentDetailChange(index, 'employerDescription', e.target.value)}
                        required
                        rows="2"
                        maxLength="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description of the employer and family..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Leaving *
                      </label>
                      <input
                        type="text"
                        name="reasonOfLeaving"
                        value={detail.reasonOfLeaving}
                        onChange={(e) => handleEmploymentDetailChange(index, 'reasonOfLeaving', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Contract ended, Family relocated"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addEmploymentDetail}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Employment Detail</span>
                </button>
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isEmployed"
                  checked={formData.isEmployed}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Currently Employed</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaidModal;
