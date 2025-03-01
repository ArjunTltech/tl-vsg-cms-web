import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Facebook, 
  Share2, 
  Youtube,
  Linkedin,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Globe,
  Plus
} from 'lucide-react';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';

const SocialMediaLayout = () => {
  // State for managing social links
  const [displayedLinks, setDisplayedLinks] = useState({});
  const [availableLinks, setAvailableLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  // Platform icons mapping
  const platformIcons = {
    instagram: <Instagram className="w-6 h-6 text-pink-500" />,
    facebook: <Facebook className="w-6 h-6 text-blue-600" />,
    whatsapp: <Share2 className="w-6 h-6 text-green-500" />,
    youtube: <Youtube className="w-6 h-6 text-red-400" />,
    linkedin: <Linkedin className="w-6 h-6 text-blue-700" />
  };

  // Fetch social links from API
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/social/get-social");

        const links = response.data.data.reduce((acc, link) => {
          const platform = link.platform.toLowerCase();
          acc[platform] = {
            id: link.id,
            url: link.url,
            name: link.platform,
            region: "Social Media",
            active: link.isActive,
            lastChecked: new Date(link.updatedAt).toISOString().split('T')[0]
          };
          return acc;
        }, {});

        setDisplayedLinks(links);
        setError(null);
      } catch (err) {
        setError("Failed to load social media links");
        console.error("Error fetching social links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleEditClick = (platform) => {
    setEditing(platform);
    setNewLink(displayedLinks[platform].url);
  };

  const handleSaveClick = async () => {
    if (!isValidUrl(newLink)) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      // Get the current social media entry being edited
      const currentEntry = displayedLinks[editing];
      
      // Make the API call to update with id in URL
      const response = await axiosInstance.put(
        `/social/update-social/${currentEntry.id}`, 
        {
          platform: currentEntry.name,
          url: newLink,
          isActive: currentEntry.active
        }
      );

      if (response.data.success) {
        // Update local state
        setDisplayedLinks((prev) => ({
          ...prev,
          [editing]: {
            ...prev[editing],
            url: newLink,
            lastChecked: new Date().toISOString().split('T')[0]
          }
        }));
        setEditing(null);
        toast.success("Social media link updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating social media link:", error);
      toast.error("Failed to update social media link. Please try again.");
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleToggleStatus = (platform) => {
    const isDisplayed = displayedLinks[platform];
    
    if (isDisplayed) {
      // If the link is currently displayed
      setDisplayedLinks((prev) => {
        const newDisplayed = { ...prev };
        delete newDisplayed[platform];
        return newDisplayed;
      });
      
      // Add back to available links
      setAvailableLinks((prev) => ({
        ...prev,
        [platform]: displayedLinks[platform]
      }));
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

  const handleAddLink = (platform) => {
    // Move the selected platform from available to displayed links
    setDisplayedLinks((prev) => ({
      ...prev,
      [platform]: availableLinks[platform]
    }));

    // Remove the platform from available links
    setAvailableLinks((prev) => {
      const newAvailable = { ...prev };
      delete newAvailable[platform];
      return newAvailable;
    });

    setShowAddLinkModal(false);
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
        <div className="card-title text-base md:text-2xl text-neutral-content flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            Social Media Management
          </div>
          {Object.keys(availableLinks).length > 0 && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddLinkModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Link
            </button>
          )}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-base-300">
                <thead>
                  <tr className="text-xs sm:text-sm text-neutral-content">
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">Platform</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left">URL</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Status</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {Object.entries(displayedLinks).map(([platform, details]) => (
                    <tr key={platform} className="hover:bg-base-300/10">
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-neutral-content whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-base-200 rounded-lg w-8 h-8">
                              <div className="flex items-center justify-center">
                                {platformIcons[platform]}
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <div className="font-medium text-sm">{details.name}</div>
                            <div className="text-xs opacity-70">{details.region}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3">
                        {editing === platform ? (
                          <input
                            type="text"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            className="input input-bordered input-sm w-full max-w-[120px] sm:max-w-xs"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs sm:text-sm max-w-[100px] sm:max-w-xs font-mono">
                              {details.url}
                            </span>
                            <button
                              onClick={() => copyToClipboard(details.url)}
                              className="btn btn-ghost btn-xs"
                            >
                              <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(platform)}
                          className={`badge badge-sm text-xs focus:outline-none ${
                            details.active ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {details.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-right">
                        {editing === platform ? (
                          <div className="flex justify-end gap-1">
                            <button
                              className="btn btn-success btn-xs"
                              onClick={handleSaveClick}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-error btn-xs"
                              onClick={() => setEditing(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => handleEditClick(platform)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Link Modal - Made more mobile friendly */}
      {showAddLinkModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm sm:max-w-md p-4">
            <h3 className="font-bold text-lg mb-4">Add New Social Media Link</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(availableLinks).map(([platform, details]) => (
                <button
                  key={platform}
                  onClick={() => handleAddLink(platform)}
                  className="btn btn-outline flex items-center justify-start gap-3 text-sm"
                >
                  {platformIcons[platform]}
                  {details.name}
                </button>
              ))}
            </div>
            <div className="modal-action">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAddLinkModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowAddLinkModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaLayout;