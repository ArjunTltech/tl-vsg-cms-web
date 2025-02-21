import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, Phone, MapPin, Calendar, Activity, Settings, Key } from 'lucide-react';
import { TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';

const UserProfile = () => {
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: '/api/placeholder/150/150',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    department: 'Engineering',
    joinDate: 'January 15, 2023',
  };

  const recentActivity = [
    { id: 1, type: 'Login', date: '2024-03-10 09:30 AM', details: 'Logged in from Chrome on Mac OS' },
    { id: 2, type: 'Profile Update', date: '2024-03-09 02:15 PM', details: 'Updated profile picture' },
    { id: 3, type: 'Settings Change', date: '2024-03-08 11:45 AM', details: 'Changed notification preferences' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">User Profile</h1>
        <p className="text-gray-600">View and manage user information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="p-6 col-span-1">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
            <span className="text-sm text-gray-600 mb-2">{user.role}</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user.status}
            </span>
            
            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{user.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Joined {user.joinDate}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="activity" className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{activity.type}</span>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <input
                      type="text"
                      defaultValue={user.department}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Change Password</h4>
                    <form className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <div className="pt-2">
                        <Button>Update Password</Button>
                      </div>
                    </form>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Protect your account with 2FA</span>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;