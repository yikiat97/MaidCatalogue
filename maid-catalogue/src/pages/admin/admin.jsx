import React, { useState , useEffect} from 'react';
import { Search, Home, Package, Users, UserCheck, ShoppingCart, Store, Settings, LogOut, Bell, X, Plus, Trash2 } from 'lucide-react';
import AddMaidModal from '../../components/admin/AddMaidModal';
import MaidDetailModal from '../../components/admin/MaidDetailModal';


const Dashboard = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // {
    //   country: '',
    //   startDate: null,
    //   endDate: null,
    //   employerDescription: '',
    //   noOfFamilyMember: '',
    //   reasonOfLeaving: '',
    //   mainJobScope: ''
    // }
  });

  const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
const countryOptions = ['Philippines', 'Indonesia', 'Myanmar']; 

  const [filters, setFilters] = useState({
  nationality: '',
  loan: 0,
  DOB: '',
  supplier: '',
  maritalStatus: '',
  religion: '',
  availability: '',
});

  const [maids, setMaids] = useState([]);

  useEffect(() => {
  const fetchMaids = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/maids');
      const data = await response.json();

      const formatted = data.map((maid) => ({
        id:maid.id,
        supplier: maid.supplier,
        photo: '👩', // replace with image logic if needed
        name: maid.name,
        nationality: maid.country,
        salary: `$${maid.salary} + ${maid.maidDetails?.restDay ?? 0} OFF`,
        religion: maid.Religion,
        ageWeightHeight: `${maid.age}yo/${maid.height}cm/${maid.weight}kg`,
        maritalStatus: `${maid.maritalStatus}/${maid.NumChildren}`,
        availability: maid.isEmployed ? 'Employed' : 'Available',
      }));

      setMaids(formatted);
    } catch (err) {
      console.error('Failed to fetch maids:', err);
    }
  };

  fetchMaids();
}, []);

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Handle array field changes (skills, languages, type)
  const handleArrayFieldChange = (fieldName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  // Add new field to array
  const addArrayField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  // Remove field from array
  const removeArrayField = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
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
        maritalStatus: '',
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
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.nationality}
                onChange={(e) => setFilters(prev => ({ ...prev, nationality: e.target.value }))}
              >
                <option value="">All</option>
                {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
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
            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Employed">Employed</option>
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
<div className="overflow-hidden  table-fixed">
  <table className="w-full ">
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
  </table>

  {/* Scrollable Tbody */}
  <div className="overflow-y-auto max-h-[400px] ">
    <table className="w-full">
      <tbody className="bg-white divide-y divide-gray-200">
        {maids
        .filter((maid) => {
          const {
            nationality,
            DOB,
            supplier,
            maritalStatus,
            religion,
            availability,
          } = filters;

          return (
            (!nationality || maid.nationality === nationality) &&
            (!availability || maid.availability === availability) &&
            (!religion || maid.religion === religion) &&
            (!supplier || maid.supplier === supplier) &&
            (!maritalStatus || maid.maritalStatus.startsWith(maritalStatus)) &&
            (!DOB || maid.ageWeightHeight.startsWith(DOB))
          );
        })
        .map((maid, index) => (
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
                checked={selectedItems.includes(maid.id + index)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectItem(maid.id + index);
                }}
              />
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
        {selectedMaid && (
          <MaidDetailModal maidId={selectedMaid} onClose={() => setSelectedMaid(null)} />
)}
      </div>
    </div>
  );
};

export default Dashboard; 