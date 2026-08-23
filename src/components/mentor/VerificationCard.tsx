'use client';

import React, { useState } from 'react';
import { StudentSubmission, ActivityCategory } from '@/types';
import {
  Check,
  X,
  Eye,
  Calendar,
  Building,
  Award,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface Props {
  submission: StudentSubmission;
  categories: ActivityCategory[];
  onApprove: (id: string, awardedPoints: number, remarks: string) => void;
  onReject: (id: string, remarks: string) => void;
}

export const VerificationCard: React.FC<Props> = ({
  submission,
  categories,
  onApprove,
  onReject,
}) => {
  const [remarks, setRemarks] = useState('');
  const [adjustedPoints, setAdjustedPoints] = useState<number>(submission.claimed_points);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [showFullDoc, setShowFullDoc] = useState(false);

  const cat = categories.find((c) => c.id === submission.category_id);

  const handleApprove = () => {
    onApprove(submission.id, adjustedPoints, remarks || 'Verified and approved by Mentor.');
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      alert('Please provide a reason or remarks for rejection so the student can correct it.');
      return;
    }
    onReject(submission.id, remarks);
    setShowRejectBox(false);
  };

  return (
    <div className="bg-white dark:bg-[#161e2e] rounded-2xl border-t-4 border-[#a16b15] dark:border-emerald-500 border-x border-b border-[#e8e3d8] dark:border-[#293548] shadow-xs overflow-hidden hover:shadow-md transition-all">
      
      {/* Student & Category Header Bar */}
      <div className="bg-[#faf9f5] dark:bg-[#0f172a] px-5 py-3.5 border-b border-[#e8e3d8] dark:border-[#293548] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#385529] dark:bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
            {submission.student_name ? submission.student_name.charAt(0) : 'S'}
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-[#1c2718] dark:text-white">
              {submission.student_name || 'Student'}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Roll: <strong>{submission.student_roll_no || '160122771045'}</strong></span>
              <span>•</span>
              <span>Semester {submission.semester}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-[#eef5ec] dark:bg-emerald-950/50 text-[#385529] dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-[#385529]/20 dark:border-emerald-800/40">
            Category #{cat?.sno || 1}: {cat?.sub_type || 'General'}
          </span>
          <span className="text-xs bg-[#fbf5eb] dark:bg-amber-950/40 text-[#a16b15] dark:text-amber-300 font-extrabold px-2.5 py-1 rounded-lg border border-[#a16b15]/30 dark:border-amber-800/40">
            Claimed: {submission.claimed_points} pts
          </span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Certificate Preview */}
        <div className="lg:col-span-5 space-y-2">
          <div className="relative border border-[#e8e3d8] dark:border-[#293548] rounded-xl overflow-hidden bg-[#faf9f5] dark:bg-[#0f172a] flex items-center justify-center min-h-[200px] max-h-[260px]">
            {submission.file_type?.includes('pdf') ? (
              <div className="text-center p-4">
                <BookOpen className="w-10 h-10 text-[#a71a1b] dark:text-red-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                  {submission.activity_title}
                </p>
                <a
                  href={submission.certificate_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center text-xs text-[#385529] dark:text-emerald-400 font-bold hover:underline"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Open PDF Document
                </a>
              </div>
            ) : (
              <img
                src={submission.certificate_url}
                alt="Certificate"
                className="w-full h-auto max-h-[250px] object-contain cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setShowFullDoc(!showFullDoc)}
              />
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
            <a
              href={submission.certificate_url}
              target="_blank"
              rel="noreferrer"
              className="text-[#385529] dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> Full View
            </a>
          </div>
        </div>

        {/* Submitted Metadata & Point Verification */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
          
          <div className="space-y-2">
            <h3 className="text-base font-serif font-bold text-[#1c2718] dark:text-white leading-snug">
              {submission.activity_title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 pt-1">
              <div className="flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                <span>Issuer: <strong>{submission.issuing_organization}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                <span>Date: <strong>{submission.event_date}</strong></span>
              </div>
            </div>

            {/* AI Extraction Indicator */}
            {submission.ai_extracted_data && (
              <div className="p-2.5 rounded-xl bg-[#eef5ec]/70 dark:bg-emerald-950/30 border border-[#385529]/20 dark:border-emerald-800/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#385529] dark:text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" /> AI Document Verification
                  </span>
                  <span className="text-[10px] bg-[#fbf5eb] dark:bg-amber-950/50 text-[#a16b15] dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border border-[#a16b15]/30">
                    Match: {Math.round((submission.ai_extracted_data.confidenceScore || 0.9) * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  {submission.ai_extracted_data.summary}
                </p>
              </div>
            )}
          </div>

          {/* Action Box: Mentor Input */}
          <div className="pt-3 border-t border-[#e8e3d8] dark:border-[#293548] space-y-3">
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-[#1c2718] dark:text-gray-200">Award Points:</label>
                <input
                  type="number"
                  min={1}
                  max={cat?.max_points_allowed || 40}
                  value={adjustedPoints}
                  onChange={(e) => setAdjustedPoints(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs font-extrabold rounded-lg border border-[#e8e3d8] dark:border-[#334155] focus:ring-2 focus:ring-[#385529] dark:focus:ring-emerald-500 text-center text-[#385529] dark:text-emerald-300 bg-white dark:bg-[#0f172a]"
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  (Category cap: {cat?.max_points_allowed} pts)
                </span>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional mentor feedback or verification remarks..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-emerald-500 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectBox(!showRejectBox)}
                className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 rounded-xl bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve ({adjustedPoints} Pts)</span>
              </button>
            </div>

            {showRejectBox && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl space-y-2 animate-in fade-in">
                <p className="text-xs font-bold text-red-700 dark:text-red-300">
                  Confirm Rejection: Reason for student correction
                </p>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Explain why this certificate is rejected (e.g. illegible certificate, wrong category)..."
                  className="w-full text-xs p-2 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(false)}
                    className="text-xs px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
