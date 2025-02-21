import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import { Bell, Clock, X, CheckCircle, AlertCircle, Info, Mail } from 'lucide-react';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const socket = useSocket();
  const NOTIFICATIONS_LIMIT = 15;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('notification/get-all-notifications');
        const sortedNotifications = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, NOTIFICATIONS_LIMIT); // Limit to first 15 notifications
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to fetch notifications');
      }
    };

    fetchNotifications();

    if (socket) {
      socket.on('new-notification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications((prevNotifications) => {
          const newNotifications = [notification, ...prevNotifications];
          return newNotifications.slice(0, NOTIFICATIONS_LIMIT);
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('new-notification');
      }
    };
  }, [socket]);

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`notification/mark-as-read/${notificationId}`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put('notification/mark-all-as-read');
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`notification/delete/${notificationId}`);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axiosInstance.delete('notification/clear-all-notifications');
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error('Failed to delete all notifications');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-warning" />;
      case 'info':
        return <Info className="w-6 h-6 text-info" />;
      default:
        return <Mail className="w-6 h-6 text-primary" />;
    }
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="py-2 min-h-screen">
      <div className="mx-auto">
        <div className="bg-base-100 shadow-xl rounded-box overflow-hidden">
          {/* Header */}
          <div className="bg-base-100 p-6 border-b border-base-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-8 h-8 text-primary" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold">Notifications</h1>
              </div>
              <div className="flex  flex-col justify-end md:flex-row ">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark read
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                Clear all
              </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="tabs tabs-boxed bg-base-200">
              <button 
                className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
              <button 
                className={`tab ${filter === 'unread' ? 'tab-active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y min-h-[75dvh] divide-base-300">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-base-content/60">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm mt-2">We'll notify you when something arrives</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group hover:bg-base-200 transition-all duration-200 ${
                    !notification.isRead ? 'bg-base-200/50' : ''
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="p-6 flex gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-lg leading-6 mb-1">
                            {notification.subject}
                            {!notification.isRead && (
                              <span className="ml-2 badge badge-sm badge-primary">New</span>
                            )}
                          </h3>
                          <p className="text-base-content/70 leading-relaxed">
                            {notification.message}
                          </p>  
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-base-content/50">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;