import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

// Create contexts for socket and notification settings
const SocketContext = createContext(null);
const NotificationContext = createContext(null);

// Custom hooks for using socket and notification settings
export const useSocket = () => {
  return useContext(SocketContext);
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notificationSound, setNotificationSound] = useState(null);

  // Retrieve settings from localStorage or set defaults
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem('notificationSoundEnabled') ?? 'false');
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem('notificationsEnabled') ?? 'true');
  });

  // Function to toggle notification sound
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('notificationSoundEnabled', JSON.stringify(newValue));
      return newValue;
    });
  };

  // Function to toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
      return newValue;
    });
  };

  // Initialize the notification sound
  useEffect(() => {
    const audio = new Audio('/notification sound.mp3');
    setNotificationSound(audio);
  }, []);

  // Initialize the socket and handle new notifications
  useEffect(() => {
    // Initialize socket connection

      const baseURL= import.meta.env.VITE_API_BASE_URL

    const socketInstance = io(baseURL);
    // const socketInstance = io('http://localhost:8080');

    setSocket(socketInstance);

    const handleNotification = (notification) => {
      if (notificationsEnabled) {
        if (soundEnabled && notificationSound) {
          notificationSound.play().catch((error) => {
            console.warn('Could not play notification sound:', error);

          });
        }
        toast.info(`New Notification: ${notification.subject}`);
      }
    };

    socketInstance.on('new-notification', handleNotification);

    return () => {
      socketInstance.off('new-notification', handleNotification);
      socketInstance.disconnect();
    };
  }, [notificationsEnabled, soundEnabled, notificationSound]);

  const notificationValue = {
    soundEnabled,
    toggleSound,
    notificationsEnabled,
    toggleNotifications,
  };

  return (
    <SocketContext.Provider value={socket}>
      <NotificationContext.Provider value={notificationValue}>
        {children}
      </NotificationContext.Provider>
    </SocketContext.Provider>
  );
};
