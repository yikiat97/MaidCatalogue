// MaidDetailModal.js (Complete version with all fields)
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Camera, Save } from 'lucide-react';

const MaidDetailModal = ({ maidId, onClose }) => {
  const [maid, setMaid] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchMaid = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/maids/${maidId}`);
        const data = await response.json();
        setMaid(data);
        setFormData({
          ...data,
          maidDetails: data.maidDetails || {
            description: '',
            restDay: '',
            maritalStatus: '',
            highestEducation: '',
            religion: '',
            employmentHistory: ''
          },
          employmentDetails: data.employmentDetails ,
          skills: data.skills || [''],
          languages: data.languages || [''],
          type: data.type || ['']
        });
      } catch (error) {
        console.error('Error fetching maid details:', error);
      }
    };

    if (maidId) fetchMaid();
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

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const updated = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: updated });
    }
  };

  // Handle employment details
  const handleEmploymentDetailChange = (index, field, value) => {
    const updated = [...formData.employmentDetails];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, employmentDetails: updated });
  };

  const addEmploymentDetail = () => {
    console.log(formData.employmentDetails.length)
    setFormData({
      ...formData,
      employmentDetails: [...formData.employmentDetails, {
        country: '',
        startDate: '',
        endDate: '',
        employerDescription: '',
        noOfFamilyMember: '',
        reasonOfLeaving: '',
        mainJobScope: ''
      }]
    });
  };

  const removeEmploymentDetail = (index) => {
    if (formData.employmentDetails.length > 1) {
      const updated = formData.employmentDetails.filter((_, i) => i !== index);
      setFormData({ ...formData, employmentDetails: updated });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Filter empty values from arrays
      const submitData = {
        ...formData,
        skills: formData.skills.filter(s => s.trim() !== ''),
        languages: formData.languages.filter(l => l.trim() !== ''),
        type: formData.type.filter(t => t.trim() !== ''),
        salary: parseInt(formData.salary) || 0,
        age: parseInt(formData.age) || 0,
        NumChildren: parseInt(formData.NumChildren) || 0,
        height: parseInt(formData.height) || 0,
        weight: parseInt(formData.weight) || 0,
        maidDetails: {
          ...formData.maidDetails,
          restDay: parseInt(formData.maidDetails.restDay) || 0
        }
      };

      await fetch(`http://localhost:3000/api/maid/${maidId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      alert('Maid details updated successfully!');
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update maid details');
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
                        src={formData.imageUrl ? `http://localhost:3000${formData.imageUrl}` : '/placeholder.jpg'} 
                        alt={formData.name} 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" 
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input 
                      name="imageUrl" 
                      value={formData.imageUrl} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="/uploads/photo.jpg" 
                    />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input 
                      name="age" 
                      type="number" 
                      min="18"
                      max="65"
                      value={formData.age} 
                      onChange={handleInputChange}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input 
                      name="height" 
                      type="number" 
                      min="100"
                      max="200"
                      value={formData.height} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input 
                      name="weight" 
                      type="number"
                      min="30"
                      max="150" 
                      value={formData.weight} 
                      onChange={handleInputChange} 
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select 
                      name="maritalStatus" 
                      value={formData.maritalStatus} 
                      onChange={handleInputChange} 
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID</label>
                    <input 
                      name="supplier" 
                      value={formData.supplier || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="e.g., ID-2"
                    />
                  </div>
                </div>

                {/* Status Checkboxes */}
                <div className="flex gap-6">
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

            {/* Skills & Languages Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Skills</label>
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
                          value={skill}
                          onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Cooking, Cleaning"
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
                </div>

                {/* Languages */}
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
                  <div className="space-y-2">
                    {formData.languages.map((language, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={language}
                          onChange={(e) => handleArrayChange('languages', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., English, Bahasa"
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
                    ))}
                  </div>
                </div>

                {/* Type/Category */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Type/Category</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rest Days (per month)</label>
                    <input 
                      name="restDay" 
                      type="number"
                      min="0"
                      max="31" 
                      value={formData.maidDetails.restDay || ''} 
                      onChange={handleDetailChange} 
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion (Details)</label>
                    <input 
                      name="religion" 
                      value={formData.maidDetails.religion || ''} 
                      onChange={handleDetailChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional religious information" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment History Summary</label>
                  <textarea 
                    name="employmentHistory" 
                    value={formData.maidDetails.employmentHistory || ''} 
                    onChange={handleDetailChange} 
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Brief employment history..."
                  />
                </div>
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

                {formData.employmentDetails.map((employment, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-700">Employment #{index + 1}</h5>
                      {formData.employmentDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmploymentDetail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={employment.country}
                          onChange={(e) => handleEmploymentDetailChange(index, 'reasonOfLeaving', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Contract finished, Family reasons"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Job Scope</label>
                        <textarea
                          value={employment.mainJobScope}
                          onChange={(e) => handleEmploymentDetailChange(index, 'mainJobScope', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe main responsibilities..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
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

export default MaidDetailModal