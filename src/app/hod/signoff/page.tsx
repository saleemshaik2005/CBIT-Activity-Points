'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GraduationCap, CheckCircle2, ShieldCheck, Download, Award } from 'lucide-react';

export default function HODSignoffPage() {
  const { currentUser, settings } = useApp();
  const [signedBatches, setSignedBatches] = useState<string[]>([]);

  const eligibleBatches = [
    { id: 'b-cse1-2026', batchName: 'B.Tech CSE - Section 1 (2022-2026)', eligibleCount: 58, total: 66, status: 'Ready for Signoff' },
    { id: 'b-cse2-2026', batchName: 'B.Tech CSE - Section 2 (2022-2026)', eligibleCount: 54, total: 64, status: 'Ready for Signoff' },
    { id: 'b-aiml-2026', batchName: 'B.Tech CSE (AI&ML) (2022-2026)', eligibleCount: 52, total: 65, status: 'Ready for Signoff' },
  ];

  const handleSignoff = (id: string, name: string) => {
    setSignedBatches([...signedBatches, id]);
    alert(`Official Digital HoD Endorsement and Sign-off recorded for ${name}!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-1">
        <div className="flex items-center space-x-2 text-purple-600">
          <GraduationCap className="w-5 h-5" />
          <h1 className="text-xl font-extrabold text-gray-900">
            Official HoD Graduation MAR Endorsement
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Sign-off verified MAR records for degree eligibility to be transmitted to the CBIT Controller of Examinations.
        </p>
      </div>

      <div className="space-y-4">
        {eligibleBatches.map((b) => {
          const isSigned = signedBatches.includes(b.id);
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900">{b.batchName}</h3>
                <p className="text-xs text-gray-500">
                  {b.eligibleCount} out of {b.total} students satisfied mandatory 60 activity points requirement.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {isSigned ? (
                  <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>HoD Endorsement Signed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSignoff(b.id, b.batchName)}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
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
