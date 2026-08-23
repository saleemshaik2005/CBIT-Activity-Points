'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  Award,
  BookOpen,
  CheckCircle,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Settings,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const pathname = usePathname();

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: 'Activity Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'AI Upload', href: '/student/upload', icon: Sparkles },
      { label: 'My Submissions', href: '/student/history', icon: FileCheck },
      { label: 'Activity Guidelines', href: '/student/guidelines', icon: BookOpen },
    ],
    mentor: [
      { label: 'Verification Queue', href: '/mentor', icon: CheckCircle },
      { label: 'Assigned Mentees', href: '/mentor/mentees', icon: Users },
      { label: 'Activity Rulebook', href: '/mentor/rules', icon: BookOpen },
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
    <header className="sticky top-0 z-40 w-full shadow-md">
      
      {/* CBIT Top Institutional Forest Green Header Bar (#385529) with Gold Line (#a16b15) */}
      <div className="bg-[#385529] text-white border-b-4 border-[#a16b15] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs tracking-wide">
            <span className="font-serif font-bold uppercase text-[#fdf8f0]">
              Chaitanya Bharathi Institute of Technology (Autonomous)
            </span>
            <span className="text-[#dfa94b] font-bold">•</span>
            <span className="text-[#dfa94b] font-semibold">Hyderabad-75</span>
            <span className="hidden md:inline text-white/80">| Affiliated to Osmania University | NAAC A++</span>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex items-center space-x-1 text-[11px]">
            <span className="text-[#f5e9d3] font-medium hidden md:inline">Portal View:</span>
            <div className="flex items-center bg-[#273e1c] rounded-md p-0.5 border border-[#a16b15]/60">
              {(['student', 'mentor', 'class_teacher', 'hod', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition-all ${
                    currentUser.role === r
                      ? 'bg-[#a16b15] text-white font-bold shadow-xs'
                      : 'text-[#e2ebd9] hover:text-white hover:bg-[#385529]'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Clean White Navigation Bar */}
      <div className="bg-white border-b border-[#e8e3d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* CBIT Official Brand & Activity Point System Identity */}
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#385529] to-[#273e1c] p-0.5 shadow-md flex items-center justify-center border-2 border-[#a16b15]">
                <div className="w-full h-full rounded-lg bg-[#385529] flex items-center justify-center text-[#dfa94b]">
                  <Award className="w-7 h-7 stroke-[2.2]" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-extrabold text-[#385529] text-xl tracking-tight leading-none group-hover:text-[#a71a1b] transition-colors">
                    CBIT Activity Point System
                  </span>
                  <span className="text-[10px] bg-[#fbf5eb] text-[#a16b15] border border-[#a16b15]/40 font-bold px-2 py-0.5 rounded-full uppercase">
                    Autonomous
                  </span>
                </div>
                <p className="text-[11px] text-[#3b566e] font-medium tracking-tight mt-0.5">
                  Automated Student Activity Points & Verification Platform
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
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#eef5ec] text-[#385529] border-b-2 border-[#385529]'
                        : 'text-[#385529] hover:text-[#a71a1b] hover:bg-[#faf7f2]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#385529]' : 'text-[#a16b15]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-3 pl-3 border-l border-[#e8e3d8]">
              <div className="w-9 h-9 rounded-full bg-[#385529] text-[#dfa94b] border border-[#a16b15] font-bold flex items-center justify-center text-xs shadow-xs">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#1c2718] leading-tight">{currentUser.full_name}</p>
                <p className="text-[10px] font-semibold text-[#a16b15] capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </header>
  );
};
