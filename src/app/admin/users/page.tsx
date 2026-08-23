'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck, UserPlus, Search, Edit2 } from 'lucide-react';
import { UserRole } from '@/types';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const [userList, setUserList] = useState([
    { id: '1', name: 'Rahul Sharma', email: 'rahul.sharma@cbit.ac.in', roll: '160122733045', role: 'student' as UserRole, mentor: 'Dr. K. Radhika' },
    { id: '2', name: 'Sneha Reddy', email: 'sneha.reddy@cbit.ac.in', roll: '160122733046', role: 'student' as UserRole, mentor: 'Dr. K. Radhika' },
    { id: '3', name: 'Mohammed Farhan', email: 'farhan.le@cbit.ac.in', roll: '160122733301', role: 'student' as UserRole, mentor: 'Prof. M. Srinivasa Rao' },
    { id: '4', name: 'Dr. K. Radhika', email: 'kradhika.cse@cbit.ac.in', roll: 'FAC-014', role: 'mentor' as UserRole, mentor: '-' },
    { id: '5', name: 'Prof. M. Srinivasa Rao', email: 'srinivasa.cse@cbit.ac.in', roll: 'FAC-008', role: 'class_teacher' as UserRole, mentor: '-' },
    { id: '6', name: 'Dr. Y. Rama Devi', email: 'hod_cse@cbit.ac.in', roll: 'FAC-001', role: 'hod' as UserRole, mentor: '-' },
  ]);

  const mentors = ['Dr. K. Radhika', 'Prof. M. Srinivasa Rao', 'Dr. T. Sridevi', 'Dr. B. Indira'];

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Hub</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">User Management & Mentor Allocation</h1>
          <p className="text-xs text-gray-500">
            Assign user roles and map students to their designated faculty counselors.
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
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-3">Roll / ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Assigned Faculty Mentor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{user.name}</div>
                    <div className="text-[11px] text-gray-500">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-gray-700">{user.roll}</td>
                  <td className="py-3.5 px-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="text-xs p-1.5 rounded-lg border border-gray-300 font-medium bg-white capitalize"
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
                        className="text-xs p-1.5 rounded-lg border border-gray-300 font-medium bg-white"
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
