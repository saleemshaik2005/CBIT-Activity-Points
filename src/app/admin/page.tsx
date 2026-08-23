'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Settings, Users, ArrowRight, RotateCcw } from 'lucide-react';

export default function AdminHubPage() {
  const { categories, submissions, settings, resetToDefaults } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
              System Administrator
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Master Control Center</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            CBIT MAR Administration Hub
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage MAR rulebooks, graduation target points, user roles, faculty mentor assignments, and database policies.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset system data and categories back to official CBIT default values?')) {
              resetToDefaults();
              alert('Reset to defaults successful.');
            }
          }}
          className="px-4 py-2 bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex items-center space-x-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
          <span>Reset All to Defaults</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Active Categories</span>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">{categories.length}</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Regular B.Tech Goal</span>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718] dark:text-white">{settings.regular_target_points} pts</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Lateral Entry Goal</span>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">{settings.lateral_entry_target_points} pts</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#385529] dark:text-emerald-400 font-semibold">Total Submissions</span>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">{submissions.length}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Link
          href="/admin/rules"
          className="bg-white dark:bg-[#1a1b20] p-6 rounded-2xl border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] hover:border-[#a16b15] dark:hover:border-gray-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1c2718] dark:text-white group-hover:text-[#385529] dark:group-hover:text-emerald-400 transition-colors">
              Configure MAR Rules & Point Limits
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Dynamically customize the 24 categories, edit point values per activity, adjust category maximum allowed caps, and change graduation target points (60/50).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2c2d36] flex items-center text-xs font-bold text-[#385529] dark:text-gray-200 group-hover:text-[#a16b15] dark:group-hover:text-white">
            <span>Manage MAR Rules & Caps</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white dark:bg-[#1a1b20] p-6 rounded-2xl border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] hover:border-[#385529] dark:hover:border-gray-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1c2718] dark:text-white group-hover:text-[#a16b15] dark:group-hover:text-amber-400 transition-colors">
              User Roles & Mentor Allocation
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Assign roles (Student, Mentor, Class Teacher, HOD, Admin), allocate students to faculty counselors, and manage department rosters.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2c2d36] flex items-center text-xs font-bold text-[#a16b15] dark:text-amber-400">
            <span>Manage Users & Roles</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

    </div>
  );
}
