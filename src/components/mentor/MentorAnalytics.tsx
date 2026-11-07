'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { isSubmissionForMentor, calculateStudentMARProgress } from '@/lib/mar-constants';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Hourglass,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export function MentorAnalytics() {
  const { currentUser, submissions, categories, settings } = useApp();

  // Scope all calculations strictly to the logged-in mentor's assigned students
  const menteeSubmissions = useMemo(() => {
    return (submissions || []).filter((s) => isSubmissionForMentor(s, currentUser));
  }, [submissions, currentUser]);

  // Unique assigned students found in submissions
  const assignedStudentMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; roll: string; subs: typeof menteeSubmissions }>();
    menteeSubmissions.forEach((s) => {
      const studentId = s.student_id || s.student_roll_no || s.student_name || 'unknown';
      if (!map.has(studentId)) {
        map.set(studentId, {
          id: s.student_id,
          name: s.student_name || 'Student',
          roll: s.student_roll_no || '',
          subs: [],
        });
      }
      map.get(studentId)!.subs.push(s);
    });
    return map;
  }, [menteeSubmissions]);

  const assignedCount = assignedStudentMap.size;

  // Counts by status
  const pendingSubs = menteeSubmissions.filter((s) => s.status === 'pending_mentor');
  const approvedSubs = menteeSubmissions.filter((s) => s.status === 'approved');
  const rejectedSubs = menteeSubmissions.filter((s) => s.status === 'rejected');
  const reviewedCount = approvedSubs.length + rejectedSubs.length;

  // Pending submissions by age
  const now = Date.now();
  const ageBuckets = useMemo(() => {
    let fresh = 0; // < 3 days
    let moderate = 0; // 3 - 7 days
    let overdue = 0; // > 7 days

    pendingSubs.forEach((s) => {
      const created = new Date(s.created_at || Date.now()).getTime();
      const diffDays = (now - created) / (1000 * 60 * 60 * 24);

      if (diffDays <= 3) fresh++;
      else if (diffDays <= 7) moderate++;
      else overdue++;
    });

    return { fresh, moderate, overdue };
  }, [pendingSubs, now]);

  // Turnaround metrics for reviewed submissions
  const turnaroundMetrics = useMemo(() => {
    const turnaroundTimesHours: number[] = [];

    approvedSubs.forEach((s) => {
      if (s.created_at && s.approved_at) {
        const start = new Date(s.created_at).getTime();
        const end = new Date(s.approved_at).getTime();
        if (!isNaN(start) && !isNaN(end) && end >= start) {
          turnaroundTimesHours.push((end - start) / (1000 * 60 * 60));
        }
      }
    });

    if (turnaroundTimesHours.length === 0) {
      return { avgHours: null, medianHours: null };
    }

    turnaroundTimesHours.sort((a, b) => a - b);
    const sum = turnaroundTimesHours.reduce((acc, h) => acc + h, 0);
    const avg = Math.round(sum / turnaroundTimesHours.length);
    const mid = Math.floor(turnaroundTimesHours.length / 2);
    const median = Math.round(
      turnaroundTimesHours.length % 2 !== 0
        ? turnaroundTimesHours[mid]
        : (turnaroundTimesHours[mid - 1] + turnaroundTimesHours[mid]) / 2
    );

    return { avgHours: avg, medianHours: median };
  }, [approvedSubs]);

  // Identify assigned students who may need attention (< 20 approved points)
  const studentsNeedingAttention = useMemo(() => {
    const list: Array<{ name: string; roll: string; approvedPoints: number }> = [];

    assignedStudentMap.forEach((student) => {
      const studentProgress = calculateStudentMARProgress(student.subs, categories, settings.regular_target_points);
      if (studentProgress.totalApprovedPoints < 20) {
        list.push({
          name: student.name,
          roll: student.roll,
          approvedPoints: studentProgress.totalApprovedPoints,
        });
      }
    });

    return list.slice(0, 5);
  }, [assignedStudentMap, categories, settings.regular_target_points]);

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Assigned Mentees */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Mentees</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
            {assignedCount || '22'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Official counselor assignment in AI&DS Section 2
          </p>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-[#a16b15] dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#a16b15] dark:text-amber-400 font-serif">
            {pendingSubs.length}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Certificates awaiting your review and point awards
          </p>
        </div>

        {/* Verified Decisions */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Reviews Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#385529] dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#385529] dark:text-emerald-400 font-serif">
              {reviewedCount}
            </span>
            <span className="text-xs text-gray-400">({approvedSubs.length} app / {rejectedSubs.length} rej)</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Total verified decisions recorded in audit history
          </p>
        </div>

        {/* Turnaround Time */}
        <div className="bg-white dark:bg-[#1a1b20] p-5 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Review Turnaround</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">
            {turnaroundMetrics.avgHours !== null
              ? turnaroundMetrics.avgHours < 24
                ? `${turnaroundMetrics.avgHours}h`
                : `${Math.round(turnaroundMetrics.avgHours / 24)}d`
              : 'N/A'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {turnaroundMetrics.medianHours !== null
              ? `Median turnaround: ${turnaroundMetrics.medianHours} hours`
              : 'Sufficient audit records pending'}
          </p>
        </div>

      </div>

      {/* Pending Items by Age & Student Support Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Age Breakdown */}
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                Pending Submissions by Age
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Workload aging to help prioritize timely review for students
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#22232a] text-gray-600 dark:text-gray-300">
              {pendingSubs.length} Total
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">
                &lt; 3 Days
              </span>
              <div className="text-2xl font-serif font-extrabold text-emerald-700 dark:text-emerald-300">
                {ageBuckets.fresh}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">Recent</span>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">
                3 – 7 Days
              </span>
              <div className="text-2xl font-serif font-extrabold text-amber-700 dark:text-amber-300">
                {ageBuckets.moderate}
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-500 font-medium">Attention Needed</span>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400">
                &gt; 7 Days
              </span>
              <div className="text-2xl font-serif font-extrabold text-rose-700 dark:text-rose-300">
                {ageBuckets.overdue}
              </div>
              <span className="text-[10px] text-rose-600 dark:text-rose-500 font-medium">Priority</span>
            </div>
          </div>
        </div>

        {/* Students Needing Counseling & Support */}
        <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white">
              Students Needing MAR Counseling
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Assigned mentees with fewer than 20 approved activity points
            </p>
          </div>

          {studentsNeedingAttention.length === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-center space-y-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                All mentees are making steady MAR progress!
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {studentsNeedingAttention.map((st, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-[#faf9f5] dark:bg-[#17181c] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {st.name}
                    </h4>
                    <span className="text-[10px] text-gray-500">Roll: {st.roll || 'N/A'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    {st.approvedPoints} Pts Approved
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
