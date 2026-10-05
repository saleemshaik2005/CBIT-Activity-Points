'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  HelpCircle,
  FileCheck,
  QrCode,
  CheckCircle2,
  LogIn,
  Briefcase,
  Lock,
  AlertCircle,
  X,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { AboutModal } from '@/components/modals/AboutModal';

export default function HomePage() {
  const { switchRole, isAuthenticated, currentUser, logout } = useApp();
  const router = useRouter();

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeLoading, setPasscodeLoading] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isTeamUnlocked, setIsTeamUnlocked] = useState(false);

  // Check if team test mode is already unlocked
  useEffect(() => {
    fetch('/api/auth/team-gate')
      .then((res) => res.json())
      .then((data) => {
        if (data.isTeamAuthenticated) {
          setIsTeamUnlocked(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    switchRole(role);
    router.push(targetPath);
  };

  const handleEnterUserMode = () => {
    try {
      localStorage.setItem('cbit_spms_portal_mode', 'user');
    } catch (e) {}
    router.push('/login?mode=user');
  };

  const handleOpenTestModeModal = () => {
    if (isTeamUnlocked) {
      try {
        localStorage.setItem('cbit_spms_portal_mode', 'test');
      } catch (e) {}
      router.push('/login?mode=test');
      return;
    }
    setPasscodeError(null);
    setPasscodeInput('');
    setIsPasscodeModalOpen(true);
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;

    setPasscodeLoading(true);
    setPasscodeError(null);

    try {
      const res = await fetch('/api/auth/team-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid passcode.');
      }

      setIsTeamUnlocked(true);
      try {
        localStorage.setItem('cbit_spms_portal_mode', 'test');
      } catch (e) {}
      setIsPasscodeModalOpen(false);
      router.push('/login?mode=test');
    } catch (err: any) {
      setPasscodeError(err.message || 'Passcode verification failed.');
    } finally {
      setPasscodeLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto pt-2">
        {/* Single Official College Logo PNG */}
        <div className="flex items-center justify-center py-2 px-4 max-w-2xl mx-auto">
          <img
            src="/images/cbit-logo.png"
            alt="Chaitanya Bharathi Institute of Technology (Autonomous)"
            className="h-16 sm:h-22 w-auto object-contain dark:brightness-110 dark:contrast-125 drop-shadow-xs"
          />
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#385529] dark:text-gray-100 tracking-tight leading-tight">
          Student Portfolio Management System (SPMS)
        </h1>

        <div className="w-20 h-1 bg-[#a16b15] dark:bg-amber-400 mx-auto rounded-full" />

        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
          AI-powered certificate verification, 100 AICTE activity points tracking, faculty mentor signoffs, and official graduation portfolios for the Department of AI &amp; DS.
        </p>

        {/* If user is already authenticated, show direct resume dashboard banner */}
        {isAuthenticated && currentUser?.id && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#eef5ec] dark:bg-[#1f2026] border border-[#385529]/30 dark:border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <p className="text-xs font-bold text-[#385529] dark:text-emerald-400">
                Active Session: {currentUser.full_name}
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 capitalize">
                Signed in as {currentUser.role.replace('_', ' ')} ({currentUser.email})
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <Link
                href={
                  currentUser.role === 'mentor'
                    ? '/mentor'
                    : currentUser.role === 'class_teacher'
                    ? '/teacher'
                    : currentUser.role === 'hod'
                    ? '/hod'
                    : currentUser.role === 'admin'
                    ? '/admin'
                    : '/student'
                }
                className="px-3.5 py-1.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-[#2a2b33] text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Dual Mode Entry Gateway Cards */}
        <div className="pt-4 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Card 1: USER MODE (Official Academic Portal) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border-2 border-[#385529] dark:border-emerald-600 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#385529] dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  <span>Official Portal</span>
                </span>
                <span className="text-[10px] font-semibold text-gray-400">Class Mode</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                User Mode
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Standard access for all <strong>Students &amp; Faculty</strong>. Clean institutional login, certificate uploading (up to 50/day), mentor approvals, and AICTE point records.
              </p>
            </div>

            <button
              onClick={handleEnterUserMode}
              className="w-full py-2.5 px-4 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Enter User Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: TEST MODE (Project Team Sandbox) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border-2 border-[#a16b15] dark:border-amber-500/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#a16b15] dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Lock className="w-3 h-3 mr-1" />
                  <span>Team Only</span>
                </span>
                {isTeamUnlocked && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Unlocked ✓
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Test Mode
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Reserved for the <strong>4-Member Project Team</strong>. Protected by team passcode. Enables rapid multi-role switching, OCR debugger, and system audit logs.
              </p>
            </div>

            <button
              onClick={handleOpenTestModeModal}
              className="w-full py-2.5 px-4 bg-[#a16b15] hover:bg-[#85550e] dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isTeamUnlocked ? 'Open Test Mode →' : 'Unlock Test Mode'}</span>
            </button>
          </div>

        </div>

        {/* System Guide Action */}
        <div className="pt-2">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#385529] dark:hover:text-emerald-400 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Read AICTE Guidelines &amp; System Overview</span>
          </button>
        </div>
      </section>

      {/* Target Points Academic Requirements Card */}
      <section className="max-w-4xl mx-auto bg-white dark:bg-[#1a1b20] rounded-2xl p-6 sm:p-8 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-lg font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wide">
            Mandatory Graduation Activity Requirements &amp; Limits
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mandatory activity points required to qualify for B.E. / B.Tech degree completion at CBIT Autonomous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#385529] dark:text-emerald-400 tracking-wider block">
              4-Year Regular B.E. / B.Tech
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-black text-[#385529] dark:text-white">60 Points</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Target (Max 100 Pts Cap)</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Earn points across approved activities including MOOCs, sports, tech fests, hackathons, internships, and community service.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#faf9f5] dark:bg-[#121214] border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#a16b15] dark:text-amber-400 tracking-wider block">
              Diploma Lateral Entry (LE)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif font-black text-[#a16b15] dark:text-amber-400">45 Points</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Target (Max 75 Pts Cap)</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Direct second-year admitted students fulfill the 45 points minimum requirement (up to 75 max cap) before final degree signoff.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Workflow */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wide">
            How The System Works
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A seamless digital workflow from document upload to official portfolio generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold flex items-center justify-center text-sm border border-transparent dark:border-[#2e3039]">
              1
            </div>
            <h3 className="font-bold text-[#1c2718] dark:text-white text-sm">Upload Certificate Proof</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Drag-and-drop your certificate PDF or snap a photo directly from your smartphone or laptop.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 font-bold flex items-center justify-center text-sm border border-transparent dark:border-[#2e3039]">
              2
            </div>
            <h3 className="font-bold text-[#1c2718] dark:text-white text-sm">Automated Extraction</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              In-house OCR extracts event name, organization, dates, credential ID, and maps to the correct CBIT category.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold flex items-center justify-center text-sm border border-transparent dark:border-[#2e3039]">
              3
            </div>
            <h3 className="font-bold text-[#1c2718] dark:text-white text-sm">Mentor Verification</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Faculty counselors inspect your certificate and award points to your official printable graduation sheet.
            </p>
          </div>
        </div>
      </section>

      {/* Team Passcode Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#1a1b20] rounded-2xl shadow-2xl border border-[#e8e3d8] dark:border-[#2c2d36] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-[#a16b15] dark:text-amber-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  Project Team Verification
                </h3>
              </div>
              <button
                onClick={() => setIsPasscodeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Test mode is restricted to the 4-member development team. Enter the team passcode to unlock developer tools and multi-role testing.
            </p>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Team Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter team passcode"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#a16b15] dark:focus:ring-amber-400"
                  />
                </div>
              </div>

              {passcodeError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start space-x-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPasscodeModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-[#2e3039] text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#22232a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passcodeLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#a16b15] hover:bg-[#85550e] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <span>{passcodeLoading ? 'Verifying...' : 'Unlock Test Mode'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* About & Instructions Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
