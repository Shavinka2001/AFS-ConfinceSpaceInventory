import React from 'react';

const PersonalInformation = ({ user }) => {
    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-[#0E1530] p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white">Personal Information</h3>
                        <p className="text-gray-200 mt-1">Your account details and contact information</p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                First Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user.firstname || 'Not provided'}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all read-only:bg-gray-50/80"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                Last Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user.lastname || 'Not provided'}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all read-only:bg-gray-50/80"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={user.email || 'Not provided'}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all read-only:bg-gray-50/80"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={user.phone || 'Not provided'}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all read-only:bg-gray-50/80"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                Role
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user.role || "Technician"}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all read-only:bg-gray-50/80"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                Department
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user.department || "Technical Support"}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all read-only:bg-gray-50/80"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Account Status</p>
                                    <p className="text-lg font-bold text-green-600">Active</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Security Level</p>
                                    <p className="text-lg font-bold text-gray-900">Standard</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation; 