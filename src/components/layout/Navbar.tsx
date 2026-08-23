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
  User,
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

  const currentNav = isAuthenticated ? roleNavItems[currentUser.role] || roleNavItems.student : [];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/login');
  };

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
              {/* Dark Mode Switcher in Top Bar */}
              <button
                type="button"
                onClick={toggleTheme}
                className="text-[#dfa94b] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline capitalize">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <span className="text-white/30">|</span>

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
        <div className="bg-white dark:bg-[#151f12] border-b border-[#e8e3d8] dark:border-[#2b3d26] transition-colors">
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
                    <span className="font-serif font-extrabold text-[#385529] dark:text-[#4ade80] text-base sm:text-xl tracking-tight leading-none group-hover:text-[#a71a1b] transition-colors">
                      CBIT Activity Point System
                    </span>
                    <span className="hidden sm:inline text-[9px] bg-[#fbf5eb] dark:bg-[#1a2817] text-[#a16b15] dark:text-[#fbbf24] border border-[#a16b15]/40 font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Autonomous
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#3b566e] dark:text-gray-400 font-medium tracking-tight mt-0.5">
                    Student Activity Points & Verification Engine
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              {isAuthenticated ? (
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
                            ? 'bg-[#eef5ec] dark:bg-[#22351e] text-[#385529] dark:text-[#4ade80] border-b-2 border-[#385529] dark:border-[#4ade80]'
                            : 'text-[#385529] dark:text-gray-300 hover:text-[#a71a1b] hover:bg-[#faf7f2] dark:hover:bg-[#1a2817]'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#385529] dark:text-[#4ade80]' : 'text-[#a16b15] dark:text-[#fbbf24]'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              ) : null}

              {/* Right Controls: Notifications & User Profile */}
              <div className="flex items-center space-x-3">
                
                {isAuthenticated ? (
                  <>
                    {/* Notification Bell */}
                    <Link
                      href="/notifications"
                      className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] border border-[#e8e3d8] dark:border-[#2b3d26] transition-all"
                      title="View notifications"
                    >
                      <Bell className="w-4 h-4 text-[#385529] dark:text-[#4ade80]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a71a1b] text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    {/* User Menu & Role Selector Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] border border-[#e8e3d8] dark:border-[#2b3d26] transition-all cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#385529] dark:bg-[#4ade80] text-[#dfa94b] dark:text-[#0d140b] font-bold flex items-center justify-center text-xs shadow-2xs">
                          {currentUser.full_name.charAt(0)}
                        </div>
                        <div className="hidden lg:block text-left pr-1">
                          <p className="text-xs font-bold text-[#1c2718] dark:text-white leading-tight">{currentUser.full_name}</p>
                          <p className="text-[10px] font-semibold text-[#a16b15] dark:text-[#fbbf24] capitalize">
                            {currentUser.role.replace('_', ' ')}
                          </p>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div
                          onMouseLeave={() => setIsUserMenuOpen(false)}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#151f12] rounded-2xl shadow-2xl border border-[#e8e3d8] dark:border-[#2b3d26] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div className="px-3.5 py-2 border-b border-gray-100 dark:border-[#2b3d26]">
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.full_name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                          </div>

                          <div className="py-1">
                            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Switch Active Role
                            </div>
                            {(['student', 'mentor', 'class_teacher', 'hod', 'admin'] as UserRole[]).map((r) => (
                              <button
                                key={r}
                                onClick={() => {
                                  switchRole(r);
                                  setIsUserMenuOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-1.5 text-xs font-medium capitalize flex items-center justify-between hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] transition-colors ${
                                  currentUser.role === r ? 'text-[#385529] dark:text-[#4ade80] font-bold bg-[#eef5ec] dark:bg-[#22351e]' : 'text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <span>{r.replace('_', ' ')}</span>
                                {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-[#385529] dark:bg-[#4ade80]" />}
                              </button>
                            ))}
                          </div>

                          <div className="pt-1 border-t border-gray-100 dark:border-[#2b3d26] space-y-0.5">
                            <Link
                              href="/settings"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] flex items-center space-x-2"
                            >
                              <Settings className="w-3.5 h-3.5 text-gray-400" />
                              <span>Settings & Profile</span>
                            </Link>

                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-3.5 py-1.5 text-xs text-[#a71a1b] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2 cursor-pointer"
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
                      className="px-4 py-2 text-xs font-bold text-[#385529] dark:text-[#4ade80] hover:bg-[#faf7f2] dark:hover:bg-[#1a2817] rounded-xl border border-[#e8e3d8] dark:border-[#2b3d26] transition-all flex items-center space-x-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 text-xs font-bold bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] rounded-xl shadow-xs transition-all"
                    >
                      Sign Up
                    </Link>
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
