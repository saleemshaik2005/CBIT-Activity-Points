'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { calculateStudentMARProgress } from '@/lib/mar-constants';
import { Users, Award, CheckCircle2, Clock, Eye, Download } from 'lucide-react';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';

export default function MentorMenteesPage() {
  const { currentUser, submissions, categories, settings } = useApp();

  // Assigned mentees in AI&DS Section 2
  const mentees = [
    {
      id: "usr-student-001",
      full_name: "Shaik Saleem",
      roll_number: "160122771045",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "2022-2026",
      is_lateral_entry: false,
      email: "saleemshaik2005@cbit.ac.in",
    },
    {
      id: "usr-student-002",
      full_name: "Sneha Reddy",
      roll_number: "160122771046",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "2022-2026",
      is_lateral_entry: false,
      email: "sneha.reddy@cbit.ac.in",
    },
    {
      id: "usr-student-003",
      full_name: "Mohammed Farhan",
      roll_number: "160122771301",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "2023-2026",
      is_lateral_entry: true, // Lateral Entry (50 pts target)
      email: "farhan.le@cbit.ac.in",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border-t-4 border-[#a16b15] border-x border-b border-[#e8e3d8] shadow-xs space-y-1">
        <div className="flex items-center space-x-2 text-[#385529]">
          <Users className="w-5 h-5" />
          <h1 className="text-xl font-serif font-extrabold text-[#385529]">
            Assigned Mentees Activity Progress
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Faculty Counselor: <strong>{currentUser.full_name}</strong> • Department of {currentUser.department}
        </p>
      </div>

      {/* Mentees Progress Table */}
      <div className="bg-white rounded-2xl border border-[#e8e3d8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] border-b border-[#e8e3d8] text-[#385529] font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Name & Roll No</th>
                <th className="py-3 px-3">Entry Type</th>
                <th className="py-3 px-3">Target</th>
                <th className="py-3 px-3">Approved Points</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mentees.map((mentee) => {
                const menteeSubmissions = submissions.filter((s) => s.student_id === mentee.id);
                const target = mentee.is_lateral_entry
                  ? settings.lateral_entry_target_points
                  : settings.regular_target_points;
                const progress = calculateStudentMARProgress(menteeSubmissions, categories, target);

                return (
                  <tr key={mentee.id} className="hover:bg-[#faf9f5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2718]">{mentee.full_name}</div>
                      <div className="text-[11px] text-gray-500">{mentee.roll_number} • Sec {mentee.section}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mentee.is_lateral_entry
                          ? 'bg-[#fbf5eb] text-[#a16b15] border border-[#a16b15]/30'
                          : 'bg-[#eef5ec] text-[#385529] border border-[#385529]/30'
                      }`}>
                        {mentee.is_lateral_entry ? 'Lateral Entry' : '4-Yr Regular'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-700">{target} pts</td>
                    <td className="py-3.5 px-3 font-extrabold text-[#385529]">
                      {progress.totalApprovedPoints} pts
                    </td>
                    <td className="py-3.5 px-3 w-40">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-[#e8e3d8] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              progress.isCompleted ? 'bg-[#385529]' : 'bg-[#a16b15]'
                            }`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-gray-600">
                          {progress.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {progress.isCompleted ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-[#385529] bg-[#eef5ec] px-2 py-0.5 rounded-full border border-[#385529]/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Satisfied
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] bg-[#fbf5eb] px-2 py-0.5 rounded-full border border-[#a16b15]/30">
                          <Clock className="w-3 h-3 mr-1" /> {progress.pointsRemaining} pts needed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => generateOfficialCBITMARPDF(mentee as any, menteeSubmissions, categories)}
                        className="px-2.5 py-1 bg-white hover:bg-[#faf7f2] text-[#385529] font-bold text-[11px] rounded-lg border border-[#e8e3d8] transition-colors inline-flex items-center gap-1"
                        title="Download Official Activity Sheet"
                      >
                        <Download className="w-3 h-3 text-[#a16b15]" />
                        <span>MAR Sheet</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
