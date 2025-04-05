import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';
import playNotificationSound from '../../utils/playNotification';

const YoutubeVideoForm = ({ onVideoCreated, initialData, mode, setIsDrawerOpen }) => {
  const [formData, setFormData] = useState({
    youtubeUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to fetch video preview data
  const fetchVideoPreview = async () => {
    if (!formData.youtubeUrl.trim().startsWith("https://www.youtube.com/watch?v=")) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    try {
      setIsLoading(true);
      // Since there's no specific preview endpoint in your routes, we'll simulate preview
      // In a real implementation, you might want to add a preview endpoint or use a third-party API
      
      // Extract video ID from URL
      const videoId = formData.youtubeUrl.split('v=')[1].split('&')[0];
      
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

    if (!formData.youtubeUrl.trim().startsWith("https://www.youtube.com/watch?v=")) {
      toast.error("Please enter a valid YouTube URL");
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
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} YouTube video. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">YouTube URL</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="input input-bordered w-full"
            required
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchVideoPreview}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : "Preview"}
          </button>
        </div>
        <label className="label">
          <span className="label-text-alt">Enter a valid YouTube video URL</span>
        </label>
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
          disabled={isSubmitting}
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