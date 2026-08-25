'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  BookOpen,
  Briefcase,
  FileText,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DEPARTMENT_FACULTY_MENTORS, FacultyMentorDetail } from '@/lib/mar-constants';

export default function HODMentorsPage() {
  const { currentUser, addNotification } = useApp();
  const [sectionFilter, setSectionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>('fm-01');
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  const filteredMentors = DEPARTMENT_FACULTY_MENTORS.filter((m) => {
    if (sectionFilter !== 'all' && m.section !== sectionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchCabin = m.cabin.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCabin) return false;
    }
    return true;
  });

  const handleSendMentorReminder = (mentor: FacultyMentorDetail) => {
    addNotification({
      recipient_role: 'mentor',
      type: 'submission',
      title: `HOD Verification Reminder: ${mentor.name}`,
      message: `Dear ${mentor.name}, kindly expedite the review of ${mentor.pendingReviews} pending student certificates in your verification queue.`,
      link: '/mentor',
      sender_name: 'Head of Department (AI&DS)',
    });
    setReminderSentId(mentor.id);
    setTimeout(() => setReminderSentId(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#a71a1b] dark:border-rose-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-300">
            <Users className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />
            <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
              Faculty Mentorship Hierarchy & Allocation Matrix
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Department of AI&DS • Comprehensive overview of all <strong>{DEPARTMENT_FACULTY_MENTORS.length} Faculty Mentors</strong> and their assigned mentees.
          </p>
        </div>

        {/* Section Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
          >
            <option value="all">All Sections (1, 2, 3)</option>
            <option value="1">Section 1 Mentors</option>
            <option value="2">Section 2 Mentors</option>
            <option value="3">Section 3 Mentors</option>
          </select>
        </div>
      </div>

      {/* Search and Quick Metric Strip */}
      <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search faculty mentors by name, cabin, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 px-3 py-1.5 rounded-xl font-bold border border-[#385529]/20">
            {DEPARTMENT_FACULTY_MENTORS.length} Faculty Mentors
          </div>
          <div className="bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 px-3 py-1.5 rounded-xl font-bold border border-[#a16b15]/30">
            193 Total Mentees Assigned
          </div>
        </div>
      </div>

      {/* Mentors List Cards */}
      <div className="space-y-4">
        {filteredMentors.map((mentor) => {
          const isExpanded = expandedMentorId === mentor.id;

          return (
            <div
              key={mentor.id}
              className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden hover:border-[#385529] dark:hover:border-emerald-600 transition-all"
            >
              
              {/* Mentor Summary Row */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Profile Info */}
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#385529] dark:bg-[#2a2b33] text-white font-bold flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                    {mentor.name.replace('Dr. ', '').replace('Prof. ', '').replace('Sri. ', '').replace('Smt. ', '').charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                        {mentor.name}
                      </h3>
                      <span className="text-[10px] bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-[#385529]/20">
                        Section {mentor.section}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{mentor.designation}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#a16b15]" /> {mentor.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-[#a16b15]" /> {mentor.cabin}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics & Performance */}
                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                  
                  {/* Assigned Mentees */}
                  <div className="text-center p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] min-w-[90px]">
                    <span className="text-base font-serif font-extrabold text-[#1c2718] dark:text-white block">
                      {mentor.menteeCount}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Mentees</span>
                  </div>

                  {/* Pending Reviews */}
                  <div className="text-center p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] min-w-[90px]">
                    <span className={`text-base font-serif font-extrabold block ${
                      mentor.pendingReviews > 0 ? 'text-[#a16b15] dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {mentor.pendingReviews}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Queue</span>
                  </div>

                  {/* Compliance Rate */}
                  <div className="text-center p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2c2d36] min-w-[110px]">
                    <span className="text-base font-serif font-extrabold text-[#385529] dark:text-emerald-400 block">
                      {mentor.complianceRate}%
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Avg: {mentor.averagePoints} Pts</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {mentor.pendingReviews > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSendMentorReminder(mentor)}
                        className="px-3 py-2 bg-[#fbf5eb] dark:bg-[#22232a] hover:bg-[#f5e9d3] text-[#a16b15] dark:text-amber-400 font-bold text-xs rounded-xl border border-[#a16b15]/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Send Review Reminder"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {reminderSentId === mentor.id ? 'Sent!' : 'Remind'}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedMentorId(isExpanded ? null : mentor.id)}
                      className="px-3.5 py-2 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Mentees' : 'View Mentees'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

              </div>

              {/* Expandable Mentees Table */}
              {isExpanded && (
                <div className="border-t border-[#e8e3d8] dark:border-[#2c2d36] bg-[#faf9f5] dark:bg-[#121214] p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xs text-[#385529] dark:text-gray-200 uppercase tracking-wider">
                      Mentees Assigned to {mentor.name} (Section {mentor.section})
                    </h4>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Roster Size: {mentor.mentees.length} Students Tracked
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#1a1b20] rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] overflow-x-auto shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f1e8] dark:bg-[#22232a] text-gray-700 dark:text-gray-300 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Roll Number</th>
                          <th className="py-2.5 px-3">Entry Type</th>
                          <th className="py-2.5 px-3">Key Highlights</th>
                          <th className="py-2.5 px-3 text-center">Approved Points</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
                        {mentor.mentees.map((mentee) => (
                          <tr key={mentee.id} className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors">
                            <td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">
                              {mentee.name}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-gray-600 dark:text-gray-400">
                              {mentee.roll}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                                {mentee.isLateral ? 'Lateral Entry' : 'Regular'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                {mentee.nptelDone && (
                                  <span className="text-[9px] font-bold bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 px-1.5 py-0.5 rounded">
                                    NPTEL
                                  </span>
                                )}
                                {mentee.internshipDone && (
                                  <span className="text-[9px] font-bold bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 px-1.5 py-0.5 rounded">
                                    Internship
                                  </span>
                                )}
                                {mentee.resumeUrl && (
                                  <span className="text-[9px] font-bold bg-[#f0f4f8] dark:bg-[#22232a] text-[#3b566e] dark:text-sky-400 px-1.5 py-0.5 rounded">
                                    CV Ready
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-extrabold text-[#385529] dark:text-emerald-400">
                              {mentee.points} / {mentee.target} pts
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {mentee.status === 'Satisfied' && (
                                <span className="inline-flex items-center text-[10px] font-bold text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-[#22232a] px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Satisfied
                                </span>
                              )}
                              {mentee.status === 'In Progress' && (
                                <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] dark:text-amber-400 bg-[#fbf5eb] dark:bg-[#22232a] px-2 py-0.5 rounded-full">
                                  <Clock className="w-3 h-3 mr-1" /> In Progress
                                </span>
                              )}
                              {mentee.status === 'At Risk' && (
                                <span className="inline-flex items-center text-[10px] font-bold text-red-600 dark:text-rose-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="w-3 h-3 mr-1" /> At Risk
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <Link
                                href="/hod/students"
                                className="text-[11px] font-bold text-[#385529] dark:text-emerald-400 hover:underline"
                              >
                                View Details &rarr;
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
