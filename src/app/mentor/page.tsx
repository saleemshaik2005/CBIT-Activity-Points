'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { VerificationCard } from '@/components/mentor/VerificationCard';
import {
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Briefcase,
  Sparkles,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCheck,
  AlertTriangle,
  Clock,
  Download,
} from 'lucide-react';
import { StudentSubmission } from '@/types';

export default function MentorQueuePage() {
  const { currentUser, submissions, categories, updateSubmissionStatus, bulkApproveSubmissions } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'nptel' | 'internship' | 'fest'>('all');
  const [queueTab, setQueueTab] = useState<'all' | 'needs_inspection' | 'clean' | 'today'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_mentor');
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');

  // Check if a submission has any tamper signs or low authenticity score
  const isSubmissionSuspicious = (sub: StudentSubmission) => {
    if (!sub.ai_tamper_analysis) return false;
    const t = sub.ai_tamper_analysis;
    if (t.isSuspicious) return true;
    if (t.riskPercentage && t.riskPercentage > 35) return true;
    if (t.authenticityScore && t.authenticityScore < 70) return true;
    if (t.fontConsistency === 'Mismatched' || t.fontConsistency === 'Flagged' || t.manipulationRisk === 'High') return true;
    return false;
  };

  const isTodaySubmission = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      return (
        d.toDateString() === now.toDateString() ||
        now.getTime() - d.getTime() < 24 * 60 * 60 * 1000
      );
    } catch {
      return false;
    }
  };

  const cleanPendingSubmissions = pendingSubmissions.filter((s) => !isSubmissionSuspicious(s));
  const needsInspectionSubmissions = pendingSubmissions.filter((s) => isSubmissionSuspicious(s));
  const todayPendingSubmissions = pendingSubmissions.filter((s) => isTodaySubmission(s.created_at));

  const handleApprove = (id: string, awardedPoints: number, remarks: string) => {
    updateSubmissionStatus(id, 'approved', remarks, awardedPoints);
  };

  const handleReject = (id: string, remarks: string) => {
    updateSubmissionStatus(id, 'rejected', remarks, 0);
  };

  const handleBulkApproveClean = () => {
    if (cleanPendingSubmissions.length === 0) return;
    const ids = cleanPendingSubmissions.map((s) => s.id);
    bulkApproveSubmissions(
      ids,
      'Bulk approved by faculty mentor after AI tamper verification (Passed Authenticity Check)'
    );
    setBulkActionSuccess(`Successfully bulk-approved ${ids.length} authentic certificates!`);
    setTimeout(() => setBulkActionSuccess(null), 5000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Submission ID',
      'Roll Number',
      'Student Name',
      'Section',
      'Activity Title',
      'Category Code',
      'Issuing Organization',
      'Event Date',
      'Semester',
      'Claimed Points',
      'AI Authenticity Score (%)',
      'AI Tamper Risk (%)',
      'Inspection Required',
      'Credential ID',
      'Submission Date',
      'Current Status',
    ].join(',');

    const rows = filteredQueue.map((s) => {
      const isSusp = isSubmissionSuspicious(s);
      const authScore = s.ai_tamper_analysis?.authenticityScore ?? 90;
      const riskScore = s.ai_tamper_analysis?.riskPercentage ?? 5;
      return [
        `"${s.id}"`,
        `"${s.student_roll_no || ''}"`,
        `"${s.student_name || ''}"`,
        `"Sec ${s.student_section || ''}"`,
        `"${(s.activity_title || '').replace(/"/g, '""')}"`,
        `"${s.category_id}"`,
        `"${(s.issuing_organization || '').replace(/"/g, '""')}"`,
        `"${s.event_date}"`,
        s.semester,
        s.claimed_points,
        authScore,
        riskScore,
        isSusp ? 'YES - SUSPICIOUS' : 'NO - CLEAN',
        `"${s.credential_id || ''}"`,
        `"${new Date(s.created_at).toLocaleDateString()}"`,
        `"${s.status}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `CBIT_Mentor_Verification_Queue_${currentUser.department.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQueue = pendingSubmissions.filter((sub) => {
    // Queue tab filter
    if (queueTab === 'needs_inspection' && !isSubmissionSuspicious(sub)) return false;
    if (queueTab === 'clean' && isSubmissionSuspicious(sub)) return false;
    if (queueTab === 'today' && !isTodaySubmission(sub.created_at)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = sub.activity_title.toLowerCase().includes(q);
      const matchOrg = sub.issuing_organization.toLowerCase().includes(q);
      const matchStudent = (sub.student_name || '').toLowerCase().includes(q);
      const matchRoll = (sub.student_roll_no || '').toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchStudent && !matchRoll) return false;
    }

    // Category filter
    if (activeCategoryFilter === 'nptel') {
      return (
        sub.category_id === 1 ||
        sub.category_id === 2 ||
        sub.activity_title.toLowerCase().includes('nptel') ||
        sub.activity_title.toLowerCase().includes('mooc')
      );
    }
    if (activeCategoryFilter === 'internship') {
      return (
        sub.category_id === 13 ||
        sub.activity_title.toLowerCase().includes('internship') ||
        sub.activity_title.toLowerCase().includes('training')
      );
    }
    if (activeCategoryFilter === 'fest') {
      return (
        sub.category_id === 3 ||
        sub.category_id === 4 ||
        sub.activity_title.toLowerCase().includes('fest') ||
        sub.activity_title.toLowerCase().includes('hackathon')
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
              Faculty Mentor Portal
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            Certificate Verification Queue
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Review submissions, inspect certificates with AI tamper detection, perform one-click bulk approvals for authentic proofs, or export queue data.
          </p>
        </div>

        {/* Action Buttons & Quick Stats */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredQueue.length === 0}
            className="px-3 py-2 bg-white dark:bg-[#22232a] hover:bg-gray-50 dark:hover:bg-[#2c2d36] text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-[#2e3039] flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Export pending certificates to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#385529] dark:text-emerald-400" />
            <span>Export CSV ({filteredQueue.length})</span>
          </button>

          {cleanPendingSubmissions.length > 0 && (
            <button
              type="button"
              onClick={handleBulkApproveClean}
              className="px-4 py-2 bg-[#385529] hover:bg-[#2e4622] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Bulk approve all untampered certificates"
            >
              <CheckCheck className="w-4 h-4 text-emerald-300" />
              <span>Bulk Approve Clean ({cleanPendingSubmissions.length})</span>
            </button>
          )}

          <div className="bg-[#fbf5eb] dark:bg-[#22232a] border border-[#a16b15]/30 dark:border-[#2e3039] rounded-xl px-3 py-1.5 text-center">
            <span className="text-base font-extrabold text-[#a16b15] dark:text-amber-400">{pendingSubmissions.length}</span>
            <p className="text-[9px] font-bold text-[#a16b15] dark:text-amber-400 uppercase">Pending</p>
          </div>
          <div className="bg-[#eef5ec] dark:bg-[#22232a] border border-[#385529]/30 dark:border-[#2e3039] rounded-xl px-3 py-1.5 text-center">
            <span className="text-base font-extrabold text-[#385529] dark:text-gray-200">{approvedSubmissions.length}</span>
            <p className="text-[9px] font-bold text-[#385529] dark:text-gray-300 uppercase">Approved</p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {bulkActionSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{bulkActionSuccess}</span>
          </div>
        </div>
      )}

      {/* Tamper Alert Notice */}
      {needsInspectionSubmissions.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 rounded-2xl text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {needsInspectionSubmissions.length} Certificate(s) Flagged for Inspection
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                AI tamper analysis detected font inconsistencies, image manipulation, or low authenticity scores. These are isolated from bulk actions and require your manual review.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQueueTab('needs_inspection')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
          >
            Inspect Flagged ({needsInspectionSubmissions.length})
          </button>
        </div>
      )}

      {/* Primary Queue Tabs (All, Needs Inspection, Clean, Today) */}
      <div className="bg-white dark:bg-[#1a1b20] p-3 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setQueueTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              queueTab === 'all'
                ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-[#22232a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2d36]'
            }`}
          >
            All Pending ({pendingSubmissions.length})
          </button>

          <button
            type="button"
            onClick={() => setQueueTab('needs_inspection')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              queueTab === 'needs_inspection'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Needs Inspection ({needsInspectionSubmissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setQueueTab('clean')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              queueTab === 'clean'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authentic & Clean ({cleanPendingSubmissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setQueueTab('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              queueTab === 'today'
                ? 'bg-[#a16b15] dark:bg-amber-600 text-white shadow-2xs'
                : 'bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 hover:bg-[#f3ead9] dark:hover:bg-[#2c2d36] border border-[#a16b15]/30 dark:border-[#2e3039]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today&apos;s Queue ({todayPendingSubmissions.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student, roll, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
          />
        </div>
      </div>

      {/* Secondary Category Filters */}
      {pendingSubmissions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-[#385529] text-white'
                : 'bg-white dark:bg-[#1a1b20] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            All Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('nptel')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeCategoryFilter === 'nptel'
                ? 'bg-[#385529] text-white'
                : 'bg-white dark:bg-[#1a1b20] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <BookOpen className="w-3 h-3 text-[#dfa94b]" />
            <span>NPTEL / MOOCs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('internship')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeCategoryFilter === 'internship'
                ? 'bg-[#385529] text-white'
                : 'bg-white dark:bg-[#1a1b20] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <Briefcase className="w-3 h-3 text-[#385529] dark:text-emerald-400" />
            <span>Internships</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('fest')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeCategoryFilter === 'fest'
                ? 'bg-[#385529] text-white'
                : 'bg-white dark:bg-[#1a1b20] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#a16b15]" />
            <span>Fests & Hackathons</span>
          </button>
        </div>
      )}

      {/* Queue Items */}
      {pendingSubmissions.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-12 text-center border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
          <div className="w-12 h-12 bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 rounded-full flex items-center justify-center mx-auto border border-[#385529]/20 dark:border-[#2e3039]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#385529] dark:text-gray-200">All caught up!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            There are currently no pending certificate submissions awaiting mentor verification.
          </p>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-8 text-center border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No pending submissions match the selected category filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider">
              Pending Submissions ({filteredQueue.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredQueue.map((sub) => {
              const cat = categories.find((c) => c.id === sub.category_id);
              return (
                <VerificationCard
                  key={sub.id}
                  submission={sub}
                  categories={categories}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
