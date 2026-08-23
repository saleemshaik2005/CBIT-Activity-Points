'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MARProgressBar } from '@/components/student/MARProgressBar';
import { CategoryBreakdown } from '@/components/student/CategoryBreakdown';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  Building,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { currentUser, submissions, categories, settings } = useApp();

  // Filter submissions for current student
  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const targetPoints = currentUser.is_lateral_entry
    ? settings.lateral_entry_target_points
    : settings.regular_target_points;

  const handleDownloadPDF = () => {
    generateOfficialCBITMARPDF(currentUser, mySubmissions, categories);
  };

  const recentSubmissions = mySubmissions.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Roll No: {currentUser.roll_number || '160122733045'}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-full">
              {currentUser.department}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Welcome, {currentUser.full_name}!
          </h1>
          <p className="text-xs text-gray-500">
            Faculty Mentor: <strong>{currentUser.mentor_name || 'Dr. K. Radhika (Assoc. Prof)'}</strong> • Batch: {currentUser.batch_year}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-300 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download MAR Sheet (PDF)</span>
          </button>

          <Link
            href="/student/upload"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Upload Certificate</span>
          </Link>
        </div>
      </div>

      {/* MAR Points Progress Meter */}
      <MARProgressBar
        submissions={mySubmissions}
        categories={categories}
        targetPoints={targetPoints}
        isLateralEntry={currentUser.is_lateral_entry}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Two Column Layout: Recent Submissions & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Submissions Feed */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-gray-900">Recent Activity Submissions</h3>
            </div>
            <Link
              href="/student/history"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All ({mySubmissions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl space-y-3">
              <Sparkles className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-medium">No certificates uploaded yet.</p>
              <Link
                href="/student/upload"
                className="inline-block text-xs font-bold text-blue-600 hover:underline"
              >
                Upload your first certificate now &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentSubmissions.map((sub) => {
                const cat = categories.find((c) => c.id === sub.category_id);
                return (
                  <div key={sub.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded">
                          Sem {sub.semester}
                        </span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                          Cat #{cat?.sno || 1}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{sub.activity_title}</h4>
                      <p className="text-[11px] text-gray-500">
                        {sub.issuing_organization} • {sub.event_date}
                      </p>
                    </div>

                    <div className="text-right space-y-1 flex-shrink-0">
                      <span className="text-xs font-extrabold text-blue-700">
                        {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points} pts` : `${sub.claimed_points} pts`}
                      </span>
                      <div>
                        {sub.status === 'approved' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                          </span>
                        )}
                        {sub.status === 'pending_mentor' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 mr-1" /> Under Review
                          </span>
                        )}
                        {sub.status === 'rejected' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Upload Action Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-2.5 bg-white/10 rounded-xl w-fit">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-lg font-bold">Have a new certificate?</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Upload any certificate image or PDF. Our Google Gemini AI will instantly extract the event name, date, organization, and calculate your activity points!
            </p>
          </div>

          <Link
            href="/student/upload"
            className="w-full text-center py-3 bg-white hover:bg-gray-100 text-blue-800 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch AI Scanner & Upload</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 24 Activity Categories & Cap Tracker */}
      <CategoryBreakdown categories={categories} submissions={mySubmissions} />

    </div>
  );
}
