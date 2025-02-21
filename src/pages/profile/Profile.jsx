import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm new password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/users/get-profile');
        setUser(response.data);
      } catch (error) {
        toast.error('Error fetching user data.');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleNameEdit = async () => {
    try {
      await axiosInstance.put('/users/update-profile', { name: user.name }); // Replace with your API endpoint
      toast.success('Name updated successfully!');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to update name.');
      console.error('Error updating name:', error);
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await axiosInstance.post('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword
      }); // Replace with your API endpoint
      toast.success('Password changed successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to change password.');
      console.error('Error changing password:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-base-300">
      <div className="max-w-2xl w-full p-6 bg-base-200 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            {isEditingName ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="input input-bordered w-full"
                />
                <button
                  onClick={handleNameEdit}
                  className="btn btn-primary btn-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{user.name}</p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="btn btn-outline btn-sm"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <p className="text-lg font-semibold">{user.role}</p>
          </div>

          <form
            onSubmit={handleSubmit(handlePasswordChange)}
            className="border-t pt-4 space-y-6"
          >
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                {...register('currentPassword')}
                className="input input-bordered w-full"
              />
              {errors.currentPassword && (
                <p className="absolute text-xs text-red-500 mt-1 left-0 top-full">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                {...register('newPassword')}
                className="input input-bordered w-full"
              />
              {errors.newPassword && (
                <p className="absolute text-xs text-red-500 mt-1 left-0 top-full">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="input input-bordered w-full"
              />
              {errors.confirmPassword && (
                <p className="absolute text-xs text-red-500 mt-1 left-0 top-full">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full mt-8">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
