'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { calculateStudentMARProgress, CBIT_24_CATEGORIES } from '@/lib/mar-constants';
import { Award, Clock, AlertCircle, TrendingUp, CheckCircle2, Lightbulb, Compass } from 'lucide-react';

export function StudentAnalytics() {
  const { currentUser, submissions, categories, settings } = useApp();

  const mySubmissions = (submissions || []).filter((s) => s.student_id === currentUser.id);

  const target = currentUser.is_lateral_entry
    ? settings.lateral_entry_target_points
    : settings.regular_target_points;

  const maxAllowed = currentUser.is_lateral_entry
    ? settings.lateral_entry_max_points
    : settings.regular_max_points;

  const progress = calculateStudentMARProgress(mySubmissions, categories, target, maxAllowed);

  // Rejected count
  const rejectedCount = mySubmissions.filter((s) => s.status === 'rejected').length;

  // On-track assessment based on current semester (default sem 5 for current 3rd years)
  const currentSemester = 5;
  const expectedPointsPerSem = target / (currentUser.is_lateral_entry ? 6 : 8);
  const expectedTargetAtCurrentSem = Math.round(expectedPointsPerSem * currentSemester);

  let onTrackLabel = 'On Track';
  let onTrackColor = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';

  if (progress.totalApprovedPoints >= target) {
    onTrackLabel = 'Graduation Target Met 🎉';
    onTrackColor = 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700';
  } else if (progress.totalApprovedPoints >= expectedTargetAtCurrentSem) {
    onTrackLabel = 'Ahead of Schedule';
    onTrackColor = 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
  } else if (progress.totalApprovedPoints + progress.totalPendingPoints >= expectedTargetAtCurrentSem) {
    onTrackLabel = 'On Track (Review Pending)';
    onTrackColor = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
  } else {
    onTrackLabel = 'Needs Attention';
    onTrackColor = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  }

  // Find eligible categories with unused capacity for practical suggestions
  const eligibleSuggestions = (categories || CBIT_24_CATEGORIES)
    .filter((cat) => {
      const currentEarned = progress.categoryPointsMap[cat.sno] || 0;
      return currentEarned < cat.max_points_allowed && cat.is_active !== false;
    })
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Approved Points Card */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Points</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#385529] dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#385529] dark:text-emerald-400 font-serif">
              {progress.totalApprovedPoints}
            </span>
            <span className="text-xs text-gray-400">/ {target} target</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {progress.pointsRemaining > 0
              ? `${progress.pointsRemaining} points needed for graduation`
              : 'Target achieved! Additional points capped at ' + maxAllowed}
          </p>
        </div>

        {/* Pending Points Card */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-[#a16b15] dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#a16b15] dark:text-amber-400 font-serif">
              {progress.totalPendingPoints}
            </span>
            <span className="text-xs text-gray-400">pts ({progress.pendingCount} docs)</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Submitted certificates awaiting faculty counselor verification
          </p>
        </div>

        {/* Rejections / Resubmissions Card */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Clarifications / Rejected</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-serif">
              {rejectedCount}
            </span>
            <span className="text-xs text-gray-400">submissions</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {rejectedCount > 0
              ? 'Check mentor remarks in History tab to re-upload proofs'
              : 'Zero rejected submissions. Excellent record!'}
          </p>
        </div>

        {/* Pace & On-Track Status Card */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Degree Pace</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold border ${onTrackColor}`}>
              {onTrackLabel}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Expected by Sem {currentSemester}: ~{expectedTargetAtCurrentSem} pts based on curriculum
          </p>
        </div>

      </div>

      {/* Semester Breakdown Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
              Semester-Wise MAR Distribution
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Approved activity points accrued across academic semesters
            </p>
          </div>
          <span className="text-xs font-bold text-[#385529] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {progress.totalApprovedPoints} Pts Verified
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const semPoints = progress.semesterBreakdown[sem] || 0;
            const isCurrent = sem === currentSemester;
            return (
              <div
                key={sem}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-[#385529] dark:border-emerald-500 bg-[#faf9f5] dark:bg-[#22232a] ring-1 ring-[#385529]'
                    : 'border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214]'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">
                  Sem {sem} {isCurrent && '(Now)'}
                </div>
                <div className="text-lg font-serif font-extrabold text-[#385529] dark:text-emerald-400 mt-1">
                  {semPoints}
                </div>
                <div className="text-[9px] text-gray-400">pts</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical MAR Opportunities */}
      {progress.pointsRemaining > 0 && (
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#a16b15] dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
              Recommended MAR Activities with Available Capacity
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Based on official CBIT MAR rules, you still have allowable point capacity in these categories:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {eligibleSuggestions.map((cat) => {
              const currentEarned = progress.categoryPointsMap[cat.sno] || 0;
              const remainingCapacity = cat.max_points_allowed - currentEarned;

              return (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-[#faf9f5] dark:bg-[#1a1b20] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                      Category #{cat.sno} &bull; {cat.sub_type || 'General'}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Standard award: +{cat.default_points} pts &bull; Subcategory cap: {cat.max_points_allowed} pts
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#385529] dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      +{remainingCapacity} pts capacity
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
