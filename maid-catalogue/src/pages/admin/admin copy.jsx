import React, { useState , useEffect} from 'react';
import { Search, Home, Package, Users, UserCheck, ShoppingCart, Store, Settings, LogOut, Bell, X, Plus, Trash2 } from 'lucide-react';
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

const handleGenerateLink = async() => { 
  if (selectedItems.length == 0){
    return alert('No miad selected in to the list')
  }
  const generateLinkBody = {
          "filters": {
            // "experience": 2,
            // "height": 155,
            // "weight": 50,
            // "Religion": "Muslim",
            // "salary": 650,
            // "skills": ["Cooking", "Cleaning"],
            // "languages": ["English"]
          },
          "maidIds": selectedItems 
        }
        // console.log(generateLinkBody)
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
        alert('Failed to Generate link') 
        throw new Error('Failed to Generate link'); 
      } 
 
    } catch (error) { 
      console.error('Error Generate link:', error); 
      alert('Error Generate link. Please try again.'); 
    }  
}


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
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50" onClick={handleGenerateLink}>
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
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
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
            <td 
            className="px-6 py-4 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()} // ⛔ stop click bubbling to row
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={selectedItems.includes(maid.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectItem(maid.id);
                }}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent row click (if it opens modal)
                  setDeleteConfirmId({id:maid.id , name :maid.name });
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

        {/* Reccomandation link Modal */}
        {showLinkModal && (
          <LinkGeneratorModal 
            generatedLink={generatedLink}
            onClose={() => {
              setShowLinkModal(false);
              setGeneratedLink('');
            }}
          />
        )}

        {/* delete comfirmation Modal */}
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
                  <br></br>and name <span className="font-semibold text-gray-700">{deleteConfirmId.name}</span>
                  ?
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