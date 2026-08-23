'use client';

import React from 'react';
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
  Smartphone,
  ArrowRight,
  BookOpen,
  FileCheck,
} from 'lucide-react';
import { CBIT_DEPARTMENTS } from '@/lib/mar-constants';

export default function HomePage() {
  const { switchRole } = useApp();
  const router = useRouter();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    switchRole(role);
    router.push(targetPath);
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-2">
        
        <div className="inline-flex items-center space-x-2 bg-[#fbf5eb] text-[#a16b15] text-xs font-bold px-4 py-1.5 rounded-full border border-[#a16b15]/40 shadow-xs">
          <Award className="w-4 h-4 text-[#a16b15]" />
          <span className="uppercase tracking-wide font-serif">
            CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
          </span>
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
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
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

      {/* Official CBIT Departments Directory Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e3d8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e8e3d8] pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#385529] uppercase tracking-wide flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#a16b15]" />
              <span>Official Academic Departments & Courses (UG & PG)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Approved programs offering Mandatory Additional Requirements (MAR) Activity Points at CBIT Hyderabad.
            </p>
          </div>
          <a
            href="https://www.cbit.ac.in/admission_post/ug-pg-course-list/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#a16b15] hover:underline inline-flex items-center gap-1"
          >
            <span>cbit.ac.in Course Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {CBIT_DEPARTMENTS.map((dept) => (
            <div
              key={dept.code}
              className="p-3.5 rounded-xl bg-[#faf9f5] border border-[#e8e3d8] hover:border-[#a16b15]/50 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#385529] bg-[#eef5ec] px-2 py-0.5 rounded border border-[#385529]/20 font-serif">
                  {dept.code}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Intake: {dept.intake} seats
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#1c2718] leading-tight">
                {dept.name}
              </h4>
              <p className="text-[11px] text-gray-600">
                Head of Dept: <strong className="text-[#385529]">{dept.hod}</strong>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Banner */}
      <section className="bg-gradient-to-r from-[#385529] via-[#273e1c] to-[#1a2813] text-white rounded-3xl p-8 sm:p-10 shadow-xl border-t-4 border-[#a16b15] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#dfa94b]">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-serif font-bold text-white text-sm">Gemini AI Document OCR</h4>
            </div>
            <p className="text-xs text-[#e2ebd9] leading-relaxed">
              Upload certificates in JPG, PNG, or PDF format. AI automatically parses event details and calculates points according to CBIT rubrics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#dfa94b]">
              <Smartphone className="w-5 h-5" />
              <h4 className="font-serif font-bold text-white text-sm">Unified PWA (Web & Mobile)</h4>
            </div>
            <p className="text-xs text-[#e2ebd9] leading-relaxed">
              Use seamlessly on laptops or install directly onto your smartphone with offline readiness and camera certificate capture.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#dfa94b]">
              <FileCheck className="w-5 h-5" />
              <h4 className="font-serif font-bold text-white text-sm">Official Printable Activity Sheet</h4>
            </div>
            <p className="text-xs text-[#e2ebd9] leading-relaxed">
              Generate 1-click printable PDF matching the exact 24-row physical CBIT Record of Activities sheet with Mentor and HoD signature blocks.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
