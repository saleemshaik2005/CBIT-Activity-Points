'use client';

import React, { useState, useEffect } from 'react';
import { ActivityCategory, AIExtractionResult } from '@/types';
import {
  Sparkles,
  Check,
  AlertCircle,
  Calendar,
  Building,
  Award,
  BookOpen,
  X,
  Eye,
  Maximize2,
  Minimize2,
  ExternalLink,
  QrCode,
  Hash,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category_id: number;
    activity_title: string;
    issuing_organization: string;
    event_date: string;
    semester: number;
    claimed_points: number;
    certificate_url: string;
    file_type: string;
    credential_id?: string;
    verification_url?: string;
    ai_extracted_data: AIExtractionResult;
  }) => void;
  aiData: AIExtractionResult;
  filePreviewUrl: string;
  fileName: string;
  fileType: string;
  categories: ActivityCategory[];
}

export const AIReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  aiData,
  filePreviewUrl,
  fileName,
  fileType,
  categories,
}) => {
  // Find category with matching SNo and matching SubType
  const findBestCategoryMatch = (sno: number, subType?: string) => {
    const matchingCats = categories.filter((c) => c.sno === sno);
    if (matchingCats.length === 0) return categories[0];
    if (matchingCats.length === 1) return matchingCats[0];

    if (subType) {
      const exactSub = matchingCats.find(
        (c) => c.sub_type?.toLowerCase() === subType.toLowerCase()
      );
      if (exactSub) return exactSub;

      const partialSub = matchingCats.find((c) =>
        c.sub_type?.toLowerCase().includes(subType.toLowerCase()) ||
        subType.toLowerCase().includes((c.sub_type || '').toLowerCase())
      );
      if (partialSub) return partialSub;
    }

    return matchingCats[0];
  };

  const initialCat = findBestCategoryMatch(
    aiData.matchedCategorySno || 1,
    aiData.matchedSubType
  );

  const [title, setTitle] = useState(aiData.certificateTitle || '');
  const [selectedCategorySno, setSelectedCategorySno] = useState<number>(initialCat.sno);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(initialCat.id);
  const [organization, setOrganization] = useState(aiData.issuingOrganization || '');
  const [date, setDate] = useState(aiData.completionDate || new Date().toISOString().split('T')[0]);
  const [semester, setSemester] = useState<number>(5);
  const [claimedPoints, setClaimedPoints] = useState<number>(
    aiData.suggestedPoints || initialCat.default_points
  );
  const [credentialId, setCredentialId] = useState(aiData.credentialId || '');
  const [verificationUrl, setVerificationUrl] = useState(aiData.verificationUrl || '');
  const [description, setDescription] = useState(aiData.summary || '');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sync state whenever aiData changes
  useEffect(() => {
    if (aiData) {
      const bestMatch = findBestCategoryMatch(
        aiData.matchedCategorySno || 1,
        aiData.matchedSubType
      );
      setTitle(aiData.certificateTitle || '');
      setSelectedCategorySno(bestMatch.sno);
      setSelectedCategoryId(bestMatch.id);
      setOrganization(aiData.issuingOrganization || '');
      setDate(aiData.completionDate || new Date().toISOString().split('T')[0]);
      setClaimedPoints(aiData.suggestedPoints || bestMatch.default_points);
      setCredentialId(aiData.credentialId || '');
      setVerificationUrl(aiData.verificationUrl || '');
      setDescription(aiData.summary || '');
    }
  }, [aiData]);

  if (!isOpen) return null;

  const currentMatchingSubtypes = categories.filter((c) => c.sno === selectedCategorySno);

  const handleCategorySnoChange = (sno: number) => {
    setSelectedCategorySno(sno);
    const firstMatch = categories.find((c) => c.sno === sno);
    if (firstMatch) {
      setSelectedCategoryId(firstMatch.id);
      setClaimedPoints(firstMatch.default_points);
    }
  };

  const handleCategoryIdChange = (catId: number) => {
    setSelectedCategoryId(catId);
    const matched = categories.find((c) => c.id === catId);
    if (matched) {
      setClaimedPoints(matched.default_points);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category_id: selectedCategoryId,
      activity_title: title,
      issuing_organization: organization,
      event_date: date,
      semester,
      claimed_points: Number(claimedPoints),
      certificate_url: filePreviewUrl,
      file_type: fileType,
      credential_id: credentialId || undefined,
      verification_url: verificationUrl || undefined,
      ai_extracted_data: aiData,
    });
  };

  const uniqueSnos = Array.from(new Set(categories.map((c) => c.sno))).sort((a, b) => a - b);
  const isPdf = fileType?.includes('pdf') || fileName?.toLowerCase().endsWith('.pdf');

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
        
        {/* Modal Container */}
        <div className="bg-white dark:bg-[#1a1b20] rounded-3xl shadow-2xl border border-[#e8e3d8] dark:border-[#2c2d36] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#385529] dark:bg-[#22232a] text-white border-b border-[#a16b15]/40 dark:border-[#2e3039] px-5 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#273e1c] dark:bg-[#2c2d36] rounded-xl border border-[#a16b15] dark:border-[#383a45]">
                <Sparkles className="w-5 h-5 text-[#dfa94b] dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg leading-tight uppercase tracking-wide text-white">
                  AI Certificate Review & Edit
                </h3>
                <p className="text-[11px] text-[#e2ebd9] dark:text-gray-400 mt-0.5">
                  Review extracted fields, QR verification, and points before submitting to Faculty Mentor.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#273e1c] dark:hover:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Match & QR Detection Strip */}
          <div className="bg-[#fbf5eb] dark:bg-[#22232a] border-b border-[#e8e3d8] dark:border-[#2c2d36] px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#a16b15] dark:text-gray-300 flex-shrink-0">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="font-bold">AI Document Match:</span>
              <span className="bg-[#eef5ec] dark:bg-[#1a1b20] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px] border border-[#385529]/20 dark:border-[#2c2d36]">
                {Math.round((aiData.confidenceScore || 0.95) * 100)}% Verified
              </span>
              {credentialId && (
                <span className="bg-[#f0f4f8] dark:bg-[#1a1b20] text-[#3b566e] dark:text-gray-300 font-bold px-2 py-0.5 rounded text-[10px] border border-[#3b566e]/30 dark:border-[#2c2d36] flex items-center gap-1 font-mono">
                  <Hash className="w-3 h-3" /> ID: {credentialId}
                </span>
              )}
            </div>
            {verificationUrl && (
              <a
                href={verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] bg-white dark:bg-[#1a1b20] text-[#385529] dark:text-emerald-400 px-2 py-0.5 rounded border border-[#e8e3d8] dark:border-[#2c2d36] font-bold hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                <span>Verify Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <form id="ai-review-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Column: Certificate Preview */}
                <div className="lg:col-span-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider">
                      Uploaded Proof
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setZoomLevel(1);
                        setIsLightboxOpen(true);
                      }}
                      className="text-xs text-[#385529] dark:text-gray-200 hover:text-[#a71a1b] font-bold flex items-center gap-1 bg-[#eef5ec] dark:bg-[#22232a] px-2.5 py-1 rounded-md border border-[#385529]/30 dark:border-[#2e3039] transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                      <span>Enlarge Proof</span>
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      setZoomLevel(1);
                      setIsLightboxOpen(true);
                    }}
                    className="border-2 border-dashed border-[#e8e3d8] dark:border-[#2e3039] hover:border-[#385529] dark:hover:border-gray-500 rounded-xl overflow-hidden bg-[#faf9f5] dark:bg-[#121214] h-[260px] sm:h-[300px] flex items-center justify-center p-2 cursor-pointer group transition-all relative"
                  >
                    {isPdf ? (
                      <div className="text-center p-4 space-y-2 w-full">
                        <BookOpen className="w-12 h-12 text-[#a71a1b] dark:text-red-400 mx-auto group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate px-2">{fileName}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#385529] dark:text-gray-300 font-bold bg-[#eef5ec] dark:bg-[#22232a] px-2.5 py-1 rounded border border-[#385529]/30 dark:border-[#2e3039]">
                          <Eye className="w-3.5 h-3.5" /> Click to Inspect Full PDF
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={filePreviewUrl}
                          alt="Certificate preview"
                          className="max-h-[280px] w-auto object-contain rounded shadow-xs"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-[2px]">
                          <Maximize2 className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
                          <span>Click to Enlarge Full Screen</span>
                        </div>
                      </>
                    )}
                  </div>

                  {aiData.keySkillsOrTopics && aiData.keySkillsOrTopics.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Extracted Tags:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiData.keySkillsOrTopics.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#fbf5eb] dark:bg-[#22232a] text-[#a16b15] dark:text-gray-300 px-2 py-0.5 rounded-full border border-[#a16b15]/30 dark:border-[#2e3039] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Editable Fields */}
                <div className="lg:col-span-7 space-y-3.5">
                  
                  <div>
                    <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                      Activity / Certification Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 font-medium"
                      placeholder="e.g. SUDHEE 2024 - Hackathon Participation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                      CBIT Activity Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCategorySno}
                      onChange={(e) => handleCategorySnoChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 bg-white dark:bg-[#121214] font-medium text-gray-800 dark:text-gray-200"
                    >
                      {uniqueSnos.map((sno) => {
                        const cat = categories.find((c) => c.sno === sno);
                        return (
                          <option key={sno} value={sno}>
                            #{sno}. {cat?.name} (Max Cap: {cat?.max_points_allowed} pts)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {currentMatchingSubtypes.length > 1 && (
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        Activity Level / Sub-Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => handleCategoryIdChange(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border-2 border-[#a16b15] dark:border-[#383a45] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-[#fbf5eb] dark:bg-[#22232a] font-bold text-[#1c2718] dark:text-gray-200"
                      >
                        {currentMatchingSubtypes.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.sub_type} — {sub.default_points} Points
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        Issuing Organization / Body <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        Completion / Event Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 font-medium"
                      />
                    </div>
                  </div>

                  {/* Credential ID and Verification URL Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        Credential ID / Certificate No.
                      </label>
                      <input
                        type="text"
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        placeholder="e.g. CBIT/VMEDHA/CIP/P/245"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        QR / Verification Link URL
                      </label>
                      <input
                        type="url"
                        value={verificationUrl}
                        onChange={(e) => setVerificationUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        Academic Semester (I to VIII) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100 font-medium"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                        Claimed Activity Points <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={40}
                        required
                        value={claimedPoints}
                        onChange={(e) => setClaimedPoints(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] font-extrabold text-[#385529] dark:text-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                      Summary / Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-gray-100"
                      placeholder="Additional details for the faculty mentor..."
                    />
                  </div>

                </div>

              </div>
            </form>
          </div>

          {/* Sticky Modal Footer */}
          <div className="p-4 border-t border-[#e8e3d8] dark:border-[#282932] bg-[#faf9f5] dark:bg-[#18191e] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#22232a] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="ai-review-form"
              className="px-6 py-2.5 rounded-xl bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15] dark:border-emerald-700 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Submit for Mentor Approval</span>
            </button>
          </div>

        </div>
      </div>

      {/* Standalone Full-Screen Lightbox Modal with Zoom Controls */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
          
          {/* Lightbox Top Control Bar */}
          <div className="w-full bg-[#121214] text-white px-6 py-3 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm font-serif font-bold text-gray-200 truncate max-w-md">
                Document Inspection: {fileName}
              </span>
              {credentialId && (
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded font-mono text-white/90">
                  ID: {credentialId}
                </span>
              )}
            </div>

            {/* Zoom & Action Controls */}
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

              {isPdf && (
                <a
                  href={filePreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#a16b15] hover:bg-[#835610] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Open PDF in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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

          {/* Lightbox Content Viewer */}
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            {isPdf ? (
              <iframe
                src={filePreviewUrl}
                title="Full PDF Document"
                className="w-full max-w-5xl h-[85vh] rounded-xl bg-white shadow-2xl border-0"
              />
            ) : (
              <div
                className="transition-transform duration-150 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={filePreviewUrl}
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
