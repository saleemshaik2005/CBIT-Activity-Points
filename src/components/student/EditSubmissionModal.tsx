'use client';

import React, { useState } from 'react';
import { ActivityCategory, StudentSubmission } from '@/types';
import {
  Sparkles,
  Check,
  X,
  Building,
  Calendar,
  Eye,
  Maximize2,
  ExternalLink,
  Hash,
  Upload,
  BookOpen,
} from 'lucide-react';
import { fileToPermanentDataURL } from '@/lib/storage-db';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  submission: StudentSubmission;
  categories: ActivityCategory[];
  onSave: (id: string, updatedData: Partial<StudentSubmission>) => void;
}

export const EditSubmissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  submission,
  categories,
  onSave,
}) => {
  const currentCat = categories.find((c) => c.id === submission.category_id) || categories[0];

  const [title, setTitle] = useState(submission.activity_title);
  const [selectedCategorySno, setSelectedCategorySno] = useState<number>(currentCat.sno);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(submission.category_id);
  const [organization, setOrganization] = useState(submission.issuing_organization);
  const [date, setDate] = useState(submission.event_date);
  const [semester, setSemester] = useState<number>(submission.semester);
  const [claimedPoints, setClaimedPoints] = useState<number>(submission.claimed_points);
  const [credentialId, setCredentialId] = useState(submission.credential_id || '');
  const [verificationUrl, setVerificationUrl] = useState(submission.verification_url || '');
  const [description, setDescription] = useState(submission.description || submission.ai_extracted_data?.summary || '');
  const [certificateUrl, setCertificateUrl] = useState(submission.certificate_url);
  const [fileType, setFileType] = useState(submission.file_type || 'image/jpeg');
  const [isReplacingFile, setIsReplacingFile] = useState(false);

  if (!isOpen) return null;

  const currentMatchingSubtypes = categories.filter((c) => c.sno === selectedCategorySno);
  const uniqueSnos = Array.from(new Set(categories.map((c) => c.sno))).sort((a, b) => a - b);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileType(file.type || 'image/jpeg');
      try {
        const permanentDataUrl = await fileToPermanentDataURL(file);
        setCertificateUrl(permanentDataUrl);
        setIsReplacingFile(false);
      } catch (err) {
        console.error('Failed to process replacement file:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(submission.id, {
      category_id: selectedCategoryId,
      activity_title: title,
      issuing_organization: organization,
      event_date: date,
      semester,
      claimed_points: Number(claimedPoints),
      credential_id: credentialId || undefined,
      verification_url: verificationUrl || undefined,
      description: description || undefined,
      certificate_url: certificateUrl,
      file_type: fileType,
    });
    onClose();
  };

  const isPdf = fileType?.includes('pdf') || certificateUrl?.endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1b20] rounded-3xl shadow-2xl border border-[#e8e3d8] dark:border-[#2c2d36] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#385529] dark:bg-[#22232a] text-white border-b border-[#a16b15]/40 dark:border-[#2e3039] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#273e1c] dark:bg-[#2c2d36] rounded-xl border border-[#a16b15] dark:border-[#383a45]">
              <Sparkles className="w-5 h-5 text-[#dfa94b] dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg uppercase tracking-wide text-white">
                Edit Pending Submission
              </h3>
              <p className="text-xs text-[#e2ebd9] dark:text-gray-400 mt-0.5">
                Update your activity details, fix verification links, or upload a clearer certificate proof.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#273e1c] dark:hover:bg-[#2c2d36] text-gray-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <form id="edit-submission-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Certificate Preview & Replace */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wider">
                    Attached Document Proof
                  </label>
                  <label className="text-xs text-[#385529] dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace File</span>
                    <input
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="border border-[#e8e3d8] dark:border-[#2e3039] rounded-2xl overflow-hidden bg-[#faf9f5] dark:bg-[#121214] h-[250px] flex items-center justify-center p-2 relative">
                  {isPdf ? (
                    <div className="text-center p-4 space-y-2">
                      <BookOpen className="w-12 h-12 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[220px]">
                        PDF Certificate Attached
                      </p>
                      <a
                        href={certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#385529] dark:text-emerald-400 font-bold hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View PDF in Tab
                      </a>
                    </div>
                  ) : (
                    <img
                      src={certificateUrl}
                      alt="Certificate"
                      className="max-h-[230px] w-auto object-contain rounded-lg"
                    />
                  )}
                </div>

                {submission.mentor_remarks && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      Mentor Feedback:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      "{submission.mentor_remarks}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Editable Metadata */}
              <div className="lg:col-span-7 space-y-3">
                
                <div>
                  <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                    Activity / Certification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                    CBIT Activity Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCategorySno}
                    onChange={(e) => handleCategorySnoChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] focus:outline-none focus:ring-2 focus:ring-[#385529] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-medium"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#a16b15] dark:border-[#383a45] bg-[#fbf5eb] dark:bg-[#22232a] font-bold text-[#1c2718] dark:text-white"
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
                      Issuing Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-medium"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                      Credential ID / Serial No.
                    </label>
                    <input
                      type="text"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      placeholder="e.g. NPTEL25CS129S401"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                      Verification Link (URL)
                    </label>
                    <input
                      type="url"
                      value={verificationUrl}
                      onChange={(e) => setVerificationUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                      Academic Semester <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white font-medium"
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
                      Claimed Points
                    </label>
                    <input
                      type="number"
                      readOnly
                      disabled
                      value={claimedPoints}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-100 dark:bg-[#1a1b20] font-extrabold text-[#385529] dark:text-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c2718] dark:text-gray-200 mb-1">
                    Student Notes / Description for Mentor
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional notes for your faculty mentor..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white"
                  />
                </div>

              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8e3d8] dark:border-[#282932] bg-[#faf9f5] dark:bg-[#18191e] flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#22232a] text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-submission-form"
            className="px-6 py-2.5 rounded-xl bg-[#385529] hover:bg-[#273e1c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15] dark:border-emerald-700 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save & Update Submission</span>
          </button>
        </div>

      </div>
    </div>
  );
};
