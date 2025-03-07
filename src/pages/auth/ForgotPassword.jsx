import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, Lock, XIcon, CheckCircleIcon, EyeOffIcon, EyeIcon } from 'lucide-react';
import axiosInstance from '../../config/axios';
import OTPInput from 'react-otp-input';
import BackgroundImage from '../../assets/images/bg-img.jpg';

// Validation Schemas
const emailSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
});

const otpSchema = yup.object({
    otp: yup
        .string()
        .matches(/^[0-9]+$/, 'OTP must contain only numbers')
        .length(6, 'OTP must be 6 digits')
        .required('OTP is required'),
});

const passwordSchema = yup.object({
    newPassword: yup
        .string()
        .min(8, 'New password must be at least 8 characters long')
        .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'New password must contain at least one special character')
        .required('New password is required'),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

function ForgotPassword() {
    const [step, setStep] = useState(1); // Step control (1: email, 2: otp, 3: reset password)
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(step === 1 ? emailSchema : step === 2 ? otpSchema : passwordSchema),
        mode: 'onChange', // Trigger validation on change
        defaultValues: {
            email: '',
            otp: '',
            newPassword: '',
            confirmNewPassword: '',
        }
    });

    const handleEmailSubmit = async (data) => {
        setIsLoading(true);
        setMessage('');
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email: data.email });
            setMessage(response.data.message);
            setSuccess(response.data.success);
            if (response.data.success) {
                setEmail(data.email);
                setStep(2); // Move to OTP step
            }
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (data) => {
        setIsLoading(true);
        setMessage('');
        try {
            const response = await axiosInstance.post('/auth/verify-otp', { email, otp: data.otp });
            setMessage(response.data.message);
            setSuccess(response.data.success);
            if (response.data.success) {
                setStep(3); // Move to reset password step
            }
        } catch (error) {
            setMessage('Error verifying OTP. Please try again.');
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (data) => {
        setIsLoading(true);
        setMessage('');
        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                email,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            });
            setMessage(response.data.message);
            setSuccess(response.data.success);
            if (response.data.success) {
                setStep(1);
                navigate('/login');
            }
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{ backgroundImage: `url(${BackgroundImage})` }}
            className="relative min-h-screen bg-cover bg-center w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            {/* Reduced blur and added slight opacity for better readability */}
            <div className='inset-0 absolute bg-black/30 backdrop-blur-sm'></div>

            <div className="max-w-md w-full space-y-8 bg-black/60 z-[10] p-8 rounded-xl shadow-lg relative">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-200">Password Reset</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        {step === 1 && "Enter your email to reset password"}
                        {step === 2 && "Enter the OTP sent to your email"}
                        {step === 3 && "Create a new password"}
                    </p>
                </div>

                {message && (
                    <div
                        className={`p-4 rounded ${success
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'bg-red-50 border-l-4 border-red-500'
                            }`}
                    >
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {success ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                ) : (
                                    <XIcon className="h-5 w-5 text-red-400" />
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Step */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
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
                                            className={`appearance-none block w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                                            text-slate-900 placeholder:text-slate-900
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Request OTP'}
                        </button>

                        <p className="mt-2 text-center text-sm text-gray-300">
                            Think you don’t need a reset? {' '}
                            <Link to="/login" className="font-medium text-blue-300 hover:text-blue-500">Login</Link>
                        </p>
                    </form>
                )}

                {/* OTP Step */}
                {step === 2 && (
                    <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">Enter OTP</label>
                            <div className='flex justify-center'>
                                <Controller
                                    name="otp"
                                    control={control}
                                    render={({ field }) => (
                                        <OTPInput
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(value) => field.onChange(value)}
                                            numInputs={6}
                                            renderInput={(props) => <input {...props} />}
                                            separator={<span className="mx-1 text-gray-300">-</span>}
                                            inputStyle={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                margin: '0.5rem',
                                                fontSize: '1rem',
                                                borderRadius: '0.375rem',
                                                border: '1px solid #d1d5db',
                                                textAlign: 'center',
                                                backgroundColor: 'white',
                                                color: 'black'
                                            }}
                                            focusStyle={{
                                                borderColor: '#3b82f6',
                                                outline: 'none',
                                                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {errors.otp && (
                                <p className="text-red-500 text-xs ml-3 mt-1 text-center">{errors.otp.message}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-300 bg-black/30 hover:bg-black/50"
                            >
                                Back
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Password Reset Step */}
                {step === 3 && (
                    <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="relative">
                                    <Controller
                                        name="newPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                className={`appearance-none block w-full pl-10 pr-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
            text-slate-900 placeholder:text-slate-900
            ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
                                                placeholder="Enter your new password"
                                            />
                                        )}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOffIcon className='text-base-300' size={20} /> : <EyeIcon className='text-base-300' size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div className='absolute'>
                                {errors.newPassword && (
                                    <p className="text-red-500 text-xs ml-3 mt-1">{errors.newPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                {/* <Controller
                                    name="confirmNewPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="password"
                                            className={`appearance-none block w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                                            text-slate-900 placeholder:text-slate-900
                                            ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Confirm your new password"
                                        />
                                    )}
                                /> */}
                                <div className="relative">
                                    <Controller
                                        name="confirmNewPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type={confirmPassword ? "text" : "password"}
                                                className={`appearance-none block w-full pl-10 pr-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
            text-slate-900 placeholder:text-slate-900
            ${errors.confirmNewPassword ? "border-red-500" : "border-gray-300"}`}
                                                placeholder="Confirm your new password"
                                            />
                                        )}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={() => setConfirmPassword(!confirmPassword)}
                                    >
                                        {confirmPassword ? <EyeOffIcon className='text-base-300' size={20} /> : <EyeIcon className='text-base-300' size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div className='absolute flex items-center'>
                                {errors.confirmNewPassword && <p className="text-red-500 text-xs ml-3 mt-1">{errors.confirmNewPassword.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
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

export default ForgotPassword;