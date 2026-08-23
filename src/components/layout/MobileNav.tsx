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
  Bell,
} from 'lucide-react';
import { UserRole } from '@/types';

export const MobileNav: React.FC = () => {
  const { currentUser, isAuthenticated, unreadCount } = useApp();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'AI Upload', href: '/student/upload', icon: Sparkles },
      { label: 'History', href: '/student/history', icon: FileCheck },
      { label: 'Notifs', href: '/notifications', icon: Bell },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
    mentor: [
      { label: 'Queue', href: '/mentor', icon: CheckCircle },
      { label: 'Mentees', href: '/mentor/mentees', icon: Users },
      { label: 'Rules', href: '/mentor/rules', icon: BookOpen },
      { label: 'Notifs', href: '/notifications', icon: Bell },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
    class_teacher: [
      { label: 'Class', href: '/teacher', icon: LayoutDashboard },
      { label: 'Reports', href: '/teacher/reports', icon: FileCheck },
      { label: 'Notifs', href: '/notifications', icon: Bell },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
    hod: [
      { label: 'Analytics', href: '/hod', icon: LayoutDashboard },
      { label: 'Signoff', href: '/hod/signoff', icon: CheckCircle },
      { label: 'Notifs', href: '/notifications', icon: Bell },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
    admin: [
      { label: 'Admin', href: '/admin', icon: LayoutDashboard },
      { label: 'Rules', href: '/admin/rules', icon: Settings },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Notifs', href: '/notifications', icon: Bell },
    ],
  };

  const items = roleNavItems[currentUser.role] || roleNavItems.student;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#18191e]/95 backdrop-blur-md border-t border-[#e8e3d8] dark:border-[#282932] shadow-xl px-2 py-1.5 pb-safe transition-colors">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isNotif = item.label === 'Notifs';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#385529] dark:text-white font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#a71a1b] dark:hover:text-gray-200'
              }`}
            >
              <div className={`p-1 rounded-lg relative ${isActive ? 'bg-[#eef5ec] dark:bg-[#22232a]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#385529] dark:text-emerald-400 stroke-[2.5]' : 'text-[#a16b15] dark:text-gray-400'}`} />
                {isNotif && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#a71a1b] dark:bg-red-500 text-white font-bold text-[8px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
