import React, { useState } from 'react';
import { Search, Home, Package, Users, UserCheck, ShoppingCart, Store, Settings, LogOut, Bell, X, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    country: '',
    experience: '',
    salary: '',
    age: '',
    skills: [],
    languages: [],
    type: [],
    isActive: true,
    isEmployed: false,
    maidDetails: {
      description: '',
      restDay: '',
      maritalStatus: '',
      highestEducation: '',
      religion: '',
      employmentHistory: ''
    },
    employmentDetails: [{
      country: '',
      startDate: '',
      endDate: '',
      employerDescription: '',
      noOfFamilyMember: '',
      reasonOfLeaving: '',
      mainJobScope: ''
    }]
  });
  
  const maids = [
    {
      id: 'ID-1',
      photo: '👩',
      name: 'THIN THIN AYE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Available'
    },
    {
      id: 'MM-22',
      photo: '👩',
      name: 'Naw Gando',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Single/3',
      availability: 'Employed'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Single/0',
      availability: 'Available'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Employed'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Available'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Available'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Employed'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Available'
    },
    {
      id: 'MM-21',
      photo: '👩',
      name: 'AYE AYE KHINE',
      nationality: '🇲🇲',
      salary: '$560+1 OFF',
      religion: 'Christian',
      ageWeightHeight: '24yo/170cm/55kg',
      maritalStatus: 'Married/0',
      availability: 'Draft'
    }
  ];

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
    } else if (name.startsWith('employmentDetails.')) {
      const field = name.replace('employmentDetails.', '');
      setFormData(prev => ({
        ...prev,
        employmentDetails: [{
          ...prev.employmentDetails[0],
          [field]: value
        }]
      }));
    } else if (name === 'skills' || name === 'languages' || name === 'type') {
      // Handle array inputs
      const values = value.split(',').map(v => v.trim()).filter(v => v);
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert string numbers to integers
      const submitData = {
        ...formData,
        experience: parseInt(formData.experience),
        salary: parseInt(formData.salary),
        age: parseInt(formData.age),
        maidDetails: {
          ...formData.maidDetails,
          restDay: parseInt(formData.maidDetails.restDay)
        },
        employmentDetails: [{
          ...formData.employmentDetails[0],
          noOfFamilyMember: parseInt(formData.employmentDetails[0].noOfFamilyMember),
          startDate: new Date(formData.employmentDetails[0].startDate).toISOString(),
          endDate: new Date(formData.employmentDetails[0].endDate).toISOString()
        }]
      };

      const response = await fetch('http://localhost:3000/api/maid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Maid added successfully:', result);
        // Reset form and close modal
        setFormData({
          name: '',
          imageUrl: '',
          country: '',
          experience: '',
          salary: '',
          age: '',
          skills: [],
          languages: [],
          type: [],
          isActive: true,
          isEmployed: false,
          maidDetails: {
            description: '',
            restDay: '',
            maritalStatus: '',
            highestEducation: '',
            religion: '',
            employmentHistory: ''
          },
          employmentDetails: [{
            country: '',
            startDate: '',
            endDate: '',
            employerDescription: '',
            noOfFamilyMember: '',
            reasonOfLeaving: '',
            mainJobScope: ''
          }]
        });
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
      experience: '',
      salary: '',
      age: '',
      skills: [],
      languages: [],
      type: [],
      isActive: true,
      isEmployed: false,
      maidDetails: {
        description: '',
        restDay: '',
        maritalStatus: '',
        highestEducation: '',
        religion: '',
        employmentHistory: ''
      },
      employmentDetails: [{
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

  const getAvailabilityColor = (status) => {
    switch(status) {
      case 'Available': return 'text-green-600 bg-green-50';
      case 'Employed': return 'text-red-600 bg-red-50';
      case 'Draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-600 bg-blue-50">
              <Package className="w-5 h-5" />
              <span>Inventory Management</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
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

        {/* Filters */}
        <div className="bg-white border-b px-6 py-4">
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Dropdown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">experience</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Dropdown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">age</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Dropdown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Dropdown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Dropdown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Dropdown</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Dropdown</option>
            </select>
          </div>
        </div>

        {/* Products Section */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-800">Products</h2>
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
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  Select to recommend
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maids.map((maid, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{maid.id}</td>
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
                          checked={selectedItems.includes(maid.id + index)}
                          onChange={() => handleSelectItem(maid.id + index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Maid Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Add New Maid</h3>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="/uploads/photo.jpg"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="18"
                        max="65"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills.join(', ')}
                        onChange={handleInputChange}
                        placeholder="Cooking, Cleaning, Child Care"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma-separated)</label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages.join(', ')}
                        onChange={handleInputChange}
                        placeholder="English, Bahasa, Chinese"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type (comma-separated)</label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type.join(', ')}
                        onChange={handleInputChange}
                        placeholder="Transfer, New, Experienced"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
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
                </div>

                {/* Maid Details */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Maid Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="maidDetails.description"
                        value={formData.maidDetails.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rest Day (per month)</label>
                      <input
                        type="number"
                        name="maidDetails.restDay"
                        value={formData.maidDetails.restDay}
                        onChange={handleInputChange}
                        min="0"
                        max="31"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                      <select
                        name="maidDetails.maritalStatus"
                        value={formData.maidDetails.maritalStatus}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Highest Education</label>
                      <select
                        name="maidDetails.highestEducation"
                        value={formData.maidDetails.highestEducation}
                        onChange={handleInputChange}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                      <select
                        name="maidDetails.religion"
                        value={formData.maidDetails.religion}
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment History</label>
                      <textarea
                        name="maidDetails.employmentHistory"
                        value={formData.maidDetails.employmentHistory}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Employment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous Country</label>
                      <input
                        type="text"
                        name="employmentDetails.country"
                        value={formData.employmentDetails[0].country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Family Members</label>
                      <input
                        type="number"
                        name="employmentDetails.noOfFamilyMember"
                        value={formData.employmentDetails[0].noOfFamilyMember}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="employmentDetails.startDate"
                        value={formData.employmentDetails[0].startDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        name="employmentDetails.endDate"
                        value={formData.employmentDetails[0].endDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employer Description</label>
                      <input
                        type="text"
                        name="employmentDetails.employerDescription"
                        value={formData.employmentDetails[0].employerDescription}
                        onChange={handleInputChange}
                        placeholder="e.g., 2 kids, elderly parents"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                      <input
                        type="text"
                        name="employmentDetails.reasonOfLeaving"
                        value={formData.employmentDetails[0].reasonOfLeaving}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Job Scope</label>
                      <textarea
                        name="employmentDetails.mainJobScope"
                        value={formData.employmentDetails[0].mainJobScope}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;