'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useUploadQueue } from '@/context/UploadContext';
import { Sparkles, Loader2, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';

export const UploadScanFloater: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useApp();
  const {
    isAnalyzingAny,
    activeProcessingItem,
    analyzingCount,
    validCount,
    clearCompletedQueue,
  } = useUploadQueue();

  const [isDismissed, setIsDismissed] = React.useState(false);

  // Reset dismissal if new analysis begins
  React.useEffect(() => {
    if (isAnalyzingAny) {
      setIsDismissed(false);
    }
  }, [isAnalyzingAny]);

  // Only display for students
  if (currentUser?.role !== 'student') return null;

  // Don't duplicate the big floater if user is already looking right at /student/upload unless analyzing in background
  const isOnUploadPage = pathname === '/student/upload';

  // If nothing is analyzing and no unsubmitted valid items, hide
  if (!isAnalyzingAny && (validCount === 0 || isOnUploadPage)) {
    return null;
  }

  if (isDismissed && !isAnalyzingAny) {
    return null;
  }

  return (
    <aside aria-label="Certificate scan status" className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
      {isAnalyzingAny ? (
        <div className="bg-[#1c2718]/95 dark:bg-[#1a1b20]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-[#385529] dark:border-emerald-600/40 flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center space-x-1.5">
              <p className="text-xs font-bold text-amber-300 truncate">
                AI Scanning In Background
              </p>
              {analyzingCount > 1 && (
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded-full font-bold">
                  +{analyzingCount - 1} more
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-200 truncate font-medium">
              {activeProcessingItem?.fileName || 'Certificate document'}
            </p>
            <p className="text-[10px] text-gray-400 truncate">
              {activeProcessingItem?.progressText || 'Extracting details & running forensics...'}
            </p>
          </div>

          {!isOnUploadPage && (
            <Link
              href="/student/upload"
              className="px-2.5 py-1.5 bg-[#385529] hover:bg-[#2e4722] text-white text-[11px] font-bold rounded-xl transition-all flex items-center space-x-1 flex-shrink-0"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      ) : validCount > 0 && !isOnUploadPage ? (
        <div className="bg-white dark:bg-[#1e1f26] text-gray-800 dark:text-gray-100 p-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              AI Analysis Ready!
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate">
              {validCount} certificate{validCount > 1 ? 's' : ''} ready to review & submit.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <Link
              href="/student/upload"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1"
            >
              <span>Review</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
};
