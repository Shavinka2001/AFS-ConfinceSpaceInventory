import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
                phone: user.phone || '',
                password: '',
                confirmPassword: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        }
    }, [user]);

    // Validation functions
    const validateEmail = (email) => {
        return email.toLowerCase().endsWith('@agilefacilities.com');
    };

    const validatePhone = (phone) => {
        return /^\+1\d{10}$/.test(phone);
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email must end with @agilefacilities.com';
        }

        // Phone validation
        if (formData.phone && !validatePhone(formData.phone)) {
            newErrors.phone = 'Phone number must start with +1 and be 10 digits long';
        }

        // Password validation for new users
        if (!user) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters long';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        // Password change validation for existing users
        if (user && (formData.currentPassword || formData.newPassword || formData.confirmNewPassword)) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required';
            }
            if (!formData.newPassword) {
                newErrors.newPassword = 'New password is required';
            } else if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'New password must be at least 6 characters long';
            }
            if (!formData.confirmNewPassword) {
                newErrors.confirmNewPassword = 'Please confirm your new password';
            } else if (formData.newPassword !== formData.confirmNewPassword) {
                newErrors.confirmNewPassword = 'New passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Email auto-completion logic
        if (name === 'email') {
            if (value.endsWith('@') && !value.includes('@agilefacilities.com')) {
                processedValue = value + 'agilefacilities.com';
            } else if (value.includes('@') && !value.endsWith('@')) {
                const username = value.split('@')[0];
                if (username && !value.includes('@agilefacilities.com')) {
                    const domainPart = value.split('@')[1] || '';
                    if ('agilefacilities.com'.startsWith(domainPart)) {
                        processedValue = value;
                    } else {
                        processedValue = username + '@agilefacilities.com';
                    }
                }
            }
        }

        // Phone formatting logic
        if (name === 'phone') {
            let phoneValue = value;
            if (!phoneValue.startsWith('+1')) {
                phoneValue = '+1' + phoneValue.replace(/^\+?1?/, '');
            }
            let digits = phoneValue.slice(2).replace(/\D/g, '').slice(0, 10);
            processedValue = '+1' + digits;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        // Prepare data for submission
        const submitData = { ...formData };
        // For registration, remove password change fields
        if (!user) {
            delete submitData.currentPassword;
            delete submitData.newPassword;
            delete submitData.confirmNewPassword;
            if (!submitData.password && !submitData.confirmPassword) {
                delete submitData.password;
                delete submitData.confirmPassword;
            }
        } else {
            // For update, only send password change fields if filled
            if (!(submitData.currentPassword && submitData.newPassword && submitData.confirmNewPassword)) {
                delete submitData.currentPassword;
                delete submitData.newPassword;
                delete submitData.confirmNewPassword;
            }
            // Remove registration password fields
            delete submitData.password;
            delete submitData.confirmPassword;
        }
        
        try {
            await onSubmit(submitData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header Section */}
                <div className="bg-[#0E1530] p-6 lg:p-8 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                    {user ? 'Update Profile' : 'Create Account'}
                                </h2>
                                <p className="text-gray-200 mt-1">
                                    {user ? 'Update your personal information and settings' : 'Create your new account'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                            errors.firstname ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                        }`}
                                        placeholder="Enter your first name"
                                    />
                                    {errors.firstname && (
                                        <p className="text-sm text-red-600">{errors.firstname}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                            errors.lastname ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                        }`}
                                        placeholder="Enter your last name"
                                    />
                                    {errors.lastname && (
                                        <p className="text-sm text-red-600">{errors.lastname}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        Email Address *
                                        <span className="text-xs font-normal text-gray-500">(@agilefacilities.com required)</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                        }`}
                                        placeholder="yourname@agilefacilities.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        Phone Number
                                        <span className="text-xs font-normal text-gray-500">(Format: +1XXXXXXXXXX)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={12}
                                        pattern="\+1\d{10}"
                                        inputMode="numeric"
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                        }`}
                                        placeholder="+1XXXXXXXXXX"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password Section - Only for new users */}
                        {!user && (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Security</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!user}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                                }`}
                                                placeholder="Create a strong password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {passwordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            Confirm Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={confirmPasswordVisible ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required={!user}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                                }`}
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {confirmPasswordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Password Change Section - Only for existing users */}
                        {user && (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={currentPasswordVisible ? "text" : "password"}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                                    errors.currentPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                                }`}
                                                placeholder="Current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {currentPasswordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.currentPassword && (
                                            <p className="text-sm text-red-600">{errors.currentPassword}</p>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={newPasswordVisible ? "text" : "password"}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                                    errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                                }`}
                                                placeholder="New password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {newPasswordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="text-sm text-red-600">{errors.newPassword}</p>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className="w-5 h-5 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={confirmNewPasswordVisible ? "text" : "password"}
                                                name="confirmNewPassword"
                                                value={formData.confirmNewPassword}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] transition-all bg-white ${
                                                    errors.confirmNewPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#0E1530]'
                                                }`}
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {confirmNewPasswordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmNewPassword && (
                                            <p className="text-sm text-red-600">{errors.confirmNewPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-[#0E1530] text-white rounded-2xl hover:bg-[#0E1530]/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {user ? 'Update Profile' : 'Create Account'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm; 