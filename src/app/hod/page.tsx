'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Download,
  BookOpen,
  Send,
  Sparkles,
  BarChart3,
  Building,
} from 'lucide-react';
import { DEPARTMENT_FACULTY_MENTORS, DEPARTMENT_ALL_STUDENTS } from '@/lib/mar-constants';

export default function HODDashboardPage() {
  const { currentUser, addNotification } = useApp();
  const [noticeSent, setNoticeSent] = useState(false);

  const totalStudents = DEPARTMENT_ALL_STUDENTS.length;
  const satisfiedCount = DEPARTMENT_ALL_STUDENTS.filter((s) => s.points >= s.target).length;
  const inProgressCount = DEPARTMENT_ALL_STUDENTS.filter((s) => s.points < s.target && s.points >= 30).length;
  const atRiskCount = DEPARTMENT_ALL_STUDENTS.filter((s) => s.points < 30).length;
  const complianceRate = Math.round((satisfiedCount / totalStudents) * 100);

  const totalMentors = DEPARTMENT_FACULTY_MENTORS.length;
  const totalPendingInDept = DEPARTMENT_FACULTY_MENTORS.reduce((acc, m) => acc + m.pendingReviews, 0);

  const handleSendNotice = () => {
    addNotification({
      recipient_role: 'student',
      type: 'announcement',
      title: 'HOD Notice: 5th Semester MAR Activity Verification Deadline',
      message: 'All Department of AI&DS students with pending activity points are advised to submit verification certificates to their faculty mentors before the semester audit.',
      link: '/student/upload',
      sender_name: 'Head of Department (AI&DS)',
    });
    setNoticeSent(true);
    setTimeout(() => setNoticeSent(false), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-3xl p-6 sm:p-7 border-t-4 border-[#a71a1b] dark:border-rose-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-[#fdf2f2] dark:bg-[#22232a] text-[#a71a1b] dark:text-rose-400 font-bold px-2.5 py-0.5 rounded-full border border-[#a71a1b]/30 dark:border-[#2e3039]">
              Department Eagle View
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Department of Artificial Intelligence & Data Science (AI&DS)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#385529] dark:text-gray-100 tracking-tight">
            Department MAR & Portfolio Analytics
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Head of Department: <strong>{currentUser.full_name}</strong> • 3 Academic Sections (AI&DS-1, 2, 3) • Batch 2024-2028 (5th Semester)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/hod/mentors"
            className="px-4 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
            <span>Faculty Mentors ({totalMentors})</span>
          </Link>

          <Link
            href="/hod/students"
            className="px-4 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <span>Student Directory</span>
          </Link>

          <Link
            href="/hod/signoff"
            className="px-4 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
            <span>Batch Signoff</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        <div className="bg-white dark:bg-[#1a1b20] p-4 sm:p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-[11px] font-bold uppercase">Total Students</span>
            <Users className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718] dark:text-white">193</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Across 3 Sections</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 sm:p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#385529] dark:text-emerald-400">
            <span className="text-[11px] font-bold uppercase">MAR Completed</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">161</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">60+ Pts (Grad Ready)</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 sm:p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#a16b15] dark:text-amber-400">
            <span className="text-[11px] font-bold uppercase">In Progress</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">24</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">30 - 59 Pts Earned</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 sm:p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-red-600 dark:text-rose-400">
            <span className="text-[11px] font-bold uppercase">At-Risk (&lt;30 Pts)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-red-600 dark:text-rose-400">8</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Needs Mentor Intervention</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 sm:p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#3b566e] dark:text-sky-400">
            <span className="text-[11px] font-bold uppercase">Compliance Rate</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#3b566e] dark:text-sky-400">83.4%</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Dept Target: 100%</span>
        </div>

      </div>

      {/* Section Performance & Faculty Coordinators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Section Comparison */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[#385529] dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
              <span>Section-Wise MAR Standing</span>
            </h3>
            <Link
              href="/hod/students"
              className="text-xs font-bold text-[#385529] dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {[
              { section: 'AI&DS Section 1', coordinator: 'Prof. M. Srinivasa Rao', enrolled: 66, satisfied: 58, rate: 87.8, queue: 3 },
              { section: 'AI&DS Section 2', coordinator: 'Dr. T. Sridevi', enrolled: 64, satisfied: 54, rate: 84.3, queue: 6 },
              { section: 'AI&DS Section 3', coordinator: 'Dr. B. Indira', enrolled: 63, satisfied: 49, rate: 77.7, queue: 5 },
            ].map((sec) => (
              <div
                key={sec.section}
                className="p-4 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{sec.section}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Coordinator: <strong>{sec.coordinator}</strong>
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-extrabold text-[#385529] dark:text-emerald-400">
                      {sec.satisfied} / {sec.enrolled} Satisfied
                    </span>
                    <span className="font-serif font-black text-[#a16b15] dark:text-amber-400">
                      {sec.rate}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#e8e3d8] dark:bg-[#22232a] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#385529] dark:bg-emerald-500 h-full rounded-full"
                    style={{ width: `${sec.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Category Distribution & Activity Engagement */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-[#385529] dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
            <span>Top Activity Categories</span>
          </h3>

          <div className="space-y-3">
            {[
              { name: 'NPTEL / MOOCs (Cat #1 & #2)', count: '182 Certs', percentage: 42, color: 'bg-emerald-600' },
              { name: 'Internships & Industry (Cat #13)', count: '112 Internships', percentage: 26, color: 'bg-amber-600' },
              { name: 'Tech Fests & Hackathons (Cat #3, 4)', count: '78 Events', percentage: 18, color: 'bg-indigo-600' },
              { name: 'Blood Donation & NSS (Cat #14)', count: '45 Drives', percentage: 10, color: 'bg-rose-600' },
              { name: 'IEEE / CSI Memberships (Cat #22)', count: '28 Members', percentage: 4, color: 'bg-sky-600' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</span>
                  <span className="font-mono text-gray-500 dark:text-gray-400">{cat.count}</span>
                </div>
                <div className="w-full bg-[#faf9f5] dark:bg-[#121214] h-2 rounded-full overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36]">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#e8e3d8] dark:border-[#2c2d36]">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Department shows outstanding participation in NPTEL AI/ML certifications and summer internships.
            </p>
          </div>
        </div>

      </div>

      {/* Early Warning Alert Box & Department Actions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#fdf2f2] dark:bg-[#1a1518] border border-red-200 dark:border-rose-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-sm text-red-900 dark:text-rose-200">
                Early-Warning MAR Intervention System
              </h4>
              <p className="text-xs text-red-700 dark:text-rose-300">
                8 students in AI&DS have less than 30 points as of 5th Semester. Action is recommended before end-of-semester MAR signoff.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendNotice}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{noticeSent ? 'Notice Dispatched!' : 'Broadcast Department Reminder'}</span>
          </button>
        </div>

        {noticeSent && (
          <div className="p-3 bg-white dark:bg-[#121214] rounded-xl border border-red-300 dark:border-rose-900/50 text-xs text-red-800 dark:text-rose-200 font-semibold animate-in fade-in">
            ✓ Official MAR notification notice successfully broadcast to all lagging students and their respective Faculty Mentors!
          </div>
        )}
      </div>

    </div>
  );
}
