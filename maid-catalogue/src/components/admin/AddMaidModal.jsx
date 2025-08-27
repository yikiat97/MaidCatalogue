// AddMaidModal.js - Complete version with S3 image upload support
import React, { useRef, useState } from 'react';
import { X, Plus, Trash2, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUpload from './ImageUpload.jsx';

const AddMaidModal = ({
  formData,
  handleInputChange,
  handleArrayFieldChange,
  handleLanguageChange,
  handleRatingChange,
  addArrayField,
  removeArrayField,
  handleEmploymentDetailChange,
  addEmploymentDetail,
  removeEmploymentDetail,
  isSubmitting,
  handleSubmit,
  resetForm,
  setIsModalOpen,
  handleDetailChange // Add this prop for maidDetails
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    physical: true,
    skills: true,
    maidDetails: true,
    employment: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle image file selection
  const handleImageChange = (file) => {
    if (!file) return;
    
    // Store the file object for form submission
    handleInputChange({ target: { name: 'imageFile', value: file } });
    
    // Clear the old imageUrl since we have a new file
    handleInputChange({ target: { name: 'imageUrl', value: '' } });
  };

  // Handle image removal
  const handleImageRemove = () => {
    handleInputChange({ target: { name: 'imageFile', value: null } });
    handleInputChange({ target: { name: 'imageUrl', value: '' } });
  };

  // If handleDetailChange is not provided, create it
  const handleMaidDetailChange = handleDetailChange || ((e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      maidDetails: {
        ...formData.maidDetails,
        [name]: value
      }
    };
    handleInputChange({ 
      target: { 
        name: 'maidDetails', 
        value: newFormData.maidDetails 
      } 
    });
  });

  // Validate age (must be at least 18 years old)
  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return true; // Allow empty for now, will be required on submit
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  // Get age validation message
  const getAgeValidationMessage = () => {
    if (!formData.DOB) return '';
    return validateAge(formData.DOB) ? '' : 'Maid must be at least 18 years old';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-6">
            <h3 className="text-xl font-semibold text-gray-900">Add New Maid</h3>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          
          // Client-side validation
          if (formData.DOB && !validateAge(formData.DOB)) {
            alert('Maid must be at least 18 years old. Please select a valid date of birth.');
            return;
          }
          
          console.log('Form submit event triggered');
          console.log('Form data before submit:', formData);
          handleSubmit(e);
        }} className="p-6 space-y-6">
          {/* Debug Section */}
          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-yellow-800 mb-2">Debug Info</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>Name: {formData.name || 'EMPTY'}</p>
              <p>Country: {formData.country || 'EMPTY'}</p>
              <p>Supplier: {formData.supplier || 'EMPTY'}</p>
              <p>DOB: {formData.DOB || 'EMPTY'}</p>
              <p>Skills: {JSON.stringify(formData.skills)}</p>
              <p>Languages: {JSON.stringify(formData.languages)}</p>
              <p>Type: {JSON.stringify(formData.type)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log('Current formData:', formData);
                console.log('handleInputChange function:', handleInputChange);
              }}
              className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm"
            >
              Log Form State
            </button>
          </div> */}

          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('basic')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Photo Upload</h4>
              {expandedSections.basic ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.basic && (
              <div className="space-y-4">
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 text-center">
                  Upload a clear, professional photo of the maid. Images will be stored securely in the cloud.
                </p>
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange({ target: { name: 'isActive', value: e.target.checked } })}
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
                <span className="text-sm font-medium text-gray-700">
                  {formData.isActive ? 'Published' : 'Draft'}
                </span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isEmployed"
                  checked={formData.isEmployed}
                  onChange={(e) => handleInputChange({ target: { name: 'isEmployed', value: e.target.checked } })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Currently Employed</span>
              </label>
            </div>
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
                     max={new Date().toISOString().split('T')[0]} // Prevent future dates
                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                       formData.DOB && !validateAge(formData.DOB) 
                         ? 'border-red-300 focus:ring-red-500' 
                         : 'border-gray-300 focus:ring-blue-500'
                     }`}
                   />
                   {formData.DOB && !validateAge(formData.DOB) && (
                     <p className="mt-1 text-sm text-red-600">
                       {getAgeValidationMessage()}
                     </p>
                   )}
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
                    Loan Amount (SGD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="loan"
                    value={formData.loan}
                    onChange={handleInputChange}
                    required
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

                {/* <div>
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
                </div> */}

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
                      Rest Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="restDay"
                      value={formData.maidDetails.restDay}
                      onChange={handleMaidDetailChange}
                      min="0"
                      max="31"
                      required
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

                {/* <div>
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
                </div> */}

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



          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Maid</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaidModal;