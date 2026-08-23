'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  HelpCircle,
  FileCheck,
  QrCode,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { AboutModal } from '@/components/modals/AboutModal';

export default function HomePage() {
  const { switchRole, isAuthenticated } = useApp();
  const router = useRouter();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    switchRole(role);
    router.push(targetPath);
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto pt-4">
        
        {/* Official College Crest Banner */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <img
            src="/images/cbit-crest.png"
            alt="CBIT Crest"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
          />
          <div className="inline-flex items-center space-x-1.5 bg-[#fbf5eb] dark:bg-[#1a2817] text-[#a16b15] dark:text-[#fbbf24] text-[11px] font-bold px-3 py-1 rounded-full border border-[#a16b15]/40 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#a16b15] dark:text-[#fbbf24]" />
            <span className="uppercase tracking-wide font-serif">
              Chaitanya Bharathi Institute of Technology (Autonomous)
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#385529] dark:text-[#4ade80] tracking-tight leading-tight">
          CBIT Activity Point System
        </h1>

        <div className="w-20 h-1 bg-[#a16b15] dark:bg-[#fbbf24] mx-auto rounded-full" />

        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
          Automated student activity points tracking, document intelligence for certificate recognition, and graduation signoffs across 8 semesters.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleSelectRole('student', '/student')}
                className="px-6 py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] cursor-pointer"
              >
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#dfa94b] dark:text-[#0d140b]" />
              </button>

              <button
                onClick={() => handleSelectRole('mentor', '/mentor')}
                className="px-6 py-3 bg-white dark:bg-[#151f12] hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] text-[#385529] dark:text-[#4ade80] font-bold text-sm rounded-xl border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24]" />
                <span>Faculty Verification Queue</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15]"
              >
                <LogIn className="w-4 h-4 text-[#dfa94b] dark:text-[#0d140b]" />
                <span>Sign In to Portal</span>
              </Link>

              <Link
                href="/register"
                className="px-6 py-3 bg-white dark:bg-[#151f12] hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] text-[#385529] dark:text-[#4ade80] font-bold text-sm rounded-xl border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs hover:shadow transition-all flex items-center space-x-2"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24]" />
              </Link>
            </>
          )}

          <button
            onClick={() => setIsAboutOpen(true)}
            className="px-5 py-3 bg-[#fbf5eb] dark:bg-[#1a2817] hover:bg-[#f5e9d3] dark:hover:bg-[#22351e] text-[#a16b15] dark:text-[#fbbf24] font-bold text-sm rounded-xl border border-[#a16b15]/40 shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24]" />
            <span>System Guide</span>
          </button>
        </div>
      </section>

      {/* Target Points Academic Requirements Card */}
      <section className="max-w-4xl mx-auto bg-white dark:bg-[#151f12] rounded-2xl p-6 sm:p-8 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-lg font-serif font-bold text-[#385529] dark:text-[#4ade80] uppercase tracking-wide">
            Mandatory Graduation Activity Requirements
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Approved non-academic points required to qualify for B.E. / B.Tech degree completion at CBIT Autonomous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] border-t-4 border-[#385529] dark:border-[#4ade80] border-x border-b border-[#e8e3d8] dark:border-[#2b3d26] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#385529] dark:text-[#4ade80] tracking-wider block">
              4-Year Regular B.E. / B.Tech
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-black text-[#385529] dark:text-[#4ade80]">60 Points</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">across Semesters I to VIII</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Earn points across approved activities including MOOCs, sports, tech fests, hackathons, and community service.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] border-t-4 border-[#a16b15] dark:border-[#fbbf24] border-x border-b border-[#e8e3d8] dark:border-[#2b3d26] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#a16b15] dark:text-[#fbbf24] tracking-wider block">
              Diploma Lateral Entry (LE)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-black text-[#a16b15] dark:text-[#fbbf24]">50 Points</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">across Semesters III to VIII</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Direct second-year admitted students fulfill 50 points requirement before final graduation signoff.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Workflow */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-serif font-bold text-[#385529] dark:text-[#4ade80] uppercase tracking-wide">
            How The System Works
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A seamless digital workflow from document upload to official graduation record generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151f12] border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ec] dark:bg-[#22351e] text-[#385529] dark:text-[#4ade80] font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-[#1c2718] dark:text-white text-sm">Upload Certificate Proof</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Drag-and-drop your certificate PDF or snap a photo directly from your smartphone camera.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151f12] border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf5eb] dark:bg-[#22351e] text-[#a16b15] dark:text-[#fbbf24] font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-[#1c2718] dark:text-white text-sm">Automated Extraction</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              AI extracts event name, organization, dates, credential ID, QR links, and maps to the correct CBIT category.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151f12] border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ec] dark:bg-[#22351e] text-[#385529] dark:text-[#4ade80] font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-[#1c2718] dark:text-white text-sm">Mentor Verification</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Faculty counselors inspect your certificate and award points to your official printable graduation sheet.
            </p>
          </div>

        </div>
      </section>

      {/* About & Instructions Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

    </div>
  );
}
