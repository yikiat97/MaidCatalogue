// AddMaidModal.js - Complete version with all fields
import React, { useRef, useState } from 'react';
import { X, Plus, Trash2, Camera, ChevronDown, ChevronUp } from 'lucide-react';

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
  const imageInputRef = useRef(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const extension = file.name.split('.').pop();
    const filename = file.name.split('.')[0].replace(/\s+/g, '') + timestamp + '.' + extension;
    const filePath = `/uploads/${filename}`;

    // handleInputChange({ target: { name: 'imageUrl', value: filePath } });
    handleInputChange({ target: { name: 'imageFile', value: file } });
    handleInputChange({ target: { name: 'imageUrl', value: filePath } });
    handleInputChange({ target: { name: 'customFilename', value: filename } });
    
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                {/* Image Upload with Preview */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                        {formData.imageUrl ? (
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.imageUrl && (
                        <p className="mt-2 text-sm text-gray-500">Path: {formData.imageUrl}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
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
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    type="number"
                    name="NumChildren"
                    value={formData.NumChildren}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <select
                    name="Religion"
                    value={formData.Religion}
                    onChange={handleInputChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary ($) *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">loan ($) *</label>
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
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., ID-2"
                  />
                </div>

                <div className="md:col-span-2 flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Is Active</span>
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
          </div>

          {/* Physical Attributes Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('physical')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Physical Attributes</h4>
              {expandedSections.physical ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.physical && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height || ''}
                    onChange={handleInputChange}
                    min="100"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    min="30"
                    max="150"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Skills, Languages & Type Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('skills')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-lg font-medium text-gray-900">Skills, Languages & Type</h4>
              {expandedSections.skills ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expandedSections.skills && (
              <div className="space-y-6">
                {/* Skills Array */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        list="skills-list"
                        value={skill}
                        onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Select or type a skill"
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('skills', index)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
                  <button
                    type="button"
                    onClick={() => addArrayField('skills')}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>

                {/* Languages Array */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
{formData.languages.map((language, index) => (
  <div key={index} className="mb-3">
    <div className="flex items-center gap-2 mb-1">
      <input
        type="text"
        list="languages-list"
        value={language}
        onChange={(e) => handleLanguageChange(index, e.target.value)}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Select a language"
      />
      {formData.languages.length > 1 && (
        <button
          type="button"
          onClick={() => removeArrayField('languages', index)}
          className="text-red-600 hover:text-red-800 p-2"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>

    {/* Show rating if language is English, Chinese or Dialect */}
    {['English', 'Chinese', 'Dialect'].includes(language) && (
      <div className="ml-2">
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
  <datalist id="languages-list">
    <option value="English" />
    <option value="Chinese" />
    <option value="Dialect" />
  </datalist>

  <button
    type="button"
    onClick={() => addArrayField('languages')}
    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
  >
    <Plus className="w-4 h-4" /> Add Language
  </button>
</div>


                {/* Type Array */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  {formData.type.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <select
                        value={type}
                        onChange={(e) => handleArrayFieldChange('type', index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          onClick={() => removeArrayField('type', index)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('type')}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Type
                  </button>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.maidDetails?.description || ''}
                    onChange={handleMaidDetailChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description about the maid..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rest Days (per month)</label>
                    <input
                      type="number"
                      name="restDay"
                      value={formData.maidDetails?.restDay || ''}
                      onChange={handleMaidDetailChange}
                      min="0"
                      max="31"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Education</label>
                    <select
                      name="highestEducation"
                      value={formData.maidDetails?.highestEducation || ''}
                      onChange={handleMaidDetailChange}
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion (Additional Details)</label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.maidDetails?.religion || ''}
                      onChange={handleMaidDetailChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific religious practices or requirements"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment History Summary</label>
                    <textarea
                      name="employmentHistory"
                      value={formData.maidDetails?.employmentHistory || ''}
                      onChange={handleMaidDetailChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief summary of past employment..."
                    />
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
              <div>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={addEmploymentDetail}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Employment</span>
                  </button>
                </div>

                {formData.employmentDetails.map((employment, index) => (
                  <div key={index} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-700">Employment #{index + 1}</h5>
                      {formData.employmentDetails.length > 0 && (
                        <button
                          type="button"
                          onClick={() => removeEmploymentDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={employment.country}
                          onChange={(e) => handleEmploymentDetailChange(index, 'country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Singapore"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Family Members</label>
                        <input
                          type="number"
                          value={employment.noOfFamilyMember}
                          onChange={(e) => handleEmploymentDetailChange(index, 'noOfFamilyMember', e.target.value)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={employment.startDate}
                          onChange={(e) => handleEmploymentDetailChange(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={employment.endDate}
                          onChange={(e) => handleEmploymentDetailChange(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employer Description</label>
                        <input
                          type="text"
                          value={employment.employerDescription}
                          onChange={(e) => handleEmploymentDetailChange(index, 'employerDescription', e.target.value)}
                          placeholder="e.g., 2 kids (ages 5 and 8), elderly parents"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                        <input
                          type="text"
                          value={employment.reasonOfLeaving}
                          onChange={(e) => handleEmploymentDetailChange(index, 'reasonOfLeaving', e.target.value)}
                          placeholder="e.g., Contract finished, Family reasons"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Job Scope</label>
                        <textarea
                          value={employment.mainJobScope}
                          onChange={(e) => handleEmploymentDetailChange(index, 'mainJobScope', e.target.value)}
                          rows="3"
                          placeholder="Describe the main responsibilities and duties..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t pt-4 -mx-6 px-6 pb-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Maid</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaidModal;