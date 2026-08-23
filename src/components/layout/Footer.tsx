'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Users, BookOpen, MapPin, Phone, Mail, ExternalLink, Heart, ShieldCheck, GraduationCap } from 'lucide-react';
import { CBIT_DEPARTMENTS } from '@/lib/mar-constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e3016] text-[#e2ebd9] border-t-4 border-[#a16b15] mt-16">
      
      {/* Top Banner Accent */}
      <div className="bg-[#2a441e] border-b border-[#385529] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2 text-[#dfa94b] font-serif font-bold tracking-wide text-center md:text-left">
            <Award className="w-4 h-4 text-[#dfa94b] flex-shrink-0" />
            <span>CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#c5d8bc]">
            <span>NAAC A++ Grade</span>
            <span>•</span>
            <span>NBA Accredited</span>
            <span>•</span>
            <span>Affiliated to Osmania University</span>
            <span>•</span>
            <span>NIRF Ranked</span>
          </div>

        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: System Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-[#385529] border border-[#a16b15] flex items-center justify-center text-[#dfa94b]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-white tracking-wide">
                CBIT Activity Point System
              </h3>
            </div>
            
            <p className="text-xs text-[#c5d8bc] leading-relaxed">
              Automated AI document intelligence platform for student activity points tracking, mentor verification, and graduation certificate approvals across 8 semesters.
            </p>

            <div className="pt-2 text-[11px] text-[#dfa94b] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#dfa94b]" />
                <span>Gandipet, Hyderabad - 500075, Telangana</span>
              </p>
              <p className="flex items-center gap-1.5 text-[#c5d8bc]">
                <Mail className="w-3.5 h-3.5 text-[#dfa94b]" />
                <span>principal@cbit.ac.in | www.cbit.ac.in</span>
              </p>
            </div>
          </div>

          {/* Col 2: Official Academic Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#dfa94b] border-b border-[#385529] pb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#dfa94b]" />
              <span>Academic Departments</span>
            </h4>
            
            <ul className="text-xs space-y-1.5 text-[#c5d8bc]">
              <li>• Artificial Intelligence & Data Science (AI&DS)</li>
              <li>• Computer Science & Engineering (CSE)</li>
              <li>• AI & Machine Learning (AI&ML / CSE-AIML)</li>
              <li>• CSE (IoT, Cyber Security & Blockchain)</li>
              <li>• Information Technology (IT)</li>
              <li>• Electronics & Communication (ECE)</li>
              <li>• Electrical & Electronics (EEE)</li>
              <li>• Mechanical / Civil / Chemical / Biotech</li>
            </ul>

            <a
              href="https://www.cbit.ac.in/admission_post/ug-pg-course-list/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-[11px] font-bold text-[#dfa94b] hover:underline pt-1"
            >
              <span>View Official UG/PG Course List</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          {/* Col 3: Role Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#dfa94b] border-b border-[#385529] pb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#dfa94b]" />
              <span>Portals & Resources</span>
            </h4>
            <ul className="text-xs space-y-1.5 text-[#c5d8bc]">
              <li>
                <Link href="/student" className="hover:text-white transition-colors">
                  &rarr; Student MAR Dashboard
                </Link>
              </li>
              <li>
                <Link href="/student/upload" className="hover:text-white transition-colors">
                  &rarr; AI Certificate OCR Scanner
                </Link>
              </li>
              <li>
                <Link href="/mentor" className="hover:text-white transition-colors">
                  &rarr; Faculty Mentor Verification
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-white transition-colors">
                  &rarr; Class Coordinator Overview
                </Link>
              </li>
              <li>
                <Link href="/hod" className="hover:text-white transition-colors">
                  &rarr; HoD Graduation Approval
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  &rarr; Master Administration Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Credits & Mentorship */}
          <div className="space-y-3 bg-[#243a1a] p-4 rounded-xl border border-[#385529]">
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#dfa94b] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#dfa94b]" />
              <span>Project Development Team</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <p className="text-[11px] uppercase font-bold text-[#dfa94b]">Developed By:</p>
                <p className="text-white font-bold leading-tight">
                  Students of AI & Data Science
                </p>
                <p className="text-[11px] text-[#c5d8bc]">
                  Department of AI & Data Science (AI&DS)<br />
                  Section 2 • 5th Semester • Batch of 2026<br />
                  <strong className="text-white">Team of 4 Members</strong> (Shaik Saleem & Team)
                </p>
              </div>

              <div className="pt-2 border-t border-[#385529]">
                <p className="text-[11px] uppercase font-bold text-[#dfa94b]">Project Guide & Mentor:</p>
                <p className="text-white font-bold">Dr. D. Ramana Sir</p>
                <p className="text-[11px] text-[#c5d8bc]">
                  Department of Artificial Intelligence & Data Science<br />
                  CBIT Autonomous, Hyderabad
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="bg-[#152310] border-t border-[#263e1c] py-4 px-4 text-center text-[11px] text-[#9eb793]">
        <p>
          © {new Date().getFullYear()} Chaitanya Bharathi Institute of Technology (Autonomous). All Rights Reserved.
        </p>
        <p className="mt-0.5 text-[10px] text-[#809b75]">
          CBIT Activity Point System • Built for Autonomous MAR Requirements Tracking
        </p>
      </div>

    </footer>
  );
};
