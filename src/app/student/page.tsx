'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MARProgressBar } from '@/components/student/MARProgressBar';
import { CategoryBreakdown } from '@/components/student/CategoryBreakdown';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
import { StudentSubmission } from '@/types';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  Building,
  Award,
  Eye,
  BookOpen,
  FileText,
  X,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { currentUser, submissions, categories, settings } = useApp();
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<StudentSubmission | null>(null);

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const targetPoints = currentUser.is_lateral_entry
    ? settings.lateral_entry_target_points
    : settings.regular_target_points;

  const handleDownloadPDF = () => {
    generateOfficialCBITMARPDF(currentUser, mySubmissions, categories);
  };

  const recentSubmissions = mySubmissions.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Student Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 font-bold px-2.5 py-0.5 rounded-full border border-[#385529]/20 dark:border-[#2e3039]">
              Roll No: {currentUser.roll_number || '160122771045'}
            </span>
            <span className="text-xs bg-[#faf9f5] dark:bg-[#22232a] text-[#1c2718] dark:text-gray-300 font-semibold px-2.5 py-0.5 rounded-full border border-[#e8e3d8] dark:border-[#2e3039]">
              {currentUser.department}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            Welcome, {currentUser.full_name}!
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Faculty Counselor: <strong>{currentUser.mentor_name || 'Faculty Mentor (AI&DS)'}</strong> • Section: {currentUser.section || '2'} • Batch: {currentUser.batch_year || '2024-2028 (5th Semester)'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] shadow-xs hover:shadow transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
            <span>Download MAR Sheet (PDF)</span>
          </button>

          <Link
            href="/student/upload"
            className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] dark:border-[#383a45]"
          >
            <Sparkles className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
            <span>AI Upload Certificate</span>
          </Link>
        </div>
      </div>

      {/* MAR Points Progress Meter */}
      <MARProgressBar
        submissions={mySubmissions}
        categories={categories}
        targetPoints={targetPoints}
        isLateralEntry={currentUser.is_lateral_entry}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Two Column Layout: Recent Submissions & Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Submissions Feed */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#385529] dark:text-gray-300" />
              <h3 className="text-base font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wide">
                Recent Activity Submissions
              </h3>
            </div>
            <Link
              href="/student/history"
              className="text-xs font-bold text-[#a16b15] dark:text-amber-400 hover:text-[#385529] dark:hover:text-white flex items-center gap-1"
            >
              <span>View All ({mySubmissions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-[#e8e3d8] dark:border-[#2e3039] rounded-xl space-y-3 bg-[#faf9f5] dark:bg-[#121214]">
              <Sparkles className="w-8 h-8 text-[#a16b15] dark:text-amber-400 mx-auto" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">No certificates uploaded yet.</p>
              <Link
                href="/student/upload"
                className="inline-block text-xs font-bold text-[#385529] dark:text-emerald-400 hover:underline"
              >
                Upload your first certificate now &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {recentSubmissions.map((sub) => {
                const cat = categories.find((c) => c.id === sub.category_id);
                const isPdf = sub.file_type?.includes('pdf') || sub.certificate_url?.endsWith('.pdf');

                return (
                  <div key={sub.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
                    
                    {/* Left: Thumbnail Preview & Meta */}
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      
                      {/* Document Preview Thumbnail */}
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewDoc(sub)}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#faf9f5] dark:bg-[#121214] border border-[#e8e3d8] dark:border-[#2e3039] flex-shrink-0 flex items-center justify-center cursor-pointer relative shadow-2xs hover:border-[#385529] dark:hover:border-emerald-500 transition-all group/thumb"
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
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                          />
                        ) : (
                          <FileText className="w-6 h-6 text-gray-400" />
                        )}
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </button>

                      {/* Details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[10px] bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 font-semibold px-2 py-0.5 rounded border border-[#e8e3d8] dark:border-[#2e3039]">
                            Sem {sub.semester}
                          </span>
                          <span className="text-[10px] bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-transparent dark:border-[#2e3039]">
                            Cat #{cat?.sno || 1}
                          </span>
                          {sub.credential_id && (
                            <span className="text-[10px] bg-[#f0f4f8] dark:bg-[#121214] text-[#3b566e] dark:text-gray-400 font-mono px-1.5 py-0.5 rounded border border-[#3b566e]/20 dark:border-[#2e3039] hidden sm:inline-block truncate max-w-[130px]">
                              ID: {sub.credential_id}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[#1c2718] dark:text-gray-100 line-clamp-1">
                          {sub.activity_title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {sub.issuing_organization} • {sub.event_date}
                        </p>
                      </div>
                    </div>

                    {/* Right: Points & Status */}
                    <div className="text-right space-y-1 flex-shrink-0">
                      <span className="text-xs font-extrabold text-[#385529] dark:text-emerald-400 block">
                        {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points} pts` : `${sub.claimed_points} pts`}
                      </span>
                      <div>
                        {sub.status === 'approved' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-[#385529]/20 dark:border-[#2e3039]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                          </span>
                        )}
                        {sub.status === 'pending_mentor' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] dark:text-amber-400 bg-[#fbf5eb] dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
                            <Clock className="w-3 h-3 mr-1" /> Under Review
                          </span>
                        )}
                        {sub.status === 'rejected' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#a71a1b] dark:text-rose-400 bg-[#fdf2f2] dark:bg-[#22232a] px-2 py-0.5 rounded-full border border-[#a71a1b]/20 dark:border-[#2e3039]">
                            <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Upload Action Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-white rounded-2xl p-6 shadow-xs border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-2.5 bg-[#eef5ec] dark:bg-[#22232a] rounded-xl w-fit border border-[#385529]/20 dark:border-[#2e3039]">
              <Sparkles className="w-6 h-6 text-[#385529] dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#385529] dark:text-white">Have a new certificate?</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Upload any certificate image or PDF. Our AI Document Intelligence will instantly extract the event name, date, organization, and calculate your activity points!
            </p>
          </div>

          <Link
            href="/student/upload"
            className="w-full text-center py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15] dark:border-[#383a45]"
          >
            <span>Launch AI Scanner & Upload</span>
            <ArrowRight className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
          </Link>
        </div>

      </div>

      {/* 24 Activity Categories & Cap Tracker */}
      <CategoryBreakdown categories={categories} submissions={mySubmissions} />

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
