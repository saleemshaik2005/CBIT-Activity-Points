'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function HODDashboardPage() {
  const { currentUser } = useApp();

  const deptStats = {
    totalStudents: 240,
    satisfiedRequirement: 198,
    pendingSignoff: 42,
    completionPercentage: 82.5,
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border-t-4 border-[#a71a1b] border-x border-b border-[#e8e3d8] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#fdf2f2] text-[#a71a1b] font-bold px-2.5 py-0.5 rounded-full border border-[#a71a1b]/30">
              Head of Department
            </span>
            <span className="text-xs text-gray-500">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529]">
            Department MAR Analytics & Graduation Signoff
          </h1>
          <p className="text-xs text-gray-500">
            Department Head: <strong>{currentUser.full_name}</strong> • CBIT Autonomous Hyderabad
          </p>
        </div>

        <Link
          href="/hod/signoff"
          className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 border-b-2 border-[#a16b15]"
        >
          <GraduationCap className="w-4 h-4 text-[#dfa94b]" />
          <span>Graduation Batch Signoff</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Total Dept Students</span>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718]">{deptStats.totalStudents}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-[#385529] font-bold">MAR Completed</span>
          <p className="text-2xl font-serif font-extrabold text-[#385529]">{deptStats.satisfiedRequirement}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-[#a16b15] font-bold">Ready for HoD Signoff</span>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15]">{deptStats.pendingSignoff}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8e3d8] shadow-2xs space-y-1">
          <span className="text-xs text-[#3b566e] font-bold">Overall Compliance Rate</span>
          <p className="text-2xl font-serif font-extrabold text-[#3b566e]">{deptStats.completionPercentage}%</p>
        </div>
      </div>

      {/* Sections Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e3d8] shadow-xs space-y-4">
        <h3 className="text-base font-serif font-bold text-[#385529] uppercase tracking-wide">
          Section-Wise MAR Progress (B.Tech 2022-2026 Batch)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] border-b border-[#e8e3d8] text-[#385529] font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-3">Class Coordinator</th>
                <th className="py-3 px-3 text-center">Enrolled</th>
                <th className="py-3 px-3 text-center">Satisfied (60+ Pts)</th>
                <th className="py-3 px-3 text-center">Completion Rate</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { section: 'CSE-1', coordinator: 'Prof. M. Srinivasa Rao', count: 66, satisfied: 58, rate: '87.8%' },
                { section: 'CSE-2', coordinator: 'Dr. T. Sridevi', count: 64, satisfied: 54, rate: '84.3%' },
                { section: 'CSE-3 (AI&ML)', coordinator: 'Dr. B. Indira', count: 65, satisfied: 52, rate: '80.0%' },
                { section: 'CSE-4 (IoT&Cyber)', coordinator: 'Prof. K. Suresh', count: 45, satisfied: 34, rate: '75.5%' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf9f5] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1c2718]">{row.section}</td>
                  <td className="py-3 px-3 text-gray-700">{row.coordinator}</td>
                  <td className="py-3 px-3 text-center font-bold">{row.count}</td>
                  <td className="py-3 px-3 text-center font-bold text-[#385529]">{row.satisfied}</td>
                  <td className="py-3 px-3 text-center font-extrabold text-[#a16b15]">{row.rate}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/hod/signoff"
                      className="text-xs font-bold text-[#385529] hover:text-[#a71a1b]"
                    >
                      Review Section &rarr;
                    </Link>
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
