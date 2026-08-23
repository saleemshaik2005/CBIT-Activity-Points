'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VerificationCard } from '@/components/mentor/VerificationCard';
import { CheckCircle, Clock, Users, ShieldCheck, Sparkles, Award } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Faculty Mentor Portal
            </span>
            <span className="text-xs text-gray-500">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Certificate Verification Queue
          </h1>
          <p className="text-xs text-gray-500">
            Review student submissions, inspect certificate proofs side-by-side, adjust points, and approve/reject.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-amber-800">{pendingSubmissions.length}</span>
            <p className="text-[10px] font-bold text-amber-700 uppercase">Pending Review</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
            <span className="text-xl font-extrabold text-emerald-800">{approvedSubmissions.length}</span>
            <p className="text-[10px] font-bold text-emerald-700 uppercase">Approved</p>
          </div>
        </div>
      </div>

      {/* Queue Items */}
      {pendingSubmissions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">All caught up!</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            There are currently no pending certificate submissions awaiting mentor verification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Pending Submissions ({pendingSubmissions.length})
            </h2>
            <span className="text-xs text-gray-400">Powered by Gemini AI Document Verification</span>
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
