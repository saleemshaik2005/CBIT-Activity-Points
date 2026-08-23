'use client';

import React from 'react';
import Link from 'next/link';
import { RulesManager } from '@/components/admin/RulesManager';
import { ArrowLeft, Settings, ShieldCheck } from 'lucide-react';

export default function AdminRulesPage() {
  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Hub</span>
        </Link>

        <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Dynamic Rules Configuration
        </span>
      </div>

      <RulesManager />

    </div>
  );
}
