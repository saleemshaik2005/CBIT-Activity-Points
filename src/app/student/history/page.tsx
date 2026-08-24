'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
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
} from 'lucide-react';

export default function StudentHistoryPage() {
  const { currentUser, submissions, categories, deleteSubmission } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<StudentSubmission | null>(null);

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const filtered = mySubmissions.filter((sub) => {
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch =
      sub.activity_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.issuing_organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDownloadPDF = () => {
    generateOfficialCBITMARPDF(currentUser, mySubmissions, categories);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">Activity Submission Logs</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Complete record of your submitted certificates, mentor verification status, and feedback remarks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="flex items-center space-x-2">
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
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100"
          />
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

                {/* Right: Points & Status */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-[#2c2d36] flex-shrink-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#385529] dark:text-emerald-400">
                      {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points}` : sub.claimed_points} pts
                    </span>
                    <p className="text-[10px] text-gray-400">
                      {sub.status === 'approved' ? 'Awarded' : 'Claimed'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
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
                <p className="text-[11px] text-[#e2ebd9] dark:text-gray-400">
                  {selectedPreviewDoc.issuing_organization} • {selectedPreviewDoc.event_date}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={selectedPreviewDoc.certificate_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="p-1.5 rounded-lg bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
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
