'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
import { EditSubmissionModal } from '@/components/student/EditSubmissionModal';
import { StudentSubmission } from '@/types';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Calendar,
  Building,
  Sparkles,
  Search,
  BookOpen,
  FileText,
  X,
  ExternalLink,
  Edit3,
  MessageSquare,
  Send,
  QrCode,
} from 'lucide-react';

export default function StudentHistoryPage() {
  const { currentUser, submissions, categories, deleteSubmission, updateSubmission, addSubmissionMessage } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [semFilter, setSemFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<StudentSubmission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<StudentSubmission | null>(null);
  const [chatSubmissionId, setChatSubmissionId] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState<string>('');

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);
  const activeChatSubmission = submissions.find((s) => s.id === chatSubmissionId) || null;

  const filtered = mySubmissions.filter((sub) => {
    // Status Filter
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;

    // Year Filter
    let matchesYear = true;
    if (yearFilter === '1') matchesYear = sub.semester === 1 || sub.semester === 2;
    else if (yearFilter === '2') matchesYear = sub.semester === 3 || sub.semester === 4;
    else if (yearFilter === '3') matchesYear = sub.semester === 5 || sub.semester === 6;
    else if (yearFilter === '4') matchesYear = sub.semester === 7 || sub.semester === 8;

    // Semester Filter
    const matchesSem = semFilter === 'all' || sub.semester === Number(semFilter);

    // Search Query
    const matchesSearch =
      sub.activity_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.issuing_organization.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesYear && matchesSem && matchesSearch;
  });

  const handleDownloadPDF = () => {
    generateOfficialCBITMARPDF(currentUser, mySubmissions, categories);
  };

  const handleSendChatReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatSubmissionId || !chatReply.trim()) return;
    addSubmissionMessage(chatSubmissionId, chatReply);
    setChatReply('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">Activity Submission Logs</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Complete record of your submitted certificates across all 4 years and 8 semesters with mentor verification notes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
            <span>Download MAR Sheet (PDF)</span>
          </button>

          <Link
            href="/student/upload"
            className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] dark:border-[#383a45]"
          >
            <Sparkles className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
            <span>Upload New</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
        
        {/* Row 1: Status & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'approved', 'pending_mentor', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  filterStatus === status
                    ? 'bg-[#385529] dark:bg-[#2a2b33] text-white shadow-2xs'
                    : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22232a]'
                }`}
              >
                {status === 'pending_mentor' ? 'Pending Review' : status}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search activities or organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e3d8] dark:border-[#2c2d36] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Row 2: Year-Wise & Semester-Wise Filter Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-2 border-t border-[#e8e3d8] dark:border-[#2c2d36]">
          
          {/* Year Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-[#faf9f5] dark:bg-[#121214] p-1.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] text-xs">
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
                  setYearFilter(y.key as any);
                  setSemFilter('all');
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  yearFilter === y.key
                    ? 'bg-[#385529] text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#22232a]'
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>

          {/* Semester Selector */}
          <div className="flex flex-wrap items-center gap-1 bg-[#faf9f5] dark:bg-[#121214] p-1.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] text-xs">
            <span className="text-[10px] font-bold text-gray-500 px-1 uppercase">Semester:</span>
            <button
              type="button"
              onClick={() => setSemFilter('all')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                semFilter === 'all'
                  ? 'bg-[#a16b15] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#22232a]'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSemFilter(String(s) as any)}
                className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  semFilter === String(s)
                    ? 'bg-[#385529] text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#22232a]'
                }`}
              >
                S{s}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-12 text-center border border-[#e8e3d8] dark:border-[#2c2d36] space-y-3">
          <FileCheck className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">No submissions found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No activity submissions match your active filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const cat = categories.find((c) => c.id === sub.category_id);
            const isPdf = sub.file_type?.includes('pdf') || sub.certificate_url?.endsWith('.pdf');
            const hasMessages = sub.messages && sub.messages.length > 0;

            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-[#1a1b20] rounded-2xl p-5 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs hover:shadow-sm transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  
                  {/* Thumbnail Preview */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewDoc(sub)}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2e3039] flex-shrink-0 flex items-center justify-center cursor-pointer relative shadow-2xs hover:border-[#385529] dark:hover:border-emerald-500 transition-all group"
                    title="Click to preview certificate"
                  >
                    {isPdf ? (
                      <div className="text-center p-1">
                        <BookOpen className="w-6 h-6 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 block uppercase mt-0.5">PDF</span>
                      </div>
                    ) : sub.certificate_url ? (
                      <img
                        src={sub.certificate_url}
                        alt={sub.activity_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 px-2.5 py-0.5 rounded-md border border-[#385529]/20 dark:border-[#2e3039]">
                        Category #{cat?.sno || 1}: {cat?.name}
                      </span>
                      <span className="text-[11px] font-semibold bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md border border-[#e8e3d8] dark:border-[#2e3039]">
                        Semester {sub.semester}
                      </span>
                      {sub.credential_id && (
                        <span className="text-[11px] font-mono bg-[#f0f4f8] dark:bg-[#121214] text-[#3b566e] dark:text-gray-300 px-2 py-0.5 rounded-md border border-[#3b566e]/20 dark:border-[#2e3039]">
                          ID: {sub.credential_id}
                        </span>
                      )}
                      {sub.verification_url && (
                        <a
                          href={sub.verification_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] bg-[#eef5ec] dark:bg-[#1a2517] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-[#385529]/20 hover:underline inline-flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Verify Link</span>
                        </a>
                      )}
                      <span className="text-[11px] text-gray-400">
                        Submitted on {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{sub.activity_title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                        {sub.issuing_organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                        {sub.event_date}
                      </span>
                    </div>

                    {sub.mentor_remarks && (
                      <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#22232a] border border-gray-200 dark:border-[#2e3039] text-xs text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Mentor Feedback ({sub.approver_name || 'Faculty'}):
                        </span>{' '}
                        {sub.mentor_remarks}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Points, Status & Actions */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-[#2c2d36] flex-shrink-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#385529] dark:text-emerald-400">
                      {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points}` : sub.claimed_points} pts
                    </span>
                    <p className="text-[10px] text-gray-400">
                      {sub.status === 'approved' ? 'Awarded' : 'Claimed'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    {sub.status === 'approved' && (
                      <span className="inline-flex items-center text-xs font-bold text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-[#22232a] px-3 py-1 rounded-full border border-[#385529]/20 dark:border-[#2e3039]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                      </span>
                    )}
                    {sub.status === 'pending_mentor' && (
                      <span className="inline-flex items-center text-xs font-bold text-[#a16b15] dark:text-amber-400 bg-[#fbf5eb] dark:bg-[#22232a] px-3 py-1 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Under Review
                      </span>
                    )}
                    {sub.status === 'rejected' && (
                      <span className="inline-flex items-center text-xs font-bold text-red-700 dark:text-rose-400 bg-red-50 dark:bg-[#22232a] px-3 py-1 rounded-full border border-red-200 dark:border-[#2e3039]">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Rejected
                      </span>
                    )}

                    {/* Contact / Message Mentor Button */}
                    <button
                      type="button"
                      onClick={() => setChatSubmissionId(sub.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
                        hasMessages
                          ? 'bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 border border-[#385529]/30'
                          : 'text-gray-500 hover:text-[#385529] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#22232a]'
                      }`}
                      title="View Mentor Messages & Discussion"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {hasMessages && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                      )}
                    </button>

                    {/* Edit Submission (Available for pending submissions) */}
                    {sub.status === 'pending_mentor' && (
                      <button
                        type="button"
                        onClick={() => setEditingSubmission(sub)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 border border-[#a16b15]/30 hover:bg-[#faeedb] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit this submission before approval"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedPreviewDoc(sub)}
                      className="p-1.5 text-gray-500 hover:text-[#385529] dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#22232a] rounded-lg transition-colors cursor-pointer"
                      title="Preview Certificate"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {sub.status !== 'approved' && (
                      <button
                        onClick={() => deleteSubmission(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Submission Modal */}
      {editingSubmission && (
        <EditSubmissionModal
          isOpen={true}
          onClose={() => setEditingSubmission(null)}
          submission={editingSubmission}
          categories={categories}
          onSave={(id, data) => updateSubmission(id, data)}
        />
      )}

      {/* Private Mentor-Student Inquiry Thread Modal */}
      {activeChatSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            
            {/* Header */}
            <div className="p-4 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#273e1c] text-white font-bold flex items-center justify-center text-xs border border-[#a16b15]">
                  <MessageSquare className="w-4 h-4 text-[#dfa94b]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-white line-clamp-1">
                    Mentor Inquiry: {activeChatSubmission.activity_title}
                  </h3>
                  <p className="text-[11px] text-[#e2ebd9]">
                    Assigned Mentor: {currentUser.mentor_name || 'Dr. K. Ramana'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setChatSubmissionId(null)}
                className="p-1.5 rounded-xl bg-[#273e1c] text-gray-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#121214] min-h-[260px] max-h-[360px]">
              {(!activeChatSubmission.messages || activeChatSubmission.messages.length === 0) ? (
                <div className="text-center py-8 space-y-2">
                  <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No messages in this inquiry thread yet. Leave a note or clarification for your mentor below.
                  </p>
                </div>
              ) : (
                activeChatSubmission.messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-gray-400 mb-0.5">
                        {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#385529] dark:bg-emerald-700 text-white rounded-br-none'
                          : 'bg-[#faf9f5] dark:bg-[#22232a] text-gray-900 dark:text-gray-100 rounded-bl-none border border-[#e8e3d8] dark:border-[#2e3039]'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input or Closed Thread Banner */}
            {activeChatSubmission.status === 'approved' ? (
              <div className="p-4 bg-[#faf9f5] dark:bg-[#18191e] border-t border-[#e8e3d8] dark:border-[#282932] text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-[#a16b15] dark:text-amber-400 font-bold text-xs rounded-full border border-amber-200 dark:border-amber-900/40">
                  <span>🔒 Inquiry Thread Closed</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm mx-auto pt-0.5">
                  This submission has already been approved and finalized. For any further queries, please discuss directly during mentor counseling hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendChatReply} className="p-3 bg-[#faf9f5] dark:bg-[#18191e] border-t border-[#e8e3d8] dark:border-[#282932] flex items-center space-x-2">
                <input
                  type="text"
                  value={chatReply}
                  onChange={(e) => setChatReply(e.target.value)}
                  placeholder="Reply to mentor inquiry..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#385529] hover:bg-[#273e1c] text-white rounded-xl transition-colors cursor-pointer"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Interactive Quick Certificate Lightbox Modal */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            
            {/* Header */}
            <div className="p-4 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0">
              <div className="space-y-0.5">
                <h3 className="font-serif font-bold text-sm text-white line-clamp-1">
                  {selectedPreviewDoc.activity_title}
                </h3>
                <p className="text-xs text-[#e2ebd9] dark:text-gray-400">
                  {selectedPreviewDoc.issuing_organization} • Semester {selectedPreviewDoc.semester}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {selectedPreviewDoc.verification_url && (
                  <a
                    href={selectedPreviewDoc.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#273e1c] hover:bg-[#1f3216] dark:bg-[#2c2d36] text-white text-xs font-bold rounded-xl border border-[#a16b15] inline-flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#dfa94b]" />
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="p-1.5 rounded-xl bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Image / PDF Area */}
            <div className="flex-1 p-4 bg-[#faf9f5] dark:bg-[#121214] overflow-auto flex items-center justify-center min-h-[300px]">
              {selectedPreviewDoc.file_type?.includes('pdf') || selectedPreviewDoc.certificate_url?.endsWith('.pdf') ? (
                <div className="text-center p-8 space-y-3">
                  <BookOpen className="w-16 h-16 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedPreviewDoc.activity_title}</h4>
                  <a
                    href={selectedPreviewDoc.certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#385529] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <span>Open PDF Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={selectedPreviewDoc.certificate_url}
                  alt={selectedPreviewDoc.activity_title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white dark:bg-[#1a1b20] border-t border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Awarded Points: </span>
                <span className="font-extrabold text-[#385529] dark:text-emerald-400">
                  {selectedPreviewDoc.status === 'approved' ? `+${selectedPreviewDoc.awarded_points || selectedPreviewDoc.claimed_points} pts` : `${selectedPreviewDoc.claimed_points} pts (Pending)`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-gray-700 dark:text-gray-200 font-bold rounded-xl cursor-pointer"
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
