import React, { useEffect, useState } from 'react';
import { X, Heart, Star, MapPin, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import API_CONFIG from '../../config/api.js';

const ViewMaidModal = ({ maidId, onClose }) => {
  const [maid, setMaid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaid = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.MAIDS}/${maidId}`), {
          credentials: 'include'
        });
        const data = await response.json();
        setMaid(data);
      } catch (error) {
        console.error('Error fetching maid details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (maidId) fetchMaid();
  }, [maidId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!maid) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center p-20">
            <p className="text-gray-500">Maid not found</p>
          </div>
        </div>
      </div>
    );
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">Maid Profile - {maid.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src={maid.imageUrl ? API_CONFIG.buildImageUrl(maid.imageUrl) : '/placeholder.jpg'} 
                    alt={maid.name} 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" 
                  />
                  {maid.isActive && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{maid.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{maid.country}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{formatDate(maid.DOB)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">
                      {maid.DOB ? Math.floor((new Date() - new Date(maid.DOB)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'} years
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Height</label>
                    <p className="text-gray-900">{maid.height ? `${maid.height} cm` : 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weight</label>
                    <p className="text-gray-900">{maid.weight ? `${maid.weight} kg` : 'Not specified'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Religion</label>
                    <p className="text-gray-900">{maid.Religion || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marital Status</label>
                    <p className="text-gray-900">{maid.maritalStatus || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Children</label>
                    <p className="text-gray-900">{maid.NumChildren || '0'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employment Status</label>
                    <p className="text-gray-900">
                      {maid.isEmployed ? (
                        <span className="text-red-600 font-medium">Employed</span>
                      ) : (
                        <span className="text-green-600 font-medium">Available</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Salary</label>
                    <p className="text-gray-900">${maid.salary || '0'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loan Amount</label>
                    <p className="text-gray-900">${maid.loan || '0'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {maid.skills && maid.skills.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {maid.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {maid.languages && maid.languages.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="space-y-3">
                  {maid.languages.map((language, index) => {
                    const rating = maid.maidDetails?.[
                      language.toLowerCase() === 'chinese' 
                        ? 'chineseRating' 
                        : `${language.toLowerCase()}Rating`
                    ] || 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{language}</span>
                        {['English', 'Chinese', 'Dialect'].includes(language) && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-500 mr-2">Rating:</span>
                            {getRatingStars(rating)}
                            <span className="text-sm text-gray-500 ml-1">({rating}/5)</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Type/Category */}
            {maid.type && maid.type.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {maid.type.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {maid.maidDetails && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 mt-1">
                      {maid.maidDetails.description || 'No description provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rest Days (per month)</label>
                    <p className="text-gray-900 mt-1">
                      {maid.maidDetails.restDay || '0'} days
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Highest Education</label>
                    <p className="text-gray-900 mt-1">
                      {maid.maidDetails.highestEducation || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Employment History */}
            {maid.employmentDetails && maid.employmentDetails.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Employment History
                </h3>
                <div className="space-y-4">
                  {maid.employmentDetails.map((employment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">Employment #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Country</label>
                          <p className="text-gray-900">{employment.country || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Family Members</label>
                          <p className="text-gray-900">{employment.noOfFamilyMember || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Start Date</label>
                          <p className="text-gray-900">{formatDate(employment.startDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">End Date</label>
                          <p className="text-gray-900">{formatDate(employment.endDate)}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Employer Description</label>
                          <p className="text-gray-900">{employment.employerDescription || 'Not specified'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Reason for Leaving</label>
                          <p className="text-gray-900">{employment.reasonOfLeaving || 'Not specified'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Main Job Scope</label>
                          <p className="text-gray-900">{employment.mainJobScope || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Maid ID</label>
                  <p className="text-gray-900 font-mono">{maid.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Supplier ID</label>
                  <p className="text-gray-900">{maid.supplier || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900">
                    {maid.isActive ? (
                      <span className="text-green-600 font-medium">Published</span>
                    ) : (
                      <span className="text-gray-600 font-medium">Draft</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-gray-900">{formatDate(maid.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMaidModal;
