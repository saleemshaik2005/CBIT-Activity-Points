'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileCheck,
  Download,
  Printer,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  FileSpreadsheet,
  BookOpen,
} from 'lucide-react';
import { DEPARTMENT_ALL_STUDENTS, CBIT_24_CATEGORIES } from '@/lib/mar-constants';
import { generateBatchMARReportPDF, generateOfficialCBITMARPDF } from '@/lib/pdf-generator';

export default function TeacherReportsPage() {
  const { currentUser, submissions, categories, settings } = useApp();
  const [selectedSection, setSelectedSection] = useState<string>('2');
  const [statusFilter, setStatusFilter] = useState<'all' | 'satisfied' | 'in_progress' | 'at_risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically calculate actual student points by blending DEPARTMENT_ALL_STUDENTS with user's submissions
  const studentsWithLivePoints = DEPARTMENT_ALL_STUDENTS.map((student) => {
    // If student is the logged in student or has submissions in store, calculate dynamically
    const studentSubs = submissions.filter(
      (s) => s.student_id === student.id || s.student_roll_no === student.roll
    );

    if (studentSubs.length > 0) {
      const approvedSubs = studentSubs.filter((s) => s.status === 'approved');
      // Sum capped points
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
        status: isSatisfied ? 'Satisfied' : isAtRisk ? 'At Risk' : 'In Progress',
      };
    }

    return student;
  });

  // Filter students based on section, status, and search
  const filteredStudents = studentsWithLivePoints.filter((st) => {
    // Section filter
    if (selectedSection !== 'all' && st.section !== selectedSection) {
      return false;
    }

    // Status filter
    if (statusFilter === 'satisfied' && st.points < st.target) return false;
    if (statusFilter === 'in_progress' && (st.points >= st.target || st.points < 30)) return false;
    if (statusFilter === 'at_risk' && st.points >= 30) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = st.name.toLowerCase().includes(q);
      const matchRoll = st.roll.toLowerCase().includes(q);
      const matchMentor = st.mentor.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchMentor) return false;
    }

    return true;
  });

  // Metrics for the active section
  const sectionStudents = studentsWithLivePoints.filter(
    (s) => selectedSection === 'all' || s.section === selectedSection
  );
  const totalStudents = sectionStudents.length;
  const satisfiedCount = sectionStudents.filter((s) => s.points >= s.target).length;
  const onTrackCount = sectionStudents.filter((s) => s.points < s.target && s.points >= 30).length;
  const atRiskCount = sectionStudents.filter((s) => s.points < 30).length;
  const avgPoints =
    totalStudents > 0
      ? (sectionStudents.reduce((acc, s) => acc + s.points, 0) / totalStudents).toFixed(1)
      : '0';

  // Export to PDF
  const handleDownloadPDF = () => {
    const sectionLabel = selectedSection === 'all' ? 'All Sections' : `Section AI&DS-${selectedSection}`;
    generateBatchMARReportPDF(
      sectionLabel,
      currentUser.department,
      settings.academic_year || '2025-2026',
      currentUser.full_name,
      filteredStudents
    );
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'S.No',
      'Roll Number',
      'Student Name',
      'Section',
      'Admission Type',
      'Assigned Faculty Mentor',
      'Approved MAR Points',
      'Target Points',
      'Requirement Status',
      'Compliance %',
      'NPTEL Completed',
      'Internship Completed',
    ].join(',');

    const rows = filteredStudents.map((s, idx) =>
      [
        idx + 1,
        `"${s.roll}"`,
        `"${s.name}"`,
        `"Section ${s.section}"`,
        `"${s.isLateral ? 'Lateral Entry' : 'Regular'}"`,
        `"${s.mentor}"`,
        s.points,
        s.target,
        `"${s.status}"`,
        `"${Math.min(100, Math.round((s.points / (s.target || 1)) * 100))}%"`,
        `"${s.nptelDone ? 'Yes' : 'No'}"`,
        `"${s.internshipDone ? 'Yes' : 'No'}"`,
      ].join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `CBIT_Batch_MAR_Master_Report_Sec${selectedSection}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#3b566e] dark:border-sky-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#3b566e] dark:text-sky-400">
            <FileCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider bg-[#f0f4f8] dark:bg-[#22232a] text-[#3b566e] dark:text-sky-400 px-2.5 py-0.5 rounded-full border border-[#3b566e]/20 dark:border-[#2e3039]">
              Class Coordinator Portal
            </span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            Batch MAR Master Tabulation Register
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Department of {currentUser.department} • Academic Year {settings.academic_year} • Coordinator: <strong>{currentUser.full_name}</strong>
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Export full section data to CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
            title="Generate official CBIT Autonomous Batch MAR Tabulation PDF"
          >
            <Download className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
            <span>Download Master PDF</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2.5 bg-white dark:bg-[#22232a] hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] transition-colors"
            title="Print Section Register"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-[11px] font-bold uppercase">Section Roster</span>
            <Users className="w-4 h-4 text-[#3b566e] dark:text-sky-400" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#1c2718] dark:text-white">{totalStudents}</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Registered Students</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#385529] dark:text-emerald-400">
            <span className="text-[11px] font-bold uppercase">Satisfied (60+ Pts)</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">{satisfiedCount}</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
            {totalStudents > 0 ? Math.round((satisfiedCount / totalStudents) * 100) : 0}% Compliance
          </span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#a16b15] dark:text-amber-400">
            <span className="text-[11px] font-bold uppercase">In Progress</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">{onTrackCount}</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">30 - 59 Points</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-red-600 dark:text-rose-400">
            <span className="text-[11px] font-bold uppercase">At-Risk (&lt;30 Pts)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-red-600 dark:text-rose-400">{atRiskCount}</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Mentoring Required</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <span className="text-[11px] font-bold uppercase">Section Average</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-purple-700 dark:text-purple-400">{avgPoints}</p>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Pts / Student</span>
        </div>
      </div>

      {/* Filter and Section Control Bar */}
      <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-2">Section:</span>
          {['2', '1', '3', 'all'].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSection === sec
                  ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
              }`}
            >
              {sec === 'all' ? 'All Sections' : `AI&DS-${sec}`}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            All ({sectionStudents.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('satisfied')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'satisfied'
                ? 'bg-[#385529] dark:bg-emerald-600 text-white'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            Satisfied ({satisfiedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            In Progress ({onTrackCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('at_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'at_risk'
                ? 'bg-red-600 text-white'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            At Risk ({atRiskCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student / roll / mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
          />
        </div>

      </div>

      {/* Tabulation Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#faf9f5] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Student Records ({filteredStudents.length} of {totalStudents})
            </h3>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Click any student to export official individual MAR ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#18191e] border-b border-[#e8e3d8] dark:border-[#2c2d36] text-gray-600 dark:text-gray-300 font-serif font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 text-center">S.No</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3 text-center">Section</th>
                <th className="py-3 px-3">Admission</th>
                <th className="py-3 px-4">Assigned Mentor</th>
                <th className="py-3 px-4 text-center">Approved Points</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No students match the selected section and status filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const pct = Math.min(100, Math.round((st.points / (st.target || 1)) * 100));

                  return (
                    <tr
                      key={st.roll}
                      className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono text-gray-500 dark:text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1c2718] dark:text-white">
                        {st.roll}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{st.name}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2e3039]">
                          Sec {st.section}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                        {st.isLateral ? (
                          <span className="text-[#a16b15] font-semibold">Lateral Entry</span>
                        ) : (
                          <span>Regular</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {st.mentor}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center space-y-1">
                          <span
                            className={`font-serif font-extrabold text-sm ${
                              st.points >= st.target
                                ? 'text-[#385529] dark:text-emerald-400'
                                : st.points < 30
                                ? 'text-red-600 dark:text-rose-400'
                                : 'text-[#a16b15] dark:text-amber-400'
                            }`}
                          >
                            {st.points} / {st.target} pts
                          </span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                st.points >= st.target
                                  ? 'bg-[#385529] dark:bg-emerald-500'
                                  : st.points < 30
                                  ? 'bg-red-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            st.status === 'Satisfied'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : st.status === 'At Risk'
                              ? 'bg-red-100 dark:bg-rose-950/50 text-red-800 dark:text-rose-300 border border-red-300 dark:border-rose-800'
                              : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {st.status === 'Satisfied' && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {st.status === 'At Risk' && <AlertTriangle className="w-2.5 h-2.5" />}
                          {st.status === 'In Progress' && <Clock className="w-2.5 h-2.5" />}
                          <span>{st.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const mockProfile = {
                              id: st.id,
                              email: `${st.name.toLowerCase().replace(/\s+/g, '.')}@cbit.ac.in`,
                              full_name: st.name,
                              role: 'student' as const,
                              roll_number: st.roll,
                              department: currentUser.department,
                              batch_year: '2024-2028 (5th Semester)',
                              is_lateral_entry: !!st.isLateral,
                            };
                            const studentSubs = submissions.filter(
                              (s) => s.student_id === st.id || s.student_roll_no === st.roll
                            );
                            generateOfficialCBITMARPDF(mockProfile, studentSubs, categories);
                          }}
                          className="px-2.5 py-1 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 text-[11px] font-bold rounded-lg border border-[#e8e3d8] dark:border-[#2c2d36] transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Generate individual student MAR ledger PDF"
                        >
                          <Download className="w-3 h-3 text-[#a16b15] dark:text-amber-400" />
                          <span>MAR PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
