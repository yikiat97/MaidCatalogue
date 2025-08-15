import React from 'react';
import API_CONFIG from '../../config/api.js';

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.ADMIN.UPLOAD), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };
