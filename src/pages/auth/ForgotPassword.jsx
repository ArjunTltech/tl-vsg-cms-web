import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, Lock, XIcon, CheckCircleIcon } from 'lucide-react';
import axiosInstance from '../../config/axios';
import OTPInput from 'react-otp-input';

// Validation Schemas
const emailSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
});

const otpSchema = yup.object({
    otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

const passwordSchema = yup.object({
    newPassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
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
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Password Reset</h2>
                    <p className="mt-2 text-sm text-gray-600">
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="email"
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter your email"
                                    />
                                )}
                            />
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

                        <p className="mt-2 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
                        </p>
                    </form>
                )}

                {/* OTP Step */}
                {step === 2 && (
                    <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-6">
                        <div className="relative ">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                            <div className='flex justify-center'>
                            <Controller
                                name="otp"
                                control={control}
                                render={({ field }) => (
                                    <OTPInput
                                        {...field}
                                        value={field.value || ''} // Default to empty string to avoid uncontrolled input error
                                        onChange={(value) => field.onChange(value)} // Update form state on change
                                        numInputs={6} 
                                        renderInput={(props) => <input {...props} />}
                                        separator={<span className="mx-1 text-gray-900">-</span>} // Add separator
                                        inputStyle={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            margin: '0.5rem',
                                            fontSize: '1rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #d1d5db',
                                            textAlign: 'center',
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
                                <p className="text-red-500 text-xs ml-3 mt-1">{errors.otp.message}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <Controller
                                name="newPassword"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="password"
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter your new password"
                                    />
                                )}
                            />
                            <div className='absolute'>
                                {errors.newPassword && (
                                    <p className="text-red-500 text-xs ml-3 mt-1">{errors.newPassword.message}</p>
                                )}
                            </div>

                        </div>

                        <div className="relative">
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <Controller
                                name="confirmNewPassword"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="password"
                                        className={`appearance-none block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Confirm your new password"
                                    />
                                )}
                            />
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
        </div>
    );
}

export default ForgotPassword;
