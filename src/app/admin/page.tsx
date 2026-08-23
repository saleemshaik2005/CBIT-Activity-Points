'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Settings, Users, Database, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

export default function AdminHubPage() {
  const { categories, submissions, settings, resetToDefaults } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              System Administrator
            </span>
            <span className="text-xs text-gray-500">Master Control Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            CBIT MAR Administration Hub
          </h1>
          <p className="text-xs text-gray-500">
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
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Defaults</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Active Categories</span>
          <p className="text-2xl font-extrabold text-blue-700">{categories.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Regular B.Tech Target</span>
          <p className="text-2xl font-extrabold text-gray-900">{settings.regular_target_points} pts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Lateral Entry Target</span>
          <p className="text-2xl font-extrabold text-gray-900">{settings.lateral_entry_target_points} pts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs text-emerald-600 font-semibold">Total Submissions</span>
          <p className="text-2xl font-extrabold text-emerald-700">{submissions.length}</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Rules & Caps Card */}
        <Link
          href="/admin/rules"
          className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Configure MAR Rules & Point Limits
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dynamically customize the 24 categories, edit point values per activity, adjust category maximum allowed caps, and change graduation target points (60/50).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-blue-600">
            <span>Manage MAR Rules & Caps</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Users & Mentors Card */}
        <Link
          href="/admin/users"
          className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              User Roles & Mentor Allocation
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Assign roles (Student, Mentor, Class Teacher, HOD, Admin), allocate students to faculty counselors, and manage department rosters.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-purple-600">
            <span>Manage Users & Roles</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

    </div>
  );
}
