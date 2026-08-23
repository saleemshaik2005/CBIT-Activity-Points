'use client';

import React from 'react';
import Link from 'next/link';
import { CertificateUploader } from '@/components/student/CertificateUploader';
import { Sparkles, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

export default function StudentUploadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/student"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Powered by Gemini 2.0 Flash
        </span>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            AI Certificate & Activity Upload
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Upload your certificate in JPG, PNG, PDF, or HEIC format. The AI will automatically extract details and match with the 24 CBIT MAR categories. You can review and edit every single detail before final submission!
          </p>
        </div>

        <CertificateUploader />

        {/* Informational Guidance Box */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-gray-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Verification Guidelines</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
            <li>Ensure the student name, issuing authority, and completion date are clearly legible.</li>
            <li>For NPTEL/MOOC courses, ensure the duration (8 weeks or 12 weeks) is visible for maximum points allocation.</li>
            <li>Once submitted, your assigned faculty mentor will verify the document and award the points to your MAR record.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
