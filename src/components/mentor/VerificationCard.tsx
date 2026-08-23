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
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      
      {/* Student & Category Header Bar */}
      <div className="bg-gray-50/80 px-5 py-3.5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
            {submission.student_name ? submission.student_name.charAt(0) : 'S'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {submission.student_name || 'Student'}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Roll: <strong>{submission.student_roll_no || '160122733045'}</strong></span>
              <span>•</span>
              <span>Semester {submission.semester}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200">
            Category #{cat?.sno || 1}: {cat?.sub_type || 'General'}
          </span>
          <span className="text-xs bg-amber-50 text-amber-800 font-extrabold px-2.5 py-1 rounded-lg border border-amber-200">
            Claimed: {submission.claimed_points} pts
          </span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Certificate Preview */}
        <div className="lg:col-span-5 space-y-2">
          <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-[200px] max-h-[260px]">
            {submission.file_type?.includes('pdf') ? (
              <div className="text-center p-4">
                <BookOpen className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">
                  {submission.activity_title}
                </p>
                <a
                  href={submission.certificate_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center text-xs text-blue-600 font-semibold hover:underline"
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
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
            <a
              href={submission.certificate_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> Full View
            </a>
          </div>
        </div>

        {/* Submitted Metadata & Point Verification */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              {submission.activity_title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
              <div className="flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span>Issuer: <strong>{submission.issuing_organization}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Date: <strong>{submission.event_date}</strong></span>
              </div>
            </div>

            {/* AI Extraction Confidence Indicator */}
            {submission.ai_extracted_data && (
              <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Document Verification
                  </span>
                  <span className="text-[10px] bg-blue-200/70 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                    Score: {Math.round((submission.ai_extracted_data.confidenceScore || 0.9) * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {submission.ai_extracted_data.summary}
                </p>
              </div>
            )}
          </div>

          {/* Action Box: Mentor Input */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-gray-700">Award Points:</label>
                <input
                  type="number"
                  min={1}
                  max={cat?.max_points_allowed || 40}
                  value={adjustedPoints}
                  onChange={(e) => setAdjustedPoints(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs font-extrabold rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-center text-blue-700 bg-white"
                />
                <span className="text-[10px] text-gray-500">
                  (Category cap: {cat?.max_points_allowed} pts)
                </span>
              </div>
            </div>

            {/* Remarks / Feedback */}
            <div>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional mentor feedback or verification remark..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectBox(!showRejectBox)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve ({adjustedPoints} Pts)</span>
              </button>
            </div>

            {showRejectBox && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 animate-in fade-in">
                <p className="text-xs font-bold text-red-800">
                  Confirm Rejection: Reason for student correction
                </p>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Explain why this was rejected (e.g. invalid date, wrong category, illegible certificate)..."
                  className="w-full text-xs p-2 rounded border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(false)}
                    className="text-xs px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="text-xs px-3 py-1 bg-red-600 text-white font-bold rounded hover:bg-red-700"
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
