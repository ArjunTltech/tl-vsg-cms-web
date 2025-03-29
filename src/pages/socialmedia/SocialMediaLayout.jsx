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
  Plus,
  Loader
} from 'lucide-react';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';
import playNotificationSound from '../../utils/playNotification';

const SocialMediaLayout = () => {
  // State for managing social links
  const [displayedLinks, setDisplayedLinks] = useState({});
  const [availableLinks, setAvailableLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [activeSocialCount, setActiveSocialCount] = useState()
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  // Confirmation modals
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [showActivationConfirmation, setShowActivationConfirmation] = useState(false);
  const [platformToToggle, setPlatformToToggle] = useState(null);
  // Loading states for actions
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        const activeLinks = {};
        const inactiveLinks = {};
        // Directly calculate active count from fetched data
        const totalActiveSocialCount = response.data.data.filter(link => link.isActive).length;

        response.data.data.forEach(link => {
          const platform = link.platform.toLowerCase();
          const linkData = {
            id: link.id,
            url: link.url,
            name: link.platform,
            region: "Social Media",
            active: link.isActive,
            lastChecked: new Date(link.updatedAt).toISOString().split('T')[0]
          };

          // Sort links into active (displayed) and inactive (available)
          if (link.isActive) {
            activeLinks[platform] = linkData;
          } else {
            inactiveLinks[platform] = linkData;
          }
        });

        setDisplayedLinks(activeLinks);
        setAvailableLinks(inactiveLinks);
        setActiveSocialCount(totalActiveSocialCount)
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
      setIsSaving(true);
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
        playNotificationSound();
        toast.success("Social media link updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating social media link:", error);
      toast.error("Failed to update social media link. Please try again.");
    } finally {
      setIsSaving(false);
      setEditing(null);
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

  // Show confirmation for setting to inactive
  const handleToggleStatus = (platform) => {
    setPlatformToToggle(platform);
    setShowStatusConfirmation(true);
  };

  // Handle status toggling after confirmation (setting to inactive)
  const confirmToggleStatus = async () => {
    if (!platformToToggle) return;

    try {
      setIsDeactivating(true);
      const platform = platformToToggle;
      const currentLink = displayedLinks[platform];

      // Make API call to update status
      const response = await axiosInstance.put(
        `/social/update-social/${currentLink.id}`,
        {
          platform: currentLink.name,
          url: currentLink.url,
          isActive: false // Set to inactive
        }
      );

      if (response.data.success) {
        // Move from displayed links to available links
        const updatedLink = {
          ...currentLink,
          active: false,
          lastChecked: new Date().toISOString().split('T')[0]
        };

        setAvailableLinks(prev => ({
          ...prev,
          [platform]: updatedLink
        }));

        // Remove from displayed links
        setDisplayedLinks(prev => {
          const updated = { ...prev };
          delete updated[platform];
          return updated;
        });

        // Decrement active social count
        setActiveSocialCount(prev => prev - 1);

        playNotificationSound();
        toast.success("Social media set to inactive!");
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating social media status:", error);
      toast.error("Failed to update social media status. Please try again.");
    } finally {
      // Close confirmation modal and reset states
      setIsDeactivating(false);
      setShowStatusConfirmation(false);
      setPlatformToToggle(null);
    }
  };

  // New function to handle activation of inactive social media
  const handleActivateSocial = (platform) => {
    setPlatformToToggle(platform);
    setShowActivationConfirmation(true);
    setShowAddLinkModal(false);
  };

  // Confirm activation of social media
  const confirmActivation = async () => {
    if (!platformToToggle) return;

    try {
      setIsActivating(true);
      const platform = platformToToggle;
      const currentLink = availableLinks[platform];

      // Make API call to update status to active
      const response = await axiosInstance.put(
        `/social/update-social/${currentLink.id}`,
        {
          platform: currentLink.name,
          url: currentLink.url,
          isActive: true // Set to active
        }
      );

      if (response.data.success) {
        // Move from available links to displayed links
        const updatedLink = {
          ...currentLink,
          active: true,
          lastChecked: new Date().toISOString().split('T')[0]
        };

        setDisplayedLinks(prev => ({
          ...prev,
          [platform]: updatedLink
        }));

        // Remove from available links
        setAvailableLinks(prev => {
          const updated = { ...prev };
          delete updated[platform];
          return updated;
        });

        // Increment active social count
        setActiveSocialCount(prev => prev + 1);

        playNotificationSound();
        toast.success("Social media activated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to activate");
      }
    } catch (error) {
      console.error("Error activating social media:", error);
      toast.error("Failed to activate social media. Please try again.");
    } finally {
      // Close confirmation modal and reset states
      setIsActivating(false);
      setShowActivationConfirmation(false);
      setPlatformToToggle(null);
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
        <div className=" flex items-center justify-between">
          <div className='space-y-1'>
            <h1 className="card-title flex items-center gap-2 text-base md:text-2xl text-neutral-content">
              <Globe className="w-6 h-6 text-accent" />
              Social Media Management
            </h1>
            <p className='ml-8'>Active Social Media : {activeSocialCount} </p>
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
              {Object.keys(displayedLinks).length > 0 ? (
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
                              disabled={isSaving}
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
                            className="badge badge-sm badge-success text-xs focus:outline-none"
                            disabled={isDeactivating && platformToToggle === platform}
                          >
                            Active
                          </button>
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-right">
                          {editing === platform ? (
                            <div className="flex justify-end gap-1">
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
              ) : (
                <div className="p-6 text-center">
                  <p className="text-neutral-content opacity-70">No active social media links. Add one using the "Add Link" button.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Link Modal - Now showing inactive social media with activation option */}
      {showAddLinkModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm sm:max-w-md p-4">
            <h3 className="font-bold text-lg mb-4">Add Social Media Link</h3>
            {Object.keys(availableLinks).length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(availableLinks).map(([platform, details]) => (
                  <button
                    key={platform}
                    onClick={() => handleActivateSocial(platform)}
                    className="btn btn-outline flex items-center justify-start gap-3 text-sm"
                    disabled={isActivating && platformToToggle === platform}
                  >
                    {platformIcons[platform]}
                    {details.name}
                    <span className="badge badge-sm badge-error ml-auto">Inactive</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">No inactive social media links available.</p>
            )}
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

      {/* Status Confirmation Modal (for deactivation) */}
      {showStatusConfirmation && platformToToggle && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm p-4">
            <h3 className="font-bold text-lg mb-4">Change Status to Inactive?</h3>
            <p className="mb-4">
              Are you sure you want to set {displayedLinks[platformToToggle]?.name} to inactive?
              This will remove it from the main list.
            </p>
            <div className="modal-action flex justify-end gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setShowStatusConfirmation(false);
                  setPlatformToToggle(null);
                }}
                disabled={isDeactivating}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={confirmToggleStatus}
                disabled={isDeactivating}
              >
                {isDeactivating ? (
                  <span className="flex items-center">
                    <Loader className="w-3 h-3 mr-1 animate-spin" />
                    Processing
                  </span>
                ) : "Set Inactive"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            if (!isDeactivating) {
              setShowStatusConfirmation(false);
              setPlatformToToggle(null);
            }
          }}></div>
        </div>
      )}

      {/* Activation Confirmation Modal (for reactivation) */}
      {showActivationConfirmation && platformToToggle && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm p-4">
            <h3 className="font-bold text-lg mb-4">Activate Social Media</h3>
            <p className="mb-4">
              Are you sure you want to activate {availableLinks[platformToToggle]?.name}?
              This will add it to your active social media list.
            </p>
            <div className="modal-action flex justify-end gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setShowActivationConfirmation(false);
                  setPlatformToToggle(null);
                }}
                disabled={isActivating}
              >
                Cancel
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={confirmActivation}
                disabled={isActivating}
              >
                {isActivating ? (
                  <span className="flex items-center">
                    <Loader className="w-3 h-3 mr-1 animate-spin" />
                    Activating
                  </span>
                ) : "Activate"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            if (!isActivating) {
              setShowActivationConfirmation(false);
              setPlatformToToggle(null);
            }
          }}></div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaLayout;