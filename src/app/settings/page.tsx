'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { fileToPermanentDataURL } from '@/lib/storage-db';
import {
  Settings,
  User,
  Moon,
  Sun,
  Lock,
  Bell,
  LogOut,
  CheckCircle2,
  Shield,
  Building,
  Hash,
  Camera,
  UploadCloud,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, theme, toggleTheme, logout, updateUserAvatar, updateUserProfile } = useApp();
  const router = useRouter();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone_number || '');
  const [email, setEmail] = useState(currentUser.email);
  const [resumeUrl, setResumeUrl] = useState(currentUser.resume_url || '');
  const [skillsInput, setSkillsInput] = useState((currentUser.skills || []).join(', '));
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [broadcastAlerts, setBroadcastAlerts] = useState(true);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64Url = await fileToPermanentDataURL(file);
        updateUserAvatar(base64Url);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to update profile image:', err);
      }
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateUserProfile({
      full_name: fullName,
      phone_number: phoneNumber,
      email,
      resume_url: resumeUrl || undefined,
      skills: parsedSkills.length > 0 ? parsedSkills : undefined,
    });

    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
        <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-200">
          <Settings className="w-5 h-5" />
          <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
            Account & Profile Settings
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Upload your profile picture, update contact details, adjust color themes, and manage notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card & Logout */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Profile Overview & Avatar Upload Card */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
            
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-[#385529] dark:bg-[#2a2b33] text-white font-serif font-bold text-2xl flex items-center justify-center border-2 border-[#a16b15]/40 overflow-hidden shadow-xs">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.full_name.charAt(0)}</span>
                  )}
                </div>

                {/* Upload Hover Overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold gap-0.5">
                  <Camera className="w-4 h-4 text-[#dfa94b]" />
                  <span>Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.full_name}</h3>
                <p className="text-[11px] text-[#a16b15] dark:text-amber-400 font-semibold capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
                <label className="text-[10px] text-[#385529] dark:text-emerald-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 mt-0.5">
                  <UploadCloud className="w-3 h-3" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {profileSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 dark:border-[#2a2b33] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  <span>Roll / Faculty ID</span>
                </span>
                <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {currentUser.roll_number || '160122771045'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>Department</span>
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-right truncate max-w-[180px]">
                  {currentUser.department}
                </span>
              </div>

              {currentUser.role === 'student' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Section & Batch</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Section {currentUser.section || '2'} • {currentUser.batch_year}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Faculty Counselor</span>
                    <span className="font-semibold text-[#385529] dark:text-emerald-400">
                      {currentUser.mentor_name || 'Dr. K. Ramana'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Entry Category</span>
                    <span className="font-bold text-[#a16b15] dark:text-amber-400">
                      {currentUser.is_lateral_entry ? 'Lateral Entry (45 Pts)' : '4-Yr Regular (60 Pts)'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Edit Information Form */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">
              Personal Information
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Official Email ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>

              {currentUser.role === 'student' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="Python, React, TensorFlow, AI"
                    className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-[#a71a1b] dark:text-rose-400 font-bold text-xs rounded-xl border border-red-200 dark:border-rose-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of System</span>
          </button>

        </div>

        {/* Right Column: Theme, Password & Notifications */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Appearance / Theme Settings */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-[#a16b15]" />}
              <span>Appearance & Color Theme</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#385529] bg-[#eef5ec] text-[#385529] font-bold shadow-xs'
                    : 'border-gray-200 dark:border-[#2c2d36] bg-white dark:bg-[#121214] text-gray-600 dark:text-gray-400'
                }`}
              >
                <Sun className="w-6 h-6 text-[#a16b15]" />
                <span className="text-xs">Light Mode (CBIT Classic)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                  theme === 'dark'
                    ? 'border-gray-400 dark:border-gray-400 bg-[#faf9f5] dark:bg-[#22232a] text-gray-900 dark:text-white font-bold shadow-xs'
                    : 'border-gray-200 dark:border-[#2c2d36] bg-white dark:bg-[#121214] text-gray-600 dark:text-gray-400'
                }`}
              >
                <Moon className="w-6 h-6 text-amber-400" />
                <span className="text-xs">Dark Mode (Matte Obsidian)</span>
              </button>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#385529] dark:text-gray-300" />
              <span>Change Account Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-2.5 pt-1 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">Certificate Review Alerts</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Get notified when submissions are verified or rejected</span>
                </div>
                <input
                  type="checkbox"
                  checked={approvalAlerts}
                  onChange={(e) => setApprovalAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#385529] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">Official Academic Broadcasts</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Receive announcements from HoD and administrators</span>
                </div>
                <input
                  type="checkbox"
                  checked={broadcastAlerts}
                  onChange={(e) => setBroadcastAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#385529] rounded"
                />
              </label>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
