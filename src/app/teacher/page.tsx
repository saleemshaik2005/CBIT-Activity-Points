'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Users, AlertTriangle } from 'lucide-react';

export default function ClassTeacherPage() {
  const { currentUser } = useApp();

  const classStats = {
    section: 'AI&DS-2 (2024-2028 Batch)',
    totalStudents: 66,
    completedMAR: 48,
    onTrack: 12,
    atRisk: 6,
  };

  const atRiskStudents = [
    { roll: '160122771012', name: 'Ananya Verma', points: 22, needed: 38, mentor: 'Faculty Mentor' },
    { roll: '160122771028', name: 'Karthik Rao', points: 25, needed: 35, mentor: 'Faculty Mentor' },
    { roll: '160122771055', name: 'Vamshi Krishna', points: 28, needed: 32, mentor: 'Faculty Mentor' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#3b566e] dark:border-sky-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
        <div className="flex items-center space-x-2 text-[#3b566e] dark:text-sky-400">
          <Users className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider bg-[#f0f4f8] dark:bg-[#22232a] text-[#3b566e] dark:text-sky-400 px-2.5 py-0.5 rounded-full border border-[#3b566e]/20 dark:border-[#2e3039]">
            Class Coordinator Portal
          </span>
        </div>
        <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
          Class Section Overview: {classStats.section}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Class Coordinator: <strong>{currentUser.full_name}</strong> • Department of {currentUser.department}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Total Students</span>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718] dark:text-white">{classStats.totalStudents}</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#385529] dark:text-emerald-400 font-bold">Requirement Satisfied</span>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">{classStats.completedMAR}</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#a16b15] dark:text-amber-400 font-bold">On-Track (30-59 Pts)</span>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">{classStats.onTrack}</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#a71a1b] dark:text-rose-400 font-bold">At-Risk (&lt; 30 Pts)</span>
          <p className="text-2xl font-serif font-extrabold text-[#a71a1b] dark:text-rose-400">{classStats.atRisk}</p>
        </div>
      </div>

      {/* At-Risk Students Section */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#a71a1b]/30 dark:border-rose-900/40 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#a71a1b] dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-serif font-bold uppercase tracking-wide">At-Risk Students Requiring Mentoring</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          These final-year students have earned fewer than 30 activity points and require prompt mentor notification to satisfy graduation requirements.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fdf2f2] dark:bg-[#22232a] border-b border-[#a71a1b]/20 dark:border-[#2e3039] text-[#a71a1b] dark:text-rose-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Current Points</th>
                <th className="py-3 px-3">Points Needed</th>
                <th className="py-3 px-3">Assigned Faculty Mentor</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {atRiskStudents.map((s) => (
                <tr key={s.roll} className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1c2718] dark:text-white">{s.roll}</td>
                  <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{s.name}</td>
                  <td className="py-3 px-3 font-extrabold text-[#a71a1b] dark:text-rose-400">{s.points} pts</td>
                  <td className="py-3 px-3 font-bold text-gray-700 dark:text-gray-300">{s.needed} pts</td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{s.mentor}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Reminder notification sent to ${s.name} and mentor ${s.mentor}`)}
                      className="px-2.5 py-1 bg-[#fdf2f2] dark:bg-rose-950/40 text-[#a71a1b] dark:text-rose-300 hover:bg-[#a71a1b] hover:text-white rounded-md font-bold text-[11px] border border-[#a71a1b]/30 dark:border-rose-800/40 transition-colors cursor-pointer"
                    >
                      Notify Mentor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
