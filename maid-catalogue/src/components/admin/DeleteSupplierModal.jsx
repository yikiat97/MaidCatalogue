import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
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
import { Alert, AlertDescription } from "../ui/alert";

const DeleteSupplierModal = ({ isOpen, onClose, supplier, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!supplier) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.SUPPLIER}/${supplier.id}`), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Supplier deleted successfully');
        onSuccess();
        onClose();
        alert('Supplier deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        
        if (response.status === 400 && errorData.message) {
          // Handle specific business logic errors (like supplier having active maids)
          alert(errorData.message);
        } else {
          alert('Failed to delete supplier. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Error deleting supplier. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Delete Supplier</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please confirm that you want to delete this supplier.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Supplier Information */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="font-medium text-gray-900">
              {supplier.companyName}
            </div>
            <div className="text-sm text-gray-600">
              Contact: {supplier.contactPerson}
            </div>
            <div className="text-sm text-gray-600">
              Email: {supplier.email}
            </div>
            {supplier.maidsCount && supplier.maidsCount > 0 && (
              <div className="text-sm text-orange-600 font-medium">
                {supplier.maidsCount} maids currently associated
              </div>
            )}
          </div>

          {/* Warning Message */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Deleting this supplier will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Permanently remove all supplier information</li>
                <li>Remove supplier assignment from associated maids</li>
                <li>Cannot be recovered once deleted</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Additional warning if supplier has maids */}
          {supplier.maidsCount && supplier.maidsCount > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Note:</strong> This supplier currently has {supplier.maidsCount} 
                {supplier.maidsCount === 1 ? ' maid' : ' maids'} associated with them. 
                These maids will need to be reassigned to other suppliers or marked as unassigned.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Supplier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSupplierModal;