'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { FileCheck, Download, Printer } from 'lucide-react';

export default function TeacherReportsPage() {
  const { currentUser, settings } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">Batch MAR Master Report</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Department of {currentUser.department} • Academic Year {settings.academic_year}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
          <span>Print Section Report</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs text-center py-12 space-y-3">
        <FileCheck className="w-12 h-12 text-[#385529] dark:text-emerald-400 mx-auto" />
        <h3 className="text-base font-serif font-bold text-gray-800 dark:text-gray-200">Master Class Report Prepared</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Section AI&DS-2: 66 Students registered. 48 students have already met the 60/50 MAR points threshold for graduation eligibility.
        </p>
      </div>
    </div>
  );
}
