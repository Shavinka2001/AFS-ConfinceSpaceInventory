import React, { useState } from 'react';

const ProfileHeader = ({ user, onProfileUpdate }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(user.profileImage || null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                return;
            }
            if (!file.type.startsWith('image/')) {
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header Background */}
            <div className="bg-[#0E1530] p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Profile Image Section */}
                    <div className="relative group">
                        <div className="h-24 w-24 lg:h-32 lg:w-32 rounded-3xl overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-bold text-3xl lg:text-4xl">
                                    {user.firstname?.[0] || "T"}
                                    {user.lastname?.[0] || ""}
                                </span>
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#0E1530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-white text-xs font-medium">Change Photo</span>
                            </div>
                        </label>
                    </div>

                    {/* User Info Section */}
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                            {user.firstname} {user.lastname}
                        </h2>
                        <p className="text-gray-200 text-lg mb-4">Technician</p>
                        
                        {/* Status Badges */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-green-500/20 text-green-100 border border-green-400/30">
                                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                                Active
                            </span>
                            <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-blue-500/20 text-blue-100 border border-blue-400/30">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Available
                            </span>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={onProfileUpdate}
                            className="px-6 py-3 bg-white text-[#0E1530] rounded-2xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Section */}
            <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Assigned Locations</p>
                                <p className="text-xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Work Orders</p>
                                <p className="text-xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                                <p className="text-xl font-bold text-gray-900">42</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader; 