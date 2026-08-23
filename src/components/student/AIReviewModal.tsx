'use client';

import React, { useState, useEffect } from 'react';
import { ActivityCategory, AIExtractionResult } from '@/types';
import { Sparkles, Check, AlertCircle, Calendar, Building, Award, BookOpen, X, Eye } from 'lucide-react';

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
  const initialCategory = categories.find((c) => c.sno === aiData.matchedCategorySno) || categories[0];

  const [title, setTitle] = useState(aiData.certificateTitle || '');
  const [selectedCategorySno, setSelectedCategorySno] = useState<number>(aiData.matchedCategorySno || 1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(initialCategory.id);
  const [organization, setOrganization] = useState(aiData.issuingOrganization || '');
  const [date, setDate] = useState(aiData.completionDate || new Date().toISOString().split('T')[0]);
  const [semester, setSemester] = useState<number>(4);
  const [claimedPoints, setClaimedPoints] = useState<number>(aiData.suggestedPoints || initialCategory.default_points);
  const [description, setDescription] = useState(aiData.summary || '');
  const [previewEnlarged, setPreviewEnlarged] = useState(false);

  useEffect(() => {
    setTitle(aiData.certificateTitle || '');
    setSelectedCategorySno(aiData.matchedCategorySno || 1);
    const cat = categories.find((c) => c.sno === aiData.matchedCategorySno) || categories[0];
    setSelectedCategoryId(cat.id);
    setOrganization(aiData.issuingOrganization || '');
    setDate(aiData.completionDate || new Date().toISOString().split('T')[0]);
    setClaimedPoints(aiData.suggestedPoints || cat.default_points);
    setDescription(aiData.summary || '');
  }, [aiData, categories]);

  const handleCategorySnoChange = (sno: number) => {
    setSelectedCategorySno(sno);
    const matchingCats = categories.filter((c) => c.sno === sno);
    const primary = matchingCats[0];
    if (primary) {
      setSelectedCategoryId(primary.id);
      setClaimedPoints(primary.default_points);
    }
  };

  const handleCategoryIdChange = (id: number) => {
    setSelectedCategoryId(id);
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setClaimedPoints(cat.default_points);
    }
  };

  if (!isOpen) return null;

  const currentMatchingSubtypes = categories.filter((c) => c.sno === selectedCategorySno);
  const uniqueSnos = Array.from(new Set(categories.map((c) => c.sno))).sort((a, b) => a - b);

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
      ai_extracted_data: aiData,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e3d8] max-w-4xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* CBIT Header: Forest Green with Gold Accent */}
        <div className="bg-[#385529] text-white border-b-4 border-[#a16b15] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#273e1c] rounded-xl border border-[#a16b15]">
              <Sparkles className="w-5 h-5 text-[#dfa94b]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight uppercase tracking-wide">
                AI Certificate Review & Edit
              </h3>
              <p className="text-xs text-[#e2ebd9] mt-0.5">
                Review, edit or correct all details before submitting to your Faculty Mentor.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#273e1c] text-[#e2ebd9] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Confidence Strip */}
        <div className="bg-[#fbf5eb] border-b border-[#e8e3d8] px-6 py-2.5 flex items-center justify-between text-xs text-[#a16b15]">
          <div className="flex items-center space-x-2">
            <span className="font-bold">AI Document Match:</span>
            <span className="bg-[#eef5ec] text-[#385529] font-bold px-2 py-0.5 rounded-full text-[10px] border border-[#385529]/20">
              {Math.round((aiData.confidenceScore || 0.95) * 100)}% Matched
            </span>
            <span className="text-gray-500 hidden sm:inline">| All fields below are 100% editable</span>
          </div>
          {aiData.durationOrHours && (
            <span className="text-[11px] bg-white text-[#385529] px-2 py-0.5 rounded border border-[#e8e3d8] font-bold">
              Duration: {aiData.durationOrHours}
            </span>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Certificate Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-[#385529] uppercase tracking-wider">
                  Uploaded Document
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewEnlarged(!previewEnlarged)}
                  className="text-xs text-[#a16b15] font-bold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {previewEnlarged ? 'Shrink' : 'Enlarge'}
                </button>
              </div>

              <div className="border border-[#e8e3d8] rounded-xl overflow-hidden bg-[#faf9f5] max-h-[360px] flex items-center justify-center p-2">
                {fileType.includes('pdf') ? (
                  <div className="text-center p-6 space-y-2">
                    <BookOpen className="w-12 h-12 text-[#a71a1b] mx-auto" />
                    <p className="text-xs font-semibold text-gray-700">{fileName}</p>
                    <p className="text-[10px] text-gray-500">PDF Document verified by Gemini AI</p>
                  </div>
                ) : (
                  <img
                    src={filePreviewUrl}
                    alt="Certificate preview"
                    className="max-h-[340px] w-auto object-contain rounded shadow-xs"
                  />
                )}
              </div>

              {aiData.keySkillsOrTopics && aiData.keySkillsOrTopics.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Extracted Topics:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiData.keySkillsOrTopics.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#fbf5eb] text-[#a16b15] px-2 py-0.5 rounded-full border border-[#a16b15]/30 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Editable Fields */}
            <div className="lg:col-span-7 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-[#1c2718] mb-1">
                  Activity / Certification Title <span className="text-[#a71a1b]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-medium"
                  placeholder="e.g. NPTEL Cloud Computing 12-Week Course"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2718] mb-1">
                  CBIT MAR Activity Category <span className="text-[#a71a1b]">*</span>
                </label>
                <select
                  value={selectedCategorySno}
                  onChange={(e) => handleCategorySnoChange(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-medium text-gray-800"
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
                  <label className="block text-xs font-bold text-[#1c2718] mb-1">
                    Activity Level / Sub-Type <span className="text-[#a71a1b]">*</span>
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryIdChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-medium"
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
                  <label className="block text-xs font-bold text-[#1c2718] mb-1">
                    Issuing Organization / Body <span className="text-[#a71a1b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1c2718] mb-1">
                    Completion / Event Date <span className="text-[#a71a1b]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1c2718] mb-1">
                    Academic Semester (I to VIII) <span className="text-[#a71a1b]">*</span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1c2718] mb-1">
                    Claimed Activity Points <span className="text-[#a71a1b]">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    required
                    value={claimedPoints}
                    onChange={(e) => setClaimedPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white font-extrabold text-[#385529]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2718] mb-1">
                  Summary / Student Remarks
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e8e3d8] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white"
                  placeholder="Additional context or remarks for the faculty mentor..."
                />
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#e8e3d8] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e8e3d8] text-gray-700 hover:bg-[#faf7f2] text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#385529] hover:bg-[#273e1c] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 border-b-2 border-[#a16b15]"
            >
              <Check className="w-4 h-4 text-[#dfa94b]" />
              <span>Confirm & Submit for Mentor Approval</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
