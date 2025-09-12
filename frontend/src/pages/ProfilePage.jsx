import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    // handle profile image upload
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({profileImage: base64Image});
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white pt-20">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-black rounded-xl p-8 space-y-8 border border-zinc-700">
          
          {/* Header */}
          <div className="text-2xl font-semibold text-orange-500">
            <h1>Profile</h1>
            <p className="text-gray-400 text-base mt-1">Your Profile Information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.user?.profileImage || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-black" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-1">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
                {authUser?.user?.username}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
                {authUser?.user?.email}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-black rounded-xl p-6 border border-zinc-700">
            <h2 className="text-lg font-medium text-orange-500 mb-4">Account Information</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {new Date(authUser?.user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
