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
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 bg-blue-100/80 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Mandatory Additional Requirements <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            (MAR) Activity Points System
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Automate student activity points tracking, certificate verification, and MAR report generation with Google Gemini 2.0 Multimodal AI.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handleSelectRole('student', '/student')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <span>Open Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSelectRole('mentor', '/mentor')}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-xl border border-gray-300 shadow-xs hover:shadow transition-all flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Faculty Verification Queue</span>
          </button>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Explore Portals by Academic Role</h2>
          <p className="text-xs text-gray-500 mt-1">
            Click any portal below to interact with role-specific views and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Student */}
          <div
            onClick={() => handleSelectRole('student', '/student')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Student
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Upload certificates with AI scanning, track 60/50 MAR points, and download official PDF sheet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-blue-600">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mentor */}
          <div
            onClick={() => handleSelectRole('mentor', '/mentor')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Faculty Mentor
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Verify certificates side-by-side, approve/reject submissions with remarks, and monitor mentees.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-600">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Class Teacher */}
          <div
            onClick={() => handleSelectRole('class_teacher', '/teacher')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Class Teacher
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Class batch overview, identify at-risk students with low points, and generate section reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-indigo-600">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* HOD */}
          <div
            onClick={() => handleSelectRole('hod', '/hod')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Head of Dept (HoD)
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Department-level statistics, branch MAR completion rates, and final graduation signoff.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-purple-600">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleSelectRole('admin', '/admin')}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                Administrator
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Configure 24 MAR categories, target points (60/50), manage user roles, and assign mentors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-amber-600">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold text-white text-sm">Gemini AI Document OCR</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload certificates in JPG, PNG, or PDF format. AI automatically parses event details and calculates points according to CBIT rubrics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-400">
              <Smartphone className="w-5 h-5" />
              <h4 className="font-bold text-white text-sm">Unified PWA (Web & Mobile)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use seamlessly on laptops or install directly onto your Android/iOS smartphone with offline readiness and camera certificate capture.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <FileCheck className="w-5 h-5" />
              <h4 className="font-bold text-white text-sm">Official CBIT MAR PDF</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate 1-click printable PDF matching the exact 24-row physical CBIT Record of Activities sheet with Mentor and HoD signature blocks.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
