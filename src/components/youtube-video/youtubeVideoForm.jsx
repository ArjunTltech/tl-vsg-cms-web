import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';
import playNotificationSound from '../../utils/playNotification';

const YoutubeVideoForm = ({ onVideoCreated, initialData, mode, setIsDrawerOpen, videos = [] }) => {
  const [formData, setFormData] = useState({
    youtubeUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    youtubeUrl: '',
  });
  const [touched, setTouched] = useState({
    youtubeUrl: false,
  });

  // Load initial data if editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        youtubeUrl: initialData.youtubeUrl || '',
      });
      // Set preview data
      setPreviewData({
        thumbnailUrl: initialData.thumbnailUrl,
        title: initialData.title,
        description: initialData.description
      });
    } else {
      // Reset form for add mode
      setFormData({
        youtubeUrl: '',
      });
      setPreviewData(null);
    }
    setErrors({ youtubeUrl: '' });
    setTouched({ youtubeUrl: false });
  }, [initialData, mode]);

  // Add a new effect to reset the form when drawer closes
  useEffect(() => {
    // This effect will run when the drawer is closed
    return () => {
      // Reset form state when component unmounts (drawer closes)
      setFormData({
        youtubeUrl: '',
      });
      setPreviewData(null);
      setErrors({ youtubeUrl: '' });
      setTouched({ youtubeUrl: false });
    };
  }, []);

  // Validate YouTube URL format and check for duplicates
  const validateYoutubeUrl = (url) => {
    if (!url.trim()) {
      return 'YouTube URL is required';
    }
    
    // Check if it's a valid YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(\S*)?$/;
    if (!youtubeRegex.test(url)) {
      return 'Please enter a valid YouTube URL (https://www.youtube.com/watch?v=...)';
    }
    
    // Check for duplicate URL - only in add mode or if URL changed in edit mode
    if (mode === 'add' || (mode === 'edit' && initialData && url !== initialData.youtubeUrl)) {
      // Extract video ID for comparison
      const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]{11})/);
      const newVideoId = videoIdMatch ? videoIdMatch[1] : '';
      
      // Check if this video ID already exists in the list
      const isDuplicate = videos.some(video => {
        // Skip comparison with current video when editing
        if (mode === 'edit' && initialData && video.id === initialData.id) {
          return false;
        }
        
        // Extract ID from existing video URLs
        const existingUrlMatch = video.youtubeUrl.match(/v=([a-zA-Z0-9_-]{11})/);
        const existingVideoId = existingUrlMatch ? existingUrlMatch[1] : '';
        
        return existingVideoId === newVideoId;
      });
      
      if (isDuplicate) {
        return 'This YouTube video already exists in your list';
      }
    }
    
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate on change if the field has been touched
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: name === 'youtubeUrl' ? validateYoutubeUrl(value) : '',
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark the field as touched
    setTouched({
      ...touched,
      [name]: true,
    });
    
    // Validate on blur
    setErrors({
      ...errors,
      [name]: name === 'youtubeUrl' ? validateYoutubeUrl(value) : '',
    });
  };

  // Function to fetch video preview data
  const fetchVideoPreview = async () => {
    // Validate URL before attempting to fetch preview
    const urlError = validateYoutubeUrl(formData.youtubeUrl);
    
    if (urlError) {
      setErrors({ ...errors, youtubeUrl: urlError });
      setTouched({ ...touched, youtubeUrl: true });
      toast.error(urlError);
      return;
    }

    try {
      setIsLoading(true);
      
      // Extract video ID from URL
      const videoIdMatch = formData.youtubeUrl.match(/v=([a-zA-Z0-9_-]{11})/);
      if (!videoIdMatch) {
        throw new Error("Could not extract video ID");
      }
      
      const videoId = videoIdMatch[1];
      
      // Set basic preview data (in a real app, you might fetch this from YouTube API)
      setPreviewData({
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        title: "Video preview",
        description: "Preview data will be fetched when the video is saved."
      });
    } catch (error) {
      console.error("Error creating video preview:", error);
      toast.error("Failed to generate video preview. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({ youtubeUrl: true });
    
    // Validate all fields before submission
    const youtubeUrlError = validateYoutubeUrl(formData.youtubeUrl);
    
    if (youtubeUrlError) {
      setErrors({ youtubeUrl: youtubeUrlError });
      toast.error(youtubeUrlError);
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (mode === 'edit' && initialData) {
        // Update existing video using the route: /youtube-video/:id
        const response = await axiosInstance.put(
          `/youtube/youtube-video/${initialData.id}`,
          formData
        );
        
        if (response.data) {
          playNotificationSound();
          toast.success("YouTube video updated successfully!");
          onVideoCreated(); // Refresh videos list
          setIsDrawerOpen(false);
        }
      } else {
        // Create new video using the route: /create-videos
        const response = await axiosInstance.post(
          '/youtube/create-videos',
          formData
        );
        
        if (response.data) {
          playNotificationSound();
          toast.success("YouTube video added successfully!");
          onVideoCreated(); // Refresh videos list
          setIsDrawerOpen(false);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Check if error is due to duplicate URL
      if (error.response && error.response.data && error.response.data.message && 
          error.response.data.message.includes('already exists')) {
        toast.error("This YouTube video already exists in your list");
      } else {
        toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} YouTube video. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form state when canceling
    setFormData({
      youtubeUrl: '',
    });
    setPreviewData(null);
    setErrors({ youtubeUrl: '' });
    setTouched({ youtubeUrl: false });
    setIsDrawerOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">YouTube URL <span className="text-error">*</span></span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`input input-bordered w-full ${touched.youtubeUrl && errors.youtubeUrl ? 'input-error' : ''}`}
            required
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchVideoPreview}
            disabled={isLoading || !!errors.youtubeUrl}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : "Preview"}
          </button>
        </div>
        {touched.youtubeUrl && errors.youtubeUrl && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.youtubeUrl}</span>
          </label>
        )}
        {!errors.youtubeUrl && (
          <label className="label">
            <span className="label-text-alt">Enter a valid YouTube video URL</span>
          </label>
        )}
      </div>

      {/* Video Preview */}
      {previewData && (
        <div className="bg-base-200 p-3 rounded-md mb-4">
          <h3 className="text-sm font-semibold mb-2">Video Preview</h3>
          <div className="flex gap-3">
            <div className="avatar">
              <div className="w-24 h-16 rounded">
                <img 
                  src={previewData.thumbnailUrl} 
                  alt="Video thumbnail"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/160x90?text=No+Thumbnail";
                  }} 
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{previewData.title}</p>
              <p className="text-xs opacity-70 line-clamp-2">{previewData.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={isSubmitting || (touched.youtubeUrl && !!errors.youtubeUrl)}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader className="w-3 h-3 mr-1 animate-spin" />
              {mode === 'edit' ? 'Updating' : 'Adding'}
            </span>
          ) : (
            mode === 'edit' ? 'Update Video' : 'Add Video'
          )}
        </button>
      </div>
    </form>
  );
};

export default YoutubeVideoForm;