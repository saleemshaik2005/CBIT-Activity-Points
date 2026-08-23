'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp, DEMO_USERS } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  Award,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, selectedRole);
    setLoading(false);

    // Redirect to respective dashboard
    if (selectedRole === 'student') router.push('/student');
    else if (selectedRole === 'mentor') router.push('/mentor');
    else if (selectedRole === 'class_teacher') router.push('/teacher');
    else if (selectedRole === 'hod') router.push('/hod');
    else router.push('/admin');
  };

  const handleQuickLogin = async (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    setEmail(demoUser.email);
    setPassword('••••••••');
    setSelectedRole(role);
    setLoading(true);
    await login(demoUser.email, role);
    setLoading(false);

    if (role === 'student') router.push('/student');
    else if (role === 'mentor') router.push('/mentor');
    else if (role === 'class_teacher') router.push('/teacher');
    else if (role === 'hod') router.push('/hod');
    else router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      
      {/* CBIT Header Icon */}
      <div className="text-center space-y-2 mb-6">
        <Link href="/" className="inline-flex items-center justify-center group">
          <img
            src="/images/cbit-crest.png"
            alt="CBIT Crest"
            className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#385529] dark:text-[#4ade80] tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter your credentials to access your CBIT Activity dashboard
        </p>
      </div>

      {/* Main Login Card (Styled with Dark Mode & Clean Border) */}
      <div className="w-full max-w-md bg-white dark:bg-[#151f12] rounded-3xl p-6 sm:p-8 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xl space-y-6">
        
        <form onSubmit={handleSignIn} className="space-y-4">
          
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@cbit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529] font-medium"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15] cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Quick Test Accounts Section */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-[#2b3d26]">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Quick Test Accounts (Development Mode)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] hover:bg-[#eef5ec] dark:hover:bg-[#22351e] border border-[#e8e3d8] dark:border-[#2b3d26] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#385529] dark:text-[#4ade80] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">Student Portal</span>
              <span className="text-[10px] text-gray-500">Shaik Saleem</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('mentor')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] hover:bg-[#fbf5eb] dark:hover:bg-[#22351e] border border-[#e8e3d8] dark:border-[#2b3d26] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#a16b15] dark:text-[#fbbf24] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">Faculty Mentor</span>
              <span className="text-[10px] text-gray-500">Dr. D. Ramana</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('hod')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] hover:bg-[#fdf2f2] dark:hover:bg-[#22351e] border border-[#e8e3d8] dark:border-[#2b3d26] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#a71a1b] dark:text-[#f87171] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">HoD AI&DS</span>
              <span className="text-[10px] text-gray-500">Dr. K. Radhika</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-[#faf9f5] dark:bg-[#1a2817] hover:bg-[#eef5ec] dark:hover:bg-[#22351e] border border-[#e8e3d8] dark:border-[#2b3d26] transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#385529] dark:text-[#4ade80] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">Administrator</span>
              <span className="text-[10px] text-gray-500">Academic Section</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-[#a16b15] dark:text-[#fbbf24] font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
