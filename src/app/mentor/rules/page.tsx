'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BookOpen, Search, ShieldCheck } from 'lucide-react';

export default function MentorRulesPage() {
  const { categories, settings } = useApp();
  const [search, setSearch] = useState('');

  const uniqueSnos = Array.from(new Set(categories.map((c) => c.sno))).sort((a, b) => a - b);

  const filteredSnos = uniqueSnos.filter((sno) => {
    const matching = categories.filter((c) => c.sno === sno);
    return matching.some(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase())) ||
        sno.toString().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-emerald-700">
          <ShieldCheck className="w-5 h-5" />
          <h1 className="text-xl font-extrabold text-gray-900">
            Faculty Mentor MAR Verification Rulebook
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Official evaluation criteria, category maximum caps, and point rubrics for verifying student certificates at CBIT Hyderabad.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-gray-700">
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
            Regular B.Tech Goal: <strong>{settings.regular_target_points} Points</strong>
          </span>
          <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
            Lateral Entry Goal: <strong>{settings.lateral_entry_target_points} Points</strong>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search evaluation rubrics (e.g. MOOCs, Sports, Publications)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-2xs"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSnos.map((sno) => {
          const matching = categories.filter((c) => c.sno === sno);
          const primary = matching[0];
          return (
            <div
              key={sno}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                  Activity #{sno}
                </span>
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                  Maximum Cap: {primary.max_points_allowed} pts
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 leading-snug">{primary.name}</h3>

              {primary.description && (
                <p className="text-xs text-gray-500 leading-relaxed">{primary.description}</p>
              )}

              {/* Sub-types and points */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Approved Point Values:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matching.map((sub, i) => (
                    <div
                      key={i}
                      className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5"
                    >
                      <span className="font-medium">
                        {sub.sub_type && sub.sub_type !== 'General' ? `${sub.sub_type}:` : 'Standard:'}
                      </span>
                      <strong className="text-emerald-700 font-extrabold">{sub.default_points} pts</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
