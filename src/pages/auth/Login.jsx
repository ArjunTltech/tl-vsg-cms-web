import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BackgroundImage from '../../assets/images/bg-img.jpg';
import { Eye, EyeOff, Mail, Lock, Loader, X } from 'lucide-react';
import axiosInstance from '../../config/axios';
import { useAuth } from '../../context/AuthContext';
import playNotificationSound from '../../utils/playNotification';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Validation Schema with Yup
    const validationSchema = yup.object({
        email: yup
            .string()
            .email('Invalid email address')
            .required('Email is required'),
        password: yup
            .string()
            .required('Password is required'),
        rememberMe: yup.boolean()
    });

    // React Hook Form
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    // Form submission handler
    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('/auth/login', data);
            const { token, user } = response.data;
            playNotificationSound()
            login(token, user.role, data.rememberMe);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            setTimeout(() => {
                setError('');
            }, 2000)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundImage: `url(${BackgroundImage})` }} className=" relative min-h-screen bg-cover bg-center w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className='inset-0 absolute backdrop-blur-sm'></div>
            <div className="max-w-md w-full space-y-8 bg-black/70 z-[999] p-8 rounded-xl shadow-lg">
                <div className="flex justify-between flex-wrap"><div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-200">Welcome back</h2>
                    <p className="mt-2 text-sm text-gray-200">Sign in to your account</p>
                </div>
                    <img src="https://www.vsgenxsolutions.com/_next/static/media/logo-1.ded65dd8.png" className='h-14 rounded-sm w-auto' alt="" /></div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <X className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="email"
                                        className={`appearance-none block text-slate-900 placeholder:text-slate-900  w-full pl-10 pr-3 py-2 border rounded-lg
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter your email"
                                    />
                                )}
                            />
                        </div>
                        <div className='absolute'>
                            {errors.email && (
                                <p className="text-red-500 text-xs ml-3 mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        className={`appearance-none block text-slate-900 placeholder:text-slate-900  w-full pl-10 pr-10 py-2 border rounded-lg
                      focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter your password"
                                    />
                                )}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className='absolute'>
                            {errors.password && (
                                <p className="text-red-500 text-xs ml-3  mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Controller
                                name="rememberMe"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => onChange(e.target.checked)}
                                        className="h-4 w-4 text-blue-300 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                )}
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-200">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-300 hover:text-blue-500">Forgot your password?</Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
              shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                            'Sign in'
                        )}
                    </button>

                    {/* Sign Up Link */}
                    {/* <p className="mt-2 text-center text-sm text-gray-200">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium text-blue-300 hover:text-blue-500">Sign up</a>
                    </p> */}
                </form>
            </div>
                <div className="text-center mt-6 absolute z-[999] bottom-10 ">
            <a
                href="https://www.tltechnologies.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 text-sm bg-black/70 p-3"
            >
                © 2025 <span className="text-red-500 ">TL TECHNOLOGIES PRIVATE LIMITED</span> All rights reserved.
            </a>
        </div>
            
        </div>
        
    );
}

export default LoginPage;
