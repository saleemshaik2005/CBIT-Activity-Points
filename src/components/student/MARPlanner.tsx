'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateStudentMARProgress, CBIT_24_CATEGORIES } from '@/lib/mar-constants';
import { Compass, CheckCircle2, ArrowRight, BookOpen, Sparkles, Award } from 'lucide-react';

export function MARPlanner() {
  const { currentUser, submissions, categories, settings } = useApp();
  const [targetSemestersCount, setTargetSemestersCount] = useState<number>(3); // Remaining sems (e.g., Sem 6, 7, 8)

  const mySubmissions = (submissions || []).filter((s) => s.student_id === currentUser.id);

  const target = currentUser.is_lateral_entry
    ? settings.lateral_entry_target_points
    : settings.regular_target_points;

  const maxAllowed = currentUser.is_lateral_entry
    ? settings.lateral_entry_max_points
    : settings.regular_max_points;

  const progress = calculateStudentMARProgress(mySubmissions, categories, target, maxAllowed);

  // If already reached target points:
  if (progress.totalApprovedPoints >= target) {
    return (
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="font-serif font-bold text-sm">MAR Graduation Target Satisfied!</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          You have achieved {progress.totalApprovedPoints} approved activity points (requirement: {target} points). You have met the graduation requirement under CBIT Autonomous regulations.
        </p>
      </div>
    );
  }

  // Calculate remaining target after considering pending submissions (shown distinctly)
  const netRemainingIfPendingApproved = Math.max(
    0,
    progress.pointsRemaining - progress.totalPendingPoints
  );

  // Generate actionable plan based on high-yield, officially allowed categories with available capacity
  const highYieldCategories = (categories || CBIT_24_CATEGORIES)
    .filter((c) => {
      const earned = progress.categoryPointsMap[c.sno] || 0;
      return earned < c.max_points_allowed && c.is_active !== false;
    })
    .sort((a, b) => b.default_points - a.default_points);

  // Build a feasible semester-by-semester roadmap to achieve remaining points
  const pointsNeededPerSem = Math.ceil(progress.pointsRemaining / targetSemestersCount);

  return (
    <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e3d8] dark:border-[#2e3039] pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-emerald-400">
            <Compass className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">
              CBIT MAR Graduation Planner
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Personalized, official roadmap to fulfill your remaining {progress.pointsRemaining} activity points before graduation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500">Plan over next:</span>
          <select
            value={targetSemestersCount}
            onChange={(e) => setTargetSemestersCount(Number(e.target.value))}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] text-gray-800 dark:text-gray-200"
          >
            <option value={1}>1 Semester (Accelerated)</option>
            <option value={2}>2 Semesters</option>
            <option value={3}>3 Semesters (Standard)</option>
            <option value={4}>4 Semesters</option>
          </select>
        </div>
      </div>

      {/* Point Deficit Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-[#2e3039]">
          <div className="text-[10px] uppercase font-bold text-gray-400">Approved Points</div>
          <div className="text-xl font-serif font-extrabold text-[#385529] dark:text-emerald-400 mt-0.5">
            {progress.totalApprovedPoints} / {target}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-[#2e3039]">
          <div className="text-[10px] uppercase font-bold text-gray-400">Pending Review</div>
          <div className="text-xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400 mt-0.5">
            +{progress.totalPendingPoints} pts
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-[#2e3039]">
          <div className="text-[10px] uppercase font-bold text-gray-400">Target Deficit</div>
          <div className="text-xl font-serif font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
            {progress.pointsRemaining} pts needed
          </div>
        </div>
      </div>

      {progress.totalPendingPoints > 0 && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between border border-amber-200 dark:border-amber-800">
          <span>
            If your pending {progress.totalPendingPoints} points are approved by faculty, your deficit decreases to <strong>{netRemainingIfPendingApproved} points</strong>.
          </span>
        </div>
      )}

      {/* Suggested Feasible Activities */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Feasible Activity Pathways (Paced at ~{pointsNeededPerSem} pts/semester)
        </h4>

        <div className="space-y-2">
          {highYieldCategories.slice(0, 3).map((cat, idx) => {
            const currentEarned = progress.categoryPointsMap[cat.sno] || 0;
            const remainingCapacity = cat.max_points_allowed - currentEarned;
            const itemsNeeded = Math.min(
              remainingCapacity,
              Math.ceil(pointsNeededPerSem / cat.default_points) * cat.default_points
            );

            return (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-[#faf9f5] dark:bg-[#17181c] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#385529]/10 text-[#385529] dark:text-emerald-400 font-bold">
                      Option {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {cat.name} ({cat.sub_type || 'General'})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cat.description || 'Complete official certified activity.'}
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-right flex-shrink-0">
                  <div>
                    <div className="text-xs font-bold text-[#385529] dark:text-emerald-400">
                      +{cat.default_points} pts / submission
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Capacity remaining: {remainingCapacity} pts
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
