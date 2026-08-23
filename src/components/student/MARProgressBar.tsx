'use client';

import React from 'react';
import { calculateStudentMARProgress } from '@/lib/mar-constants';
import { ActivityCategory, StudentSubmission } from '@/types';
import { Award, CheckCircle2, Clock, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  submissions: StudentSubmission[];
  categories: ActivityCategory[];
  targetPoints: number;
  isLateralEntry: boolean;
  onDownloadPDF?: () => void;
}

export const MARProgressBar: React.FC<Props> = ({
  submissions,
  categories,
  targetPoints,
  isLateralEntry,
  onDownloadPDF,
}) => {
  const progress = calculateStudentMARProgress(submissions, categories, targetPoints);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-sm border border-blue-100 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Overall Progress Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {isLateralEntry ? 'Lateral Entry (Diploma)' : '4-Year B.Tech'} MAR Goal
            </span>
            {progress.isCompleted ? (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Requirement Satisfied
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {progress.pointsRemaining} Points Needed
              </span>
            )}
          </div>

          <div className="flex items-baseline space-x-3">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {progress.totalApprovedPoints}
              <span className="text-xl font-normal text-gray-500"> / {targetPoints} pts</span>
            </h2>
            <span className="text-base font-bold text-blue-600">
              ({progress.percentage}% Complete)
            </span>
          </div>

          <p className="text-sm text-gray-600 max-w-lg">
            {progress.isCompleted
              ? 'Congratulations! You have satisfied the mandatory 60 activity points graduation requirement.'
              : `Earn at least ${targetPoints} verified activity points across 8 semesters to qualify for degree award.`}
          </p>

          {/* Points Status Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span><strong>{progress.totalApprovedPoints}</strong> Approved</span>
            </div>
            {progress.totalPendingPoints > 0 && (
              <div className="flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span><strong>{progress.totalPendingPoints}</strong> Pending Mentor</span>
              </div>
            )}
            {progress.totalUncappedApprovedPoints > progress.totalApprovedPoints && (
              <div className="flex items-center space-x-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200" title="Points beyond category maximum allowed are automatically capped according to CBIT rules">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{progress.totalUncappedApprovedPoints - progress.totalApprovedPoints} pts capped</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Progress Meter & Official PDF Download */}
        <div className="flex flex-col items-center md:items-end justify-center space-y-3">
          <div className="w-full md:w-56 bg-gray-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, progress.percentage)}%` }}
            />
          </div>

          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-blue-700 font-semibold px-4 py-2.5 rounded-xl border border-blue-200 shadow-sm hover:shadow transition-all text-xs"
            >
              <span>Download Official MAR Sheet (PDF)</span>
            </button>
          )}
        </div>

      </div>

      {/* Semester Breakdown Strip */}
      <div className="mt-6 pt-5 border-t border-blue-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Semester-Wise Activity Points Earned (Sem I to VIII)
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const pts = progress.semesterBreakdown[sem] || 0;
            return (
              <div
                key={sem}
                className={`p-2 rounded-lg text-center border transition-all ${
                  pts > 0
                    ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold shadow-2xs'
                    : 'bg-gray-50/60 border-gray-100 text-gray-400'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-tight">Sem {sem}</div>
                <div className="text-sm font-extrabold mt-0.5">{pts > 0 ? `${pts} pts` : '-'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
