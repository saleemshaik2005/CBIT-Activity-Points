'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { FileCheck, Download, Printer } from 'lucide-react';

export default function TeacherReportsPage() {
  const { currentUser, settings } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Batch MAR Master Report</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Department of {currentUser.department} • Academic Year {settings.academic_year}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Section Report</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center py-12 space-y-3">
        <FileCheck className="w-12 h-12 text-blue-500 mx-auto" />
        <h3 className="text-base font-bold text-gray-800">Master Class Report Prepared</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Section CSE-1: 66 Students registered. 48 students have already met the 60/50 MAR points threshold for graduation eligibility.
        </p>
      </div>
    </div>
  );
}
