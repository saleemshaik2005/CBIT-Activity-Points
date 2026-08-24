'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck, UserPlus, Search, Edit2 } from 'lucide-react';
import { UserRole } from '@/types';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const [userList, setUserList] = useState([
    { id: '1', name: 'Shaik Saleem', email: 'saleemshaik2005@cbit.ac.in', roll: '160122771045', role: 'student' as UserRole, mentor: 'Faculty Mentor' },
    { id: '2', name: 'Sneha Reddy', email: 'sneha.reddy@cbit.ac.in', roll: '160122771046', role: 'student' as UserRole, mentor: 'Faculty Mentor' },
    { id: '3', name: 'Mohammed Farhan', email: 'farhan.le@cbit.ac.in', roll: '160122771301', role: 'student' as UserRole, mentor: 'Faculty Mentor' },
    { id: '4', name: 'Faculty Mentor', email: 'mentor.aids@cbit.ac.in', roll: 'FAC-AIDS-01', role: 'mentor' as UserRole, mentor: '-' },
    { id: '5', name: 'Head of Department', email: 'hod.aids@cbit.ac.in', roll: 'FAC-008', role: 'hod' as UserRole, mentor: '-' },
    { id: '6', name: 'Class Coordinator', email: 'coordinator.aids@cbit.ac.in', roll: 'FAC-002', role: 'class_teacher' as UserRole, mentor: '-' },
  ]);

  const mentors = ['Faculty Mentor', 'Senior Faculty Mentor', 'Department Coordinator', 'Associate Mentor'];

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUserList(userList.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleMentorChange = (id: string, newMentor: string) => {
    setUserList(userList.map(u => u.id === id ? { ...u, mentor: newMentor } : u));
  };

  const filtered = userList.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.roll.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#385529] dark:text-gray-300 hover:text-[#a71a1b] dark:hover:text-white transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Hub</span>
          </Link>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">User Management & Mentor Allocation</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Assign user roles and map students to their designated faculty counselors across departments.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by student name, roll number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 shadow-2xs"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] text-[#385529] dark:text-gray-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-3">Roll / ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Assigned Faculty Mentor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1c2718] dark:text-white">{user.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-700 dark:text-gray-300">{user.roll}</td>
                  <td className="py-3.5 px-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="text-xs p-1.5 rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] font-medium bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 capitalize"
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="class_teacher">Class Teacher</option>
                      <option value="hod">HOD</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3">
                    {user.role === 'student' ? (
                      <select
                        value={user.mentor}
                        onChange={(e) => handleMentorChange(user.id, e.target.value)}
                        className="text-xs p-1.5 rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] font-medium bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100"
                      >
                        {mentors.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-400 text-[11px]">N/A (Faculty/Staff)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
