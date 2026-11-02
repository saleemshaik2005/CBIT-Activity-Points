'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Users, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Mail, ArrowRight, BookOpen } from 'lucide-react';
import { DEPARTMENT_ALL_STUDENTS, DEPARTMENT_FACULTY_MENTORS } from '@/lib/mar-constants';

export default function ClassTeacherPage() {
  const { currentUser, submissions, categories, addNotification } = useApp();
  const [notifiedRoll, setNotifiedRoll] = useState<string | null>(null);

  // Dynamically calculate actual student points by blending canonical roster with live submissions
  const studentsWithLivePoints = DEPARTMENT_ALL_STUDENTS.map((student) => {
    const studentSubs = submissions.filter(
      (s) => s.student_id === student.id || s.student_roll_no === student.roll
    );

    if (studentSubs.length > 0) {
      const approvedSubs = studentSubs.filter((s) => s.status === 'approved');
      const catPointsMap: Record<number, number> = {};
      approvedSubs.forEach((sub) => {
        const cat = categories.find((c) => c.id === sub.category_id || c.sno === sub.category_id);
        const sno = cat ? cat.sno : 1;
        const pts = Number(sub.awarded_points || sub.claimed_points || 0);
        catPointsMap[sno] = (catPointsMap[sno] || 0) + pts;
      });

      let total = 0;
      Object.entries(catPointsMap).forEach(([snoStr, earned]) => {
        const sno = Number(snoStr);
        const matchingCat = categories.find((c) => c.sno === sno);
        const cap = matchingCat ? matchingCat.max_points_allowed : 40;
        total += Math.min(earned, cap);
      });

      const finalPoints = Math.min(total, student.maxCap || (student.isLateral ? 75 : 100));
      const target = student.target || (student.isLateral ? 45 : 60);
      const isSatisfied = finalPoints >= target;
      const isAtRisk = finalPoints < 30;

      return {
        ...student,
        points: finalPoints,
        status: isSatisfied ? ('Satisfied' as const) : isAtRisk ? ('At Risk' as const) : ('In Progress' as const),
      };
    }

    return student;
  });

  const sectionName = 'AI&DS Section 2 (2024-2028 Batch)';
  const totalStudents = studentsWithLivePoints.length; // 67 real classmates
  const completedMAR = studentsWithLivePoints.filter((s) => s.points >= s.target).length;
  const onTrack = studentsWithLivePoints.filter((s) => s.points < s.target && s.points >= 30).length;
  const atRisk = studentsWithLivePoints.filter((s) => s.points < 30).length;
  const complianceRate = Math.round((completedMAR / totalStudents) * 100);

  const atRiskStudents = studentsWithLivePoints
    .filter((s) => s.points < 30)
    .map((s) => ({
      roll: s.roll,
      name: s.name,
      points: s.points,
      needed: Math.max(0, s.target - s.points),
      mentor: s.mentor,
      mentorEmail: s.mentorEmail,
    }));

  const handleNotifyMentor = (student: typeof atRiskStudents[0]) => {
    addNotification({
      recipient_role: 'mentor',
      type: 'submission',
      title: `At-Risk Student Mentoring Alert: ${student.name} (${student.roll})`,
      message: `Dear ${student.mentor}, student ${student.name} currently has ${student.points} activity points (needs ${student.needed} points to satisfy requirement). Please schedule a review session.`,
      link: '/mentor',
      sender_name: currentUser.full_name || 'Ms. Talla Sai Sree (Class Coordinator)',
    });
    setNotifiedRoll(student.roll);
    setTimeout(() => setNotifiedRoll(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#3b566e] dark:border-sky-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#3b566e] dark:text-sky-400">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider bg-[#f0f4f8] dark:bg-[#22232a] text-[#3b566e] dark:text-sky-400 px-2.5 py-0.5 rounded-full border border-[#3b566e]/20 dark:border-[#2e3039]">
              Class Coordinator Portal
            </span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            Class Section Overview: {sectionName}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Class Coordinator: <strong>{currentUser.full_name || 'Ms. Talla Sai Sree'}</strong> • Faculty ID: <strong>{currentUser.roll_number || '11628'}</strong> • Department of {currentUser.department}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link
            href="/teacher/reports"
            className="px-4 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
            <span>Batch MAR Master Report ({totalStudents})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Total Classmates (Sec 2)</span>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718] dark:text-white">{totalStudents}</p>
          <span className="text-[10px] text-gray-400">Batch 2024-2028 (5th Sem)</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#385529] dark:text-emerald-400 font-bold">Requirement Satisfied</span>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">{completedMAR}</p>
          <span className="text-[10px] text-[#385529] dark:text-emerald-400 font-semibold">{complianceRate}% of Section</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#a16b15] dark:text-amber-400 font-bold">On-Track (30-59 Pts)</span>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">{onTrack}</p>
          <span className="text-[10px] text-gray-400">Steady Progress</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <span className="text-xs text-[#a71a1b] dark:text-rose-400 font-bold">At-Risk (&lt; 30 Pts)</span>
          <p className="text-2xl font-serif font-extrabold text-[#a71a1b] dark:text-rose-400">{atRisk}</p>
          <span className="text-[10px] text-rose-500 font-semibold">Requires Intervention</span>
        </div>
      </div>

      {/* Faculty Mentors Overview Grid */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-100 font-serif font-bold text-sm uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
            <span>Assigned Faculty Mentors for Section 2 (3 Mentors)</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">67 Total Mentees Distributed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEPARTMENT_FACULTY_MENTORS.map((m) => {
            const mentorStudents = studentsWithLivePoints.filter((s) => s.mentor === m.name);
            const satisfied = mentorStudents.filter((s) => s.points >= s.target).length;
            const atRiskCount = mentorStudents.filter((s) => s.points < 30).length;

            return (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] space-y-2.5"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{m.name}</h4>
                    <span className="text-[10px] bg-white dark:bg-[#1a1b20] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono text-gray-600 dark:text-gray-300">
                      {m.cabin}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{m.designation}</p>
                  <p className="text-[10.5px] text-[#3b566e] dark:text-sky-400 font-mono">{m.email}</p>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Assigned Mentees</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{mentorStudents.length} Students</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#385529] dark:text-emerald-400 block font-bold">Satisfied</span>
                    <span className="font-bold text-[#385529] dark:text-emerald-400">{satisfied} / {mentorStudents.length}</span>
                  </div>
                  {atRiskCount > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-[#a71a1b] dark:text-rose-400 block font-bold">At-Risk</span>
                      <span className="font-bold text-[#a71a1b] dark:text-rose-400">{atRiskCount}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* At-Risk Students Section */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#a71a1b]/30 dark:border-rose-900/40 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#a71a1b] dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-serif font-bold uppercase tracking-wide">At-Risk Students Requiring Mentoring</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          These final-year students in Section 2 have earned fewer than 30 activity points and require prompt mentor notification to satisfy graduation requirements.
        </p>

        <div className="overflow-x-auto rounded-xl border border-[#a71a1b]/20 dark:border-[#2e3039] max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#fdf2f2] dark:bg-[#22232a] border-b border-[#a71a1b]/20 dark:border-[#2e3039] text-[#a71a1b] dark:text-rose-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Roll Number</th>
                <th className="py-3 px-3 whitespace-nowrap">Student Name</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Current Points</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Points Needed</th>
                <th className="py-3 px-3 whitespace-nowrap">Assigned Faculty Mentor</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {atRiskStudents.map((s) => (
                <tr key={s.roll} className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1c2718] dark:text-white font-mono">{s.roll}</td>
                  <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">{s.name}</td>
                  <td className="py-3 px-3 font-extrabold text-[#a71a1b] dark:text-rose-400 text-center">{s.points} pts</td>
                  <td className="py-3 px-3 font-bold text-gray-700 dark:text-gray-300 text-center">{s.needed} pts</td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400 font-medium">{s.mentor}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleNotifyMentor(s)}
                      aria-label={`Send reminder notification to ${s.name} and mentor ${s.mentor}`}
                      className="px-2.5 py-1 bg-[#fdf2f2] dark:bg-rose-950/40 text-[#a71a1b] dark:text-rose-300 hover:bg-[#a71a1b] hover:text-white rounded-md font-bold text-[11px] border border-[#a71a1b]/30 dark:border-rose-800/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a71a1b]"
                    >
                      {notifiedRoll === s.roll ? 'Notified!' : 'Notify Mentor'}
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
