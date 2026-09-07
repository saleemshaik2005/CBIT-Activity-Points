'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LayoutDashboard, BookOpen } from 'lucide-react';

export default function HODSignoffPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 text-center">
      <div className="w-16 h-16 bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-[#a16b15]/30 dark:border-[#2e3039] shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider font-bold bg-[#faf9f5] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 px-3 py-1 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
          Institutional Academic Regulation
        </span>
        <h1 className="text-2xl font-serif font-extrabold text-gray-900 dark:text-white">
          Digital Graduation Sign-Off Discontinued
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
          As per CBIT Autonomous Academic Regulations, digital graduation sign-off by the Head of Department is not required. Student graduation eligibility is determined directly upon achieving the mandatory 60 Activity Points (45 for Lateral Entry) verified by Faculty Mentors and recorded in the Master MAR Register.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/hod"
          className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] dark:border-[#383a45]"
        >
          <LayoutDashboard className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
          <span>Return to HOD Analytics</span>
        </Link>
        <Link
          href="/hod/students"
          className="px-5 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 text-xs font-bold rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>View Student Directory</span>
        </Link>
      </div>
    </div>
  );
}

