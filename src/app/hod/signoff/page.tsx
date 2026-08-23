'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GraduationCap, CheckCircle2, ShieldCheck, Download, Award } from 'lucide-react';

export default function HODSignoffPage() {
  const { currentUser, settings } = useApp();
  const [signedBatches, setSignedBatches] = useState<string[]>([]);

  const eligibleBatches = [
    { id: 'b-aids1-2026', batchName: 'B.Tech AI&DS - Section 1 (2022-2026)', eligibleCount: 58, total: 66, status: 'Ready for Signoff' },
    { id: 'b-aids2-2026', batchName: 'B.Tech AI&DS - Section 2 (2022-2026)', eligibleCount: 54, total: 64, status: 'Ready for Signoff' },
    { id: 'b-aids3-2026', batchName: 'B.Tech AI&DS - Section 3 (2022-2026)', eligibleCount: 52, total: 65, status: 'Ready for Signoff' },
  ];

  const handleSignoff = (id: string, name: string) => {
    setSignedBatches([...signedBatches, id]);
    alert(`Official Digital HoD Endorsement and Sign-off recorded for ${name}!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
        <div className="flex items-center space-x-2 text-[#385529] dark:text-emerald-400">
          <GraduationCap className="w-5 h-5" />
          <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
            Official HoD Graduation MAR Endorsement
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Sign-off verified MAR records for degree eligibility to be transmitted to the CBIT Controller of Examinations.
        </p>
      </div>

      <div className="space-y-4">
        {eligibleBatches.map((b) => {
          const isSigned = signedBatches.includes(b.id);
          return (
            <div
              key={b.id}
              className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{b.batchName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {b.eligibleCount} out of {b.total} students satisfied mandatory 60 activity points requirement.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {isSigned ? (
                  <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>HoD Endorsement Signed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSignoff(b.id, b.batchName)}
                    className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
                    <span>Apply Digital HoD Signature</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
