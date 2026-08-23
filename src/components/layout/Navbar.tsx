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
  UploadCloud,
  User,
  Users,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const pathname = usePathname();

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'AI Upload', href: '/student/upload', icon: Sparkles },
      { label: 'My Submissions', href: '/student/history', icon: FileCheck },
      { label: 'MAR Guidelines', href: '/student/guidelines', icon: BookOpen },
    ],
    mentor: [
      { label: 'Verification Queue', href: '/mentor', icon: CheckCircle },
      { label: 'Assigned Mentees', href: '/mentor/mentees', icon: Users },
      { label: 'MAR Rulebook', href: '/mentor/rules', icon: BookOpen },
    ],
    class_teacher: [
      { label: 'Class Overview', href: '/teacher', icon: LayoutDashboard },
      { label: 'Batch MAR Report', href: '/teacher/reports', icon: FileCheck },
    ],
    hod: [
      { label: 'Department Analytics', href: '/hod', icon: LayoutDashboard },
      { label: 'Graduation Signoff', href: '/hod/signoff', icon: GraduationCap },
    ],
    admin: [
      { label: 'Admin Hub', href: '/admin', icon: ShieldCheck },
      { label: 'MAR Rules & Caps', href: '/admin/rules', icon: Settings },
      { label: 'User Roles & Mentors', href: '/admin/users', icon: Users },
    ],
  };

  const currentNav = roleNavItems[currentUser.role] || roleNavItems.student;

  return (
    <header className="sticky top-0 z-40 w-full glass-header shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & College Branding */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-gray-900 text-lg tracking-tight">CBIT MAR</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">AI Powered</span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Activity Points Management System</p>
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher & User Profile Pill */}
          <div className="flex items-center space-x-3">
            {/* Quick Interactive Role Switcher */}
            <div className="flex items-center bg-gray-100/90 rounded-lg p-1 border border-gray-200 text-xs">
              <span className="text-gray-500 px-2 font-medium hidden lg:inline">View as:</span>
              {(['student', 'mentor', 'class_teacher', 'hod', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                    currentUser.role === r
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{currentUser.full_name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
