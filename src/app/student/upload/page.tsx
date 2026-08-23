'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CertificateUploader } from '@/components/student/CertificateUploader';
import { Sparkles, ArrowLeft, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function StudentUploadPage() {
  const { currentUser, switchRole } = useApp();

  // Role Gate: Only students can upload certificates
  if (currentUser.role !== 'student') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-[#fbf5eb] dark:bg-[#1a1b20] text-[#a16b15] dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-[#a16b15]/30 dark:border-[#2c2d36] shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
          Student Portal Restricted
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
          AI Certificate Upload is available exclusively to students. You are currently logged in as a <strong>{currentUser.role.replace('_', ' ').toUpperCase()}</strong> ({currentUser.full_name}).
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => switchRole('student')}
            className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Switch to Student Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <Link
            href={currentUser.role === 'mentor' ? '/mentor' : currentUser.role === 'hod' ? '/hod' : '/admin'}
            className="px-5 py-2.5 bg-white dark:bg-[#22232a] hover:bg-gray-50 dark:hover:bg-[#2a2b33] text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] transition-all"
          >
            Go to Your Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/student"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#385529] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-xs bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-200 font-bold px-3 py-1 rounded-full border border-[#385529]/30 dark:border-[#2e3039] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" /> Automated AI Document Verification
        </span>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-3xl p-6 sm:p-8 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100 tracking-tight">
            AI Certificate & Activity Upload
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload your certificate in JPG, PNG, PDF, or HEIC format. AI will automatically extract details and match with the 24 CBIT MAR categories. You can review and edit every detail before submitting!
          </p>
        </div>

        <CertificateUploader />

        {/* Informational Guidance Box */}
        <div className="p-4 rounded-2xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] text-xs text-gray-600 dark:text-gray-300 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-gray-800 dark:text-gray-200">
            <ShieldCheck className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <span>Verification Guidelines</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
            <li>Ensure the student name, issuing authority, and completion date are clearly legible.</li>
            <li>For NPTEL/MOOC courses, ensure the duration (8 weeks or 12 weeks) is visible for maximum points allocation.</li>
            <li>Once submitted, your assigned faculty mentor will verify the document and award the points to your MAR record.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
