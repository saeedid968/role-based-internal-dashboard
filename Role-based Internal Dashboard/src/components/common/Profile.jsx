import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/Auth_Context';
import { useUI } from '../../context/UIContext';
import { CheckCircle } from "lucide-react";


const Profile = () => {
  const { profileData, updateProfile, resetProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const { showToast } = useUI();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const loadSupportData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadSupportData();
  }, []);

  useEffect(() => {
    if (!profileData) return;

    setFormData(prev => ({
      ...prev,
      name: profileData.name,
      email: profileData.email
    }));
  }, [profileData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const hasProfileChanges =
    !!profileData &&
    (formData.name !== profileData.name || formData.email !== profileData.email);

  const hasPasswordChanges =
    !!formData.currentPassword || !!formData.newPassword || !!formData.confirmPassword;

  const isSaveEnabled = hasProfileChanges || hasPasswordChanges;

  const handleSaveChanges = () => {
    if (!isSaveEnabled) {
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: formData.name,
        email: formData.email
      });

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      showToast({
        message: "Changes saved!",
        icon: <CheckCircle className="w-5 h-5 text-white" />,
        type: "success",
        duration: 3000,
        action: {
          label: "Undo",
          disabled: true,
          tooltip: "Undo — coming soon",
        },
      });

      setIsSaving(false);
    }, 700);
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.name,
        email: profileData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleResetToDefault = () => {
    setShowResetModal(true);
  };

  if (!profileData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-slate-500 animate-pulse">Loading users...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500">
      <p>Failed to load user data. Please try again later.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header with Avatar */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="relative group">
          <div className="size-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-200">
            <img
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              src={profileData.avatar}
            />
          </div>
          <button className="absolute bottom-0 right-0 size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 hover:bg-blue-700 transition-colors">
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData.name}</h2>
          <p className="text-slate-500">Manage your profile and account security</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Basic Information
          </h4>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm py-2.5 px-3"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Personal Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personal Email</label>
              <input
                className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm py-2.5 px-3"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Job Title (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-500">Job Title (Read-only)</label>
              <div className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 text-slate-500 sm:text-sm py-2.5 px-3 cursor-not-allowed">
                {profileData.jobTitle}
              </div>
            </div>

            {/* Department (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-500">Department (Read-only)</label>
              <div className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 text-slate-500 sm:text-sm py-2.5 px-3 cursor-not-allowed">
                {profileData.department}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            Security
          </h4>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
              <input
                className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm py-2.5 px-3"
                placeholder="••••••••"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
              <input
                className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm py-2.5 px-3"
                placeholder="Min. 8 characters"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <input
                className="block w-full mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm py-2.5 px-3"
                placeholder="Confirm new password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Password Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 items-start">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Password must contain at least 8 characters, including one uppercase letter,
              one lowercase letter, and one number or special character.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleResetToDefault}
          className="text-sm font-semibold text-rose-500 hover:text-rose-700 dark:text-rose-500 dark:hover:text-red-300 transition-colors cursor-pointer"
        >
          Reset to Default
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium cursor-pointer
        text-slate-700 dark:text-slate-300
        bg-white dark:bg-slate-800
        border border-slate-300 dark:border-slate-600
        rounded-lg
        hover:bg-slate-50 dark:hover:bg-slate-700
        transition-colors"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={!isSaveEnabled || isSaving}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors
        ${!isSaveEnabled || isSaving
                ? "bg-slate-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>


      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div
            className="bg-white dark:bg-[#1a202c] w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reset Profile?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                This will restore your profile fields to their default values. You can still cancel now.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProfile();
                  setShowResetModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition-all active:scale-95 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
