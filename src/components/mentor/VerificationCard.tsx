'use client';

import React, { useState } from 'react';
import { StudentSubmission, ActivityCategory } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Check,
  X,
  Eye,
  Calendar,
  Building,
  Award,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Phone,
  Mail,
  QrCode,
  Hash,
  Send,
  User,
  AlertTriangle,
  FileText,
  Clock,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface Props {
  submission: StudentSubmission;
  categories: ActivityCategory[];
  onApprove: (id: string, awardedPoints: number, remarks: string) => void;
  onReject: (id: string, remarks: string) => void;
}

export const VerificationCard: React.FC<Props> = ({
  submission,
  categories,
  onApprove,
  onReject,
}) => {
  const { currentUser, addSubmissionMessage, updateSubmissionStatus, getStudentAvatar } = useApp();
  const [remarks, setRemarks] = useState('');
  const [adjustedPoints, setAdjustedPoints] = useState<number>(submission.claimed_points);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);

  const handleCopyContact = (type: 'phone' | 'email', val: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val);
    }
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const cat = categories.find((c) => c.id === submission.category_id);
  const tamper = submission.ai_tamper_analysis;
  const studentAvatar = getStudentAvatar(submission.student_id);

  const handleApprove = () => {
    onApprove(submission.id, adjustedPoints, remarks);
    setShowRejectBox(false);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      setShowRejectBox(true);
      return;
    }
    onReject(submission.id, remarks);
    setShowRejectBox(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    addSubmissionMessage(submission.id, chatMessage);
    setChatMessage('');
  };

  const isPdf = submission.file_type?.includes('pdf') || submission.certificate_url?.endsWith('.pdf');

  return (
    <>
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl border-t-4 border-[#a16b15] dark:border-amber-500/80 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs overflow-hidden hover:shadow-md transition-all">
        
        {/* Student & Category Header Bar */}
        <div className="bg-[#faf9f5] dark:bg-[#22232a] px-5 py-3.5 border-b border-[#e8e3d8] dark:border-[#2c2d36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#385529] dark:bg-[#2a2b33] text-white font-bold flex items-center justify-center text-xs border border-transparent dark:border-[#383a45] overflow-hidden flex-shrink-0">
              {studentAvatar ? (
                <img src={studentAvatar} alt={submission.student_name || 'Student'} className="w-full h-full object-cover" />
              ) : (
                submission.student_name ? submission.student_name.charAt(0) : 'S'
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-serif font-bold text-[#1c2718] dark:text-gray-100">
                  {submission.student_name || 'Student'}
                </h4>
                {submission.student_section && (
                  <span className="text-[10px] bg-white dark:bg-[#1c1d22] text-gray-700 dark:text-gray-300 font-semibold px-2 py-0.5 rounded border border-[#e8e3d8] dark:border-[#2e3039]">
                    Section {submission.student_section}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>Roll: <strong className="font-mono">{submission.student_roll_no || '160122771045'}</strong></span>
                <span>•</span>
                <span>Semester {submission.semester}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges & Contact Student Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-3 py-1.5 bg-[#eef5ec] hover:bg-[#ddead8] dark:bg-[#22232a] dark:hover:bg-[#2c2d36] text-[#385529] dark:text-emerald-400 text-xs font-bold rounded-xl border border-[#385529]/30 dark:border-[#2e3039] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Student</span>
              {submission.messages && submission.messages.length > 0 && (
                <span className="bg-[#385529] dark:bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                  {submission.messages.length}
                </span>
              )}
            </button>

            <span className="text-xs bg-[#eef5ec] dark:bg-[#1a1b20] text-[#385529] dark:text-gray-300 font-bold px-2.5 py-1 rounded-lg border border-[#385529]/20 dark:border-[#2c2d36]">
              Category #{cat?.sno || 1}: {cat?.sub_type || 'General'}
            </span>
            <span className="text-xs bg-[#fbf5eb] dark:bg-[#1a1b20] text-[#a16b15] dark:text-amber-400 font-extrabold px-2.5 py-1 rounded-lg border border-[#a16b15]/30 dark:border-[#2c2d36]">
              Claimed: {submission.claimed_points} pts
            </span>
          </div>
        </div>

        {/* Main Card Content */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Certificate Preview & Verification Actions */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="relative border border-[#e8e3d8] dark:border-[#2c2d36] rounded-2xl overflow-hidden bg-[#faf9f5] dark:bg-[#121214] flex items-center justify-center min-h-[220px] max-h-[270px]">
              {isPdf ? (
                <div className="text-center p-4 space-y-2">
                  <BookOpen className="w-12 h-12 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[220px]">
                    {submission.activity_title}
                  </p>
                  <a
                    href={submission.certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center text-xs text-[#385529] dark:text-emerald-400 font-bold hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> Open PDF Document
                  </a>
                </div>
              ) : (
                <>
                  <img
                    src={submission.certificate_url}
                    alt="Certificate Proof"
                    className="w-full h-auto max-h-[260px] object-contain cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 cursor-pointer backdrop-blur-[2px]"
                  >
                    <Maximize2 className="w-4 h-4 text-[#dfa94b]" />
                    <span>Click to Inspect Full Resolution</span>
                  </div>
                </>
              )}
            </div>

            {/* Preview Toolbar */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
              <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="text-[#385529] dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" /> Inspect Proof
              </button>
            </div>

            {/* Official Verification URL Button */}
            {submission.verification_url && (
              <div className="pt-1">
                <a
                  href={submission.verification_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 bg-[#eef5ec] hover:bg-[#ddead8] dark:bg-[#22232a] dark:hover:bg-[#2c2d36] text-[#385529] dark:text-emerald-400 font-bold text-xs rounded-xl border border-[#385529]/30 dark:border-[#2e3039] flex items-center justify-center gap-2 shadow-2xs transition-colors"
                  title={`Open official verification link: ${submission.verification_url}`}
                >
                  <QrCode className="w-4 h-4 text-[#a16b15] dark:text-amber-400" />
                  <span>Verify Official Link / QR Code</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Submitted Metadata & AI Tamper Detection */}
          <div className="lg:col-span-7 space-y-3.5 flex flex-col justify-between">
            
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1c2718] dark:text-white leading-snug">
                  {submission.activity_title}
                </h3>
                <p className="text-xs text-[#a16b15] dark:text-amber-400 font-semibold mt-0.5">
                  Category #{cat?.sno || 1}: {cat?.name} ({cat?.sub_type || 'General'}) • Max Cap: {cat?.max_points_allowed} pts
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 bg-[#faf9f5] dark:bg-[#121214] p-3 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36]">
                <div className="flex items-center space-x-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400 flex-shrink-0" />
                  <span className="truncate">Issuer: <strong className="text-gray-900 dark:text-gray-100">{submission.issuing_organization}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400 flex-shrink-0" />
                  <span>Date: <strong className="text-gray-900 dark:text-gray-100">{submission.event_date}</strong></span>
                </div>
                {submission.credential_id && (
                  <div className="flex items-center space-x-1.5 sm:col-span-2 truncate">
                    <Hash className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="font-mono text-[11px] truncate">
                      Certificate ID: <strong className="text-gray-900 dark:text-gray-100">{submission.credential_id}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Student Description */}
              {submission.description && (
                <div className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-[#16171c] p-2.5 rounded-xl border border-gray-200 dark:border-[#2c2d36]">
                  <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Student Notes:</span>
                  <p className="text-[11px] leading-relaxed italic">{submission.description}</p>
                </div>
              )}

              {/* AI Image Manipulation & Tamper Detection Box */}
              {tamper && (
                <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                  tamper.isSuspicious
                    ? 'bg-red-50/90 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 text-red-900 dark:text-rose-300'
                    : 'bg-[#eef5ec]/90 dark:bg-[#1a2517] border-[#385529]/30 dark:border-emerald-800/60 text-[#273e1c] dark:text-emerald-300'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {tamper.isSuspicious ? (
                        <ShieldAlert className="w-4 h-4 text-red-600 dark:text-rose-400" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-[#385529] dark:text-emerald-400" />
                      )}
                      <span className="font-serif font-bold text-xs">
                        AI Image Authenticity & Manipulation Analysis
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        tamper.isSuspicious
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-rose-300 border-red-300'
                          : 'bg-white dark:bg-[#121214] text-[#385529] dark:text-emerald-400 border-[#385529]/20'
                      }`}>
                        {tamper.isSuspicious ? `⚠️ ${tamper.riskPercentage}% Tamper Risk` : `✓ ${tamper.authenticityScore}% Authentic`}
                      </span>
                    </div>
                  </div>

                  {/* Forensic Findings */}
                  <div className="space-y-1 text-[11px] pt-1">
                    {tamper.findings.map((f, i) => (
                      <div key={i} className="flex items-start space-x-1.5">
                        <span className="opacity-75">•</span>
                        <span className="leading-tight">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] opacity-80 pt-1 border-t border-black/10 dark:border-white/10 font-mono">
                    <span>Typography: {tamper.fontConsistency}</span>
                    <span>Compression: {tamper.compressionArtifacts}</span>
                    <span>Edges: {tamper.edgeAlignment}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Action Box: Mentor Input & Decision */}
            <div className="pt-3 border-t border-[#e8e3d8] dark:border-[#2c2d36] space-y-3">
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-[#1c2718] dark:text-gray-200">Award Points:</label>
                  <input
                    type="number"
                    min={1}
                    max={cat?.max_points_allowed || 40}
                    value={adjustedPoints}
                    onChange={(e) => setAdjustedPoints(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs font-extrabold rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:ring-2 focus:ring-[#385529] text-center text-[#385529] dark:text-emerald-400 bg-white dark:bg-[#121214]"
                  />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    (Category cap: {cat?.max_points_allowed} pts)
                  </span>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Mentor verification feedback or notes..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-white"
                />
              </div>

              {/* Decision Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(!showRejectBox)}
                  className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-xl bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#dfa94b] dark:text-emerald-400" />
                  <span>Approve ({adjustedPoints} Pts)</span>
                </button>
              </div>

              {showRejectBox && (
                <div className="p-3 bg-red-50 dark:bg-[#1a1b20] border border-red-200 dark:border-rose-900/50 rounded-xl space-y-2 animate-in fade-in">
                  <p className="text-xs font-bold text-red-700 dark:text-rose-400">
                    Confirm Rejection: Reason for student correction
                  </p>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Explain why this certificate is rejected (e.g. illegible certificate, wrong category)..."
                    className="w-full text-xs p-2 rounded-lg border border-red-300 dark:border-rose-900/50 bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(false)}
                      className="text-xs px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* PRIVATE CHAT & DIRECT STUDENT CONTACT MODAL */}
      {/* ========================================================================= */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1b20] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl">
            
            {/* Header */}
            <div className="p-4 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#273e1c] dark:bg-[#2c2d36] text-white font-bold flex items-center justify-center text-sm border border-[#a16b15]">
                  {submission.student_name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base leading-tight text-white">
                    Direct Discussion: {submission.student_name}
                  </h3>
                  <p className="text-[11px] text-[#e2ebd9] dark:text-gray-400">
                    Roll: <span className="font-mono font-bold text-white">{submission.student_roll_no || '160122771045'}</span> • Section {submission.student_section || '2'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-xl bg-[#273e1c] dark:bg-[#2c2d36] text-gray-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Phone & Email Quick Contact Bar */}
            <div className="bg-[#faf9f5] dark:bg-[#16171c] p-3 border-b border-[#e8e3d8] dark:border-[#2c2d36] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Student Contact:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{submission.student_phone || '+91 98765 43210'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-300 font-mono text-[11px]">{submission.student_email || 'saleemshaik2005@cbit.ac.in'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Mobile Phone Call Trigger */}
                <a
                  href={`tel:${submission.student_phone || '+919876543210'}`}
                  className="sm:hidden px-3 py-1.5 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Make a phone call to student"
                >
                  <Phone className="w-3.5 h-3.5 text-[#dfa94b]" />
                  <span>Call</span>
                </a>

                {/* Laptop / Desktop Copy Phone Button */}
                <button
                  type="button"
                  onClick={() => handleCopyContact('phone', submission.student_phone || '+91 98765 43210')}
                  className="hidden sm:inline-flex px-3 py-1.5 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Click to copy student's phone number"
                >
                  <Phone className="w-3.5 h-3.5 text-[#dfa94b]" />
                  <span>{copiedField === 'phone' ? 'Copied Phone!' : `Phone: ${submission.student_phone || '+91 98765 43210'}`}</span>
                </button>

                {/* Email Address Display & Copy Button (No App Launch) */}
                <button
                  type="button"
                  onClick={() => handleCopyContact('email', submission.student_email || 'saleemshaik2005@cbit.ac.in')}
                  className="px-3 py-1.5 bg-white dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#2c2d36] transition-colors cursor-pointer"
                  title="Click to copy student's email address"
                >
                  <Mail className="w-3.5 h-3.5 text-[#a16b15]" />
                  <span>{copiedField === 'email' ? 'Copied Email!' : (submission.student_email || 'saleemshaik2005@cbit.ac.in')}</span>
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#121214] min-h-[260px] max-h-[360px]">
              <div className="text-center">
                <span className="text-[10px] bg-gray-100 dark:bg-[#1c1d22] text-gray-500 px-3 py-1 rounded-full font-medium">
                  Private Certificate Inquiry Thread ({submission.activity_title})
                </span>
              </div>

              {(!submission.messages || submission.messages.length === 0) ? (
                <div className="text-center py-8 space-y-2">
                  <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No messages in this thread yet. Send a query below to message the student directly.
                  </p>
                </div>
              ) : (
                submission.messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-gray-400 mb-0.5">
                        {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#385529] dark:bg-emerald-700 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-[#22232a] text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-[#2e3039]'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#faf9f5] dark:bg-[#18191e] border-t border-[#e8e3d8] dark:border-[#282932] flex items-center space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask student for clarification or link..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529]"
              />
              <button
                type="submit"
                className="p-2 bg-[#385529] hover:bg-[#273e1c] text-white rounded-xl transition-colors cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-RESOLUTION DOCUMENT INSPECTION LIGHTBOX */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
          
          <div className="w-full bg-[#121214] text-white px-6 py-3 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm font-serif font-bold text-gray-200 truncate max-w-md">
                Mentor Document Inspection: {submission.activity_title}
              </span>
              {submission.credential_id && (
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded font-mono text-white/90">
                  ID: {submission.credential_id}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!isPdf && (
                <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1 mr-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                    className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs px-1 font-mono">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                    className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 hover:bg-white/20 rounded text-white cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {submission.verification_url && (
                <a
                  href={submission.verification_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#dfa94b]" />
                  <span>Verify Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            {isPdf ? (
              <iframe
                src={submission.certificate_url}
                title="Full PDF Document"
                className="w-full max-w-5xl h-[85vh] rounded-xl bg-white shadow-2xl border-0"
              />
            ) : (
              <div
                className="transition-transform duration-150 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={submission.certificate_url}
                  alt="Full resolution certificate"
                  className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
};

