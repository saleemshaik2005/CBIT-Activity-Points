'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BookOpen, Search, Layers, CheckCircle2 } from 'lucide-react';

export default function StudentGuidelinesPage() {
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
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-300">
          <BookOpen className="w-5 h-5" />
          <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
            CBIT MAR Guidelines & Point Rubrics
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Official Mandatory Additional Requirements (MAR) activity point distribution for B.Tech students at Chaitanya Bharathi Institute of Technology.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span className="bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 px-3 py-1 rounded-full border border-[#385529]/20 dark:border-[#2e3039]">
            4-Year Regular B.Tech: <strong>{settings.regular_target_points} Points</strong> required
          </span>
          <span className="bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 px-3 py-1 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
            Lateral Entry (Diploma): <strong>{settings.lateral_entry_target_points} Points</strong> required
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search guidelines (e.g. MOOCs, Sports, Hackathons, Blood donation)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 shadow-2xs"
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
              className="bg-white dark:bg-[#1a1b20] rounded-2xl p-5 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 px-2.5 py-0.5 rounded-md border border-transparent dark:border-[#2e3039]">
                  Activity #{sno}
                </span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-[#faf9f5] dark:bg-[#121214] px-2 py-0.5 rounded-md border border-[#e8e3d8] dark:border-[#2e3039]">
                  Max Cap: {primary.max_points_allowed} pts
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{primary.name}</h3>

              {primary.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{primary.description}</p>
              )}

              {/* Sub-types and points */}
              <div className="pt-2 border-t border-gray-100 dark:border-[#2c2d36] space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Points Allocation:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matching.map((sub, i) => (
                    <div
                      key={i}
                      className="text-xs bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] flex items-center gap-1.5"
                    >
                      <span className="font-medium">
                        {sub.sub_type && sub.sub_type !== 'General' ? `${sub.sub_type}:` : 'Standard:'}
                      </span>
                      <strong className="text-[#385529] dark:text-emerald-400 font-extrabold">{sub.default_points} pts</strong>
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
