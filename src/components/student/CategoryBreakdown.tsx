'use client';

import React, { useState } from 'react';
import { ActivityCategory, StudentSubmission } from '@/types';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface Props {
  categories: ActivityCategory[];
  submissions: StudentSubmission[];
}

export const CategoryBreakdown: React.FC<Props> = ({ categories, submissions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Group categories by SNo
  const uniqueSnos = Array.from(new Set(categories.map((c) => c.sno))).sort((a, b) => a - b);

  // Calculate points earned per SNo
  const approved = submissions.filter((s) => s.status === 'approved');
  const pointsMap = new Map<number, number>();
  approved.forEach((sub) => {
    const cat = categories.find((c) => c.id === sub.category_id);
    const sno = cat ? cat.sno : 1;
    const current = pointsMap.get(sno) || 0;
    pointsMap.set(sno, current + (sub.awarded_points || sub.claimed_points || 0));
  });

  const categoryList = uniqueSnos.map((sno) => {
    const matching = categories.filter((c) => c.sno === sno);
    const primary = matching[0];
    const maxCap = primary.max_points_allowed;
    const earned = pointsMap.get(sno) || 0;
    const isCapped = earned >= maxCap;
    const percent = Math.min(100, Math.round((earned / maxCap) * 100));

    return {
      sno,
      name: primary.name,
      subTypes: matching,
      maxCap,
      earned,
      isCapped,
      percent,
      description: primary.description,
    };
  });

  const filteredCategories = categoryList.filter(
    (c) =>
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.sno.toString().includes(filterQuery)
  );

  const displayedList = isExpanded ? filteredCategories : filteredCategories.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e8e3d8] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#385529]" />
            <h3 className="text-base font-serif font-bold text-[#385529] uppercase tracking-wide">
              CBIT MAR 24 Activities & Cap Limits
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor points earned per category against the official maximum allowed caps.
          </p>
        </div>

        <input
          type="text"
          placeholder="Filter categories (e.g. MOOCs, Sports)..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#e8e3d8] bg-[#faf9f5] focus:outline-none focus:ring-2 focus:ring-[#385529] w-full sm:w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {displayedList.map((cat) => (
          <div
            key={cat.sno}
            className={`p-3.5 rounded-xl border transition-all ${
              cat.earned > 0
                ? cat.isCapped
                  ? 'bg-[#eef5ec] border-[#385529]/40 shadow-2xs'
                  : 'bg-[#fbf5eb] border-[#a16b15]/40 shadow-2xs'
                : 'bg-[#faf9f5] border-[#e8e3d8] hover:border-[#a16b15]/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold text-[#385529] bg-white px-2 py-0.5 rounded-md border border-[#e8e3d8]">
                #{cat.sno}
              </span>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#1c2718]">{cat.earned}</span>
                <span className="text-[11px] text-gray-500"> / {cat.maxCap} max</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-[#1c2718] line-clamp-2 mt-2 leading-snug">
              {cat.name}
            </h4>

            {/* Sub-types and points pill */}
            <div className="flex flex-wrap gap-1 mt-2">
              {cat.subTypes.map((st, idx) => (
                <span
                  key={idx}
                  className="text-[9px] bg-white text-gray-700 px-1.5 py-0.5 rounded border border-[#e8e3d8]"
                >
                  {st.sub_type && st.sub_type !== 'General' ? `${st.sub_type}: ` : ''}
                  <strong className="text-[#385529]">{st.default_points} pts</strong>
                </span>
              ))}
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    cat.isCapped
                      ? 'bg-[#385529]'
                      : cat.earned > 0
                      ? 'bg-[#a16b15]'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>

            {cat.isCapped && (
              <div className="flex items-center space-x-1 text-[10px] font-bold text-[#385529] mt-2">
                <CheckCircle2 className="w-3 h-3 text-[#385529]" />
                <span>Category Cap Reached</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center space-x-1 text-xs font-bold text-[#385529] hover:text-[#a71a1b] transition-colors"
        >
          <span>{isExpanded ? 'Show Fewer Categories' : `View All ${uniqueSnos.length} Categories`}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
