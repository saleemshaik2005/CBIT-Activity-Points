'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { RulesManager } from '@/components/admin/RulesManager';
import { ArrowLeft, Settings, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminRulesPage() {
  const { currentUser, switchRole } = useApp();

  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-[#fbf5eb] dark:bg-[#1a2817] text-[#a16b15] dark:text-[#fbbf24] rounded-2xl flex items-center justify-center mx-auto border border-[#a16b15]/30 shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
          Administrator Access Required
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
          Modifying the official 24 MAR categories and point caps is restricted to College Administrators.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => switchRole('admin')}
            className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Switch to Admin Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#385529] dark:hover:text-[#4ade80] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Hub</span>
        </Link>

        <span className="text-xs bg-[#fbf5eb] dark:bg-[#1a2817] text-[#a16b15] dark:text-[#fbbf24] font-bold px-3 py-1 rounded-full border border-[#a16b15]/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Dynamic Rules Configuration
        </span>
      </div>

      <RulesManager />

    </div>
  );
}
