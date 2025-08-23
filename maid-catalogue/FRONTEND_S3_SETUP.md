# Frontend S3 Image Upload Setup Guide

This guide explains how to use the new S3 image upload functionality in your maid agency frontend.

## New Components Created

### 1. **ImageUpload Component** (`src/components/admin/ImageUpload.jsx`)
- Drag and drop image upload
- Image preview with hover effects
- File validation (type, size)
- Professional UI with camera icon and upload states

### 2. **Enhanced AddMaidModal** (`src/components/admin/AddMaidModal.jsx`)
- Integrated S3 image upload
- Photo upload section at the top
- Automatic image handling

### 3. **New EditMaidModal** (`src/components/admin/EditMaidModal.jsx`)
- Edit existing maids with image updates
- Replace or keep existing photos
- Full form validation

### 4. **Image Upload Utilities** (`src/utils/imageUpload.js`)
- S3 upload handling
- File validation
- Error handling
- Image preview creation

## Features

✅ **Drag & Drop Upload**: Users can drag images directly onto the upload area  
✅ **Image Preview**: Real-time preview of selected images  
✅ **File Validation**: Automatic validation of file type and size  
✅ **S3 Integration**: Images automatically upload to your AWS S3 bucket  
✅ **Responsive Design**: Works on all screen sizes  
✅ **Professional UI**: Modern, clean interface with smooth animations  

## Usage Examples

### Creating a New Maid with Image

```jsx
import AddMaidModal from '../components/admin/AddMaidModal';

// In your component
const [isModalOpen, setIsModalOpen] = useState(false);

const handleSubmit = async (formData) => {
  // The modal automatically handles image upload to S3
  // formData.imageFile contains the selected image
  // formData.imageUrl will be updated with the S3 URL after upload
};

<AddMaidModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleSubmit}
/>
```

### Editing a Maid with Image Update

```jsx
import EditMaidModal from '../components/admin/EditMaidModal';

// In your component
const [editingMaid, setEditingMaid] = useState(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

const handleSave = async (maidId, updatedData) => {
  // The modal automatically handles image updates
  // If a new image is selected, it will replace the old one in S3
};

<EditMaidModal
  maid={editingMaid}
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  onSave={handleSave}
/>
```

### Using the ImageUpload Component Directly

```jsx
import ImageUpload from '../components/admin/ImageUpload';

const MyComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (file) => {
    setSelectedImage(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  return (
    <ImageUpload
      currentImageUrl={existingImageUrl}
      onImageChange={handleImageChange}
      onImageRemove={handleImageRemove}
    />
  );
};
```

## API Integration

The frontend automatically handles S3 uploads through your backend API:

### Create Maid with Image
```http
POST /api/admin/maid
Content-Type: multipart/form-data

Fields:
- image: [file] (optional)
- name: "Maid Name"
- country: "Philippines"
- ... other maid data
```

### Update Maid with Image
```http
PUT /api/admin/maid/:id
Content-Type: multipart/form-data

Fields:
- image: [file] (optional)
- name: "Updated Name"
- ... other maid data
```

## File Validation

The system automatically validates:
- **File Type**: Only JPG, PNG, GIF, WebP allowed
- **File Size**: Maximum 5MB
- **Image Format**: Must be a valid image file

## Image Storage

- **New Images**: Automatically uploaded to S3 bucket `bucket-fnnhd3`
- **Storage Path**: `maid-photos/[unique-id].[extension]`
- **Public Access**: Images are publicly accessible via S3 URLs
- **Automatic Cleanup**: Old images are automatically deleted when replaced

## Error Handling

The system provides comprehensive error handling:

```jsx
// Example error handling
const handleSubmit = async (formData) => {
  try {
    const result = await createMaid(formData);
    if (result.success) {
      // Show success message
      toast.success('Maid created successfully!');
    } else {
      // Show error message
      toast.error(result.error || 'Failed to create maid');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('An unexpected error occurred');
  }
};
```

## Styling

The components use Tailwind CSS classes and are fully responsive:

- **Mobile**: Single column layout with stacked sections
- **Tablet**: Two-column grid for better space utilization
- **Desktop**: Full-width layout with optimal spacing

## Customization

You can easily customize the components:

### Changing Upload Limits
```jsx
// In ImageUpload.jsx
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
```

### Modifying UI Elements
```jsx
// Change upload button text
<button className="...">
  <span>Upload Photo</span> {/* Customize this text */}
</button>
```

### Adding Custom Validation
```jsx
// In your component
const customValidation = (file) => {
  // Add your custom validation logic
  if (file.name.includes('watermark')) {
    return { isValid: false, error: 'Watermarked images not allowed' };
  }
  return { isValid: true };
};
```

## Troubleshooting

### Common Issues

1. **Images not uploading**
   - Check browser console for errors
   - Verify backend S3 configuration
   - Ensure file size is under 5MB

2. **Preview not showing**
   - Check if file is a valid image
   - Verify FileReader API support
   - Check browser console for errors

3. **S3 upload failures**
   - Verify AWS credentials in backend
   - Check S3 bucket permissions
   - Ensure bucket exists and is accessible

### Debug Mode

Enable debug logging:
```jsx
// In your component
const DEBUG = true;

if (DEBUG) {
  console.log('Image file:', selectedImage);
  console.log('Form data:', formData);
}
```

## Performance Tips

1. **Image Compression**: Consider compressing images before upload
2. **Lazy Loading**: Use lazy loading for image previews
3. **Caching**: Implement image caching for better performance

## Security Notes

- Images are stored with public read access
- File validation prevents malicious uploads
- Maximum file size limits prevent abuse
- Only image files are accepted

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **FileReader API**: Required for image preview
- **FormData API**: Required for file uploads
- **Drag & Drop**: Supported in all modern browsers

## Next Steps

1. **Test the Components**: Try creating and editing maids with images
2. **Customize UI**: Adjust styling to match your brand
3. **Add Validation**: Implement additional business logic validation
4. **Monitor Performance**: Track upload times and success rates

## Support

For issues related to:
- **Frontend Components**: Check component props and state
- **Image Upload**: Verify file validation and API calls
- **S3 Integration**: Check backend configuration and logs
- **UI/UX**: Review Tailwind CSS classes and responsive design
