'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Search,
  Filter,
  Download,
  GraduationCap,
  UserCheck,
  Briefcase,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { UserRole } from '@/types';

interface UserDirectoryItem {
  id: string;
  full_name: string;
  roll_number?: string;
  email: string;
  role: UserRole;
  department: string;
  section: string;
  batch_year: string;
  is_lateral_entry: boolean;
  mentor_id?: string;
  mentor_name?: string;
  avatar_url?: string;
}

const FACULTY_MENTORS = [
  { id: '378feeb5-4cd4-430e-812c-c9d95fa1734d', name: 'Dr. Shobarani Salvadi', label: 'Dr. Shobarani Salvadi (Mentor 1: 071-093)' },
  { id: 'b182853f-e309-4ffe-9d10-a68087cbf8c0', name: 'Dr. SHEENA MOHAMMED', label: 'Dr. SHEENA MOHAMMED (Mentor 2: 094-117)' },
  { id: 'dd38a4de-c509-44dd-99c6-5d98f6bb29c4', name: 'Dr. Anireddy Srilakshmi', label: 'Dr. Anireddy Srilakshmi (Mentor 3: 118-313)' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState<'all' | UserRole>('all');
  const [mentorFilter, setMentorFilter] = useState<string>('all');
  const [admissionFilter, setAdmissionFilter] = useState<'all' | 'regular' | 'lateral'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/students?role=all');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setUsers(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMentorChange = async (studentId: string, studentName: string, newMentorId: string) => {
    const selectedMentor = FACULTY_MENTORS.find((m) => m.id === newMentorId);
    const newMentorName = selectedMentor ? selectedMentor.name : 'Unassigned';

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === studentId
          ? { ...u, mentor_id: newMentorId || undefined, mentor_name: newMentorName }
          : u
      )
    );

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reassign_mentor',
          payload: { studentId, mentorId: newMentorId },
        }),
      });
      if (res.ok) {
        showToast(`Assigned ${studentName} to ${newMentorName}`);
      } else {
        showToast(`Failed to update mentor on server. Please try again.`);
      }
    } catch (err) {
      console.error('Failed to save mentor reassignment:', err);
      showToast(`Error updating mentor assignment.`);
    }
  };

  const handleRoleChange = async (userId: string, userName: string, newRole: UserRole) => {
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_user_role',
          payload: { userId, role: newRole },
        }),
      });
      if (res.ok) {
        showToast(`Updated role for ${userName} to ${newRole.toUpperCase()}`);
      }
    } catch (err) {
      console.error('Failed to save role update:', err);
    }
  };

  // Metrics
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const regularStudents = users.filter((u) => u.role === 'student' && !u.is_lateral_entry).length;
  const lateralStudents = users.filter((u) => u.role === 'student' && u.is_lateral_entry).length;
  const mentorsCount = users.filter((u) => u.role === 'mentor').length;
  const facultyStaffCount = users.filter((u) => u.role !== 'student').length;

  // Filtered list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role tab filter
      if (activeRoleTab !== 'all' && u.role !== activeRoleTab) return false;

      // Mentor filter (for students)
      if (mentorFilter !== 'all') {
        if (mentorFilter === 'unassigned' && u.mentor_id) return false;
        if (mentorFilter !== 'unassigned' && u.mentor_id !== mentorFilter) return false;
      }

      // Admission filter (regular vs lateral)
      if (admissionFilter === 'regular' && (u.role !== 'student' || u.is_lateral_entry)) return false;
      if (admissionFilter === 'lateral' && (u.role !== 'student' || !u.is_lateral_entry)) return false;

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = u.full_name?.toLowerCase().includes(query);
        const matchesRoll = u.roll_number?.toLowerCase().includes(query);
        const matchesEmail = u.email?.toLowerCase().includes(query);
        const matchesMentor = u.mentor_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesRoll && !matchesEmail && !matchesMentor) return false;
      }

      return true;
    });
  }, [users, activeRoleTab, mentorFilter, admissionFilter, search]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Roll Number', 'Email', 'Role', 'Admission Type', 'Department', 'Section', 'Assigned Mentor'];
    const rows = filteredUsers.map((u) => [
      `"${u.full_name}"`,
      `"${u.roll_number || 'N/A'}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.is_lateral_entry ? 'Lateral Entry' : '4-Year Regular'}"`,
      `"${u.department || 'AI&DS'}"`,
      `"${u.section || '2'}"`,
      `"${u.mentor_name || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBIT_SPMS_Users_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 bg-[#385529] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in border border-[#a16b15]/30">
          <CheckCircle2 className="w-4 h-4 text-[#dfa94b]" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
              User Management & Mentor Allocation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 border border-[#385529]/20">
              {users.length} Active Records
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time directory for CBIT AI&DS Section 2. Manage student credentials, inspect faculty counselor mappings, and re-allocate mentees.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-2 bg-white dark:bg-[#22232a] text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] hover:bg-gray-50 dark:hover:bg-[#2c2d36] transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Refresh directory from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#385529]' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#dfa94b]" />
            <span>Export Roster CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Students Roster</span>
            <GraduationCap className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#385529] dark:text-white">{totalStudents}</span>
            <span className="text-[11px] text-gray-400">Total Enrolled</span>
          </div>
          <div className="mt-1 text-[10px] text-gray-500 flex space-x-2">
            <span>{regularStudents} Regular</span>
            <span>•</span>
            <span className="text-[#a16b15] font-semibold">{lateralStudents} Lateral Entry</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Faculty Mentors</span>
            <UserCheck className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#a16b15] dark:text-amber-400">{mentorsCount}</span>
            <span className="text-[11px] text-gray-400">Designated</span>
          </div>
          <div className="mt-1 text-[10px] text-gray-500">
            Dr. Shobha, Dr. Sheena, Dr. Srilakshmi
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Faculty & Staff</span>
            <Briefcase className="w-4 h-4 text-[#3b566e] dark:text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#3b566e] dark:text-sky-400">{facultyStaffCount}</span>
            <span className="text-[11px] text-gray-400">Accounts</span>
          </div>
          <div className="mt-1 text-[10px] text-gray-500">
            Coordinator, HOD & Admin Leads
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Section Allocation</span>
            <ShieldCheck className="w-4 h-4 text-[#a71a1b] dark:text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#a71a1b] dark:text-rose-400">100%</span>
            <span className="text-[11px] text-gray-400">Mapped</span>
          </div>
          <div className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            All 67 Mentees Assigned
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e8e3d8] dark:border-[#2c2d36] pb-2">
        <button
          onClick={() => setActiveRoleTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeRoleTab === 'all'
              ? 'bg-[#385529] text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-[#eef5ec] dark:hover:bg-[#22232a]'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveRoleTab('student')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeRoleTab === 'student'
              ? 'bg-[#385529] text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-[#eef5ec] dark:hover:bg-[#22232a]'
          }`}
        >
          Students ({totalStudents})
        </button>
        <button
          onClick={() => setActiveRoleTab('mentor')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeRoleTab === 'mentor'
              ? 'bg-[#385529] text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-[#eef5ec] dark:hover:bg-[#22232a]'
          }`}
        >
          Mentors ({mentorsCount})
        </button>
        <button
          onClick={() => setActiveRoleTab('class_teacher')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeRoleTab === 'class_teacher'
              ? 'bg-[#385529] text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-[#eef5ec] dark:hover:bg-[#22232a]'
          }`}
        >
          Class Coordinator (1)
        </button>
        <button
          onClick={() => setActiveRoleTab('hod')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeRoleTab === 'hod'
              ? 'bg-[#385529] text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-[#eef5ec] dark:hover:bg-[#22232a]'
          }`}
        >
          HOD (1)
        </button>
        <button
          onClick={() => setActiveRoleTab('admin')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeRoleTab === 'admin'
              ? 'bg-[#385529] text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-[#eef5ec] dark:hover:bg-[#22232a]'
          }`}
        >
          Admin (1)
        </button>
      </div>

      {/* Search & Sub-filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, roll number, email, or mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 shadow-2xs"
          />
        </div>

        {/* Mentor Filter */}
        <div className="md:col-span-3">
          <select
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385529]"
          >
            <option value="all">All Counselors / Mentors</option>
            {FACULTY_MENTORS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Admission Type Filter */}
        <div className="md:col-span-3">
          <select
            value={admissionFilter}
            onChange={(e) => setAdmissionFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385529]"
          >
            <option value="all">All Admission Types</option>
            <option value="regular">4-Year Regular Only ({regularStudents})</option>
            <option value="lateral">Lateral Entry (Diploma) Only ({lateralStudents})</option>
          </select>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-between bg-[#faf9f5] dark:bg-[#16171c]">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <span className="text-xs font-serif font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Registered Users & Counselors Directory ({filteredUsers.length})
            </span>
          </div>
          <span className="text-[11px] text-gray-500">
            Showing {filteredUsers.length} of {users.length} accounts
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#385529] mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Loading live accounts directory from database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">No matching user records found</p>
            <p className="text-[11px] text-gray-400">Try adjusting your search criteria or clearing filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f2ea] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] text-[#385529] dark:text-gray-300 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student / User</th>
                  <th className="py-3 px-3">Roll No / ID</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Admission Type</th>
                  <th className="py-3 px-3">Assigned Faculty Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a]/50 transition-colors"
                  >
                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#eef5ec] dark:bg-[#2a3825] text-[#385529] dark:text-emerald-400 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-[#385529]/20">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-[#1c2718] dark:text-white flex items-center space-x-1.5">
                            <span>{user.full_name}</span>
                            {user.role === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#a71a1b] text-white">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Roll / ID */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                        {user.roll_number || 'N/A'}
                      </span>
                    </td>

                    {/* Role Selector */}
                    <td className="py-3.5 px-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, user.full_name, e.target.value as UserRole)}
                        className="text-xs py-1 px-2 rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] font-medium bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 capitalize"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="class_teacher">Class Teacher</option>
                        <option value="hod">HOD</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Admission Type */}
                    <td className="py-3.5 px-3">
                      {user.role === 'student' ? (
                        user.is_lateral_entry ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf7f2] dark:bg-amber-950/30 text-[#a16b15] dark:text-amber-400 border border-[#dfa94b]/40">
                            Lateral Entry (Diploma)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef5ec] dark:bg-emerald-950/30 text-[#385529] dark:text-emerald-400 border border-[#385529]/20">
                            4-Year Regular B.Tech
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400 text-[11px]">Faculty / Staff</span>
                      )}
                    </td>

                    {/* Assigned Mentor Dropdown */}
                    <td className="py-3.5 px-3">
                      {user.role === 'student' ? (
                        <div className="flex items-center space-x-1.5">
                          <select
                            value={user.mentor_id || ''}
                            onChange={(e) => handleMentorChange(user.id, user.full_name, e.target.value)}
                            className="text-xs py-1 px-2.5 rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] font-medium bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-[#385529]"
                          >
                            <option value="">Unassigned</option>
                            {FACULTY_MENTORS.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">N/A (Faculty Account)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
