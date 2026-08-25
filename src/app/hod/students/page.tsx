'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  Briefcase,
  AlertTriangle,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  ExternalLink,
  X,
  Check,
} from 'lucide-react';
import { DEPARTMENT_ALL_STUDENTS, CBIT_24_CATEGORIES } from '@/lib/mar-constants';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
import { StudentSubmission } from '@/types';

export default function HODStudentsDirectoryPage() {
  const { submissions, categories } = useApp();
  const [sectionFilter, setSectionFilter] = useState('all');
  const [activeTabFilter, setActiveTabFilter] = useState<
    'all' | 'nptel' | 'internship' | 'resumes' | 'satisfied' | 'at_risk'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [previewCertDoc, setPreviewCertDoc] = useState<StudentSubmission | null>(null);

  const filteredStudents = DEPARTMENT_ALL_STUDENTS.filter((st) => {
    // Section filter
    if (sectionFilter !== 'all' && st.section !== sectionFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = st.name.toLowerCase().includes(q);
      const matchRoll = st.roll.toLowerCase().includes(q);
      const matchMentor = st.mentor.toLowerCase().includes(q);
      const matchSkills = st.skills?.some((sk) => sk.toLowerCase().includes(q));
      if (!matchName && !matchRoll && !matchMentor && !matchSkills) return false;
    }

    // Tab filter
    if (activeTabFilter === 'nptel') return st.nptelDone;
    if (activeTabFilter === 'internship') return st.internshipDone;
    if (activeTabFilter === 'resumes') return !!st.resumeUrl;
    if (activeTabFilter === 'satisfied') return st.points >= st.target;
    if (activeTabFilter === 'at_risk') return st.points < 30;

    return true;
  });

  const handleExportCSV = () => {
    const headers = "Student Name,Roll Number,Section,Faculty Mentor,Entry Type,Approved MAR Points,Target Points,Status,NPTEL Done,Internship Done\n";
    const rows = filteredStudents.map(s => 
      `"${s.name}","${s.roll}","Section ${s.section}","${s.mentor}","${s.isLateral ? 'Lateral Entry' : 'Regular'}",${s.points},${s.target},"${s.status}","${s.nptelDone ? 'Yes' : 'No'}","${s.internshipDone ? 'Yes' : 'No'}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CBIT_AIDS_Department_MAR_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#a71a1b] dark:border-rose-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-300">
            <BookOpen className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />
            <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
              Department Student Directory & MAR Portfolio Search
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Department of AI&DS • Comprehensive registry of all <strong>{DEPARTMENT_ALL_STUDENTS.length} students</strong> across Section 1, 2, and 3.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
            <span>Export Department Audit (CSV)</span>
          </button>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
          >
            <option value="all">All Sections (1, 2, 3)</option>
            <option value="1">Section 1</option>
            <option value="2">Section 2</option>
            <option value="3">Section 3</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'all'
                ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Students ({DEPARTMENT_ALL_STUDENTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('nptel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'nptel'
                ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#dfa94b] dark:text-amber-400" />
            <span>NPTEL / MOOCs Certified</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('internship')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'internship'
                ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#385529] dark:text-emerald-400" />
            <span>Internships & Industry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('resumes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'resumes'
                ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
            <span>Student Resumes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('satisfied')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'satisfied'
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>MAR Satisfied</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('at_risk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'at_risk'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>At Risk (&lt;30 Pts)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search students by name, roll number, faculty mentor, or skill keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100"
          />
        </div>

      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] text-[#385529] dark:text-gray-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student & Roll No</th>
                <th className="py-3.5 px-3">Section</th>
                <th className="py-3.5 px-3">Faculty Mentor</th>
                <th className="py-3.5 px-3">Highlights</th>
                <th className="py-3.5 px-3">Entry Type</th>
                <th className="py-3.5 px-3 text-center">Approved Points</th>
                <th className="py-3.5 px-3 w-36">Progress</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No students found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const percentage = Math.min(100, Math.round((student.points / student.target) * 100));

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#385529] dark:bg-[#2a2b33] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#1c2718] dark:text-white group-hover:text-[#385529] dark:group-hover:text-emerald-400 transition-colors">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                              {student.roll}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-gray-700 dark:text-gray-300">
                        Sec {student.section}
                      </td>

                      <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300 font-medium">
                        {student.mentor}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1">
                          {student.nptelDone && (
                            <span className="text-[9px] font-bold bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 px-1.5 py-0.5 rounded border border-[#385529]/20">
                              NPTEL
                            </span>
                          )}
                          {student.internshipDone && (
                            <span className="text-[9px] font-bold bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 px-1.5 py-0.5 rounded border border-[#a16b15]/30">
                              Internship
                            </span>
                          )}
                          {student.resumeUrl && (
                            <span className="text-[9px] font-bold bg-[#f0f4f8] dark:bg-[#22232a] text-[#3b566e] dark:text-sky-400 px-1.5 py-0.5 rounded border border-[#3b566e]/20">
                              CV
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                          {student.isLateral ? 'Lateral Entry' : '4-Yr Regular'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-extrabold text-[#385529] dark:text-emerald-400">
                        {student.points} / {student.target} pts
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-[#e8e3d8] dark:bg-[#121214] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percentage >= 100
                                  ? 'bg-[#385529] dark:bg-emerald-500'
                                  : percentage >= 50
                                  ? 'bg-[#a16b15] dark:bg-amber-400'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">{percentage}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {student.status === 'Satisfied' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-[#22232a] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Satisfied
                          </span>
                        )}
                        {student.status === 'In Progress' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] dark:text-amber-400 bg-[#fbf5eb] dark:bg-[#22232a] px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 mr-1" /> In Progress
                          </span>
                        )}
                        {student.status === 'At Risk' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-red-600 dark:text-rose-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 mr-1" /> At Risk
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="px-2.5 py-1 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOD STUDENT INSPECTION MODAL */}
      {/* ========================================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0 border-b border-[#a16b15]/40 dark:border-[#2e3039]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#273e1c] dark:bg-[#2c2d36] text-white font-bold flex items-center justify-center text-sm border border-[#a16b15] dark:border-[#383a45]">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg leading-tight text-white">
                    {selectedStudent.name} — Department Portfolio Record
                  </h3>
                  <p className="text-xs text-[#e2ebd9] dark:text-gray-400 mt-0.5">
                    Roll: <span className="font-mono font-bold text-white">{selectedStudent.roll}</span> • Sec {selectedStudent.section} • Mentor: {selectedStudent.mentor}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const menteeSubs = submissions.filter((s) => s.student_id === selectedStudent.id);
                    generateOfficialCBITMARPDF(selectedStudent, menteeSubs, categories);
                  }}
                  className="px-3 py-1.5 bg-[#273e1c] hover:bg-[#1f3216] dark:bg-[#2c2d36] text-white text-xs font-bold rounded-xl border border-[#a16b15] dark:border-[#383a45] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#dfa94b] dark:text-amber-400" />
                  <span className="hidden sm:inline">Export Official MAR (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-xl bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {/* Profile Card & Target Standing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] space-y-2">
                  <h4 className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider">
                    Academic Registration
                  </h4>
                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    <p><strong>Department:</strong> Artificial Intelligence and Data Science</p>
                    <p><strong>Batch:</strong> 2024-2028 (5th Semester)</p>
                    <p><strong>Counselor:</strong> {selectedStudent.mentor}</p>
                    <p><strong>Admit Category:</strong> {selectedStudent.isLateral ? 'Diploma Lateral Entry (45 pts target)' : '4-Year Regular B.Tech (60 pts target)'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#eef5ec]/70 dark:bg-[#121214] border border-[#385529]/20 dark:border-[#2c2d36] space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider block">
                      MAR Credit Progress
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-3xl font-serif font-black text-[#385529] dark:text-white">
                        {selectedStudent.points}
                      </span>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        / {selectedStudent.target} Target Points (Max Cap: {selectedStudent.maxCap || 100} pts)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#e8e3d8] dark:bg-[#22232a] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#385529] dark:bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((selectedStudent.points / selectedStudent.target) * 100))}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Verified Skills */}
              {selectedStudent.skills && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Verified Skills & Technical Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.skills.map((sk: string) => (
                      <span key={sk} className="bg-[#faf9f5] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-[#e8e3d8] dark:border-[#2c2d36] text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submissions by this student */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#385529] dark:text-gray-100 uppercase tracking-wider border-b border-[#e8e3d8] dark:border-[#2c2d36] pb-2">
                  Submitted Certificate Proofs & MAR History
                </h4>

                {(() => {
                  const studentSubs = submissions.filter((s) => s.student_id === selectedStudent.id);

                  if (studentSubs.length === 0) {
                    return (
                      <div className="p-6 rounded-2xl bg-[#faf9f5] dark:bg-[#121214] text-center border border-dashed border-[#e8e3d8] dark:border-[#2c2d36]">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Detailed certificate proofs will appear here as they are uploaded.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2.5">
                      {studentSubs.map((sub) => {
                        const cat = categories.find((c) => c.id === sub.category_id);

                        return (
                          <div
                            key={sub.id}
                            className="p-3.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <button
                                type="button"
                                onClick={() => setPreviewCertDoc(sub)}
                                className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36] flex-shrink-0 flex items-center justify-center cursor-pointer"
                              >
                                {sub.certificate_url ? (
                                  <img src={sub.certificate_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <FileText className="w-5 h-5 text-gray-400" />
                                )}
                              </button>

                              <div className="space-y-0.5 min-w-0">
                                <span className="text-[9px] bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                                  Cat #{cat?.sno || 1}: {cat?.name}
                                </span>
                                <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                  {sub.activity_title}
                                </h5>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {sub.issuing_organization} • {sub.event_date}
                                </p>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <span className="text-xs font-extrabold text-[#385529] dark:text-emerald-400 block">
                                +{sub.awarded_points || sub.claimed_points} pts
                              </span>
                              <span className="text-[10px] font-bold text-[#385529] dark:text-emerald-400">
                                Approved
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#faf9f5] dark:bg-[#18191e] border-t border-[#e8e3d8] dark:border-[#282932] flex items-center justify-between text-xs flex-shrink-0">
              <span className="text-gray-500 dark:text-gray-400">
                Official records maintained under Department of AI&DS, CBIT Autonomous.
              </span>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-gray-800 dark:text-white font-bold rounded-xl cursor-pointer"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

      {/* High Res Lightbox */}
      {previewCertDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            <div className="p-4 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0">
              <h4 className="font-serif font-bold text-sm text-white line-clamp-1">
                {previewCertDoc.activity_title}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewCertDoc(null)}
                className="p-1.5 rounded-lg bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 bg-[#faf9f5] dark:bg-[#121214] overflow-auto flex items-center justify-center min-h-[300px]">
              <img
                src={previewCertDoc.certificate_url}
                alt={previewCertDoc.activity_title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
              />
            </div>
            <div className="p-4 bg-white dark:bg-[#1a1b20] border-t border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-end text-xs">
              <button
                type="button"
                onClick={() => setPreviewCertDoc(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2b33] text-gray-700 dark:text-gray-200 font-bold rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
