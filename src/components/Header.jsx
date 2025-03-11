import React, { useEffect, useState } from "react";
import { Bell, Menu, Moon, Sun, User, Settings, LogOut, User2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";
import axiosInstance from "../config/axios";

function Header({ onToggleSidebar, isCollapsed }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const socket = useSocket();

  const [historyStack, setHistoryStack] = useState([]);
  const [forwardStack, setForwardStack] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Function to get relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 30) {
      return "just now";
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes === 1) {
      return "1 minute ago";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours === 1) {
      return "1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("notification/get-all-notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle new socket notifications
  useEffect(() => {
    if (socket) {
      socket.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });
    }
    return () => {
      if (socket) {
        socket.off('new-notification');
      }
    };
  }, [socket]);

  useEffect(() => {
    fetchNotifications();
    // Update relative times every minute
    const interval = setInterval(() => {
      setNotifications(prev => [...prev]); // Force re-render to update times
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Rest of the hooks and handlers remain the same
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleBack = () => {
    if (historyStack.length > 1) {
      const newHistory = [...historyStack];
      const lastRoute = newHistory.pop();
      setHistoryStack(newHistory);
      setForwardStack((prev) => [lastRoute, ...prev]);
      navigate(newHistory[newHistory.length - 1]);
    }
  };

  const handleForward = () => {
    if (forwardStack.length > 0) {
      const newForward = [...forwardStack];
      const nextRoute = newForward.shift();
      setForwardStack(newForward);
      setHistoryStack((prev) => [...prev, nextRoute]);
      navigate(nextRoute);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  // Get the 4 latest notifications
  const latestNotifications = notifications.slice(0, 4);

  return (
    <header className="fixed top-0 left-0 right-0 bg-base-200 shadow-lg z-30">
      {/* Rest of the JSX remains the same */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
        {/* Sidebar Toggle */}
        <div className="flex items-center h-full">
          <div
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden cursor-pointer transition-all duration-300 ease-in-out"
          >
            <Menu className="w-6 h-6 text-neutral-content" />
          </div>
        </div>

        {/* Breadcrumb and Navigation */}
          {/* <div className="hidden lg:flex items-center space-x-4 flex-1 justify-center">
            <button
              onClick={handleBack}
              disabled={historyStack.length <= 1}
              className="flex items-center p-2 bg-base-300 rounded-lg text-neutral-content hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsChevronDoubleLeft className="w-5 h-5" />
              <span className="ml-1">Back</span>
            </button>
            <div className="flex items-center text-sm font-medium text-neutral-content px-4">
              <span className="text-lg font-bold italic text-center capitalize">
                {location.pathname === "/" ? "Home" : location.pathname.split("/").slice(-1)[0]}
              </span>
            </div>
            <button
              onClick={handleForward}
              disabled={forwardStack.length === 0}
              className="flex items-center p-2 bg-base-300 rounded-lg text-neutral-content hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-1">Forward</span>
              <BsChevronDoubleRight className="w-5 h-5" />
            </button>
          </div> */}

        {/* Mobile Title */}
        <div className="lg:hidden flex-1 text-center">
          <span className="text-lg font-bold italic capitalize text-neutral-content">
            {location.pathname === "/" ? "Home" : location.pathname.split("/").slice(-1)[0]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <div
            className="p-2 bg-base-300 rounded-lg transition-all duration-300 ease-in-out group cursor-pointer"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 md:w-6 md:h-6 text-neutral-content group-hover:text-info" />
            ) : (
              <Sun className="w-5 h-5 md:w-6 md:h-6 text-neutral-content group-hover:text-warning" />
            )}
          </div>

          {/* Notifications */}
          <div className="relative notifications-container">
            <button
              className="p-2 bg-base-300 rounded-lg transition-all duration-300 ease-in-out group cursor-pointer"
              onClick={toggleNotifications}
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-neutral-content group-hover:text-primary" />
              {notifications.filter(notification => !notification.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 text-xs flex items-center justify-center">
                  {notifications.filter(notification => !notification.isRead).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-base-300 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden">
                <div className="p-3 border-b border-base-200">
                  <h3 className="font-semibold text-neutral-content">Latest Notifications</h3>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {latestNotifications.length > 0 ? (
                    <ul className="divide-y divide-base-200">
                      {latestNotifications.map((notification, index) => (
                        <li key={index} className="p-3 md:p-4 hover:bg-base-200 transition-colors duration-200">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-neutral-content">
                              {notification.subject}
                            </p>
                            <p className="text-xs text-neutral-content/70">
                              {notification.message}
                            </p>
                            <span className="text-xs text-neutral-content/50">
                              {getRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-neutral-content/70">
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-base-200">
                  <button
                    className="w-full text-center text-sm text-primary hover:underline p-1"
                    
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/notifications'); 
                    }}
                  >
                    View All Notifications ({notifications.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative user-menu-container">
            <button
              className="p-2 bg-base-300 rounded-lg transition-all duration-300 ease-in-out group cursor-pointer"
              onClick={toggleUserMenu}
            >
              <User className="w-5 h-5 md:w-6 md:h-6 text-neutral-content group-hover:text-primary" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-base-300 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-base-200">
                  <h3 className="font-semibold text-neutral-content">User Menu</h3>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-neutral-content hover:bg-base-200 flex items-center gap-2"
                  >
                    <User2 className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-neutral-content hover:bg-base-200 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-500 hover:bg-base-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;