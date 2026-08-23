'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { generateOfficialCBITMARPDF } from '@/lib/pdf-generator';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Calendar,
  Building,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

export default function StudentHistoryPage() {
  const { currentUser, submissions, categories, deleteSubmission } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const filtered = mySubmissions.filter((sub) => {
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch =
      sub.activity_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.issuing_organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDownloadPDF = () => {
    generateOfficialCBITMARPDF(currentUser, mySubmissions, categories);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Activity Submission Logs</h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete record of your submitted certificates, mentor verification status, and feedback remarks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-300 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download Official MAR Sheet (PDF)</span>
          </button>

          <Link
            href="/student/upload"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upload New</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          {['all', 'approved', 'pending_mentor', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'pending_mentor' ? 'Pending Review' : status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search activities or organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
          <FileCheck className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No submissions found</h3>
          <p className="text-xs text-gray-500">
            No activity submissions match your active filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const cat = categories.find((c) => c.id === sub.category_id);
            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:shadow-sm transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                      Category #{cat?.sno || 1}: {cat?.name}
                    </span>
                    <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                      Semester {sub.semester}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Submitted on {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900">{sub.activity_title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-gray-400" />
                      {sub.issuing_organization}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {sub.event_date}
                    </span>
                  </div>

                  {sub.mentor_remarks && (
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
                      <span className="font-bold text-gray-800">
                        Mentor Feedback ({sub.approver_name || 'Faculty'}):
                      </span>{' '}
                      {sub.mentor_remarks}
                    </div>
                  )}
                </div>

                {/* Right: Points & Status */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-blue-700">
                      {sub.status === 'approved' ? `+${sub.awarded_points || sub.claimed_points}` : sub.claimed_points} pts
                    </span>
                    <p className="text-[10px] text-gray-400">
                      {sub.status === 'approved' ? 'Awarded' : 'Claimed'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {sub.status === 'approved' && (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                      </span>
                    )}
                    {sub.status === 'pending_mentor' && (
                      <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Under Review
                      </span>
                    )}
                    {sub.status === 'rejected' && (
                      <span className="inline-flex items-center text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Rejected
                      </span>
                    )}

                    <a
                      href={sub.certificate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Certificate"
                    >
                      <Eye className="w-4 h-4" />
                    </a>

                    {sub.status !== 'approved' && (
                      <button
                        onClick={() => deleteSubmission(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
