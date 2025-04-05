import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Link as LinkIcon,
  Plus,
  Loader,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';
import playNotificationSound from '../../utils/playNotification';
import YoutubeVideoForm from './youtubeVideoForm';
// You'll need to create this component

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add"); // "add" or "edit"
  const [editVideoData, setEditVideoData] = useState(null);

  // Fetch YouTube videos from API
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

  // Use effect to fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Handler for refreshing videos
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchVideos();
    setIsRefreshing(false);
  };

  const handleEditClick = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      // For inline editing
    //   setEditing(videoId);
    //   setNewLink(video.youtubeUrl);
      
      // For drawer editing
      setEditVideoData(video);
      setDrawerMode("edit");
      setIsDrawerOpen(true);
    }
  };

  const handleAddNewClick = () => {
    setDrawerMode("add");
    setEditVideoData(null);
    setIsDrawerOpen(true);
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
        // If the response contains the complete updated video
        if (response.data.thumbnailUrl && response.data.title) {
          // Update with full data from response
          setVideos(prevVideos => 
            prevVideos.map(video => 
              video.id === editing ? response.data : video
            )
          );
        } else {
          // If the backend doesn't return the full updated video,
          // refresh the videos list to get the latest data
          await fetchVideos();
        }
        
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
    <div className="drawer drawer-end">
      <input
        id="youtube-video-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen}
        onChange={(e) => setIsDrawerOpen(e.target.checked)}
      />
      
      <div className="drawer-content">
        {/* Main content */}
        <div className="card w-full bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className='space-y-1'>
                <h1 className="card-title flex items-center gap-2 text-base md:text-2xl text-neutral-content">
                  Videos Management
                </h1>
                <p className=''>Active Videos: {activeVideoCount}</p>
                <p className='text-sm text-gray-500 hover:text-gray-400 mt-1 flex items-center gap-1'>
                  <Youtube className="w-5 h-auto text-gray-500 hover:text-red-500" />
                  Manage your YouTube Videos list
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh videos"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                {/* <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddNewClick}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Video
                </button> */}
              </div>
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
                                  <img 
                                    src={video.thumbnailUrl} 
                                    alt={video.title}
                                    onError={(e) => {
                                      // If image fails to load, use default placeholder
                                      e.target.src = "https://via.placeholder.com/160x90?text=No+Thumbnail";
                                    }} 
                                  />
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
                              {/* {editing === video.id ? (
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
                              ) : ( */}
                                <>
                                  {/* <button
                                    className="btn btn-primary btn-xs"
                                    onClick={() => handleEditClick(video.id)}
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button> */}
                                  <button
                                    className="btn btn-error btn-xs"
                                    onClick={() => handleDeleteClick(video.id)}
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              {/* )} */}
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
      </div>
      
      {/* Drawer side panel */}
      <div className="drawer-side">
        <label htmlFor="youtube-video-drawer" className="drawer-overlay"></label>
        <div className="p-4 md:w-1/3 w-full sm:w-2/3 max-h-screen overflow-auto bg-base-100 h-[80vh] text-base-content absolute bottom-4 right-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">{drawerMode === "edit" ? 'Edit YouTube Video' : 'Add New YouTube Video'}</h2>
          <YoutubeVideoForm
            onVideoCreated={fetchVideos}
            initialData={editVideoData}
            mode={drawerMode}
            videos={videos}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideoLayout;