// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { toast } from 'react-toastify';
// import axiosInstance from '../../config/axios';

// const Profile = () => {
//   const [user, setUser] = useState({ name: '', email: '', role: '' });
//   const [loading, setLoading] = useState(true);
//   const [isEditingName, setIsEditingName] = useState(false);

//   const passwordSchema = yup.object().shape({
//     currentPassword: yup.string().required('Current password is required'),
//     newPassword: yup
//       .string()
//       .min(8, 'New password must be at least 8 characters long')
//       .required('New password is required'),
//     confirmPassword: yup
//       .string()
//       // .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
//       .required('Confirm new password is required'),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(passwordSchema),
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axiosInstance.get('/users/get-profile');
//         setUser(response.data);
//       } catch (error) {
//         toast.error('Error fetching user data.');
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleNameEdit = async () => {
//     try {
//       await axiosInstance.put('/users/update-profile', { name: user.name }); // Replace with your API endpoint
//       toast.success('Name updated successfully!');
//       setIsEditingName(false);
//     } catch (error) {
//       toast.error('Failed to update name.');
//       console.error('Error updating name:', error);
//     }
//   };

//   const handlePasswordChange = async (data) => {
//     try {
//       if(data.currentPassword === data.confirmNewPassword){
//       await axiosInstance.post('/users/change-password', {
//         currentPassword: data.currentPassword,
//         newPassword: data.newPassword,
//         confirmNewPassword: data.confirmPassword
//       }); // Replace with your API endpoint
//       toast.success('Password changed successfully!');
//       reset();}else{
//         toast.error("Passwords don’t match! Please check and retry. ")
//       }
//     } catch (error) {
//       toast.error('Failed to change password.');
//       console.error('Error changing password:', error);
//     }
//   };

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   return (
//     <div className="flex items-center justify-center bg-base-300">
//       <div className="max-w-2xl w-full p-6 bg-base-200 shadow-lg rounded-lg">
//         <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Name</label>
//             {isEditingName ? (
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={user.name}
//                   onChange={(e) => setUser({ ...user, name: e.target.value })}
//                   className="input input-bordered w-full"
//                 />
//                 <button
//                   onClick={handleNameEdit}
//                   className="btn btn-primary btn-sm"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setIsEditingName(false)}
//                   className="btn btn-secondary btn-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             ) : (
//               <div className="flex justify-between items-center">
//                 <p className="text-lg font-semibold">{user.name}</p>
//                 <button
//                   onClick={() => setIsEditingName(true)}
//                   className="btn btn-outline btn-sm"
//                 >
//                   Edit
//                 </button>
//               </div>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-2">Email</label>
//             <p className="text-lg font-semibold">{user.email}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-2">Role</label>
//             <p className="text-lg font-semibold">{user.role}</p>
//           </div>

//           <form
//             onSubmit={handleSubmit(handlePasswordChange)}
//             className="border-t pt-4 space-y-6"
//           >
//             <div className="relative">
//               <label className="block text-sm font-medium mb-2">Current Password</label>
//               <input
//                 type="password"
//                 {...register('currentPassword')}
//                 className="input input-bordered w-full"
//               />
//               {errors.currentPassword && (
//                 <p className="absolute text-xs text-red-500 mt-1 left-0 top-full">
//                   {errors.currentPassword.message}
//                 </p>
//               )}
//             </div>
//             <div className="relative">
//               <label className="block text-sm font-medium mb-2">New Password</label>
//               <input
//                 type="password"
//                 {...register('newPassword')}
//                 className="input input-bordered w-full"
//               />
//               {errors.newPassword && (
//                 <p className="absolute text-xs text-red-500 mt-1 left-0 top-full">
//                   {errors.newPassword.message}
//                 </p>
//               )}
//             </div>
//             <div className="relative">
//               <label className="block text-sm font-medium mb-2">Confirm New Password</label>
//               <input
//                 type="password"
//                 {...register('confirmPassword')}
//                 className="input input-bordered w-full"
//               />
//               {errors.confirmPassword && (
//                 <p className="absolute text-xs text-red-500 mt-1 left-0 top-full">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>
//             <button type="submit" className="btn btn-primary w-full mt-8">
//               Change Password
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from 'react';
import { UserCircle, Mail, Shield, Edit2, Save, X, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'New password must contain at least one special character')
      .required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Passwords must match')
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
      await axiosInstance.put('/users/update-profile', { name: user.name });
      toast.success('Name updated successfully!');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to update name.');
      console.error('Error updating name:', error);
    }
  };

  const handlePasswordChange = async (data) => {
    try {  
      const newPassword = data.newPassword.trim();
      const confirmNewPassword = data.confirmPassword.trim();
      const currentPassword = data.currentPassword.trim();
  
      if (!newPassword || !confirmNewPassword || !currentPassword) {
        toast.error("All fields are required!");
        return;
      }
  
      if (newPassword !== confirmNewPassword) {
        toast.error("Passwords don't match! Please check and retry.");
        return;
      }
  
      if (currentPassword === newPassword) {
        toast.error("New password must be different from the current password.");
        return;
      }
  
      const response = await axiosInstance.post('/users/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      
      if(response.data){
        toast.success(response.data.message);
        reset();

      }
    } catch (error) {
      
      toast.error(error.response.data.message);
      console.error('Error changing password:', error);
    }
  };
  

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r  px-6 py-4">
            
            <h2 className="mt-2 text-center text-xl font-bold ">Profile Settings</h2>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {/* Personal Information Section */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <UserCircle className="h-4 w-4  text-purple-400" />
                Personal Information
              </h3>
              
              {/* Name Field */}
              <div className="bg-base-300 rounded-lg p-2">
                <label className="block text-xs font-medium  mb-1">Name</label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="flex-1 h-10 rounded-lg bg-base-300 pl-2 border-gray-600  shadow-sm "
                    />
                    <button
                      onClick={handleNameEdit}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white btn btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="inline-flex items-center px-2 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-base ">{user.name}</p>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="inline-flex items-center px-2 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="bg-base-300 rounded-lg p-2">
                <label className="block text-xs font-medium  mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-base ">{user.email}</p>
                </div>
              </div>

              {/* Role Field */}
              <div className="bg-base-300 rounded-lg p-2">
                <label className="block text-xs font-medium  mb-1">Role</label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <p className="text-base ">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-base font-semibold  flex items-center gap-2 mb-3">
                <KeyRound className="h-4 w-4 text-purple-400" />
                Change Password
              </h3>
              
              <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-3">
                {/* Current Password */}
                <div className="relative">
                  <label className="block text-xs font-medium  mb-1">
                    Current Password
                    <span className="text-error pl-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      {...register('currentPassword')}
                      className="block w-full h-10 rounded-lg pl-2 bg-base-100 border-gray-600  shadow-sm focus:border-purple-500 focus:ring-purple-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 " />
                      ) : (
                        <Eye className="h-4 w-4 " />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-xs font-medium  mb-1">
                    New Password
                    <span className="text-error pl-1">*</span>

                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      {...register('newPassword')}
                      className="block w-full h-10 rounded-lg pl-2 bg-base-100 border-gray-600  shadow-sm focus:border-purple-500 focus:ring-purple-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 " />
                      ) : (
                        <Eye className="h-4 w-4 " />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-xs font-medium  mb-1">
                    Confirm New Password
                    <span className="text-error pl-1">*</span>

                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      {...register('confirmPassword')}
                      className="block w-full h-10 rounded-lg pl-2 bg-base-100 border-gray-600  shadow-sm focus:border-purple-500 focus:ring-purple-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 " />
                      ) : (
                        <Eye className="h-4 w-4 " />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  transition-colors duration-200"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;