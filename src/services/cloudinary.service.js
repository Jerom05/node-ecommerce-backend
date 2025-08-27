import cloudinary from '../config/cloudinary.js';

import streamifier from 'streamifier';

export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return result.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error.message);
    throw error;
  }
};

export const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Image deletion failed:', error.message);
  }
};

export const deleteImages = async (public_ids) => {
  try {
    await Promise.all(
      public_ids.map((public_id) => cloudinary.uploader.destroy(public_id))
    );
    console.log('Images deleted successfully');
  } catch (error) {
    console.error('Images deletion failed:', error.message);
  }
};

export const updateImage = async (public_id, file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    await cloudinary.uploader.destroy(public_id);
    return result.secure_url;
  } catch (error) {
    console.error('Image update failed:', error.message);
    throw error;
  }
};
