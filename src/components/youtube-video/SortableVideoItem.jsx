import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Globe,
  Plus,
  Loader,
  Edit,
  Trash2
} from 'lucide-react';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';
import playNotificationSound from '../../utils/playNotification';

const YoutubeVideoLayout = () => {
  // State for managing video links
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [activeVideoCount, setActiveVideoCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch YouTube videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/youtube/get-all-youtube-videos");
        setVideos(response.data);
        setActiveVideoCount(response.data.length);
        setError(null);
      } catch (err) {
        setError("Failed to load YouTube videos");
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleEditClick = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      setEditing(videoId);
      setNewLink(video.youtubeUrl);
    }
  };

  const handleSaveClick = async () => {
    if (!newLink.trim().startsWith("https://www.youtube.com/watch?v=")) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    try {
      setIsSaving(true);
      // Get the current video being edited
      const currentVideo = videos.find(v => v.id === editing);

      // Make the API call to update with id in URL
      const response = await axiosInstance.put(
        `/youtube/youtube-video/${currentVideo.id}`,
        { youtubeUrl: newLink }
      );

      if (response.data) {
        // Update local state
        setVideos(prevVideos => 
          prevVideos.map(video => 
            video.id === editing ? { ...video, youtubeUrl: newLink } : video
          )
        );
        
        playNotificationSound();
        toast.success("YouTube video link updated successfully!");
      } else {
        throw new Error("Failed to update video URL");
      }
    } catch (error) {
      console.error("Error updating YouTube video link:", error);
      toast.error("Failed to update YouTube video link. Please try again.");
    } finally {
      setIsSaving(false);
      setEditing(null);
    }
  };

  // Show confirmation for deleting
  const handleDeleteClick = (videoId) => {
    setVideoToDelete(videoId);
    setShowDeleteConfirmation(true);
  };

  // Handle deletion after confirmation
  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      setIsDeleting(true);
      
      // Make API call to delete video
      const response = await axiosInstance.delete(
        `/youtube/delete-youtube-video/${videoToDelete}`
      );

      if (response.data || response.status === 200) {
        // Remove from videos list
        setVideos(prevVideos => prevVideos.filter(video => video.id !== videoToDelete));
        
        // Decrement video count
        setActiveVideoCount(prev => prev - 1);

        playNotificationSound();
        toast.success("YouTube video deleted successfully!");
      } else {
        throw new Error("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting YouTube video:", error);
      toast.error("Failed to delete YouTube video. Please try again.");
    } finally {
      // Close confirmation modal and reset states
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setVideoToDelete(null);
    }
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="card w-full bg-base-200 shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-base-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card w-full bg-base-200 shadow-xl p-6">
        <div className="text-error text-center">
          <p>{error}</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className='space-y-1'>
            <h1 className="card-title flex items-center gap-2 text-base md:text-2xl text-neutral-content">
              <Youtube className="w-6 h-6 text-red-500" />
              YouTube Videos Management
            </h1>
            <p className='ml-8'>Active Videos: {activeVideoCount}</p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => window.location.href = "/admin/youtube/add"}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Video
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-4">
          <div className="w-full">
            {videos.length > 0 ? (
              <table className="table table-compact w-full">
                <thead>
                  <tr className="text-neutral-content">
                    <th className="w-2/5">Video</th>
                    <th className="w-2/5">URL</th>
                    <th className="text-right w-1/5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.id} className="hover:bg-base-300/10">
                      <td className="align-top">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-16 h-10 rounded">
                              <img src={video.thumbnailUrl} alt={video.title} />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{video.title}</div>
                            <div className="text-xs opacity-70 max-w-xs truncate">{video.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        {editing === video.id ? (
                          <input
                            type="text"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            className="input input-bordered input-sm w-full"
                            disabled={isSaving}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs sm:text-sm max-w-xs font-mono">
                              {video.youtubeUrl}
                            </span>
                            <button
                              onClick={() => copyToClipboard(video.youtubeUrl)}
                              className="btn btn-ghost btn-xs"
                              title="Copy to clipboard"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end space-x-2">
                          {editing === video.id ? (
                            <>
                              <button
                                className="btn btn-success btn-xs"
                                onClick={handleSaveClick}
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <span className="flex items-center">
                                    <Loader className="w-3 h-3 mr-1 animate-spin" />
                                    Saving
                                  </span>
                                ) : "Save"}
                              </button>
                              <button
                                className="btn btn-error btn-xs"
                                onClick={() => setEditing(null)}
                                disabled={isSaving}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleEditClick(video.id)}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="btn btn-error btn-xs"
                                onClick={() => handleDeleteClick(video.id)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center">
                <p className="text-neutral-content opacity-70">No YouTube videos available. Add one using the "Add Video" button.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && videoToDelete && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm p-4">
            <h3 className="font-bold text-lg mb-4">Delete YouTube Video?</h3>
            <p className="mb-4">
              Are you sure you want to delete this video? This action cannot be undone.
            </p>
            <div className="modal-action flex justify-end gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setVideoToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <Loader className="w-3 h-3 mr-1 animate-spin" />
                    Deleting
                  </span>
                ) : "Delete"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            if (!isDeleting) {
              setShowDeleteConfirmation(false);
              setVideoToDelete(null);
            }
          }}></div>
        </div>
      )}
    </div>
  );
};

export default YoutubeVideoLayout;