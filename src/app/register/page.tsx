'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1b20] rounded-3xl p-7 sm:p-8 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-center mx-auto text-[#a71a1b] dark:text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf9f5] dark:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] text-[10px] font-bold uppercase tracking-wider text-[#a16b15] dark:text-amber-400">
            <Lock className="w-3 h-3" /> Strict Whitelist Access
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            New Account Sign-Up Disabled
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            This portal is strictly restricted to the pre-authorized <strong>CBIT AI&amp;DS Section 2 Student Roster (67 Students)</strong> and <strong>Assigned Department Faculty (6 Accounts)</strong>.
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Unregistered Google accounts and external sign-ups are blocked by institutional security policy. Please sign in using your pre-registered CBIT email or Roll Number on the Login portal.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="w-full py-3 px-5 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 border-b-2 border-[#a16b15]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
