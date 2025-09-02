import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Trash2, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ 
  currentImageUrl, 
  onImageChange, 
  onImageRemove, 
  className = "",
  disabled = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  // Update preview when currentImageUrl changes
  React.useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageChange(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative group">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Maid preview"
              className="w-full h-full object-cover"
            />
            {/* Remove button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                title="Remove image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!previewUrl && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-primary-orange bg-primary-orange bg-opacity-10' 
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!disabled ? openFileDialog : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {dragActive ? (
                <Upload className="w-8 h-8 text-primary-orange" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {dragActive ? 'Drop your image here' : 'Upload maid photo'}
              </p>
              <p className="text-sm text-gray-500">
                {dragActive 
                  ? 'Release to upload' 
                  : 'Click to browse or drag and drop'
                }
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button (when no image) */}
      {!previewUrl && (
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full py-3 px-4 bg-primary-orange text-white rounded-lg hover:bg-primary-orange-dark focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <div className="flex items-center justify-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Choose Image</span>
          </div>
        </button>
      )}

      {/* Current Image Info */}
      {currentImageUrl && !previewUrl && (
        <div className="text-sm text-gray-500 text-center">
          Current image will be kept
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
