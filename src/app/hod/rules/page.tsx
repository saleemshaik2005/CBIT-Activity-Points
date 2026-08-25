'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileCheck,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  ShieldCheck,
  Download,
  ExternalLink,
} from 'lucide-react';
import { CBIT_24_CATEGORIES } from '@/lib/mar-constants';

export default function HODRulesPage() {
  const { categories, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q) ||
      cat.sub_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#a71a1b] dark:border-rose-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#385529] dark:text-gray-300">
            <FileCheck className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />
            <h1 className="text-xl font-serif font-extrabold text-gray-900 dark:text-white">
              CBIT Mandatory Activity Points Regulations & Category Caps
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Official Academic Guidelines for B.E. / B.Tech Degree Award • Chaitanya Bharathi Institute of Technology (Autonomous)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl border border-[#385529]/20">
            24 Approved Categories
          </span>
        </div>
      </div>

      {/* Graduation Requirements Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2 border-l-4 border-l-[#385529]">
          <span className="text-[10px] font-bold uppercase text-[#385529] dark:text-emerald-400 tracking-wider block">
            4-Year Regular B.Tech (Sem I - VIII)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-serif font-extrabold text-[#385529] dark:text-white">
              {settings.regular_target_points} Points Target
            </span>
            <span className="text-xs text-gray-500">(Max Cap: {settings.regular_max_points || 100} pts)</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Must earn minimum 60 non-academic activity points across approved technical, co-curricular, sports, and community outreach categories.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-2 border-l-4 border-l-[#a16b15]">
          <span className="text-[10px] font-bold uppercase text-[#a16b15] dark:text-amber-400 tracking-wider block">
            Diploma Lateral Entry (Sem III - VIII)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">
              {settings.lateral_entry_target_points} Points Target
            </span>
            <span className="text-xs text-gray-500">(Max Cap: {settings.lateral_entry_max_points || 75} pts)</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Direct 2nd year lateral entrants must earn minimum 45 non-academic activity points before the final 8th semester signoff.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search categories by name, sub-type, or keywords (e.g. MOOCs, NPTEL, Hackathon, Internship)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529]"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] text-[#385529] dark:text-gray-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16 text-center">S.No</th>
                <th className="py-3 px-4">Activity Category Title</th>
                <th className="py-3 px-3">Sub-Type / Scope</th>
                <th className="py-3 px-3 text-center">Default Pts</th>
                <th className="py-3 px-3 text-center">Max Allowed Cap</th>
                <th className="py-3 px-4">Approved Activities & Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    #{cat.sno}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1c2718] dark:text-white">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-[#e8e3d8] dark:border-[#2c2d36] text-[10px] font-semibold">
                      {cat.sub_type || 'General'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-extrabold text-[#385529] dark:text-emerald-400">
                    {cat.default_points} pts
                  </td>
                  <td className="py-3.5 px-3 text-center font-extrabold text-[#a16b15] dark:text-amber-400">
                    {cat.max_points_allowed} pts
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                    {cat.description || 'Verified certificate issued by recognized organizer/institution.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
