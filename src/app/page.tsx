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
  Users,
  ArrowRight,
  HelpCircle,
  Github,
  BookOpen,
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
      <section className="text-center space-y-5 max-w-4xl mx-auto pt-2">
        
        {/* Official College Crest Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <img
            src="/images/cbit-crest.png"
            alt="CBIT Crest"
            className="w-16 h-16 object-contain drop-shadow-md"
          />
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 bg-[#fbf5eb] text-[#a16b15] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-[#a16b15]/40 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#a16b15]" />
              <span className="uppercase tracking-wide font-serif">
                CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Affiliated to Osmania University • Hyderabad-500075 • NAAC A++
            </p>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#385529] tracking-tight leading-tight">
          CBIT Activity Point System <br className="hidden sm:inline" />
          <span className="text-[#a16b15] font-sans font-bold">
            Autonomous Points & Verification Engine
          </span>
        </h1>

        <div className="w-24 h-1 bg-[#a16b15] mx-auto rounded-full" />

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Automated student activity points tracking, AI document intelligence for certificate recognition, and graduation approvals across 8 semesters.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleSelectRole('student', '/student')}
            className="px-6 py-3 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15]"
          >
            <span>Open Student Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#dfa94b]" />
          </button>

          <button
            onClick={() => handleSelectRole('mentor', '/mentor')}
            className="px-6 py-3 bg-white hover:bg-[#faf7f2] text-[#385529] font-bold text-sm rounded-xl border border-[#e8e3d8] shadow-xs hover:shadow transition-all flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#a16b15]" />
            <span>Faculty Verification Queue</span>
          </button>

          <button
            onClick={() => setIsAboutOpen(true)}
            className="px-5 py-3 bg-[#fbf5eb] hover:bg-[#f5e9d3] text-[#a16b15] font-bold text-sm rounded-xl border border-[#a16b15]/40 shadow-xs hover:shadow transition-all flex items-center space-x-2"
          >
            <HelpCircle className="w-4 h-4 text-[#a16b15]" />
            <span>About & User Guide</span>
          </button>
        </div>
      </section>

      {/* Role Portals Grid */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-[#385529] uppercase tracking-wide">
            Select Your Academic Portal
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access role-specific workflows for Students, Mentors, Class Coordinators, HoDs, and Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Student */}
          <div
            onClick={() => handleSelectRole('student', '/student')}
            className="p-5 rounded-2xl bg-white border-t-4 border-[#385529] border-x border-b border-[#e8e3d8] hover:border-[#a16b15] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef5ec] text-[#385529] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1c2718] group-hover:text-[#385529] transition-colors">
                Student
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upload certificates with AI scanning, track 60/50 activity points, and download official printable sheet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#385529] group-hover:text-[#a16b15]">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mentor */}
          <div
            onClick={() => handleSelectRole('mentor', '/mentor')}
            className="p-5 rounded-2xl bg-white border-t-4 border-[#a16b15] border-x border-b border-[#e8e3d8] hover:border-[#385529] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fbf5eb] text-[#a16b15] flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1c2718] group-hover:text-[#a16b15] transition-colors">
                Faculty Mentor
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Verify certificates side-by-side, approve/reject submissions with remarks, and monitor mentees.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#a16b15]">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Class Teacher */}
          <div
            onClick={() => handleSelectRole('class_teacher', '/teacher')}
            className="p-5 rounded-2xl bg-white border-t-4 border-[#3b566e] border-x border-b border-[#e8e3d8] hover:border-[#385529] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0f4f8] text-[#3b566e] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1c2718] group-hover:text-[#3b566e] transition-colors">
                Class Coordinator
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Class batch overview, identify at-risk students with low points, and generate section reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#3b566e]">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* HOD */}
          <div
            onClick={() => handleSelectRole('hod', '/hod')}
            className="p-5 rounded-2xl bg-white border-t-4 border-[#a71a1b] border-x border-b border-[#e8e3d8] hover:border-[#385529] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f2] text-[#a71a1b] flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1c2718] group-hover:text-[#a71a1b] transition-colors">
                Head of Dept (HoD)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Department-level statistics, branch completion rates, and final graduation signoff.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#a71a1b]">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleSelectRole('admin', '/admin')}
            className="p-5 rounded-2xl bg-white border-t-4 border-[#385529] border-x border-b border-[#e8e3d8] hover:border-[#a16b15] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef5ec] text-[#385529] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1c2718] group-hover:text-[#385529] transition-colors">
                Administrator
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Configure 24 activity categories, target points (60/50), manage user roles, and assign mentors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#385529]">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* About & Instructions Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

    </div>
  );
}
