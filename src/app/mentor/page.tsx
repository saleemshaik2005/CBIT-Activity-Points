'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VerificationCard } from '@/components/mentor/VerificationCard';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function MentorQueuePage() {
  const { currentUser, submissions, categories, updateSubmissionStatus } = useApp();

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_mentor');
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');

  const handleApprove = (id: string, awardedPoints: number, remarks: string) => {
    updateSubmissionStatus(id, 'approved', remarks, awardedPoints);
  };

  const handleReject = (id: string, remarks: string) => {
    updateSubmissionStatus(id, 'rejected', remarks, 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#151f12] rounded-2xl p-6 border-t-4 border-[#a16b15] dark:border-[#fbbf24] border-x border-b border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#fbf5eb] dark:bg-[#1a2817] text-[#a16b15] dark:text-[#fbbf24] font-bold px-2.5 py-0.5 rounded-full border border-[#a16b15]/30">
              Faculty Mentor Portal
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-[#4ade80]">
            Certificate Verification Queue
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Review student submissions, inspect certificate proofs side-by-side, adjust points, and approve/reject.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-[#fbf5eb] dark:bg-[#1a2817] border border-[#a16b15]/30 rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-[#a16b15] dark:text-[#fbbf24]">{pendingSubmissions.length}</span>
            <p className="text-[10px] font-bold text-[#a16b15] dark:text-[#fbbf24] uppercase">Pending Review</p>
          </div>
          <div className="bg-[#eef5ec] dark:bg-[#1a2817] border border-[#385529]/30 rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-[#385529] dark:text-[#4ade80]">{approvedSubmissions.length}</span>
            <p className="text-[10px] font-bold text-[#385529] dark:text-[#4ade80] uppercase">Approved</p>
          </div>
        </div>
      </div>

      {/* Queue Items */}
      {pendingSubmissions.length === 0 ? (
        <div className="bg-white dark:bg-[#151f12] rounded-2xl p-12 text-center border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xs space-y-3">
          <div className="w-12 h-12 bg-[#eef5ec] dark:bg-[#1a2817] text-[#385529] dark:text-[#4ade80] rounded-full flex items-center justify-center mx-auto border border-[#385529]/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#385529] dark:text-[#4ade80]">All caught up!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            There are currently no pending certificate submissions awaiting mentor verification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-serif font-bold text-[#385529] dark:text-[#4ade80] uppercase tracking-wider">
              Pending Submissions ({pendingSubmissions.length})
            </h2>
          </div>

          <div className="space-y-4">
            {pendingSubmissions.map((sub) => {
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
