'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  FileCheck,
  CheckCircle,
  Users,
  Settings,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '@/types';

export const MobileNav: React.FC = () => {
  const { currentUser } = useApp();
  const pathname = usePathname();

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'AI Upload', href: '/student/upload', icon: Sparkles },
      { label: 'History', href: '/student/history', icon: FileCheck },
      { label: 'Rules', href: '/student/guidelines', icon: BookOpen },
    ],
    mentor: [
      { label: 'Queue', href: '/mentor', icon: CheckCircle },
      { label: 'Mentees', href: '/mentor/mentees', icon: Users },
      { label: 'Rules', href: '/mentor/rules', icon: BookOpen },
    ],
    class_teacher: [
      { label: 'Class', href: '/teacher', icon: LayoutDashboard },
      { label: 'Reports', href: '/teacher/reports', icon: FileCheck },
    ],
    hod: [
      { label: 'Analytics', href: '/hod', icon: LayoutDashboard },
      { label: 'Signoff', href: '/hod/signoff', icon: CheckCircle },
    ],
    admin: [
      { label: 'Admin', href: '/admin', icon: LayoutDashboard },
      { label: 'Rules', href: '/admin/rules', icon: Settings },
      { label: 'Users', href: '/admin/users', icon: Users },
    ],
  };

  const items = roleNavItems[currentUser.role] || roleNavItems.student;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-900 font-normal'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-gray-400'}`} />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
