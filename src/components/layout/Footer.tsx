'use client';

import React from 'react';
import {
  ExternalLink,
  Github,
  Heart,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c2718] dark:bg-[#14151a] text-[#e2ebd9] dark:text-gray-400 border-t-4 border-[#a16b15] dark:border-[#282932] mt-auto transition-colors">
      
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center justify-between">
          
          {/* Column 1: CBIT Brand & System Mission */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="/images/cbit-crest.png"
                alt="CBIT Emblem"
                className="w-10 h-10 object-contain bg-white rounded-lg p-0.5"
              />
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide">
                  CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
                </h3>
                <p className="text-xs text-[#dfa94b] dark:text-gray-300 font-medium">
                  Autonomous Activity Points & AI Document Verification Platform • Hyderabad-75
                </p>
              </div>
            </div>

            <p className="text-xs text-[#cad8c0] dark:text-gray-400 leading-relaxed max-w-xl">
              Automated tracking of mandatory 60 activity points (50 for Lateral Entry) across 24 approved activity categories for B.E. / B.Tech degree qualification.
            </p>

            <div className="pt-1">
              <a
                href="https://github.com/saleemshaik2005/CBIT-Activity-Points"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-white hover:text-[#dfa94b] dark:hover:text-gray-200 inline-flex items-center gap-1.5 bg-[#273e1c] dark:bg-[#1c1d22] px-3 py-1.5 rounded-lg border border-[#a16b15]/40 dark:border-[#2a2b33] transition-colors"
              >
                <Github className="w-4 h-4 text-[#dfa94b] dark:text-gray-300" />
                <span>GitHub Repository & Source Code</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Project Development Attribution */}
          <div className="md:col-span-5 space-y-2.5 bg-[#273e1c]/80 dark:bg-[#1c1d22] p-4 sm:p-5 rounded-2xl border border-[#a16b15]/40 dark:border-[#2a2b33]">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#dfa94b] dark:text-gray-200">
              Project Development & Mentorship
            </h4>

            <div className="space-y-2 text-xs text-[#cad8c0] dark:text-gray-300">
              <p>
                <strong className="text-white">Developed By:</strong> Team of 4 Students of Department of Artificial Intelligence and Data Science (AI&DS), Section 2, 5th Semester, Batch of 2026.
              </p>
              <p>
                <strong className="text-white">Project Guide:</strong> Dr. K. Ramana Sir, Department of AI&DS, CBIT Autonomous Hyderabad.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#121b0f] dark:bg-[#0f1014] border-t border-[#385529]/60 dark:border-[#23242c] px-4 py-3 text-xs text-[#8a9f7e] dark:text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} CBIT Activity Point System • CBIT (Autonomous), Gandipet, Hyderabad - 500075.
          </div>
          <div className="flex items-center space-x-1 text-[11px]">
            <span>Developed by AI&DS Students with</span>
            <Heart className="w-3 h-3 text-[#a71a1b] dark:text-rose-400 fill-current" />
            <span>for CBIT Hyderabad</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
