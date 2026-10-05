'use client';

import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c2718] dark:bg-[#14151a] text-[#cad8c0] dark:text-gray-400 border-t-2 border-[#a16b15]/40 dark:border-[#282932] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Department & System Info */}
          <div className="text-center sm:text-left space-y-0.5">
            <h3 className="font-serif font-bold text-xs sm:text-sm text-white tracking-wide">
              Student Portfolio Management System (SPMS)
            </h3>
            <p className="text-[11px] text-[#8ea382] dark:text-gray-400">
              Department of Artificial Intelligence and Data Science (AI&amp;DS)
            </p>
          </div>

          {/* Right: Team & GitHub Link */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-right">
            <span className="text-[11px] text-[#8ea382] dark:text-gray-400">
              Developed by <strong className="text-[#e2ebd9] dark:text-gray-200">AI&amp;DS Team</strong> (Batch 2024–2028)
            </span>
            <a
              href="https://github.com/saleemshaik2005/CBIT-Activity-Points"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-white hover:text-[#dfa94b] dark:hover:text-amber-400 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#273e1c] dark:bg-[#1c1d22] border border-[#a16b15]/40 dark:border-[#2a2b33] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-[#dfa94b] dark:text-amber-400" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>

        </div>

        {/* Bottom Thin Copyright Row */}
        <div className="mt-4 pt-3 border-t border-[#385529]/40 dark:border-[#23242c] text-center text-[10.5px] text-[#718766] dark:text-gray-500">
          © {new Date().getFullYear()} Chaitanya Bharathi Institute of Technology (Autonomous), Gandipet, Hyderabad - 500075. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
