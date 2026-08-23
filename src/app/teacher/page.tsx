'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Users, AlertTriangle } from 'lucide-react';

export default function ClassTeacherPage() {
  const { currentUser } = useApp();

  const classStats = {
    section: 'CSE-1 (2022-2026 Batch)',
    totalStudents: 66,
    completedMAR: 48,
    onTrack: 12,
    atRisk: 6,
  };

  const atRiskStudents = [
    { roll: '160122733012', name: 'Ananya Verma', points: 22, needed: 38, mentor: 'Dr. K. Radhika' },
    { roll: '160122733028', name: 'Karthik Rao', points: 25, needed: 35, mentor: 'Prof. M. Srinivasa' },
    { roll: '160122733055', name: 'Vamshi Krishna', points: 28, needed: 32, mentor: 'Dr. K. Radhika' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border-t-4 border-[#3b566e] border-x border-b border-[#e8e3d8] shadow-xs space-y-1">
        <div className="flex items-center space-x-2 text-[#3b566e]">
          <Users className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider bg-[#f0f4f8] text-[#3b566e] px-2.5 py-0.5 rounded-full border border-[#3b566e]/20">
            Class Coordinator Portal
          </span>
        </div>
        <h1 className="text-2xl font-serif font-extrabold text-[#385529]">
          Class Section Overview: {classStats.section}
        </h1>
        <p className="text-xs text-gray-500">
          Class Coordinator: <strong>{currentUser.full_name}</strong> • Department of {currentUser.department}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Total Students</span>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718]">{classStats.totalStudents}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-[#385529] font-bold">Requirement Satisfied</span>
          <p className="text-2xl font-serif font-extrabold text-[#385529]">{classStats.completedMAR}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-[#a16b15] font-bold">On-Track (30-59 Pts)</span>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15]">{classStats.onTrack}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-[#a71a1b] font-bold">At-Risk (&lt; 30 Pts)</span>
          <p className="text-2xl font-serif font-extrabold text-[#a71a1b]">{classStats.atRisk}</p>
        </div>
      </div>

      {/* At-Risk Students Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#a71a1b]/30 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#a71a1b]">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-serif font-bold uppercase tracking-wide">At-Risk Students Requiring Mentoring</h3>
        </div>
        <p className="text-xs text-gray-500">
          These final-year students have earned fewer than 30 activity points and require prompt mentor notification to satisfy graduation requirements.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fdf2f2] border-b border-[#a71a1b]/20 text-[#a71a1b] font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Current Points</th>
                <th className="py-3 px-3">Points Needed</th>
                <th className="py-3 px-3">Assigned Faculty Mentor</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {atRiskStudents.map((s) => (
                <tr key={s.roll} className="hover:bg-[#faf9f5] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1c2718]">{s.roll}</td>
                  <td className="py-3 px-3 font-semibold text-gray-800">{s.name}</td>
                  <td className="py-3 px-3 font-extrabold text-[#a71a1b]">{s.points} pts</td>
                  <td className="py-3 px-3 font-bold text-gray-700">{s.needed} pts</td>
                  <td className="py-3 px-3 text-gray-600">{s.mentor}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Reminder notification sent to ${s.name} and mentor ${s.mentor}`)}
                      className="px-2.5 py-1 bg-[#fdf2f2] text-[#a71a1b] hover:bg-[#a71a1b] hover:text-white rounded-md font-bold text-[11px] border border-[#a71a1b]/30 transition-colors"
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
