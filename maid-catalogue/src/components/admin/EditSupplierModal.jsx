import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API_CONFIG from '../../config/api.js';

// shadcn components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const EditSupplierModal = ({ isOpen, onClose, supplier, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form with supplier data when modal opens
  useEffect(() => {
    if (supplier && isOpen) {
      setFormData({
        companyName: supplier.companyName || '',
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        status: supplier.status || 'active',
        notes: supplier.notes || ''
      });
      setErrors({});
    }
  }, [supplier, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.SUPPLIER}/${supplier.id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Supplier updated successfully:', result);
        
        onSuccess();
        onClose();
        alert('Supplier updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(errorData.message || 'Failed to update supplier');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Error updating supplier. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-xl">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">Edit Supplier</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update supplier information and partnership details
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="pt-6 space-y-8">
          {/* Company Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5 pl-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className={`h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Company Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter company address"
                  rows={3}
                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-6 border-t border-gray-100 pt-8">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5 pl-4">
              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                  className={`h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${errors.contactPerson ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.contactPerson && (
                  <p className="text-sm text-red-600 mt-1">{errors.contactPerson}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className={`h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status & Notes Section */}
          <div className="space-y-6 border-t border-gray-100 pt-8">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5 pl-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="active" className="hover:bg-orange-50">Active</SelectItem>
                    <SelectItem value="inactive" className="hover:bg-orange-50">Inactive</SelectItem>
                    <SelectItem value="pending" className="hover:bg-orange-50">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the supplier"
                  rows={3}
                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Supplier Statistics Section */}
          {(supplier.maidsCount !== undefined || supplier.createdAt) && (
            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-medium text-gray-900">Supplier Statistics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4">
                {supplier.maidsCount !== undefined && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Current Maids</Label>
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-900">
                      {supplier.maidsCount} maids currently associated
                    </div>
                  </div>
                )}

                {supplier.createdAt && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Created Date</Label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                      {new Date(supplier.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-gray-100 pt-6 mt-8 bg-gray-50/50 -mx-6 -mb-6 px-6 py-6 rounded-b-lg">
            <div className="flex items-center justify-end space-x-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-11 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-orange-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 focus:ring-orange-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Supplier'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplierModal;