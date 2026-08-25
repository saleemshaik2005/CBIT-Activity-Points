'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Bell,
  Sun,
  Moon,
  LogOut,
  LogIn,
} from 'lucide-react';
import { AboutModal } from '@/components/modals/AboutModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    theme,
    toggleTheme,
    isAuthenticated,
    logout,
    unreadCount,
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ElementType }[]> = {
    student: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'AI Upload', href: '/student/upload', icon: Sparkles },
      { label: 'Submissions', href: '/student/history', icon: FileCheck },
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

  const roleDefaultRoutes: Record<UserRole, string> = {
    student: '/student',
    mentor: '/mentor',
    class_teacher: '/teacher',
    hod: '/hod',
    admin: '/admin',
  };

  const currentNav = isAuthenticated ? roleNavItems[currentUser.role] || roleNavItems.student : [];

  const handleRoleSwitch = (r: UserRole) => {
    switchRole(r);
    setIsUserMenuOpen(false);
    router.push(roleDefaultRoutes[r] || '/');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#18191e]/95 backdrop-blur-md border-b border-[#e8e3d8] dark:border-[#282932] shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Official Crest & Title */}
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group flex-shrink-0">
              <img
                src="/images/cbit-crest.png"
                alt="CBIT Crest"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform"
              />

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-serif font-extrabold text-[#385529] dark:text-gray-100 text-sm sm:text-lg tracking-tight leading-none group-hover:text-[#a71a1b] dark:group-hover:text-white transition-colors">
                      CBIT Student Portfolio
                    </span>
                    <span className="hidden sm:inline text-[9px] bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-gray-300 border border-[#a16b15]/30 dark:border-[#2e3039] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Autonomous
                    </span>
                  </div>
                  <p className="text-[10px] text-[#3b566e] dark:text-gray-400 font-medium tracking-tight mt-0.5 hidden xs:block">
                    CBIT Hyderabad-75 • Student Portfolio Management System
                  </p>
                </div>
            </Link>

            {/* Center: Desktop Role Navigation */}
            {isAuthenticated ? (
              <nav className="hidden lg:flex items-center space-x-1">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-white border-b-2 border-[#385529] dark:border-emerald-500'
                          : 'text-[#385529] dark:text-gray-300 hover:text-[#a71a1b] dark:hover:text-white hover:bg-[#faf7f2] dark:hover:bg-[#22232a]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#385529] dark:text-emerald-400' : 'text-[#a16b15] dark:text-gray-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            ) : null}

            {/* Right: Theme Toggle, Notifications, Guide, GitHub & User Menu */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
              
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] transition-all cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700" />
                )}
              </button>

              {/* About & Guide Modal Button */}
              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] transition-colors cursor-pointer"
                title="About System & User Guide"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                <span>Guide</span>
              </button>

              {/* GitHub Link */}
              <a
                href="https://github.com/saleemshaik2005/CBIT-Activity-Points"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] transition-all"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </a>

              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] transition-all"
                    title="View notifications"
                  >
                    <Bell className="w-4 h-4 text-[#385529] dark:text-gray-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a71a1b] dark:bg-red-500 text-white font-bold text-[9px] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu & Role Selector Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-1 sm:p-1.5 rounded-xl hover:bg-[#faf7f2] dark:hover:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] transition-all cursor-pointer"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#385529] dark:bg-[#2a2b33] text-white dark:text-gray-200 font-bold flex items-center justify-center text-xs border border-transparent dark:border-[#383a45]">
                        {currentUser.full_name.charAt(0)}
                      </div>
                      <div className="hidden sm:block text-left pr-1">
                        <p className="text-xs font-bold text-[#1c2718] dark:text-gray-200 leading-tight">{currentUser.full_name}</p>
                        <p className="text-[10px] font-semibold text-[#a16b15] dark:text-gray-400 capitalize">
                          {currentUser.role.replace('_', ' ')}
                        </p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1c1d22] rounded-2xl shadow-xl border border-[#e8e3d8] dark:border-[#2e3039] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="px-3.5 py-2 border-b border-gray-100 dark:border-[#2a2b33]">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.full_name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                        </div>

                        <div className="py-1">
                          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Switch Active Role
                          </div>
                          {(['student', 'mentor', 'class_teacher', 'hod', 'admin'] as UserRole[]).map((r) => (
                            <button
                              key={r}
                              onClick={() => handleRoleSwitch(r)}
                              className={`w-full text-left px-3.5 py-1.5 text-xs font-medium capitalize flex items-center justify-between hover:bg-[#faf7f2] dark:hover:bg-[#22232a] transition-colors cursor-pointer ${
                                currentUser.role === r ? 'text-[#385529] dark:text-white font-bold bg-[#eef5ec] dark:bg-[#22232a]' : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <span>{r.replace('_', ' ')}</span>
                              {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-[#385529] dark:bg-emerald-400" />}
                            </button>
                          ))}
                        </div>

                        <div className="pt-1 border-t border-gray-100 dark:border-[#2a2b33] space-y-0.5">
                          <Link
                            href="/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#22232a] flex items-center space-x-2"
                          >
                            <Settings className="w-3.5 h-3.5 text-gray-400" />
                            <span>Settings & Profile</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-[#a71a1b] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center space-x-2 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-xs font-bold text-[#385529] dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#22232a] rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex items-center space-x-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 text-xs font-bold bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* About & Instructions Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};
