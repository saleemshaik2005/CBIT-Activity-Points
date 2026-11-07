'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { fileToPermanentDataURL } from '@/lib/storage-db';
import { FeedbackModal } from '@/components/modals/FeedbackModal';
import {
  Settings,
  MessageSquare,
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
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, theme, toggleTheme, logout, updateUserAvatar, updateUserProfile } = useApp();
  const router = useRouter();

  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone_number || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [resumeUrl, setResumeUrl] = useState(currentUser.resume_url || '');
  const [skillsInput, setSkillsInput] = useState((currentUser.skills || []).join(', '));
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Synchronize form fields whenever currentUser changes
  useEffect(() => {
    setFullName(currentUser.full_name || '');
    setPhoneNumber(currentUser.phone_number || '');
    setEmail(currentUser.email || '');
    setResumeUrl(currentUser.resume_url || '');
    setSkillsInput((currentUser.skills || []).join(', '));
  }, [
    currentUser.id,
    currentUser.full_name,
    currentUser.phone_number,
    currentUser.email,
    currentUser.resume_url,
    currentUser.skills,
  ]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [broadcastAlerts, setBroadcastAlerts] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsPushSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsPushSubscribed(!!sub);
        });
      });
    }
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'avatar');
        formData.append('role', currentUser.role);
        formData.append('studentId', currentUser.id);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.url) {
            updateUserAvatar(json.url);
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
            return;
          }
        }

        const base64Url = await fileToPermanentDataURL(file);
        updateUserAvatar(base64Url);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to update profile image:', err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError(null);

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          skills: parsedSkills,
          resume_url: resumeUrl || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setProfileError(json.error || 'Failed to save profile changes.');
        return;
      }

      updateUserProfile(json.profile || {
        phone_number: phoneNumber,
        resume_url: resumeUrl || undefined,
        skills: parsedSkills,
      });

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Network error saving profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      setIsSavingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      setIsSavingPassword(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setPasswordError(json.error || 'Failed to update password.');
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Error occurred while updating password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePushToggle = async () => {
    if (!isPushSupported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      if (isPushSubscribed) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
        }
        setIsPushSubscribed(false);
      } else {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey || undefined,
        });
        const subJson = sub.toJSON();
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: subJson.keys,
            userAgent: navigator.userAgent,
          }),
        });
        setIsPushSubscribed(true);
      }
    } catch (err) {
      console.warn('Push subscription toggle error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
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
          Upload your profile picture, update verified contact details, manage themes, and configure notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card & Logout */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Profile Overview & Avatar Upload Card */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-[#e8e3d8] dark:border-[#2c2d36]">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#eef5ec] dark:bg-[#22232a] border-2 border-[#385529] dark:border-emerald-500 shadow-md flex items-center justify-center">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-[#385529] dark:text-emerald-400" />
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-[#385529] hover:bg-[#273e1c] text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Upload New Profile Picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>

              <div>
                <h2 className="font-serif font-bold text-base text-gray-900 dark:text-white">
                  {currentUser.full_name}
                </h2>
                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                  <span className="capitalize font-bold text-[#385529] dark:text-emerald-400">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <span>•</span>
                  <span>{currentUser.department}</span>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
              {profileSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Profile updated and verified on database!</span>
                </div>
              )}

              {profileError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold flex items-center gap-2 border border-rose-200 dark:border-rose-800">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Full Name (Official Roster)
                </label>
                <input
                  type="text"
                  disabled
                  value={fullName}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2e3039] bg-gray-100 dark:bg-[#121214] text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2e3039] bg-gray-100 dark:bg-[#121214] text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>

              {currentUser.role === 'student' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                      Professional Resume URL
                    </label>
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                      Technical Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="Python, React, Machine Learning, Java"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Feedback & Bug Reporting Button */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full py-2.5 bg-white dark:bg-[#1a1b20] hover:bg-gray-50 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <span>Send Feedback or Bug Report</span>
          </button>

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

          {/* Password Change Card (Faculty & Password Accounts) */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#385529] dark:text-gray-300" />
              <span>Change Account Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                    New Password (Min 8 chars)
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
                  disabled={isSavingPassword}
                  className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {isSavingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences & Web Push */}
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-2.5 pt-1 text-xs">
              {isPushSupported && (
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] cursor-pointer">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">
                      Browser Web Push Notifications
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      Receive instant desktop/mobile push alerts when certificates are reviewed
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPushSubscribed}
                    onChange={handlePushToggle}
                    className="w-4 h-4 accent-[#385529] rounded"
                  />
                </label>
              )}

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">Certificate Review In-App Alerts</span>
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

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
