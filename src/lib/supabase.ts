import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Helper function to generate unique filename
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  return `${timestamp}_${randomString}.${extension}`;
};

// File validation
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please upload PNG, JPG, JPEG, or WEBP images only' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'Image must be less than 10MB' };
  }

  return { isValid: true };
};

export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['video/mp4', 'video/webm'];
  const maxSize = 200 * 1024 * 1024; // 200MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please upload MP4 or WEBM videos only' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'Video must be less than 200MB' };
  }

  return { isValid: true };
};

// Upload file to Supabase storage
export const uploadFile = async (
  file: File,
  bucket: 'images' | 'videos',
  onProgress?: (progress: number) => void
): Promise<{ url: string; error?: string }> => {
  try {
    const filename = generateUniqueFilename(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return { url: '', error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return { url: publicUrl };
  } catch (error) {
    return { url: '', error: 'Upload failed. Please try again.' };
  }
};

// Delete file from Supabase storage
export const deleteFile = async (url: string, bucket: 'images' | 'videos'): Promise<boolean> => {
  try {
    const filename = url.split('/').pop();
    if (!filename) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    return !error;
  } catch (error) {
    return false;
  }
};

// Extract YouTube video ID from URL
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Extract Vimeo video ID from URL
export const extractVimeoId = (url: string): string | null => {
  const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Detect video source type
export const detectVideoSourceType = (url: string): 'youtube' | 'vimeo' | 'direct' => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'direct';
};