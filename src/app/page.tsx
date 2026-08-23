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
} from 'lucide-react';
import { AboutModal } from '@/components/modals/AboutModal';

export default function HomePage() {
  const { switchRole } = useApp();
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
          <div className="inline-flex items-center space-x-1.5 bg-[#fbf5eb] text-[#a16b15] text-[11px] font-bold px-3 py-1 rounded-full border border-[#a16b15]/40 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#a16b15]" />
            <span className="uppercase tracking-wide font-serif">
              Chaitanya Bharathi Institute of Technology (Autonomous)
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#385529] tracking-tight leading-tight">
          CBIT Activity Point System
        </h1>

        <div className="w-20 h-1 bg-[#a16b15] mx-auto rounded-full" />

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xl mx-auto">
          Automated student activity points tracking, document intelligence for certificate recognition, and graduation signoffs across 8 semesters.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleSelectRole('student', '/student')}
            className="px-6 py-3 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] cursor-pointer"
          >
            <span>Open Student Portal</span>
            <ArrowRight className="w-4 h-4 text-[#dfa94b]" />
          </button>

          <button
            onClick={() => handleSelectRole('mentor', '/mentor')}
            className="px-6 py-3 bg-white hover:bg-[#faf7f2] text-[#385529] font-bold text-sm rounded-xl border border-[#e8e3d8] shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#a16b15]" />
            <span>Faculty Verification Queue</span>
          </button>

          <button
            onClick={() => setIsAboutOpen(true)}
            className="px-5 py-3 bg-[#fbf5eb] hover:bg-[#f5e9d3] text-[#a16b15] font-bold text-sm rounded-xl border border-[#a16b15]/40 shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#a16b15]" />
            <span>System Guide</span>
          </button>
        </div>
      </section>

      {/* Target Points Academic Requirements Card */}
      <section className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e3d8] shadow-xs">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-lg font-serif font-bold text-[#385529] uppercase tracking-wide">
            Mandatory Graduation Activity Requirements
          </h2>
          <p className="text-xs text-gray-500">
            Approved non-academic points required to qualify for B.E. / B.Tech degree completion at CBIT Autonomous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#faf9f5] border-t-4 border-[#385529] border-x border-b border-[#e8e3d8] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#385529] tracking-wider block">
              4-Year Regular B.E. / B.Tech
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-black text-[#385529]">60 Points</span>
              <span className="text-xs text-gray-500 font-medium">across Semesters I to VIII</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Earn points across approved activities including MOOCs, sports, tech fests, hackathons, and community service.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#faf9f5] border-t-4 border-[#a16b15] border-x border-b border-[#e8e3d8] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#a16b15] tracking-wider block">
              Diploma Lateral Entry (LE)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-black text-[#a16b15]">50 Points</span>
              <span className="text-xs text-gray-500 font-medium">across Semesters III to VIII</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct second-year admitted students fulfill 50 points requirement before final graduation signoff.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Workflow */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-serif font-bold text-[#385529] uppercase tracking-wide">
            How The System Works
          </h2>
          <p className="text-xs text-gray-500">
            A seamless digital workflow from document upload to official graduation record generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#e8e3d8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ec] text-[#385529] font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-[#1c2718] text-sm">Upload Certificate Proof</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Drag-and-drop your certificate PDF or snap a photo directly from your smartphone camera.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e8e3d8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf5eb] text-[#a16b15] font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-[#1c2718] text-sm">Automated Extraction</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              AI extracts event name, organization, dates, credential ID, QR links, and maps to the correct CBIT category.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e8e3d8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ec] text-[#385529] font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-[#1c2718] text-sm">Mentor Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
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
