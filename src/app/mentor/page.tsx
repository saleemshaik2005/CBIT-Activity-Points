'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { VerificationCard } from '@/components/mentor/VerificationCard';
import { CheckCircle, ShieldCheck, BookOpen, Briefcase, Sparkles, Search, Filter } from 'lucide-react';

export default function MentorQueuePage() {
  const { currentUser, submissions, categories, updateSubmissionStatus } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'nptel' | 'internship' | 'fest'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_mentor');
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');

  const handleApprove = (id: string, awardedPoints: number, remarks: string) => {
    updateSubmissionStatus(id, 'approved', remarks, awardedPoints);
  };

  const handleReject = (id: string, remarks: string) => {
    updateSubmissionStatus(id, 'rejected', remarks, 0);
  };

  const filteredQueue = pendingSubmissions.filter((sub) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = sub.activity_title.toLowerCase().includes(q);
      const matchOrg = sub.issuing_organization.toLowerCase().includes(q);
      const matchStudent = (sub.student_name || '').toLowerCase().includes(q);
      const matchRoll = (sub.student_roll_no || '').toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchStudent && !matchRoll) return false;
    }

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
            Review student submissions, inspect certificate proofs side-by-side, adjust points, and approve/reject.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-[#fbf5eb] dark:bg-[#22232a] border border-[#a16b15]/30 dark:border-[#2e3039] rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-[#a16b15] dark:text-amber-400">{pendingSubmissions.length}</span>
            <p className="text-[10px] font-bold text-[#a16b15] dark:text-amber-400 uppercase">Pending Review</p>
          </div>
          <div className="bg-[#eef5ec] dark:bg-[#22232a] border border-[#385529]/30 dark:border-[#2e3039] rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-[#385529] dark:text-gray-200">{approvedSubmissions.length}</span>
            <p className="text-[10px] font-bold text-[#385529] dark:text-gray-300 uppercase">Approved</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Strip */}
      {pendingSubmissions.length > 0 && (
        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
              }`}
            >
              All Pending ({pendingSubmissions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('nptel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategoryFilter === 'nptel'
                  ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#dfa94b]" />
              <span>NPTEL / MOOCs</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('internship')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategoryFilter === 'internship'
                  ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#385529] dark:text-emerald-400" />
              <span>Internships</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('fest')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategoryFilter === 'fest'
                  ? 'bg-[#385529] dark:bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a16b15]" />
              <span>Fests & Hackathons</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
            />
          </div>
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
