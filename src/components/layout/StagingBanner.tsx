'use client';

import React from 'react';

export function StagingBanner() {
  // Check environment: default to staging if NEXT_PUBLIC_ENVIRONMENT is not explicitly 'production'
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || (process.env.NODE_ENV === 'production' ? 'production' : 'staging');
  const isStaging = env !== 'production';

  if (!isStaging) {
    return null;
  }

  return (
    <aside
      aria-label="Staging environment warning banner"
      className="bg-amber-500 text-slate-950 font-bold text-xs py-1.5 px-4 text-center tracking-wide uppercase shadow-sm flex items-center justify-center gap-2 border-b border-amber-600 relative z-50 select-none"
    >
      <span className="inline-block px-2 py-0.5 rounded bg-black text-amber-400 font-mono text-[10px] uppercase font-extrabold tracking-wider">
        STAGING / TEST
      </span>
      <span>
        TEST ENVIRONMENT &mdash; Synthetic test data only. No connection to live production records.
      </span>
    </aside>
  );
}
