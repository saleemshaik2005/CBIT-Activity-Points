'use client';

import React from 'react';
import {
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  GraduationCap,
  X,
  ExternalLink,
  ChevronRight,
  Github,
} from 'lucide-react';
import { CBIT_24_CATEGORIES, DEFAULT_SETTINGS } from '@/lib/mar-constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#151f12] rounded-3xl shadow-2xl border border-[#e8e3d8] dark:border-[#2b3d26] max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#385529] text-white border-b-4 border-[#a16b15] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src="/images/cbit-crest.png"
              alt="CBIT Crest"
              className="w-10 h-10 object-contain bg-white rounded-lg p-0.5"
            />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight uppercase tracking-wide text-[#fdf8f0]">
                About CBIT Activity Point System
              </h3>
              <p className="text-xs text-[#dfa94b] font-semibold">
                Autonomous Student Activity Tracking & Verification Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#273e1c] text-[#e2ebd9] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          
          {/* Overview Banner */}
          <div className="bg-[#faf9f5] dark:bg-[#1a2817] border border-[#e8e3d8] dark:border-[#2b3d26] rounded-2xl p-4 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#385529] dark:text-[#4ade80] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24]" />
              <span>What is the CBIT Activity Point System?</span>
            </h4>
            <p>
              As per Chaitanya Bharathi Institute of Technology (Autonomous) academic regulations, every undergraduate student is required to earn mandatory non-academic Activity Points across 8 semesters to qualify for their degree:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 bg-white dark:bg-[#121b0f] rounded-xl border border-[#e8e3d8] dark:border-[#2b3d26] shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-[#385529] dark:text-[#4ade80] tracking-wider block">
                  4-Year Regular B.E. / B.Tech
                </span>
                <span className="text-lg font-serif font-black text-[#385529] dark:text-[#4ade80]">
                  60 Points Target
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Across Semesters I to VIII</p>
              </div>
              <div className="p-3 bg-white dark:bg-[#121b0f] rounded-xl border border-[#e8e3d8] dark:border-[#2b3d26] shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-[#a16b15] dark:text-[#fbbf24] tracking-wider block">
                  Diploma Lateral Entry (LE)
                </span>
                <span className="text-lg font-serif font-black text-[#a16b15] dark:text-[#fbbf24]">
                  50 Points Target
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Across Semesters III to VIII</p>
              </div>
            </div>
          </div>

          {/* How to Upload & Use Instructions */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#385529] dark:text-[#4ade80] flex items-center gap-1.5 border-b border-[#e8e3d8] dark:border-[#2b3d26] pb-2">
              <Sparkles className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24]" />
              <span>How to Upload & Track Activity Points (3-Step Guide)</span>
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#121b0f] border border-[#e8e3d8] dark:border-[#2b3d26]">
                <div className="w-6 h-6 rounded-full bg-[#385529] text-[#dfa94b] font-bold flex items-center justify-center text-xs flex-shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white">Snap / Upload Certificate</h5>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                    Click <strong>AI Upload</strong> from your phone camera or laptop. Drag and drop any certificate in PDF, JPG, or PNG format.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#121b0f] border border-[#e8e3d8] dark:border-[#2b3d26]">
                <div className="w-6 h-6 rounded-full bg-[#a16b15] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white">AI Instant OCR & Category Mapping</h5>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                    Automated AI Document Intelligence extracts the certificate title, organization, dates, credential ID, QR links, and maps to the correct <strong>CBIT Category (1 to 24)</strong> with suggested points. You can edit any field before submitting.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#121b0f] border border-[#e8e3d8] dark:border-[#2b3d26]">
                <div className="w-6 h-6 rounded-full bg-[#385529] text-[#dfa94b] font-bold flex items-center justify-center text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white">Mentor Approval & 1-Click PDF Sheet</h5>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                    Your designated faculty counselor verifies your document side-by-side. Once approved, points are credited to your official progress, and you can download the <strong>official printable 24-row activity sheet</strong> anytime!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Credits & Guiding Faculty */}
          <div className="p-4 rounded-2xl bg-[#eef5ec] dark:bg-[#1a2817] border border-[#385529]/30 space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#385529] dark:text-[#4ade80]">
              Academic Project Attribution
            </h4>
            <p className="text-[11px] text-[#273e1c] dark:text-gray-300">
              <strong>Developed by:</strong> Team of 4 Students of Department of Artificial Intelligence and Data Science (AI&DS), Section 2, 5th Semester, Batch of 2026.
            </p>
            <p className="text-[11px] text-[#273e1c] dark:text-gray-300">
              <strong>Project Guide & Mentor:</strong> Dr. D. Ramana Sir, Department of AI&DS, CBIT Hyderabad.
            </p>
            <p className="text-[11px] text-[#273e1c] dark:text-gray-300">
              <strong>Head of Department (AI&DS):</strong> Dr. K. Radhika Madam, CBIT Autonomous Hyderabad.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#faf9f5] dark:bg-[#121b0f] border-t border-[#e8e3d8] dark:border-[#2b3d26] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
          <a
            href="https://github.com/saleemshaik2005/CBIT-Activity-Points"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#385529] dark:text-[#4ade80] hover:text-[#a71a1b]"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
