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
  Award,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { currentUser, submissions, categories, settings } = useApp();

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
      
      {/* Student Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border-t-4 border-[#385529] border-x border-b border-[#e8e3d8] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#eef5ec] text-[#385529] font-bold px-2.5 py-0.5 rounded-full border border-[#385529]/20">
              Roll No: {currentUser.roll_number || '160122733045'}
            </span>
            <span className="text-xs bg-[#faf9f5] text-[#1c2718] font-semibold px-2.5 py-0.5 rounded-full border border-[#e8e3d8]">
              {currentUser.department}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529]">
            Welcome, {currentUser.full_name}!
          </h1>
          <p className="text-xs text-gray-500">
            Faculty Counselor: <strong>{currentUser.mentor_name || 'Dr. K. Radhika (Assoc. Prof)'}</strong> • Section: {currentUser.section || 'A'} • Batch: {currentUser.batch_year}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-white hover:bg-[#faf7f2] text-[#385529] font-bold text-xs rounded-xl border border-[#e8e3d8] shadow-xs hover:shadow transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-[#a16b15]" />
            <span>Download MAR Sheet (PDF)</span>
          </button>

          <Link
            href="/student/upload"
            className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15]"
          >
            <Sparkles className="w-4 h-4 text-[#dfa94b]" />
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

      {/* Two Column Layout: Recent Submissions & Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Submissions Feed */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e8e3d8] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#385529]" />
              <h3 className="text-base font-serif font-bold text-[#385529] uppercase tracking-wide">
                Recent Activity Submissions
              </h3>
            </div>
            <Link
              href="/student/history"
              className="text-xs font-bold text-[#a16b15] hover:text-[#385529] flex items-center gap-1"
            >
              <span>View All ({mySubmissions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-[#e8e3d8] rounded-xl space-y-3 bg-[#faf9f5]">
              <Sparkles className="w-8 h-8 text-[#a16b15] mx-auto" />
              <p className="text-xs text-gray-500 font-medium">No certificates uploaded yet.</p>
              <Link
                href="/student/upload"
                className="inline-block text-xs font-bold text-[#385529] hover:underline"
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
                        <span className="text-[10px] bg-[#faf9f5] text-gray-700 font-semibold px-2 py-0.5 rounded border border-[#e8e3d8]">
                          Sem {sub.semester}
                        </span>
                        <span className="text-[10px] bg-[#eef5ec] text-[#385529] font-bold px-2 py-0.5 rounded">
                          Cat #{cat?.sno || 1}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1c2718] line-clamp-1">{sub.activity_title}</h4>
                      <p className="text-[11px] text-gray-500">
                        {sub.issuing_organization} • {sub.event_date}
                      </p>
                    </div>

                    <div className="text-right space-y-1 flex-shrink-0">
                      <span className="text-xs font-extrabold text-[#385529]">
                        {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points} pts` : `${sub.claimed_points} pts`}
                      </span>
                      <div>
                        {sub.status === 'approved' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#385529] bg-[#eef5ec] px-2 py-0.5 rounded-full border border-[#385529]/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                          </span>
                        )}
                        {sub.status === 'pending_mentor' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#a16b15] bg-[#fbf5eb] px-2 py-0.5 rounded-full border border-[#a16b15]/30">
                            <Clock className="w-3 h-3 mr-1" /> Under Review
                          </span>
                        )}
                        {sub.status === 'rejected' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[#a71a1b] bg-[#fdf2f2] px-2 py-0.5 rounded-full border border-[#a71a1b]/20">
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
        <div className="lg:col-span-5 bg-gradient-to-br from-[#385529] via-[#273e1c] to-[#1c2718] text-white rounded-2xl p-6 shadow-md border-t-4 border-[#a16b15] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-2.5 bg-[#273e1c] rounded-xl w-fit border border-[#a16b15]">
              <Sparkles className="w-6 h-6 text-[#dfa94b]" />
            </div>
            <h3 className="text-lg font-serif font-bold">Have a new certificate?</h3>
            <p className="text-xs text-[#e2ebd9] leading-relaxed">
              Upload any certificate image or PDF. Our AI Document Intelligence will instantly extract the event name, date, organization, and calculate your activity points!
            </p>
          </div>

          <Link
            href="/student/upload"
            className="w-full text-center py-3 bg-white hover:bg-[#faf7f2] text-[#385529] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15]"
          >
            <span>Launch AI Scanner & Upload</span>
            <ArrowRight className="w-4 h-4 text-[#a16b15]" />
          </Link>
        </div>

      </div>

      {/* 24 Activity Categories & Cap Tracker */}
      <CategoryBreakdown categories={categories} submissions={mySubmissions} />

    </div>
  );
}
