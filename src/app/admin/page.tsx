'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Settings,
  Users,
  ArrowRight,
  RotateCcw,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  Database,
  Bell,
  Activity,
  Sparkles,
  Layers,
  Clock,
  ShieldAlert,
  Send,
  Save,
  Check,
  Building,
  GraduationCap,
  FileText,
  Eye,
} from 'lucide-react';
import { DEPARTMENT_ALL_STUDENTS } from '@/lib/mar-constants';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: string;
  status: 'success' | 'warning' | 'info';
  details: string;
}

export default function AdminHubPage() {
  const {
    currentUser,
    categories,
    submissions,
    settings,
    updateSettings,
    resetToDefaults,
    addNotification,
  } = useApp();

  // Policy Settings State
  const [regularTarget, setRegularTarget] = useState(settings.regular_target_points);
  const [regularMax, setRegularMax] = useState(settings.regular_max_points || 100);
  const [lateralTarget, setLateralTarget] = useState(settings.lateral_entry_target_points);
  const [lateralMax, setLateralMax] = useState(settings.lateral_entry_max_points || 75);
  const [academicYear, setAcademicYear] = useState(settings.academic_year || '2025-2026');
  const [policySaveSuccess, setPolicySaveSuccess] = useState(false);

  // System Controls & Feature Toggles
  const [portalStatus, setPortalStatus] = useState<'active' | 'frozen' | 'maintenance'>('active');
  const [aiStrictness, setAiStrictness] = useState<'moderate' | 'strict' | 'forensic'>('strict');
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [lateSubmissionsAllowed, setLateSubmissionsAllowed] = useState(false);
  const [strictDocumentEnforcement, setStrictDocumentEnforcement] = useState(true);
  const [mentorSelfApproval, setMentorSelfApproval] = useState(true);

  // Announcement Broadcast State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'students' | 'mentors'>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'AI Authenticity Verification',
      user: 'Gemini 2.5 Forensics',
      role: 'System AI',
      status: 'success',
      details: 'Evaluated 12 student certificate uploads. 1 flagged with font inconsistency.',
    },
    {
      id: 'log-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 55).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'Mentor Bulk Approval',
      user: 'Dr. K. Ramana',
      role: 'Mentor',
      status: 'success',
      details: 'Approved 6 clean certificates for Section 2 students.',
    },
    {
      id: 'log-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'MAR Report Generated',
      user: 'Prof. M. Srinivasa Rao',
      role: 'Class Coordinator',
      status: 'info',
      details: 'Downloaded Section AI&DS-2 Batch MAR Master Register (PDF).',
    },
    {
      id: 'log-004',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'Security Sandbox Alert',
      user: 'Upload Validator',
      role: 'Security Engine',
      status: 'warning',
      details: 'Blocked non-document upload attempt (arbitrary photo) on student portal.',
    },
  ]);

  // Handle Saving Policy Limits
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      regular_target_points: Number(regularTarget),
      regular_max_points: Number(regularMax),
      lateral_entry_target_points: Number(lateralTarget),
      lateral_entry_max_points: Number(lateralMax),
      academic_year: academicYear,
    });

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'Policy Limits Modified',
      user: currentUser.full_name || 'Admin',
      role: 'Administrator',
      status: 'warning',
      details: `Updated MAR Target: Regular ${regularTarget} pts (Max ${regularMax}), Lateral ${lateralTarget} pts (Max ${lateralMax}), AY ${academicYear}.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setPolicySaveSuccess(true);
    setTimeout(() => setPolicySaveSuccess(false), 4000);
  };

  // Handle Institutional Announcement Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    addNotification({
      title: `📢 Campus Notice: ${broadcastTitle}`,
      message: broadcastMessage,
      type: 'announcement',
      recipient_role: broadcastTarget === 'all' ? undefined : broadcastTarget === 'students' ? 'student' : 'mentor',
    });

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'Campus Announcement Broadcast',
      user: currentUser.full_name || 'Admin',
      role: 'Administrator',
      status: 'info',
      details: `Sent notification "${broadcastTitle}" to ${broadcastTarget.toUpperCase()} recipients.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 1800);
  };

  // Handle Exporting All Submissions to CSV
  const handleExportAllSubmissionsCSV = () => {
    const headers = [
      'Submission ID',
      'Student Roll Number',
      'Student Name',
      'Department',
      'Section',
      'Activity Title',
      'Category Code',
      'Issuing Organization',
      'Event Date',
      'Semester',
      'Academic Year',
      'Claimed Points',
      'Awarded Points',
      'Status',
      'AI Authenticity Score (%)',
      'AI Tamper Risk (%)',
      'Credential ID',
      'Verification URL',
      'Submission Date',
    ].join(',');

    const rows = submissions.map((s) => {
      const auth = s.ai_tamper_analysis?.authenticityScore ?? 90;
      const risk = s.ai_tamper_analysis?.riskPercentage ?? 5;
      return [
        `"${s.id}"`,
        `"${s.student_roll_no || ''}"`,
        `"${s.student_name || ''}"`,
        `"${currentUser.department || 'AI&DS'}"`,
        `"Section ${s.student_section || ''}"`,
        `"${(s.activity_title || '').replace(/"/g, '""')}"`,
        s.category_id,
        `"${(s.issuing_organization || '').replace(/"/g, '""')}"`,
        `"${s.event_date}"`,
        s.semester,
        `"${s.academic_year}"`,
        s.claimed_points,
        s.awarded_points,
        `"${s.status}"`,
        auth,
        risk,
        `"${s.credential_id || ''}"`,
        `"${s.verification_url || ''}"`,
        `"${new Date(s.created_at).toLocaleDateString()}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `CBIT_Master_MAR_Submissions_All_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const pendingCount = submissions.filter((s) => s.status === 'pending_mentor').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;
  const flaggedCount = submissions.filter(
    (s) => s.ai_tamper_analysis?.isSuspicious || (s.ai_tamper_analysis?.riskPercentage ?? 0) > 35
  ).length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039]">
              CBIT Administration Hub
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Institutional Command Center</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Systems Operational
            </span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-[#385529] dark:text-gray-100">
            CBIT Mandatory Additional Requirements (MAR) Operations
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Autonomous college policy limits, AI verification guardrails, faculty assignment controls, and institutional audit telemetry.
          </p>
        </div>

        {/* Master Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportAllSubmissionsCSV}
            className="px-3 py-2 bg-white dark:bg-[#22232a] hover:bg-gray-50 dark:hover:bg-[#2c2d36] text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            title="Export all database submissions to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#385529] dark:text-emerald-400" />
            <span>Export Master CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="px-3.5 py-2 bg-[#385529] hover:bg-[#273e1c] text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>Broadcast Notice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset system data and categories back to official CBIT default values?')) {
                resetToDefaults();
                alert('Reset to defaults successful.');
              }
            }}
            className="px-3 py-2 bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] text-[#a16b15] dark:text-amber-400 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Reset rulebook and system settings to initial CBIT defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Key Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Total Submissions</span>
            <Database className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#385529] dark:text-emerald-400">
            {submissions.length}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {approvedCount} Approved • {pendingCount} Pending
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Active Categories</span>
            <Layers className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-[#a16b15] dark:text-amber-400">
            {categories.length}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Autonomous MAR Catalog
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Flagged / Quarantine</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-rose-600 dark:text-rose-400">
            {flaggedCount}
          </p>
          <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium">
            Requires Manual Inspection
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Monitored Students</span>
            <GraduationCap className="w-4 h-4 text-[#385529] dark:text-gray-300" />
          </div>
          <p className="text-2xl font-serif font-extrabold text-gray-900 dark:text-gray-100">
            {DEPARTMENT_ALL_STUDENTS.length}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            AI&DS Department (Sec 1, 2, 3)
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-semibold">Portal Status</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-extrabold uppercase text-gray-900 dark:text-white">
              {portalStatus}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            AY {settings.academic_year || '2025-2026'}
          </p>
        </div>
      </div>

      {/* Main Grid: Policy Editor & System Control Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Policy Limits Configuration Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2c2d36] pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#385529] dark:text-emerald-400" />
              <div>
                <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                  Institutional MAR Point Policies & Caps
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update official targets and ceiling caps across degree streams.
                </p>
              </div>
            </div>

            {policySaveSuccess && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 animate-fade-in">
                <Check className="w-3.5 h-3.5 mr-1" /> Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Regular B.Tech Target */}
              <div className="space-y-1.5 bg-[#faf9f5] dark:bg-[#121214] p-3.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Regular B.Tech Target Points
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="20"
                    max="200"
                    value={regularTarget}
                    onChange={(e) => setRegularTarget(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-white dark:bg-[#1a1b20] border border-gray-300 dark:border-[#2e3039] rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#385529]"
                    required
                  />
                  <span className="text-xs font-semibold text-gray-500">pts</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Default: 60 pts minimum for graduation eligibility.
                </p>
              </div>

              {/* Regular B.Tech Max Cap */}
              <div className="space-y-1.5 bg-[#faf9f5] dark:bg-[#121214] p-3.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Regular Maximum Points Cap
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="50"
                    max="300"
                    value={regularMax}
                    onChange={(e) => setRegularMax(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-white dark:bg-[#1a1b20] border border-gray-300 dark:border-[#2e3039] rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#385529]"
                    required
                  />
                  <span className="text-xs font-semibold text-gray-500">pts</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Institutional ceiling cap (Default: 100 pts).
                </p>
              </div>

              {/* Lateral Entry Target */}
              <div className="space-y-1.5 bg-[#faf9f5] dark:bg-[#121214] p-3.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Lateral Entry Target Points
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="15"
                    max="150"
                    value={lateralTarget}
                    onChange={(e) => setLateralTarget(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-white dark:bg-[#1a1b20] border border-gray-300 dark:border-[#2e3039] rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#385529]"
                    required
                  />
                  <span className="text-xs font-semibold text-gray-500">pts</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Pro-rated graduation target (Default: 45 pts).
                </p>
              </div>

              {/* Lateral Entry Max Cap */}
              <div className="space-y-1.5 bg-[#faf9f5] dark:bg-[#121214] p-3.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Lateral Entry Maximum Cap
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={lateralMax}
                    onChange={(e) => setLateralMax(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-white dark:bg-[#1a1b20] border border-gray-300 dark:border-[#2e3039] rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#385529]"
                    required
                  />
                  <span className="text-xs font-semibold text-gray-500">pts</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Institutional ceiling cap (Default: 75 pts).
                </p>
              </div>
            </div>

            {/* Academic Year Setting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf9f5] dark:bg-[#121214] p-3.5 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Current Academic Year Designation
                </label>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Applied to all master register PDF generation and batch calculations.
                </p>
              </div>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025-2026"
                className="w-full sm:w-44 px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#1a1b20] border border-gray-300 dark:border-[#2e3039] rounded-lg text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-emerald-300" />
                <span>Save Institutional Policy</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): System Security & Feature Toggles */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] p-6 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-[#2c2d36] pb-3">
            <ShieldCheck className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />
            <div>
              <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                Governance & Security Controls
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live feature flags, access rules, and AI parameters.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Portal Operational State */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-[#121214] border border-gray-200 dark:border-[#2c2d36]">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Student Upload Portal Mode
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {portalStatus === 'active'
                    ? 'Accepting submissions'
                    : portalStatus === 'frozen'
                    ? 'Read-only during evaluation'
                    : 'Offline for maintenance'}
                </span>
              </div>
              <select
                value={portalStatus}
                onChange={(e) => setPortalStatus(e.target.value as any)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-white"
              >
                <option value="active">Active (Open)</option>
                <option value="frozen">Frozen (Semester End)</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* AI Forensics Strictness */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-[#121214] border border-gray-200 dark:border-[#2c2d36]">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  AI Forensic Strictness
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Gemini multimodal tamper and document filter sensitivity
                </span>
              </div>
              <select
                value={aiStrictness}
                onChange={(e) => setAiStrictness(e.target.value as any)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-white"
              >
                <option value="moderate">Moderate (Flag &gt;45% risk)</option>
                <option value="strict">Strict (Flag &gt;30% risk)</option>
                <option value="forensic">Forensic Quarantine (All font mismatch)</option>
              </select>
            </div>

            {/* Toggle: Auto-quarantine */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-[#121214] border border-gray-200 dark:border-[#2c2d36]">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Auto-Quarantine Suspicious Uploads
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Exclude flagged items from mentor one-click bulk approvals
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoQuarantine(!autoQuarantine)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ease-in-out duration-200 ${
                  autoQuarantine ? 'bg-[#385529]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ease-in-out duration-200 mt-0.5 ml-0.5 ${
                    autoQuarantine ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: Strict Document Guardrail */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-[#121214] border border-gray-200 dark:border-[#2c2d36]">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Strict Document Enforcer
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Block non-document images (selfies, memes, arbitrary photos)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStrictDocumentEnforcement(!strictDocumentEnforcement)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ease-in-out duration-200 ${
                  strictDocumentEnforcement ? 'bg-[#385529]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ease-in-out duration-200 mt-0.5 ml-0.5 ${
                    strictDocumentEnforcement ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: Late Submissions */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-[#121214] border border-gray-200 dark:border-[#2c2d36]">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Allow Past Semester Submissions
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Students can claim points for past semesters with mentor approval
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLateSubmissionsAllowed(!lateSubmissionsAllowed)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ease-in-out duration-200 ${
                  lateSubmissionsAllowed ? 'bg-[#385529]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ease-in-out duration-200 mt-0.5 ml-0.5 ${
                    lateSubmissionsAllowed ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Section Health & Batch Master Link Strip */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2c2d36] pb-3">
          <div>
            <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
              Department Cohort Health & Compliance
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Section-wise tracking for AI&DS B.Tech Batch 2024-2028 (5th Semester).
            </p>
          </div>
          <Link
            href="/teacher/reports"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#385529] dark:text-emerald-400 hover:underline"
          >
            <span>Open Batch MAR Master Tabulation Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['1', '2', '3'].map((sec) => {
            const secStudents = DEPARTMENT_ALL_STUDENTS.filter((s) => s.section === sec);
            const target = settings.regular_target_points;
            const satisfied = secStudents.filter((s) => s.points >= target).length;
            const atRisk = secStudents.filter((s) => s.points < 30).length;
            const pct = Math.round((satisfied / secStudents.length) * 100);

            return (
              <div
                key={sec}
                className="p-4 rounded-xl border border-gray-200 dark:border-[#2c2d36] bg-[#faf9f5] dark:bg-[#121214] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    Section AI&DS-{sec}
                  </span>
                  <span className="text-xs font-extrabold text-[#385529] dark:text-emerald-400">
                    {pct}% Satisfied
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#385529] dark:bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                  <span>Total: {secStudents.length} Students</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    {atRisk} At-Risk (&lt;30 pts)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Link
          href="/admin/rules"
          className="bg-white dark:bg-[#1a1b20] p-6 rounded-2xl border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] hover:border-[#a16b15] dark:hover:border-gray-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1c2718] dark:text-white group-hover:text-[#385529] dark:group-hover:text-emerald-400 transition-colors">
              Configure MAR Rules & Point Limits
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Dynamically customize the 24 official CBIT categories, edit point values per activity, adjust individual category maximum caps, and re-order catalog types.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2c2d36] flex items-center text-xs font-bold text-[#385529] dark:text-gray-200 group-hover:text-[#a16b15] dark:group-hover:text-white">
            <span>Open Rulebook Manager</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white dark:bg-[#1a1b20] p-6 rounded-2xl border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] hover:border-[#385529] dark:hover:border-gray-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1c2718] dark:text-white group-hover:text-[#a16b15] dark:group-hover:text-amber-400 transition-colors">
              User Roles & Mentor Allocation
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Manage accounts across Student, Faculty Mentor, Class Coordinator, HOD, and Admin roles. Reassign mentee batches and verify department roster mappings.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2c2d36] flex items-center text-xs font-bold text-[#a16b15] dark:text-amber-400">
            <span>Manage User Directory</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Live System Audit Log */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2c2d36] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
            <h2 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
              Live Security & Administrative Audit Trail
            </h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {auditLogs.length} Events Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#121214] border-b border-gray-200 dark:border-[#2c2d36] text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Triggered By</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-[#16171c]">
                  <td className="py-2.5 px-3 font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-gray-100">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">
                    {log.user} <span className="text-[10px] text-gray-400">({log.role})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : log.status === 'warning'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcement Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b20] w-full max-w-lg rounded-2xl border border-gray-300 dark:border-[#2c2d36] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2c2d36] pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#a16b15] dark:text-amber-400" />
                <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  Broadcast Campus MAR Announcement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {broadcastSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Notice Dispatched</h4>
                <p className="text-xs text-gray-500">
                  Notification sent to all {broadcastTarget.toUpperCase()} active users.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Recipient Group
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white"
                  >
                    <option value="all">All Campus (Students & Faculty Mentors)</option>
                    <option value="students">Students Only</option>
                    <option value="mentors">Faculty Mentors Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Notice Subject / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MAR Semester 5 Certificate Submission Deadline"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Notice Description / Content
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details regarding submission deadlines, portal freeze dates, or required documentation..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-[#22232a] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Broadcast Now</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
