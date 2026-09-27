'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp, DEMO_USERS } from '@/context/AppContext';
import { UserRole } from '@/types';
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
} from 'lucide-react';

function LoginFormContent() {
  const { login, loginWithGoogle } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  // Check URL query parameters for OAuth redirect error messages
  const urlError = searchParams.get('error');
  const unauthorizedEmail = searchParams.get('unauthorized_email');

  const routeAfterAuth = () => {
    const activeRole = (localStorage.getItem('cbit_mar_active_role') || 'student') as UserRole;
    if (activeRole === 'student') router.push('/student');
    else if (activeRole === 'mentor') router.push('/mentor');
    else if (activeRole === 'class_teacher') router.push('/teacher');
    else if (activeRole === 'hod') router.push('/hod');
    else router.push('/admin');
  };

  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    setIsGoogleModalOpen(true);
  };

  const handleGoogleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle(googleEmailInput.trim());
      setIsGoogleModalOpen(false);
      routeAfterAuth();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In verification failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login(identifier, undefined, password);
      routeAfterAuth();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUser = async (userIdentifier: string, userPassword?: string, fallbackRole?: UserRole) => {
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
      const activeRole = (localStorage.getItem('cbit_mar_active_role') || fallbackRole || 'student') as UserRole;
      if (activeRole === 'student') router.push('/student');
      else if (activeRole === 'mentor') router.push('/mentor');
      else if (activeRole === 'class_teacher') router.push('/teacher');
      else if (activeRole === 'hod') router.push('/hod');
      else router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <Link href="/" className="inline-flex items-center justify-center group">
          <img
            src="/images/cbit-crest.png"
            alt="CBIT Crest"
            className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#385529] dark:text-gray-100 tracking-tight">
          CBIT Student Portfolio System
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Chaitanya Bharathi Institute of Technology (Autonomous) | Dept. of AI&DS
        </p>
      </div>

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
                  <strong>Access Restricted:</strong> The Google account (<strong>{unauthorizedEmail}</strong>) is not registered in the official CBIT AI&DS Section 2 classroom roster. Please sign in with your college-registered Google Mail.
                </span>
              ) : (
                urlError
              )}
            </div>
          </div>
        )}

        {/* 1. Primary Student Login: Sign in with Google */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 bg-white dark:bg-[#121214] hover:bg-gray-50 dark:hover:bg-[#1f2026] text-gray-800 dark:text-gray-100 font-bold text-xs rounded-xl border-2 border-gray-200 dark:border-[#2e3039] shadow-sm hover:shadow transition-all flex items-center justify-center space-x-3 cursor-pointer group"
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
            <span>
              {googleLoading ? 'Verifying Google Account...' : 'Sign in with Google Mail (Recommended for Students)'}
            </span>
          </button>

          {isGoogleModalOpen && (
            <div className="p-4 rounded-2xl bg-[#faf9f5] dark:bg-[#121214] border-2 border-[#385529]/30 dark:border-emerald-800/50 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span className="text-xs font-serif font-bold text-gray-900 dark:text-white">
                    Google Mail Roster Sign-In
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-bold cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                Enter your college-registered Google Mail (`@gmail.com` or `@cbit.org.in`). Verified directly against the 67 AI&amp;DS Section 2 students and 6 faculty accounts.
              </p>
              <form onSubmit={handleGoogleVerifySubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  autoFocus
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="Enter your CBIT-registered Gmail address..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
                <button
                  type="submit"
                  disabled={googleLoading}
                  className="px-4 py-2 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {googleLoading ? 'Verifying...' : 'Sign In'}
                </button>
              </form>
            </div>
          )}

          <p className="text-[10px] text-center text-gray-500 dark:text-gray-400">
            One-click verified login. Protected by your CBIT Roster Google Account.
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-gray-200 dark:border-[#2a2b33] w-full"></div>
          <span className="bg-white dark:bg-[#1a1b20] px-3 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold shrink-0">
            Or sign in with Roll Number / Password
          </span>
          <div className="border-t border-gray-200 dark:border-[#2a2b33] w-full"></div>
        </div>

        {/* 2. Manual Form: Roll Number / Email + Password */}
        <form onSubmit={handleSignIn} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-gray-50/50 dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Credentials Guide Info Card */}
          <div className="p-3 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2e3039] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#385529] dark:text-emerald-400">
              <Info className="w-3.5 h-3.5" />
              <span>Login Instructions for Class</span>
            </div>
            <p className="text-[10.5px] text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>Students:</strong> Log in with Google above or enter Roll Number &amp; initial formula <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-[10px]">Cbit@&lt;last3digits&gt;</code> (e.g. <span className="font-semibold text-[#a16b15]">Cbit@310</span>).
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              <strong>Faculty:</strong> Log in with institutional email &amp; issued faculty password.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15] dark:border-emerald-700 cursor-pointer"
          >
            <span>{loading ? 'Verifying with Supabase...' : 'Sign In with Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 3. Quick Test Role Switcher (For Developer & Faculty Testing) */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-[#2a2b33]">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Quick Role Preview (Developer &amp; Testing Mode)
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
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Mentor: Dr. Anireddy Srilakshmi</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickUser('160124771310', 'Cbit@310', 'student')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#eef5ec] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#385529] dark:text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Aslam (310)</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Mentor: Dr. Anireddy Srilakshmi</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickUser('shobarani_aids@cbit.ac.in', 'Cbit@facultyM1', 'mentor')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#a16b15] dark:text-amber-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Mentor 1</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Dr. Shobarani (071-093)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickUser('srilakshmia_aids@cbit.ac.in', 'Cbit@facultyM3', 'mentor')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#a16b15] dark:text-amber-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Mentor 3</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Dr. Srilakshmi (118-313)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickUser('saisreetalla_aids@cbit.ac.in', 'Cbit@facultyCT', 'class_teacher')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#f0f9ff] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Class Coordinator</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Ms. Talla Sai Sree (11628)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickUser('kradhika_aids@cbit.ac.in', 'Cbit@facultyHOD', 'hod')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fdf2f2] dark:hover:bg-[#2a2b33] border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#a71a1b] dark:text-rose-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Head of Dept (HOD)</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Dr. K. Radhika</span>
            </button>
          </div>
        </div>

        {/* Protected Class Footer */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-[#2a2b33]">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Internal Academic Portal | AI&amp;DS Section 2 | For login assistance, contact Class Coordinator or System Administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[82vh] flex items-center justify-center">Loading login portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
