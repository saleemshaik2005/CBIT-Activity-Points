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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border-t-4 border-[#a16b15] border-x border-b border-[#e8e3d8] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#fbf5eb] text-[#a16b15] font-bold px-2.5 py-0.5 rounded-full border border-[#a16b15]/30">
              Faculty Mentor Portal
            </span>
            <span className="text-xs text-gray-500">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529]">
            Certificate Verification Queue
          </h1>
          <p className="text-xs text-gray-500">
            Review student submissions, inspect certificate proofs side-by-side, adjust points, and approve/reject.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-[#fbf5eb] border border-[#a16b15]/30 rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-[#a16b15]">{pendingSubmissions.length}</span>
            <p className="text-[10px] font-bold text-[#a16b15] uppercase">Pending Review</p>
          </div>
          <div className="bg-[#eef5ec] border border-[#385529]/30 rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-[#385529]">{approvedSubmissions.length}</span>
            <p className="text-[10px] font-bold text-[#385529] uppercase">Approved</p>
          </div>
        </div>
      </div>

      {/* Queue Items */}
      {pendingSubmissions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#e8e3d8] shadow-xs space-y-3">
          <div className="w-12 h-12 bg-[#eef5ec] text-[#385529] rounded-full flex items-center justify-center mx-auto border border-[#385529]/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#385529]">All caught up!</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            There are currently no pending certificate submissions awaiting mentor verification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-serif font-bold text-[#385529] uppercase tracking-wider">
              Pending Submissions ({pendingSubmissions.length})
            </h2>
            <span className="text-xs text-[#385529] font-medium">Powered by Institutional AI Document Intelligence</span>
          </div>

          <div className="space-y-4">
            {pendingSubmissions.map((sub) => (
              <VerificationCard
                key={sub.id}
                submission={sub}
                categories={categories}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
