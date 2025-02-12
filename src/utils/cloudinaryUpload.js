// cloudinaryUpload.js
import axios from 'axios';

export const uploadImageToCloudinary = async (file) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Missing Cloudinary configuration');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'book-store');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
  }
};