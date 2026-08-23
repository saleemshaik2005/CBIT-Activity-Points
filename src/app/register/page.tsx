'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { CBIT_DEPARTMENTS } from '@/lib/mar-constants';
import {
  GraduationCap,
  Briefcase,
  User,
  Mail,
  Lock,
  Building,
  Hash,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();

  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Artificial Intelligence and Data Science (AI&DS)');
  const [rollNumber, setRollNumber] = useState('');
  const [isLateralEntry, setIsLateralEntry] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const mappedRole: UserRole = role === 'student' ? 'student' : 'mentor';

    await register({
      full_name: fullName,
      email,
      department,
      roll_number: rollNumber,
      is_lateral_entry: isLateralEntry,
      role: mappedRole,
    });

    setLoading(false);
    if (mappedRole === 'student') router.push('/student');
    else router.push('/mentor');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <Link href="/" className="inline-flex items-center justify-center group">
          <img
            src="/images/cbit-crest.png"
            alt="CBIT Crest"
            className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#385529] dark:text-[#4ade80] tracking-tight">
          Sign Up
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Create your account for the CBIT Activity Point System
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-lg bg-white dark:bg-[#151f12] rounded-3xl p-6 sm:p-8 border border-[#e8e3d8] dark:border-[#2b3d26] shadow-xl space-y-6">
        
        {/* Role Tabs */}
        <div className="flex bg-[#faf9f5] dark:bg-[#1a2817] p-1 rounded-2xl border border-[#e8e3d8] dark:border-[#2b3d26]">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'student'
                ? 'bg-[#385529] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#385529]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('faculty')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'faculty'
                ? 'bg-[#385529] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#385529]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@cbit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
              >
                {CBIT_DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.name}>
                    {dept.code} — {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                {role === 'student' ? 'Roll Number' : 'Faculty ID'}
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={role === 'student' ? '160122771045' : 'FAC-014'}
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
                />
              </div>
            </div>
          </div>

          {role === 'student' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Student Category
              </label>
              <select
                value={isLateralEntry ? 'lateral' : 'regular'}
                onChange={(e) => setIsLateralEntry(e.target.value === 'lateral')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
              >
                <option value="regular">Regular Student (4-Year B.Tech — 60 Points Target)</option>
                <option value="lateral">Diploma Lateral Entry (Sem III to VIII — 50 Points Target)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2b3d26] bg-gray-50/50 dark:bg-[#1a2817] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white dark:text-[#0d140b] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15] cursor-pointer"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-[#2b3d26]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#a16b15] dark:text-[#fbbf24] font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
