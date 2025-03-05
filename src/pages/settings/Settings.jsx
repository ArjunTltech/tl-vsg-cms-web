import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import {
  Bell,
  Moon,
  Shield,
  Globe,
  Mail,
  Smartphone,
  Clock,
  Database,
  Save
} from 'lucide-react';
import { useNotification } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../config/axios';


const Settings = () => {
  const {
    soundEnabled,
    toggleSound,
    notificationsEnabled,
    toggleNotifications,
  } = useNotification();

  const [storageUsage, setStorageUsage] = useState({
    totalSpace: 0,
    usedSpace: 0,
    freeSpace: 0,
  });

  // Fetch storage usage using axios
  const fetchStorageUsage = async () => {
    try {
      const response = await axiosInstance.get('/settings/storage');
      const data = response.data;
      setStorageUsage({
        totalSpace: parseFloat(data.totalSpace),
        usedSpace: parseFloat(data.usedSpace),
        freeSpace: parseFloat(data.freeSpace),
      });
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    }
  };

  useEffect(() => {
    fetchStorageUsage();
  }, []);

  const { theme, toggleTheme, selectedFont, setSelectedFont } = useTheme();

  const getTimeZoneOffset = () => {
    const offset = new Date().getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const currentTimeZone = getTimeZoneOffset();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="">Manage your application preferences and configurations</p>
      </div>

      {/* Appearance Settings */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Moon className="w-5 h-5 mr-2" />
          Appearance
        </h2>
        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm ">Toggle dark mode on/off</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-lg"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
          </div>

          {/* Custom Font */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mediu">Custom Font</p>
              <p className="text-sm ">Choose a custom font for the app</p>
            </div>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="select select-primary"
            >
              <option value="sans-serif">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h2>
        <div className="space-y-4">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Notifications</p>
              <p className="text-sm ">Receive notifications from the system</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-lg"
              checked={notificationsEnabled}
              onChange={toggleNotifications}
            />
          </div>

          {/* Notification Sound */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notification Sound</p>
              <p className="text-sm ">Play sound for new notifications</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-lg"
              checked={soundEnabled}
              onChange={toggleSound}
              disabled={!notificationsEnabled}
            />
          </div>
        </div>
      </Card>
      {/* Language and Region */}

      {/* <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Language & Region
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              className="w-full bg-base-200 rounded-lg px-3 py-2"
              disabled
            >
              <option>English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Zone</label>
            <select
              className="w-full bg-base-200 rounded-lg px-3 py-2"
              value={currentTimeZone}
              disabled
            >
              <option>{currentTimeZone}</option>
            </select>
          </div>
        </div>
      </Card> */}

      {/* Account Settings */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Data & Storage
        </h2>
        <div className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear Cache</p>
              <p className="text-sm ">Clear temporary files</p>
            </div>
            <Button variant="outline">Clear</Button>
          </div> */}
          <div>
            <p className="text-sm  mb-2">Storage Usage</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(storageUsage.usedSpace / storageUsage.totalSpace) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-sm  mt-1">
            {(storageUsage.totalSpace - storageUsage.freeSpace).toFixed(2)} GB of {storageUsage.totalSpace.toFixed(2)} GB used
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      {/* <div className="flex justify-end">
        <Button className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div> */}
    </div>
  );
};

export default Settings;