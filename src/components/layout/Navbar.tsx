'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  BookOpen,
  CheckCircle,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Settings,
  HelpCircle,
  Github,
  ChevronDown,
} from 'lucide-react';
import { AboutModal } from '@/components/modals/AboutModal';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: 'Activity Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'AI Upload', href: '/student/upload', icon: Sparkles },
      { label: 'My Submissions', href: '/student/history', icon: FileCheck },
      { label: 'Guidelines', href: '/student/guidelines', icon: BookOpen },
    ],
    mentor: [
      { label: 'Verification Queue', href: '/mentor', icon: CheckCircle },
      { label: 'Assigned Mentees', href: '/mentor/mentees', icon: Users },
      { label: 'Rulebook', href: '/mentor/rules', icon: BookOpen },
    ],
    class_teacher: [
      { label: 'Class Overview', href: '/teacher', icon: LayoutDashboard },
      { label: 'Batch Reports', href: '/teacher/reports', icon: FileCheck },
    ],
    hod: [
      { label: 'Dept Analytics', href: '/hod', icon: LayoutDashboard },
      { label: 'Graduation Signoff', href: '/hod/signoff', icon: GraduationCap },
    ],
    admin: [
      { label: 'Admin Hub', href: '/admin', icon: ShieldCheck },
      { label: 'Rules & Caps', href: '/admin/rules', icon: Settings },
      { label: 'User Roles', href: '/admin/users', icon: Users },
    ],
  };

  const currentNav = roleNavItems[currentUser.role] || roleNavItems.student;

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-xs">
        
        {/* Top Institutional Header Bar (#385529) with Gold Border (#a16b15) */}
        <div className="bg-[#385529] text-white border-b-2 border-[#a16b15] px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            <div className="flex items-center space-x-2 text-[11px] sm:text-xs tracking-wide">
              <span className="font-serif font-bold uppercase text-[#fdf8f0]">
                Chaitanya Bharathi Institute of Technology (Autonomous)
              </span>
              <span className="text-[#dfa94b] font-bold hidden sm:inline">•</span>
              <span className="text-[#dfa94b] font-semibold hidden sm:inline">Hyderabad-75</span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className="text-[#dfa94b] hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>About & Guide</span>
              </button>

              <span className="text-white/30">|</span>

              <a
                href="https://github.com/saleemshaik2005/CBIT-Activity-Points"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 hover:text-white flex items-center gap-1 transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-3.5 h-3.5 text-[#dfa94b]" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>

          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-white border-b border-[#e8e3d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              
              {/* Official Crest & Brand Title */}
              <Link href="/" className="flex items-center space-x-3 group">
                <img
                  src="/images/cbit-crest.png"
                  alt="CBIT Emblem"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
                />

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-extrabold text-[#385529] text-base sm:text-xl tracking-tight leading-none group-hover:text-[#a71a1b] transition-colors">
                      CBIT Activity Point System
                    </span>
                    <span className="hidden sm:inline text-[9px] bg-[#fbf5eb] text-[#a16b15] border border-[#a16b15]/40 font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Autonomous
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#3b566e] font-medium tracking-tight mt-0.5">
                    Student Activity Points & Verification Engine
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#eef5ec] text-[#385529] border-b-2 border-[#385529]'
                          : 'text-[#385529] hover:text-[#a71a1b] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#385529]' : 'text-[#a16b15]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile & Interactive Role Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-[#faf7f2] border border-[#e8e3d8] transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#385529] text-[#dfa94b] border border-[#a16b15] font-bold flex items-center justify-center text-xs shadow-2xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left pr-1">
                    <p className="text-xs font-bold text-[#1c2718] leading-tight">{currentUser.full_name}</p>
                    <p className="text-[10px] font-semibold text-[#a16b15] capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Role Switcher Menu */}
                {isRoleDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsRoleDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#e8e3d8] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Role Portal
                    </div>
                    {(['student', 'mentor', 'class_teacher', 'hod', 'admin'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium capitalize flex items-center justify-between hover:bg-[#faf7f2] transition-colors ${
                          currentUser.role === r ? 'text-[#385529] font-bold bg-[#eef5ec]' : 'text-gray-700'
                        }`}
                      >
                        <span>{r.replace('_', ' ')}</span>
                        {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-[#385529]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </header>

      {/* About & Instructions Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};
