'use client';

import React from 'react';
import { calculateStudentMARProgress } from '@/lib/mar-constants';
import { ActivityCategory, StudentSubmission } from '@/types';
import { Award, CheckCircle2, Clock, AlertTriangle, Download } from 'lucide-react';

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
    <div className="bg-white dark:bg-[#161e2e] rounded-2xl p-6 shadow-xs border-t-4 border-[#385529] dark:border-emerald-500 border-x border-b border-[#e8e3d8] dark:border-[#293548] relative overflow-hidden transition-colors">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Overall Progress Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-[#385529]/20 dark:border-emerald-800/40 flex items-center gap-1.5 font-serif">
              <Award className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
              {isLateralEntry ? 'Lateral Entry' : '4-Year B.Tech'} MAR Requirement
            </span>
            {progress.isCompleted ? (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Requirement Satisfied
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#a16b15] dark:text-amber-300 bg-[#fbf5eb] dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-[#a16b15]/30 dark:border-amber-800/40 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {progress.pointsRemaining} Points Remaining
              </span>
            )}
          </div>

          <div className="flex items-baseline space-x-3">
            <h2 className="text-4xl font-serif font-extrabold text-[#385529] dark:text-white tracking-tight">
              {progress.totalApprovedPoints}
              <span className="text-xl font-normal text-gray-500 dark:text-gray-400 font-sans"> / {targetPoints} pts</span>
            </h2>
            <span className="text-base font-bold text-[#a16b15] dark:text-emerald-400">
              ({progress.percentage}% Completed)
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg">
            {progress.isCompleted
              ? 'Congratulations! You have satisfied the mandatory activity points graduation requirement.'
              : `Earn at least ${targetPoints} verified activity points across 8 semesters to qualify for degree award.`}
          </p>

          {/* Points Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center space-x-1.5 text-xs text-[#385529] dark:text-emerald-400 bg-[#eef5ec] dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-[#385529]/20 dark:border-emerald-800/40 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#385529] dark:text-emerald-400" />
              <span><strong>{progress.totalApprovedPoints}</strong> Approved</span>
            </div>
            {progress.totalPendingPoints > 0 && (
              <div className="flex items-center space-x-1.5 text-xs text-[#a16b15] dark:text-amber-400 bg-[#fbf5eb] dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-[#a16b15]/30 dark:border-amber-800/40 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                <span><strong>{progress.totalPendingPoints}</strong> Pending Mentor</span>
              </div>
            )}
            {progress.totalUncappedApprovedPoints > progress.totalApprovedPoints && (
              <div className="flex items-center space-x-1.5 text-xs text-[#3b566e] dark:text-sky-300 bg-[#f0f4f8] dark:bg-sky-950/40 px-2.5 py-1 rounded-md border border-[#3b566e]/20 dark:border-sky-800/40" title="Points beyond category maximum allowed are automatically capped according to CBIT rules">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{progress.totalUncappedApprovedPoints - progress.totalApprovedPoints} pts capped</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Progress Bar & PDF Download */}
        <div className="flex flex-col items-center md:items-end justify-center space-y-3">
          <div className="w-full md:w-56 bg-[#e8e3d8] dark:bg-[#0f172a] h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-[#385529] via-[#4d7237] to-[#a16b15] dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, progress.percentage)}%` }}
            />
          </div>

          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-white dark:bg-[#0f172a] hover:bg-[#faf7f2] dark:hover:bg-[#1e293b] text-[#385529] dark:text-emerald-400 font-bold px-4 py-2.5 rounded-xl border border-[#e8e3d8] dark:border-[#334155] shadow-xs hover:shadow transition-all text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
              <span>Download Official MAR Sheet (PDF)</span>
            </button>
          )}
        </div>

      </div>

      {/* Semester Breakdown Grid */}
      <div className="mt-6 pt-5 border-t border-[#e8e3d8] dark:border-[#293548]">
        <h4 className="text-xs font-serif font-bold text-[#385529] dark:text-emerald-400 uppercase tracking-wider mb-3">
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
                    ? 'bg-[#eef5ec] dark:bg-emerald-950/40 border-[#385529]/30 dark:border-emerald-700 text-[#385529] dark:text-emerald-300 font-semibold shadow-2xs'
                    : 'bg-[#faf9f5] dark:bg-[#0f172a] border-[#e8e3d8] dark:border-[#293548] text-gray-400 dark:text-gray-500'
                }`}
              >
                <div className="text-[10px] uppercase font-serif font-bold tracking-tight">Sem {sem}</div>
                <div className="text-sm font-extrabold mt-0.5">{pts > 0 ? `${pts} pts` : '-'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
