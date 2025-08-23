import API_CONFIG from '../config/api.js';

/**
 * Upload image to backend (which will then upload to S3)
 * @param {File} imageFile - The image file to upload
 * @param {string} maidId - Optional maid ID for updates
 * @returns {Promise<Object>} - Upload result with success status and image URL
 */
export const uploadMaidImage = async (imageFile, maidId = null) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('image', imageFile);

    // If updating an existing maid, include the maid ID
    if (maidId) {
      formData.append('maidId', maidId);
    }

    // Determine endpoint based on whether we're creating or updating
    const endpoint = maidId 
      ? `${API_CONFIG.ENDPOINTS.ADMIN.MAID}/${maidId}`
      : API_CONFIG.ENDPOINTS.ADMIN.MAID;

    const method = maidId ? 'PUT' : 'POST';

    const response = await fetch(API_CONFIG.buildUrl(endpoint), {
      method: method,
      body: formData,
      credentials: 'include',
      // Don't set Content-Type header - let the browser set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      imageUrl: result.maid?.imageUrl || result.imageUrl,
      maid: result.maid,
      message: result.message
    };

  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message,
      imageUrl: null
    };
  }
};

/**
 * Delete maid image
 * @param {string} maidId - The maid ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMaidImage = async (maidId) => {
  try {
    const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.ADMIN.MAID}/${maidId}`), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Deletion failed with status ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      message: result.message
    };

  } catch (error) {
    console.error('Image deletion error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get image URL with proper fallback
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }

  // If it's already a full URL (S3), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If it's a local path, build the full URL
  return API_CONFIG.buildImageUrl(imageUrl);
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Image size must be less than 5MB');
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push('File must be a JPG, PNG, GIF, or WebP image');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create a preview URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} - The preview URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
