'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Megaphone,
  CheckCheck,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';

export default function NotificationsPage() {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'student' | 'mentor'>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    addNotification({
      recipient_role: targetAudience,
      type: 'announcement',
      title: announcementTitle,
      message: announcementMsg,
      link: '/student/guidelines',
      sender_name: `${currentUser.full_name} (${currentUser.role.toUpperCase()})`,
    });

    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-200">
            <Bell className="w-5 h-5" />
            <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
              Notifications & Activity Feed
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time updates regarding certificate submissions, mentor approvals, and academic notices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3 py-1.5 bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#eef5ec] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-300 text-xs font-bold rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Admin Broadcast Card (Visible to Admin & HoD) */}
      {(currentUser.role === 'admin' || currentUser.role === 'hod') && (
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#a16b15] dark:text-amber-400">
            <Megaphone className="w-5 h-5" />
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">
              Broadcast Official Announcement
            </h3>
          </div>

          {broadcastSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Announcement published to recipient notification feeds!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Announcement Title (e.g. Semester 6 Activity Points Deadline)"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529] font-medium"
                />
              </div>
              <div>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
                >
                  <option value="all">Target: All Users</option>
                  <option value="student">Target: Students Only</option>
                  <option value="mentor">Target: Mentors Only</option>
                </select>
              </div>
            </div>

            <textarea
              required
              rows={2}
              placeholder="Announcement message body..."
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Filter & List */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#385529] dark:bg-[#2c2d36] text-white'
                : 'bg-white dark:bg-[#1a1b20] text-gray-600 dark:text-gray-400 border border-[#e8e3d8] dark:border-[#2e3039]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-[#385529] dark:bg-[#2c2d36] text-white'
                : 'bg-white dark:bg-[#1a1b20] text-gray-600 dark:text-gray-400 border border-[#e8e3d8] dark:border-[#2e3039]'
            }`}
          >
            Unread ({notifications.filter((n) => !n.is_read).length})
          </button>
        </div>

        {filteredNotifs.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-12 text-center border border-[#e8e3d8] dark:border-[#2c2d36] space-y-2">
            <Bell className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No notifications found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up with your latest updates!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  item.is_read
                    ? 'bg-white dark:bg-[#1a1b20] border-[#e8e3d8] dark:border-[#2c2d36] opacity-80'
                    : 'bg-[#faf9f5] dark:bg-[#22232a] border-l-4 border-l-[#385529] dark:border-l-emerald-500 border-t border-r border-b border-[#e8e3d8] dark:border-[#2e3039] shadow-2xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2e3039] flex-shrink-0 mt-0.5">
                    {item.type === 'approval' && <CheckCircle2 className="w-5 h-5 text-[#385529] dark:text-emerald-400" />}
                    {item.type === 'rejection' && <AlertCircle className="w-5 h-5 text-[#a71a1b] dark:text-rose-400" />}
                    {item.type === 'submission' && <UploadCloud className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />}
                    {item.type === 'announcement' && <Megaphone className="w-5 h-5 text-[#3b566e] dark:text-sky-400" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h4>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#a71a1b] dark:bg-rose-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 dark:text-gray-500 pt-0.5">
                      <span>{new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {item.sender_name && (
                        <>
                          <span>•</span>
                          <span>From: {item.sender_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {item.link && (
                  <Link
                    href={item.link}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#121214] hover:bg-[#eef5ec] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] text-gray-600 dark:text-gray-300 flex-shrink-0"
                    title="Go to activity"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
