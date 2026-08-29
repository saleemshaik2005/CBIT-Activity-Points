'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateStudentMARProgress } from '@/lib/mar-constants';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  BookOpen,
  Briefcase,
  FileText,
  Sparkles,
  ExternalLink,
  X,
  AlertTriangle,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Building,
  Check,
  Github,
  Linkedin,
} from 'lucide-react';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
import { StudentSubmission, UserProfile } from '@/types';

export default function MentorMenteesPage() {
  const { currentUser, submissions, categories, settings } = useApp();
  const [sectionFilter, setSectionFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [modalYearFilter, setModalYearFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [modalSemFilter, setModalSemFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'>('all');
  const [activeTabFilter, setActiveTabFilter] = useState<
    'all' | 'nptel' | 'internship' | 'resumes' | 'pending' | 'at_risk' | 'completed'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [previewCertDoc, setPreviewCertDoc] = useState<StudentSubmission | null>(null);

  // Assigned mentees in AI&DS
  const mentees = [
    {
      id: "usr-student-001",
      full_name: "Shaik Saleem",
      roll_number: "160122771045",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "2024-2028 (5th Semester)",
      is_lateral_entry: false,
      email: "saleemshaik2005@cbit.ac.in",
      phone_number: "+91 98765 43210",
      skills: ["Python", "TensorFlow", "React", "Next.js", "AI Document Intelligence", "SQL"],
      resume_url: "https://drive.google.com/file/d/sample-resume-saleem/view",
      github_url: "https://github.com/saleemshaik2005",
      linkedin_url: "https://linkedin.com/in/saleemshaik",
      mentor_history: [
        { semester: 1, academic_year: "2024-2025", mentor_id: "fm-03", mentor_name: "Dr. T. Sridevi", designation: "Associate Professor", email: "tsridevi_aids@cbit.ac.in", phone: "+91 98480 12347", cabin: "AI&DS Block, Room 305", is_current: false },
        { semester: 2, academic_year: "2024-2025", mentor_id: "fm-04", mentor_name: "Dr. B. Indira", designation: "Associate Professor", email: "bindira_aids@cbit.ac.in", phone: "+91 98480 12348", cabin: "AI&DS Block, Room 308", is_current: false },
        { semester: 3, academic_year: "2025-2026", mentor_id: "fm-02", mentor_name: "Prof. M. Srinivasa Rao", designation: "Professor", email: "msrao_aids@cbit.ac.in", phone: "+91 98480 12346", cabin: "AI&DS Block, Room 301", is_current: false },
        { semester: 4, academic_year: "2025-2026", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor & Senior Mentor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: false },
        { semester: 5, academic_year: "2026-2027", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor & Senior Mentor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: true },
      ],
    },
    {
      id: "usr-student-002",
      full_name: "Sneha Reddy",
      roll_number: "160122771046",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "2",
      batch_year: "2024-2028 (5th Semester)",
      is_lateral_entry: false,
      email: "sneha.reddy@cbit.ac.in",
      phone_number: "+91 98765 43211",
      skills: ["Cloud Computing", "AWS", "DevOps", "Docker", "Python"],
      resume_url: "https://drive.google.com/file/d/sample-resume-sneha/view",
      github_url: "https://github.com/snehareddy",
      linkedin_url: "https://linkedin.com/in/snehareddy",
      mentor_history: [
        { semester: 1, academic_year: "2024-2025", mentor_id: "fm-03", mentor_name: "Dr. T. Sridevi", designation: "Associate Professor", email: "tsridevi_aids@cbit.ac.in", phone: "+91 98480 12347", cabin: "AI&DS Block, Room 305", is_current: false },
        { semester: 2, academic_year: "2024-2025", mentor_id: "fm-04", mentor_name: "Dr. B. Indira", designation: "Associate Professor", email: "bindira_aids@cbit.ac.in", phone: "+91 98480 12348", cabin: "AI&DS Block, Room 308", is_current: false },
        { semester: 3, academic_year: "2025-2026", mentor_id: "fm-02", mentor_name: "Prof. M. Srinivasa Rao", designation: "Professor", email: "msrao_aids@cbit.ac.in", phone: "+91 98480 12346", cabin: "AI&DS Block, Room 301", is_current: false },
        { semester: 4, academic_year: "2025-2026", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: false },
        { semester: 5, academic_year: "2026-2027", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: true },
      ],
    },
    {
      id: "usr-student-003",
      full_name: "Mohammed Farhan",
      roll_number: "160122771301",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "1",
      batch_year: "2025-2028 (5th Semester)",
      is_lateral_entry: true, // Lateral Entry (45 pts target, 75 max cap)
      email: "farhan.le@cbit.ac.in",
      phone_number: "+91 98765 43212",
      skills: ["IoT Systems", "Full-Stack Web", "Node.js", "MongoDB", "Embedded C"],
      resume_url: "https://drive.google.com/file/d/sample-resume-farhan/view",
      github_url: "https://github.com/farhanle",
      linkedin_url: "https://linkedin.com/in/farhanle",
      mentor_history: [
        { semester: 3, academic_year: "2025-2026", mentor_id: "fm-02", mentor_name: "Prof. M. Srinivasa Rao", designation: "Professor", email: "msrao_aids@cbit.ac.in", phone: "+91 98480 12346", cabin: "AI&DS Block, Room 301", is_current: false },
        { semester: 4, academic_year: "2025-2026", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: false },
        { semester: 5, academic_year: "2026-2027", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: true },
      ],
    },
    {
      id: "usr-student-004",
      full_name: "Ananya Rao",
      roll_number: "160122771089",
      department: "Artificial Intelligence and Data Science (AI&DS)",
      section: "3",
      batch_year: "2024-2028 (5th Semester)",
      is_lateral_entry: false,
      email: "ananya.rao@cbit.ac.in",
      phone_number: "+91 98765 43213",
      skills: ["NLP", "Deep Learning", "PyTorch", "Data Science", "Research Publications"],
      resume_url: "https://drive.google.com/file/d/sample-resume-ananya/view",
      github_url: "https://github.com/ananyarao",
      linkedin_url: "https://linkedin.com/in/ananyarao",
      mentor_history: [
        { semester: 1, academic_year: "2024-2025", mentor_id: "fm-03", mentor_name: "Dr. T. Sridevi", designation: "Associate Professor", email: "tsridevi_aids@cbit.ac.in", phone: "+91 98480 12347", cabin: "AI&DS Block, Room 305", is_current: false },
        { semester: 2, academic_year: "2024-2025", mentor_id: "fm-04", mentor_name: "Dr. B. Indira", designation: "Associate Professor", email: "bindira_aids@cbit.ac.in", phone: "+91 98480 12348", cabin: "AI&DS Block, Room 308", is_current: false },
        { semester: 3, academic_year: "2025-2026", mentor_id: "fm-02", mentor_name: "Prof. M. Srinivasa Rao", designation: "Professor", email: "msrao_aids@cbit.ac.in", phone: "+91 98480 12346", cabin: "AI&DS Block, Room 301", is_current: false },
        { semester: 4, academic_year: "2025-2026", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: false },
        { semester: 5, academic_year: "2026-2027", mentor_id: "fm-01", mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "AI&DS Block, Room 304", is_current: true },
      ],
    },
  ];

  // Helper checks for each mentee
  const menteeHasNPTEL = (studentId: string) => {
    return submissions.some(
      (s) =>
        s.student_id === studentId &&
        s.status === 'approved' &&
        (s.category_id === 1 ||
          s.category_id === 2 ||
          s.activity_title.toLowerCase().includes('nptel') ||
          s.activity_title.toLowerCase().includes('mooc') ||
          s.issuing_organization.toLowerCase().includes('nptel') ||
          s.issuing_organization.toLowerCase().includes('swayam'))
    );
  };

  const menteeHasInternship = (studentId: string) => {
    return submissions.some(
      (s) =>
        s.student_id === studentId &&
        s.status === 'approved' &&
        (s.category_id === 13 ||
          s.activity_title.toLowerCase().includes('internship') ||
          s.activity_title.toLowerCase().includes('training') ||
          s.issuing_organization.toLowerCase().includes('internship') ||
          s.issuing_organization.toLowerCase().includes('labs') ||
          s.issuing_organization.toLowerCase().includes('technologies'))
    );
  };

  const menteeHasPending = (studentId: string) => {
    return submissions.some((s) => s.student_id === studentId && s.status === 'pending_mentor');
  };

  const filteredMentees = mentees.filter((m) => {
    // Section filter
    if (sectionFilter !== 'all' && m.section !== sectionFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.full_name.toLowerCase().includes(q);
      const matchRoll = m.roll_number.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchSkills = m.skills?.some((sk) => sk.toLowerCase().includes(q));
      if (!matchName && !matchRoll && !matchEmail && !matchSkills) return false;
    }

    // Tab filter
    const menteeSubmissions = submissions.filter((s) => s.student_id === m.id);
    const target = m.is_lateral_entry
      ? settings.lateral_entry_target_points
      : settings.regular_target_points;
    const maxCap = m.is_lateral_entry
      ? settings.lateral_entry_max_points || 75
      : settings.regular_max_points || 100;
    const progress = calculateStudentMARProgress(menteeSubmissions, categories, target, maxCap);

    if (activeTabFilter === 'nptel') {
      return menteeHasNPTEL(m.id);
    }
    if (activeTabFilter === 'internship') {
      return menteeHasInternship(m.id);
    }
    if (activeTabFilter === 'resumes') {
      return !!m.resume_url;
    }
    if (activeTabFilter === 'pending') {
      return menteeHasPending(m.id);
    }
    if (activeTabFilter === 'at_risk') {
      return progress.totalApprovedPoints < 30 && !progress.isCompleted;
    }
    if (activeTabFilter === 'completed') {
      return progress.isCompleted;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-300">
            <Users className="w-5 h-5" />
            <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
              Assigned Mentees & Portfolio Directory
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Faculty Counselor: <strong>{currentUser.full_name}</strong> • Department of {currentUser.department}
          </p>
        </div>

        {/* Section Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
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
        
        {/* Quick Filter Buttons */}
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
            <span>All Mentees ({mentees.length})</span>
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
            <span>Student Resumes & CVs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'pending'
                ? 'bg-[#a16b15] dark:bg-amber-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
            <span>Pending Approvals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabFilter === 'completed'
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>MAR Satisfied</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search mentees by name, roll number, or technical skills (e.g. Python, Cloud, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Mentees Progress Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] text-[#385529] dark:text-gray-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student Name & Roll No</th>
                <th className="py-3.5 px-3">Section</th>
                <th className="py-3.5 px-3">Portfolio Highlights</th>
                <th className="py-3.5 px-3">Entry Type</th>
                <th className="py-3.5 px-3">Target</th>
                <th className="py-3.5 px-3">Approved Points</th>
                <th className="py-3.5 px-3">Progress</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {filteredMentees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No mentees match your active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMentees.map((mentee) => {
                  const menteeSubmissions = submissions.filter((s) => s.student_id === mentee.id);
                  const target = mentee.is_lateral_entry
                    ? settings.lateral_entry_target_points
                    : settings.regular_target_points;
                  const maxCap = mentee.is_lateral_entry
                    ? settings.lateral_entry_max_points || 75
                    : settings.regular_max_points || 100;
                  const progress = calculateStudentMARProgress(menteeSubmissions, categories, target, maxCap);
                  const hasNPTEL = menteeHasNPTEL(mentee.id);
                  const hasInternship = menteeHasInternship(mentee.id);

                  return (
                    <tr
                      key={mentee.id}
                      onClick={() => setSelectedMentee(mentee)}
                      className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#385529] dark:bg-[#2a2b33] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {mentee.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#1c2718] dark:text-white group-hover:text-[#385529] dark:group-hover:text-emerald-400 transition-colors">
                              {mentee.full_name}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                              {mentee.roll_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-gray-700 dark:text-gray-300">
                        Sec {mentee.section}
                      </td>

                      {/* Portfolio Badges */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {hasNPTEL && (
                            <span className="bg-[#eef5ec] dark:bg-[#1a1b20] text-[#385529] dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#385529]/20">
                              NPTEL
                            </span>
                          )}
                          {hasInternship && (
                            <span className="bg-[#fbf5eb] dark:bg-[#1a1b20] text-[#a16b15] dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#a16b15]/30">
                              Internship
                            </span>
                          )}
                          {mentee.resume_url && (
                            <span className="bg-[#f0f4f8] dark:bg-[#1a1b20] text-[#3b566e] dark:text-sky-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#3b566e]/20">
                              CV Ready
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mentee.is_lateral_entry
                              ? 'bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 border border-[#a16b15]/30 dark:border-[#2e3039]'
                              : 'bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 border border-[#385529]/30 dark:border-[#2e3039]'
                          }`}
                        >
                          {mentee.is_lateral_entry ? 'Lateral Entry' : '4-Yr Regular'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-gray-700 dark:text-gray-300">
                        {target} pts
                      </td>

                      <td className="py-3.5 px-3 font-extrabold text-[#385529] dark:text-emerald-400">
                        {progress.totalApprovedPoints} pts
                      </td>

                      <td className="py-3.5 px-3 w-36">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-[#e8e3d8] dark:bg-[#121214] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                progress.isCompleted
                                  ? 'bg-[#385529] dark:bg-emerald-500'
                                  : 'bg-[#a16b15] dark:bg-amber-400'
                              }`}
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                            {progress.percentage}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {progress.isCompleted ? (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-[#385529]/30 dark:border-[#2e3039]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Satisfied
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] dark:text-amber-400 bg-[#fbf5eb] dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
                            <Clock className="w-3 h-3 mr-1" /> {progress.pointsRemaining} pts needed
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedMentee(mentee)}
                            className="px-2.5 py-1 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="View Full Student Portfolio & Certificates"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Portfolio</span>
                          </button>
                          <button
                            onClick={() => generateOfficialCBITMARPDF(mentee as any, menteeSubmissions, categories)}
                            className="px-2 py-1 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-[11px] rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Download Official Activity Sheet"
                          >
                            <Download className="w-3 h-3 text-[#a16b15] dark:text-amber-400" />
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
      {/* FULL MENTEE PORTFOLIO & CERTIFICATE INSPECTION MODAL */}
      {/* ========================================================================= */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0 border-b border-[#a16b15]/40 dark:border-[#2e3039]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#273e1c] dark:bg-[#2c2d36] text-white font-bold flex items-center justify-center text-sm border border-[#a16b15] dark:border-[#383a45]">
                  {selectedMentee.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg leading-tight text-white">
                    {selectedMentee.full_name} — Portfolio & Verification Details
                  </h3>
                  <p className="text-xs text-[#e2ebd9] dark:text-gray-400 mt-0.5">
                    Roll: <span className="font-mono font-bold text-white">{selectedMentee.roll_number}</span> • Sec {selectedMentee.section} • {selectedMentee.batch_year}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const menteeSubs = submissions.filter((s) => s.student_id === selectedMentee.id);
                    generateOfficialCBITMARPDF(selectedMentee, menteeSubs, categories);
                  }}
                  className="px-3 py-1.5 bg-[#273e1c] hover:bg-[#1f3216] dark:bg-[#2c2d36] dark:hover:bg-[#383a45] text-white text-xs font-bold rounded-xl border border-[#a16b15] dark:border-[#383a45] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#dfa94b] dark:text-amber-400" />
                  <span className="hidden sm:inline">Export Official MAR (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMentee(null)}
                  className="p-1.5 rounded-xl bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Mentee Overview Banner */}
              {(() => {
                const allMenteeSubs = submissions.filter((s) => s.student_id === selectedMentee.id);
                const target = selectedMentee.is_lateral_entry
                  ? settings.lateral_entry_target_points
                  : settings.regular_target_points;
                const maxCap = selectedMentee.is_lateral_entry
                  ? settings.lateral_entry_max_points || 75
                  : settings.regular_max_points || 100;
                const progress = calculateStudentMARProgress(allMenteeSubs, categories, target, maxCap);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* Left: Contact & Profile */}
                    <div className="md:col-span-6 p-4 rounded-2xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] space-y-2.5">
                      <h4 className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider">
                        Student Contact & Credentials
                      </h4>
                      <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                          <span>{selectedMentee.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                          <span>{selectedMentee.phone_number || '+91 98765 43210'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                          <span>
                            {selectedMentee.is_lateral_entry ? 'Lateral Entry (Diploma Admitted)' : '4-Year Regular B.Tech Admitted'}
                          </span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {selectedMentee.skills && (
                        <div className="pt-2 border-t border-gray-200 dark:border-[#2e3039]">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                            Verified Skill Portfolio:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {selectedMentee.skills.map((sk: string) => (
                              <span
                                key={sk}
                                className="bg-white dark:bg-[#1c1d22] text-[#385529] dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md border border-[#e8e3d8] dark:border-[#2e3039] text-[10px]"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: MAR Progress Meter */}
                    <div className="md:col-span-6 p-4 rounded-2xl bg-[#eef5ec]/70 dark:bg-[#121214] border border-[#385529]/20 dark:border-[#2c2d36] space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider block">
                          Graduation Points Standing
                        </span>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-3xl font-serif font-black text-[#385529] dark:text-white">
                            {progress.totalApprovedPoints}
                          </span>
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            / {target} Target (Max Cap: {maxCap} pts)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="w-full bg-[#e8e3d8] dark:bg-[#22232a] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#385529] dark:bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                          <span>{progress.percentage}% Requirement Satisfied</span>
                          <span>{progress.pointsRemaining} pts needed</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-white dark:bg-[#1a1b20] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-[#385529]/20">
                          {progress.approvedCount} Certificates Approved
                        </span>
                        {progress.pendingCount > 0 && (
                          <span className="text-[10px] bg-[#fbf5eb] dark:bg-[#1a1b20] text-[#a16b15] dark:text-amber-400 font-bold px-2 py-0.5 rounded border border-[#a16b15]/30">
                            {progress.pendingCount} Pending Review
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* ========================================================================= */}
              {/* FACULTY MENTORS HISTORY (SEMESTER-WISE LOG) */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#16171c] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-[#eef5ec] dark:bg-[#22232a] rounded-lg border border-[#385529]/20">
                      <GraduationCap className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider">
                        Semester-Wise Assigned Faculty Mentors History
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Historical mentor records across semesters. Contact past mentors for confirmation if needed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {(selectedMentee.mentor_history && selectedMentee.mentor_history.length > 0
                    ? selectedMentee.mentor_history
                    : [
                        { semester: 1, mentor_name: "Dr. T. Sridevi", designation: "Associate Professor", email: "tsridevi_aids@cbit.ac.in", phone: "+91 98480 12347", cabin: "Room 305", is_current: false },
                        { semester: 2, mentor_name: "Dr. B. Indira", designation: "Associate Professor", email: "bindira_aids@cbit.ac.in", phone: "+91 98480 12348", cabin: "Room 308", is_current: false },
                        { semester: 3, mentor_name: "Prof. M. Srinivasa Rao", designation: "Professor", email: "msrao_aids@cbit.ac.in", phone: "+91 98480 12346", cabin: "Room 301", is_current: false },
                        { semester: 4, mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "Room 304", is_current: false },
                        { semester: 5, mentor_name: "Dr. K. Ramana", designation: "Associate Professor", email: "kramana_aids@cbit.ac.in", phone: "+91 98480 12345", cabin: "Room 304", is_current: true },
                      ]
                  ).map((mRec: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        mRec.is_current
                          ? 'bg-[#eef5ec]/90 dark:bg-[#1a2517] border-[#385529]/40 dark:border-emerald-800'
                          : 'bg-[#faf9f5] dark:bg-[#121214] border-[#e8e3d8] dark:border-[#2c2d36]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-[11px] text-[#385529] dark:text-emerald-400">
                          Semester {mRec.semester}
                        </span>
                        {mRec.is_current && (
                          <span className="bg-[#385529] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                            Current Mentor
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-xs">{mRec.mentor_name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{mRec.designation}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-black/5 dark:border-white/5">
                        <span className="text-gray-500 dark:text-gray-400">{mRec.cabin || 'Dept Block'}</span>
                        <div className="flex items-center space-x-2">
                          {mRec.phone && (
                            <a
                              href={`tel:${mRec.phone}`}
                              className="text-[#385529] dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5"
                              title={`Call ${mRec.mentor_name}`}
                            >
                              <Phone className="w-2.5 h-2.5" /> Call
                            </a>
                          )}
                          {mRec.email && (
                            <a
                              href={`mailto:${mRec.email}?subject=Confirmation regarding mentee ${selectedMentee.full_name} (${selectedMentee.roll_number})`}
                              className="text-[#a16b15] dark:text-amber-400 font-bold hover:underline inline-flex items-center gap-0.5"
                              title={`Email ${mRec.mentor_name}`}
                            >
                              <Mail className="w-2.5 h-2.5" /> Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* YEAR & SEMESTER FILTERS FOR MENTEE SUBMISSIONS */}
              {/* ========================================================================= */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e3d8] dark:border-[#2c2d36] pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#385529] dark:text-gray-100 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
                      <span>Submitted Certificates & Proofs Portfolio</span>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Filter certificates by 4-Year cycle or specific semester.
                    </p>
                  </div>

                  {/* Year-Wise Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#faf9f5] dark:bg-[#121214] p-1.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
                    <span className="text-[10px] font-bold text-gray-500 px-1 uppercase">Year:</span>
                    {[
                      { key: 'all', label: 'All 4 Years' },
                      { key: '1', label: '1st Yr (Sem 1-2)' },
                      { key: '2', label: '2nd Yr (Sem 3-4)' },
                      { key: '3', label: '3rd Yr (Sem 5-6)' },
                      { key: '4', label: '4th Yr (Sem 7-8)' },
                    ].map((y) => (
                      <button
                        key={y.key}
                        type="button"
                        onClick={() => {
                          setModalYearFilter(y.key as any);
                          setModalSemFilter('all');
                        }}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                          modalYearFilter === y.key
                            ? 'bg-[#385529] text-white shadow-2xs'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#22232a]'
                        }`}
                      >
                        {y.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semester Sub-Filter Bar */}
                <div className="flex flex-wrap items-center gap-1 bg-[#faf9f5] dark:bg-[#121214] p-1.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] text-xs">
                  <span className="text-[10px] font-bold text-gray-500 px-2 uppercase">Semester:</span>
                  <button
                    type="button"
                    onClick={() => setModalSemFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      modalSemFilter === 'all'
                        ? 'bg-[#a16b15] text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#22232a]'
                    }`}
                  >
                    All Semesters
                  </button>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModalSemFilter(String(s) as any)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        modalSemFilter === String(s)
                          ? 'bg-[#385529] text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#22232a]'
                      }`}
                    >
                      Sem {s}
                    </button>
                  ))}
                </div>

                {(() => {
                  let menteeSubs = submissions.filter((s) => s.student_id === selectedMentee.id);

                  // Year Filter Application
                  if (modalYearFilter === '1') {
                    menteeSubs = menteeSubs.filter((s) => s.semester === 1 || s.semester === 2);
                  } else if (modalYearFilter === '2') {
                    menteeSubs = menteeSubs.filter((s) => s.semester === 3 || s.semester === 4);
                  } else if (modalYearFilter === '3') {
                    menteeSubs = menteeSubs.filter((s) => s.semester === 5 || s.semester === 6);
                  } else if (modalYearFilter === '4') {
                    menteeSubs = menteeSubs.filter((s) => s.semester === 7 || s.semester === 8);
                  }

                  // Semester Filter Application
                  if (modalSemFilter !== 'all') {
                    menteeSubs = menteeSubs.filter((s) => s.semester === Number(modalSemFilter));
                  }

                  if (menteeSubs.length === 0) {
                    return (
                      <div className="p-8 rounded-2xl bg-[#faf9f5] dark:bg-[#121214] text-center border border-dashed border-[#e8e3d8] dark:border-[#2c2d36]">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          No certificates submitted for the selected Year / Semester filter.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {menteeSubs.map((sub) => {
                        const cat = categories.find((c) => c.id === sub.category_id);
                        const isPdf = sub.file_type?.includes('pdf') || sub.certificate_url?.endsWith('.pdf');

                        return (
                          <div
                            key={sub.id}
                            className="p-4 rounded-2xl bg-white dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#385529] dark:hover:border-emerald-600 transition-all"
                          >
                            <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                              
                              {/* Certificate Thumbnail Preview */}
                              <button
                                type="button"
                                onClick={() => setPreviewCertDoc(sub)}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#faf9f5] dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] flex-shrink-0 flex items-center justify-center cursor-pointer relative shadow-2xs hover:border-[#385529] transition-all group/thumb"
                                title="Click to view full certificate"
                              >
                                {isPdf ? (
                                  <div className="text-center p-1">
                                    <BookOpen className="w-6 h-6 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                                    <span className="text-[9px] font-bold text-gray-500 block uppercase">PDF</span>
                                  </div>
                                ) : sub.certificate_url ? (
                                  <img
                                    src={sub.certificate_url}
                                    alt={sub.activity_title}
                                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                                  />
                                ) : (
                                  <FileText className="w-6 h-6 text-gray-400" />
                                )}
                                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </button>

                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] bg-[#eef5ec] dark:bg-[#1a1b20] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-[#385529]/20">
                                    Cat #{cat?.sno || 1}: {cat?.name}
                                  </span>
                                  <span className="text-[10px] bg-[#faf9f5] dark:bg-[#1a1b20] text-gray-700 dark:text-gray-300 font-semibold px-2 py-0.5 rounded border border-[#e8e3d8] dark:border-[#2e3039]">
                                    Sem {sub.semester}
                                  </span>
                                  {sub.credential_id && (
                                    <span className="text-[10px] bg-[#f0f4f8] dark:bg-[#1a1b20] text-[#3b566e] dark:text-gray-400 font-mono px-1.5 py-0.5 rounded border border-[#3b566e]/20 hidden sm:inline-block">
                                      ID: {sub.credential_id}
                                    </span>
                                  )}
                                  {sub.verification_url && (
                                    <a
                                      href={sub.verification_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] bg-[#eef5ec] text-[#385529] dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-[#385529]/20 hover:underline inline-flex items-center gap-0.5"
                                    >
                                      Verify Link ↗
                                    </a>
                                  )}
                                </div>

                                <h5 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                                  {sub.activity_title}
                                </h5>

                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {sub.issuing_organization} • {sub.event_date}
                                </p>

                                {sub.mentor_remarks && (
                                  <p className="text-[11px] text-[#385529] dark:text-emerald-400 font-medium pt-0.5">
                                    Feedback: "{sub.mentor_remarks}"
                                  </p>
                                )}
                              </div>

                            </div>

                            {/* Right: Points & Status */}
                            <div className="text-right space-y-1 flex-shrink-0">
                              <span className="text-xs font-extrabold text-[#385529] dark:text-emerald-400 block">
                                {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points} pts` : `${sub.claimed_points} pts`}
                              </span>
                              <div>
                                {sub.status === 'approved' && (
                                  <span className="inline-flex items-center text-[10px] font-bold text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-[#385529]/30">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                                  </span>
                                )}
                                {sub.status === 'pending_mentor' && (
                                  <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] dark:bg-[#22232a] text-amber-400 bg-[#fbf5eb] px-2 py-0.5 rounded-full border border-[#a16b15]/30">
                                    <Clock className="w-3 h-3 mr-1" /> Pending
                                  </span>
                                )}
                                {sub.status === 'rejected' && (
                                  <span className="inline-flex items-center text-[10px] font-bold text-red-700 dark:text-rose-400 bg-red-50 dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-red-200">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Rejected
                                  </span>
                                )}
                              </div>
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
                Mentee records synchronized with CBIT Academic Section.
              </span>
              <button
                type="button"
                onClick={() => setSelectedMentee(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-gray-800 dark:text-white font-bold rounded-xl cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK HIGH-RES CERTIFICATE VIEWER LIGHTBOX */}
      {/* ========================================================================= */}
      {previewCertDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            
            <div className="p-4 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0">
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-white line-clamp-1">
                  {previewCertDoc.activity_title}
                </h4>
                <p className="text-[11px] text-[#e2ebd9] dark:text-gray-400">
                  {previewCertDoc.issuing_organization} • {previewCertDoc.event_date}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewCertDoc.certificate_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewCertDoc(null)}
                  className="p-1.5 rounded-lg bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-[#faf9f5] dark:bg-[#121214] overflow-auto flex items-center justify-center min-h-[300px]">
              {previewCertDoc.file_type?.includes('pdf') || previewCertDoc.certificate_url?.endsWith('.pdf') ? (
                <div className="text-center p-8 space-y-3">
                  <BookOpen className="w-16 h-16 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{previewCertDoc.activity_title}</h4>
                  <a
                    href={previewCertDoc.certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#385529] text-white text-xs font-bold rounded-xl"
                  >
                    <span>Open PDF Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={previewCertDoc.certificate_url}
                  alt={previewCertDoc.activity_title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
                />
              )}
            </div>

            <div className="p-4 bg-white dark:bg-[#1a1b20] border-t border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-between text-xs">
              <span className="font-bold text-[#385529] dark:text-emerald-400">
                Awarded: +{previewCertDoc.awarded_points || previewCertDoc.claimed_points} Points
              </span>
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
