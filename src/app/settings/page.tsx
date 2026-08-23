'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
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
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, theme, toggleTheme, logout } = useApp();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [broadcastAlerts, setBroadcastAlerts] = useState(true);

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
      <div className="bg-white dark:bg-[#151f12] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-1">
        <div className="flex items-center space-x-2 text-[#385529] dark:text-[#4ade80]">
          <Settings className="w-5 h-5" />
          <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
            Account & System Settings
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Manage your personal profile, appearance theme, security, and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card & Logout */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Profile Overview Card */}
          <div className="bg-white dark:bg-[#151f12] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#385529] dark:bg-[#4ade80] text-[#dfa94b] dark:text-[#0d140b] font-serif font-bold text-xl flex items-center justify-center border-2 border-[#a16b15]">
                {currentUser.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.full_name}</h3>
                <p className="text-[11px] text-[#a16b15] dark:text-[#fbbf24] font-semibold capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
                <p className="text-[10px] text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-[#2b3d26] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  <span>Roll / Faculty ID</span>
                </span>
                <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {currentUser.roll_number || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5">
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
                    <span className="text-gray-500">Section & Batch</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Section {currentUser.section || '2'} • {currentUser.batch_year}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Counselor / Guide</span>
                    <span className="font-semibold text-[#385529] dark:text-[#4ade80]">
                      {currentUser.mentor_name || 'Dr. D. Ramana'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Entry Category</span>
                    <span className="font-bold text-[#a16b15] dark:text-[#fbbf24]">
                      {currentUser.is_lateral_entry ? 'Lateral Entry (50 Pts)' : '4-Yr Regular (60 Pts)'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-[#a71a1b] dark:text-red-400 font-bold text-xs rounded-xl border border-red-200 dark:border-red-800/50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of System</span>
          </button>

        </div>

        {/* Right Column: Theme, Password & Notifications */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Appearance / Theme Settings */}
          <div className="bg-white dark:bg-[#151f12] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#fbbf24]" /> : <Sun className="w-4 h-4 text-[#a16b15]" />}
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
                    : 'border-gray-200 dark:border-[#2b3d26] bg-white dark:bg-[#1a2817] text-gray-600 dark:text-gray-300'
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
                    ? 'border-[#4ade80] bg-[#22351e] text-[#4ade80] font-bold shadow-xs'
                    : 'border-gray-200 dark:border-[#2b3d26] bg-white dark:bg-[#1a2817] text-gray-600 dark:text-gray-300'
                }`}
              >
                <Moon className="w-6 h-6 text-[#fbbf24]" />
                <span className="text-xs">Dark Mode (Midnight Green)</span>
              </button>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white dark:bg-[#151f12] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#385529] dark:text-[#4ade80]" />
              <span>Change Account Password</span>
            </h3>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-[#eef5ec] dark:bg-[#1a2817] text-[#273e1c] dark:text-[#4ade80] text-xs font-bold flex items-center gap-2">
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-[#151f12] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24]" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-2.5 pt-1 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] border border-[#e8e3d8] dark:border-[#2b3d26] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">Certificate Review Alerts</span>
                  <span className="text-[10px] text-gray-500">Get notified when submissions are verified or rejected</span>
                </div>
                <input
                  type="checkbox"
                  checked={approvalAlerts}
                  onChange={(e) => setApprovalAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#385529] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] border border-[#e8e3d8] dark:border-[#2b3d26] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">Official Academic Broadcasts</span>
                  <span className="text-[10px] text-gray-500">Receive announcements from HoD and administrators</span>
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
