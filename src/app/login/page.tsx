'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { createClient } from '@/lib/supabase/client';
import {
  Award,
  User,
  Lock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  ShieldAlert,
  LogOut,
  Mail,
} from 'lucide-react';

function LoginFormContent() {
  const { login, loginWithGoogle } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Test Mode password inputs
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // User Mode Google Auth inputs
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dual-mode state
  const [isTestMode, setIsTestMode] = useState(false);
  const [isCheckingMode, setIsCheckingMode] = useState(true);

  // URL query parameters for OAuth errors
  const urlError = searchParams.get('error');
  const unauthorizedEmail = searchParams.get('unauthorized_email');
  const modeParam = searchParams.get('mode');

  useEffect(() => {
    // Verify server-side if user is authenticated for Test Mode
    fetch('/api/auth/team-gate')
      .then((res) => res.json())
      .then((data) => {
        if (data.isTeamAuthenticated && modeParam === 'test') {
          setIsTestMode(true);
        } else {
          setIsTestMode(false);
        }
      })
      .catch(() => {
        setIsTestMode(false);
      })
      .finally(() => {
        setIsCheckingMode(false);
      });
  }, [modeParam]);

  const routeAfterAuth = () => {
    const activeRole = (localStorage.getItem('cbit_mar_active_role') || 'student') as UserRole;
    if (activeRole === 'student') router.push('/student');
    else if (activeRole === 'mentor') router.push('/mentor');
    else if (activeRole === 'class_teacher') router.push('/teacher');
    else if (activeRole === 'hod') router.push('/hod');
    else router.push('/admin');
  };

  // 1-Click Google OAuth via Supabase
  const handleGoogleOAuth = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);

    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.warn('[Google OAuth Error]', err);
      setErrorMsg(
        err.message?.includes('provider is not enabled')
          ? 'Google OAuth provider is being configured. Please enter your college Google email below to sign in.'
          : err.message || 'Google sign-in could not be initiated. Please verify your email below.'
      );
      setGoogleLoading(false);
    }
  };

  // Pre-check registered Google email with roster, then redirect to Google OAuth
  const handleVerifyAndSignInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = googleEmailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your registered Google Mail address.');
      return;
    }

    setErrorMsg(null);
    setGoogleLoading(true);

    try {
      // 1. Verify against official classroom roster
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.registered) {
        throw new Error(
          checkData.error ||
            `Access Denied: The Google account "${cleanEmail}" is not registered in the official CBIT AI&DS Section 2 classroom roster (67 Students & 6 Faculty).`
        );
      }

      // 2. Pre-check passed! Initiate Google OAuth with login_hint
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            login_hint: cleanEmail,
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.warn('[Google Sign-In Error]', err);
      setErrorMsg(err.message || 'Google Sign-In could not be initiated.');
      setGoogleLoading(false);
    }
  };

  // Test Mode Password Login
  const handleTestModeSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTestMode) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      await login(identifier, undefined, password);
      routeAfterAuth();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Multi-Role Switcher for Test Mode only
  const handleQuickUser = async (userIdentifier: string, userPassword?: string, fallbackRole?: UserRole) => {
    if (!isTestMode) return;
    setErrorMsg(null);
    setIdentifier(userIdentifier);
    setPassword(userPassword || '••••••••');
    setLoading(true);

    try {
      if (userPassword) {
        await login(userIdentifier, undefined, userPassword);
      } else if (fallbackRole) {
        await login(userIdentifier, fallbackRole);
      }
      routeAfterAuth();
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleExitTestMode = async () => {
    try {
      await fetch('/api/auth/team-gate', { method: 'DELETE' });
      localStorage.setItem('cbit_spms_portal_mode', 'user');
    } catch (e) {}
    setIsTestMode(false);
    router.push('/login?mode=user');
  };

  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Single Official College Logo */}
      <div className="text-center space-y-2 mb-6 flex flex-col items-center">
        <Link href="/" className="inline-flex items-center justify-center group mb-1">
          <img
            src="/images/cbit-logo.png"
            alt="Chaitanya Bharathi Institute of Technology (Autonomous)"
            className="h-14 sm:h-20 w-auto object-contain dark:brightness-110 dark:contrast-125 group-hover:scale-102 transition-transform"
          />
        </Link>
        <h1 className="text-xl sm:text-2xl font-serif font-black text-[#385529] dark:text-gray-100 tracking-tight">
          Student Portfolio Management System
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Department of Artificial Intelligence &amp; Data Science (AI&amp;DS)
        </p>
      </div>

      {/* Test Mode Active Banner (Only shown when server-verified in Test Mode) */}
      {isTestMode && (
        <div className="w-full max-w-md mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              🧪 Team Sandbox Mode Active (Direct Password &amp; Role Switcher)
            </span>
          </div>
          <button
            onClick={handleExitTestMode}
            className="text-[11px] font-semibold text-gray-500 hover:text-red-600 dark:text-gray-400 flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Test Mode</span>
          </button>
        </div>
      )}

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#1a1b20] rounded-3xl p-6 sm:p-8 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xl space-y-5">
        
        {/* Error Notification Alert */}
        {(errorMsg || urlError) && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start space-x-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="flex-1 leading-relaxed">
              {errorMsg ? (
                errorMsg
              ) : urlError === 'unauthorized_email' ? (
                <span>
                  <strong>Access Restricted:</strong> The Google account (<strong>{unauthorizedEmail}</strong>) is not registered in the official CBIT AI&amp;DS roster. Please sign in with your college-registered Google Mail.
                </span>
              ) : (
                urlError
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. USER MODE: STRICT GOOGLE AUTHENTICATION ONLY (NO PASSWORD BYPASS)     */}
        {/* ========================================================================= */}
        {!isTestMode ? (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#385529] dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Institutional Google Authentication</span>
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300 pt-1 leading-relaxed">
                Sign in with your verified CBIT Google Mail address to access your student or faculty portfolio.
              </p>
            </div>

            {/* Primary Action: 1-Click Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleOAuth}
              disabled={googleLoading}
              className="w-full py-3 px-4 bg-white dark:bg-[#121214] hover:bg-gray-50 dark:hover:bg-[#1f2026] text-gray-800 dark:text-gray-100 font-bold text-xs rounded-xl border-2 border-gray-200 dark:border-[#2e3039] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>Sign in with Google Account</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-gray-200 dark:border-[#2e3039] w-full"></div>
              <span className="bg-white dark:bg-[#1a1b20] px-3 text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                or verify registered email first
              </span>
            </div>

            {/* Email Pre-check Form that launches Google OAuth */}
            <form onSubmit={handleVerifyAndSignInWithGoogle} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Registered CBIT Google Mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529] font-medium"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] space-y-1">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#385529] dark:text-emerald-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Strict Institutional Access</span>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Only registered CBIT AI&amp;DS Section 2 accounts (67 Students &amp; 6 Faculty) are authorized. Every user must authenticate through Google.
                </p>
              </div>

              <button
                type="submit"
                disabled={googleLoading}
                className="w-full py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15] dark:border-emerald-700 cursor-pointer disabled:opacity-50"
              >
                <span>{googleLoading ? 'Verifying with Roster...' : 'Continue to Google Sign-In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. TEST MODE: SANDBOX PASSWORD LOGIN & MULTI-ROLE SWITCHER                */
          /* ========================================================================= */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#a16b15] dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Team Sandbox Access (No 2FA Required)</span>
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300 pt-1 leading-relaxed">
                Direct credentials login and multi-role testing for the 4-member project team.
              </p>
            </div>

            <form onSubmit={handleTestModeSignIn} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Roll Number or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="160124771... or email@cbit.ac.in"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#a16b15] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#a16b15]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#a16b15] hover:bg-[#85550e] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Verifying...' : 'Sign In (Sandbox Direct)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Multi-Role Switcher for Sandbox Testing */}
            <div className="space-y-3 pt-3 border-t border-amber-500/20">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  ⚡ 1-Click Role Switcher (Sandbox Only)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickUser('160124771129', 'Cbit@129', 'student')}
                  className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#eef5ec] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#385529] dark:text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Saleem (129)</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Student 1</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickUser('160124771310', 'Cbit@310', 'student')}
                  className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#eef5ec] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#385529] dark:text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Aslam (310)</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Student 2</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickUser('shobarani_aids@cbit.ac.in', 'Cbit@facultyM1', 'mentor')}
                  className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#a16b15] dark:text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Mentor 1</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Faculty Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickUser('srilakshmia_aids@cbit.ac.in', 'Cbit@facultyM3', 'mentor')}
                  className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#a16b15] dark:text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Mentor 3</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Faculty Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickUser('saisreetalla_aids@cbit.ac.in', 'Cbit@facultyCT', 'class_teacher')}
                  className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#f0f9ff] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Class Coordinator</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Teacher Analytics</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickUser('kradhika_aids@cbit.ac.in', 'Cbit@facultyHOD', 'hod')}
                  className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fdf2f2] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#a71a1b] dark:text-rose-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Head of Dept (HOD)</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Department Signoff</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Protected Institutional Footer */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-[#2a2b33]">
          <p className="text-[10.5px] text-gray-400 dark:text-gray-500">
            Official Portal for B.E. AI&amp;DS (2024-2028). Unauthorized access is strictly logged and audited.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[82vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#385529] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
