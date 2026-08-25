'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Download,
  Award,
  Building,
  FileCheck,
  Check,
  Calendar,
  Lock,
} from 'lucide-react';

export default function HODSignoffPage() {
  const { currentUser, settings, addNotification } = useApp();
  const [signedBatches, setSignedBatches] = useState<string[]>(['b-aids1-2028']);

  const eligibleBatches = [
    {
      id: 'b-aids1-2028',
      batchName: 'B.Tech AI&DS - Section 1 (Batch 2024-2028)',
      coordinator: 'Prof. M. Srinivasa Rao',
      eligibleCount: 58,
      total: 66,
      signedDate: '2026-08-20',
      hash: 'CBIT-HOD-AIDS-SEC1-98741B2',
      status: 'Endorsed & Transmitted to COE',
    },
    {
      id: 'b-aids2-2028',
      batchName: 'B.Tech AI&DS - Section 2 (Batch 2024-2028)',
      coordinator: 'Dr. T. Sridevi',
      eligibleCount: 54,
      total: 64,
      signedDate: null,
      hash: null,
      status: 'Ready for HOD Endorsement',
    },
    {
      id: 'b-aids3-2028',
      batchName: 'B.Tech AI&DS - Section 3 (Batch 2024-2028)',
      coordinator: 'Dr. B. Indira',
      eligibleCount: 49,
      total: 63,
      signedDate: null,
      hash: null,
      status: 'Ready for HOD Endorsement',
    },
  ];

  const handleSignoff = (id: string, name: string) => {
    setSignedBatches([...signedBatches, id]);
    addNotification({
      recipient_role: 'admin',
      type: 'announcement',
      title: `Official HOD Sign-off: ${name}`,
      message: `Head of Department endorsed MAR compliance records for ${name}. Dispatched to Controller of Examinations.`,
      link: '/admin',
      sender_name: currentUser.full_name,
    });
    alert(`Official Digital HoD Endorsement and Sign-off recorded for ${name}!\nTransmitted to CBIT Examination Branch.`);
  };

  const handleDownloadTransmittal = (batchName: string) => {
    const content = `CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE
============================================================
OFFICIAL BATCH MAR GRADUATION ELIGIBILITY TRANSMITTAL
Batch: ${batchName}
Department Head: ${currentUser.full_name}
Date of Signoff: ${new Date().toLocaleDateString()}
Status: VERIFIED & ENDORSED FOR DEGREE CONFERRAL
Digital Signature ID: CBIT-HOD-AIDS-${Date.now().toString(36).toUpperCase()}
============================================================
This document certifies that eligible students in the above batch have satisfied
the mandatory 60 Activity Points (45 points for Diploma Lateral Entry) requirement
as per CBIT Autonomous academic regulations.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${batchName.replace(/[^a-zA-Z0-9]/g, '_')}_HOD_Endorsement.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 sm:p-7 border-t-4 border-[#a71a1b] dark:border-rose-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1.5">
        <div className="flex items-center space-x-2 text-[#385529] dark:text-emerald-400">
          <GraduationCap className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900 dark:text-white">
            Official HoD Graduation MAR Endorsement & COE Transmittal
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Sign-off verified MAR records for degree eligibility to be transmitted to the CBIT Controller of Examinations (COE) and Examination Branch.
        </p>
      </div>

      {/* Batches List */}
      <div className="space-y-4">
        {eligibleBatches.map((b) => {
          const isSigned = signedBatches.includes(b.id);

          return (
            <div
              key={b.id}
              className={`bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border shadow-xs space-y-4 transition-all ${
                isSigned
                  ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-[#151c17]'
                  : 'border-[#e8e3d8] dark:border-[#2c2d36]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                      {b.batchName}
                    </h3>
                    <span className="text-[10px] bg-[#faf9f5] dark:bg-[#22232a] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-[#e8e3d8] dark:border-[#2c2d36] font-semibold">
                      Coordinator: {b.coordinator}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>{b.eligibleCount} out of {b.total} students</strong> have satisfied the mandatory activity points requirements ({Math.round((b.eligibleCount / b.total) * 100)}% compliance).
                  </p>
                  {isSigned && (
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#385529] dark:text-emerald-400 font-mono pt-1">
                      <span>✓ Digital Seal Hash: {b.hash || 'CBIT-HOD-AIDS-SEC2-4721A9C'}</span>
                      <span>• Timestamp: {new Date().toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
                  {isSigned ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownloadTransmittal(b.batchName)}
                        className="px-3.5 py-2 bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                        <span>Download COE Transmittal</span>
                      </button>

                      <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>HOD Endorsement Signed</span>
                      </span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSignoff(b.id, b.batchName)}
                      className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
                      <span>Apply Digital HoD Seal & Endorsement</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
