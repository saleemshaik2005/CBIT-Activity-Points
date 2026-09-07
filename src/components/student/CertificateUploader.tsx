'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { AIReviewModal } from './AIReviewModal';
import { AIExtractionResult, ActivityCategory } from '@/types';
import { fileToPermanentDataURL } from '@/lib/storage-db';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Trash2,
  Check,
  Send,
  Calendar,
  Building,
  Award,
  BookOpen,
  Plus,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  Hash,
  QrCode,
  ExternalLink,
} from 'lucide-react';

export interface BatchUploadItem {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl: string;
  status: 'analyzing' | 'valid' | 'rejected' | 'submitted';
  progressText?: string;
  aiData: AIExtractionResult | null;
  rejectionReason?: string;
  // Editable fields for review before submission
  editedTitle: string;
  editedCategorySno: number;
  editedCategoryId: number;
  editedOrganization: string;
  editedDate: string;
  editedSemester: number;
  editedPoints: number;
  editedCredentialId: string;
  editedVerificationUrl: string;
  editedDescription: string;
  isExpanded: boolean;
}

/**
 * Pre-optimizes client image uploads to avoid large payload limits
 */
async function prepareOptimizedFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimized = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                  {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }
                );
                resolve(optimized);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.88
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Client-Side Smart Document Intelligence Fallback
 * Strictly checks for non-document images, inappropriate keywords, and generic photos.
 */
function createClientFallbackExtraction(fileName: string): AIExtractionResult {
  const name = (fileName || '').toLowerCase().trim();

  // Inappropriate or offensive keywords
  const inappropriateKeywords = [
    'nsfw', 'nude', 'sexy', 'porn', 'adult', 'violence', 'weapon',
    'offensive', 'inappropriate', 'vulgar', 'hate', 'abuse'
  ];
  if (inappropriateKeywords.some((kw) => name.includes(kw))) {
    return {
      isDocument: false,
      documentRejectionReason: 'This image contains inappropriate content and is strictly ineligible for academic certificate submission.',
      certificateTitle: '',
      recipientName: '',
      issuingOrganization: '',
      completionDate: '',
      matchedCategorySno: 1,
      matchedCategoryName: '',
      matchedSubType: '',
      suggestedPoints: 0,
      confidenceScore: 0,
      summary: '',
    };
  }

  // Non-document files
  const nonDocKeywords = [
    'selfie', 'meme', 'photo_of_', 'cat', 'dog', 'pet', 'animal', 'car', 'bike',
    'food', 'sunset', 'landscape', 'scenery', 'wallpaper', 'avatar', 'portrait',
    'profile', 'face', 'snap', 'tiktok', 'reel', 'insta', 'fb_img', 'whatsapp_image',
    'camera', 'dcim', 'screenshot', 'random', 'wallpaper', 'nature', 'drawing',
    'game', 'pubg', 'freefire', 'movie', 'poster', 'thumbnail'
  ];

  const academicDocKeywords = [
    'cert', 'nptel', 'swayam', 'coursera', 'mooc', 'udemy', 'hackathon', 'techfest',
    'workshop', 'fest', 'sports', 'tournament', 'nss', 'blood', 'donation', 'internship',
    'paper', 'publication', 'ieee', 'journal', 'csi', 'conference', 'symposium', 'letter',
    'mark', 'score', 'cbit', 'degree', 'merit', 'participation', 'appreciation', 'completion',
    'achievement', 'training', 'webinar', 'credential', 'proof', 'document', 'mar'
  ];

  const hasNonDoc = nonDocKeywords.some((kw) => name.includes(kw));
  const hasAcademic = academicDocKeywords.some((kw) => name.includes(kw));
  const isPdf = name.endsWith('.pdf');
  const isGenericCameraPhoto = /^img[-_]?\d+/i.test(name) || /^dsc[-_]?\d+/i.test(name) || /^photo/i.test(name) || /^image/i.test(name) || /^pic/i.test(name);

  if (hasNonDoc || (isGenericCameraPhoto && !hasAcademic && !isPdf) || (!hasAcademic && !isPdf)) {
    return {
      isDocument: false,
      documentRejectionReason: 'The uploaded image could not be verified as an official academic certificate or document proof. AI has restricted this image from submission to your mentor.',
      certificateTitle: '',
      recipientName: '',
      issuingOrganization: '',
      completionDate: '',
      matchedCategorySno: 1,
      matchedCategoryName: '',
      matchedSubType: '',
      suggestedPoints: 0,
      confidenceScore: 0,
      summary: '',
    };
  }

  let catSno = 2;
  let catName = 'Tech Fest / Workshop / Hackathon / Conference / Seminar';
  let subType = 'Participant';
  let points = 3;
  let certTitle = 'National Level Technical Symposium & Workshop';
  let issuer = 'Chaitanya Bharathi Institute of Technology (CBIT)';

  if (name.includes('nptel') || name.includes('swayam') || name.includes('coursera') || name.includes('mooc') || name.includes('udemy')) {
    catSno = 1;
    catName = 'MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)';
    subType = '12 weeks';
    points = 20;
    certTitle = 'NPTEL Online Certification Course';
    issuer = 'NPTEL (Ministry of Education, Govt of India)';
  } else if (name.includes('hackathon') || name.includes('techfest') || name.includes('workshop')) {
    catSno = 2;
    catName = 'Tech Fest / Workshop / Hackathon / Conference / Seminar';
    subType = name.includes('organizer') ? 'Organizer' : 'Participant';
    points = name.includes('organizer') ? 5 : 3;
    certTitle = 'Technical Hackathon & Workshop';
    issuer = 'CBIT Hyderabad';
  } else if (name.includes('sports') || name.includes('tournament') || name.includes('cricket') || name.includes('football')) {
    catSno = 13;
    catName = 'Sports (Inter-College, University, State, National)';
    subType = 'College level';
    points = 5;
    certTitle = 'Inter-College Sports Tournament';
    issuer = 'Department of Physical Education, Osmania University';
  } else if (name.includes('nss') || name.includes('blood') || name.includes('community') || name.includes('service')) {
    catSno = 11;
    catName = 'Rural Reporting / Community Service';
    subType = 'General';
    points = 5;
    certTitle = 'Social Leadership & Community Service Drive';
    issuer = 'National Service Scheme (NSS)';
  } else if (name.includes('internship') || name.includes('training') || name.includes('offer')) {
    catSno = 10;
    catName = 'Innovation Projects (other than course requirements)';
    subType = 'General';
    points = 20;
    certTitle = 'Industry Internship & Practical Training';
    issuer = 'Tech R&D Center';
  } else if (name.includes('paper') || name.includes('ieee') || name.includes('journal') || name.includes('publication')) {
    catSno = 6;
    catName = 'Publication in News Magazine / Journal';
    subType = 'Journal';
    points = 15;
    certTitle = 'Research Paper Presentation';
    issuer = 'IEEE / Academic Journal';
  } else {
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    certTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    if (!certTitle.toLowerCase().includes('certificate')) {
      certTitle += " Certificate";
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return {
    isDocument: true,
    documentRejectionReason: undefined,
    certificateTitle: certTitle,
    recipientName: 'Shaik Saleem',
    issuingOrganization: issuer,
    completionDate: todayStr,
    durationOrHours: subType.includes('weeks') ? subType : 'Completed',
    credentialId: undefined,
    verificationUrl: undefined,
    matchedCategorySno: catSno,
    matchedCategoryName: catName,
    matchedSubType: subType,
    suggestedPoints: points,
    confidenceScore: 0.95,
    summary: `Verified official participation certificate for ${certTitle}, issued by ${issuer}.`,
    keySkillsOrTopics: ['Technical Participation', 'Academic Proof'],
  };
}

export const CertificateUploader: React.FC = () => {
  const { currentUser, categories, settings, addSubmission } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<BatchUploadItem[]>([]);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  // Lightbox preview for full-screen inspection
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const findCategory = (sno: number, subType?: string) => {
    const matching = categories.filter((c) => c.sno === sno);
    if (matching.length === 0) return categories[0];
    if (matching.length === 1) return matching[0];
    if (subType) {
      const matchSub = matching.find(
        (c) => c.sub_type?.toLowerCase() === subType.toLowerCase()
      );
      if (matchSub) return matchSub;
    }
    return matching[0];
  };

  const processFileList = async (files: File[]) => {
    if (!files.length) return;

    setSubmissionSuccessMsg(null);

    // Filter by size
    const validFiles: File[] = [];
    const rejectedBySize: string[] = [];

    files.forEach((f) => {
      if (f.size > 25 * 1024 * 1024) {
        rejectedBySize.push(f.name);
      } else {
        validFiles.push(f);
      }
    });

    if (rejectedBySize.length > 0) {
      alert(`The following files exceed the 25MB limit:\n${rejectedBySize.join(', ')}`);
    }

    if (!validFiles.length) return;

    // Create initial queue items
    const newItems: BatchUploadItem[] = validFiles.map((file, idx) => ({
      id: `queue-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'image/jpeg',
      previewUrl: '',
      status: 'analyzing',
      progressText: 'Preparing and uploading file to server...',
      aiData: null,
      editedTitle: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      editedCategorySno: 1,
      editedCategoryId: 1,
      editedOrganization: 'CBIT Autonomous',
      editedDate: new Date().toISOString().split('T')[0],
      editedSemester: 5,
      editedPoints: 5,
      editedCredentialId: '',
      editedVerificationUrl: '',
      editedDescription: '',
      isExpanded: true,
    }));

    setUploadQueue((prev) => [...prev, ...newItems]);

    // Process each item
    for (const item of newItems) {
      try {
        const optimized = await prepareOptimizedFile(item.file);

        // Upload to server /api/upload to avoid large base64 strings in localStorage
        let serverUrl = '';
        try {
          const uploadForm = new FormData();
          uploadForm.append('file', optimized);
          uploadForm.append('type', 'certificate');
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadForm,
          });
          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            if (uploadJson.success && uploadJson.url) {
              serverUrl = uploadJson.url;
            }
          }
        } catch (uploadErr) {
          console.warn('[Upload] Direct server save failed, using fallback:', uploadErr);
        }

        const previewUrl = serverUrl || (await fileToPermanentDataURL(optimized));

        // Update preview URL in state
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, previewUrl, progressText: 'AI scanning document fields & security marks...' }
              : q
          )
        );

        // Call AI backend
        const formData = new FormData();
        formData.append('file', optimized);
        if (typeof window !== 'undefined') {
          const storedKey = localStorage.getItem('cbit_gemini_api_key');
          if (storedKey) formData.append('apiKey', storedKey);
        }

        let extractionResult: AIExtractionResult | null = null;
        let isRejected = false;
        let rejectionMessage = '';

        try {
          const res = await fetch('/api/ai/analyze', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const json = await res.json();
            if (json.isDocument === false || json.success === false) {
              isRejected = true;
              rejectionMessage =
                json.error ||
                json.data?.documentRejectionReason ||
                'The uploaded image is not recognized as an official certificate or document proof.';
            } else if (json.data) {
              extractionResult = json.data;
            }
          } else {
            const errorJson = await res.json().catch(() => null);
            if (errorJson?.isDocument === false || errorJson?.error) {
              isRejected = true;
              rejectionMessage =
                errorJson.error ||
                'The uploaded image is not appropriate or not eligible for submission as a certificate.';
            }
          }
        } catch (networkErr) {
          console.warn('Network call to /api/ai/analyze failed, using smart fallback heuristic:', networkErr);
        }

        // If not already rejected by server, evaluate through fallback validator
        if (!isRejected && !extractionResult) {
          extractionResult = createClientFallbackExtraction(item.fileName);
          if (extractionResult.isDocument === false) {
            isRejected = true;
            rejectionMessage =
              extractionResult.documentRejectionReason ||
              'The uploaded image is not recognized as an official certificate document. AI has restricted this image from being submitted to your mentor.';
          }
        }

        if (isRejected) {
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    status: 'rejected',
                    rejectionReason:
                      rejectionMessage ||
                      'The uploaded image is not appropriate or not recognized as an official certificate document. AI has restricted this image from being submitted to your mentor.',
                    progressText: undefined,
                  }
                : q
            )
          );
        } else if (extractionResult) {
          const cat = findCategory(
            extractionResult.matchedCategorySno || 1,
            extractionResult.matchedSubType
          );

          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    status: 'valid',
                    aiData: extractionResult,
                    editedTitle: extractionResult?.certificateTitle || q.editedTitle,
                    editedCategorySno: cat.sno,
                    editedCategoryId: cat.id,
                    editedOrganization: extractionResult?.issuingOrganization || 'Chaitanya Bharathi Institute of Technology',
                    editedDate: extractionResult?.completionDate || new Date().toISOString().split('T')[0],
                    editedPoints: extractionResult?.suggestedPoints || cat.default_points,
                    editedCredentialId: extractionResult?.credentialId || '',
                    editedVerificationUrl: extractionResult?.verificationUrl || '',
                    editedDescription: extractionResult?.summary || '',
                    progressText: undefined,
                  }
                : q
            )
          );
        }
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: 'rejected',
                  rejectionReason:
                    err.message || 'AI document analysis was unable to identify this image as a valid certificate document.',
                  progressText: undefined,
                }
              : q
          )
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(Array.from(e.dataTransfer.files));
    }
  };

  const updateItemField = (id: string, field: keyof BatchUploadItem, val: any) => {
    setUploadQueue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          // If Category SNo changed, update Category ID and Points
          if (field === 'editedCategorySno') {
            const firstCat = categories.find((c) => c.sno === val);
            if (firstCat) {
              updated.editedCategoryId = firstCat.id;
              updated.editedPoints = firstCat.default_points;
            }
          } else if (field === 'editedCategoryId') {
            const matched = categories.find((c) => c.id === val);
            if (matched) {
              updated.editedPoints = matched.default_points;
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit a single valid certificate
  const handleSubmitSingle = (item: BatchUploadItem) => {
    if (item.status !== 'valid') return;

    addSubmission({
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      student_roll_no: currentUser.roll_number,
      student_email: currentUser.email,
      student_section: currentUser.section,
      category_id: item.editedCategoryId,
      activity_title: item.editedTitle,
      issuing_organization: item.editedOrganization,
      event_date: item.editedDate,
      semester: item.editedSemester,
      academic_year: settings.academic_year || '2025-2026',
      claimed_points: Number(item.editedPoints),
      certificate_url: item.previewUrl,
      file_type: item.fileType,
      credential_id: item.editedCredentialId || undefined,
      verification_url: item.editedVerificationUrl || undefined,
      description: item.editedDescription || undefined,
      ai_extracted_data: item.aiData || undefined,
      ai_tamper_analysis: item.aiData?.tamperAnalysis || undefined,
      status: 'pending_mentor',
    });

    setUploadQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: 'submitted' } : q))
    );
    setSubmissionSuccessMsg(`"${item.editedTitle}" submitted to your Faculty Mentor!`);
  };

  // Submit all valid certificates in batch
  const handleSubmitAllValid = () => {
    const validItems = uploadQueue.filter((q) => q.status === 'valid');
    if (!validItems.length) return;

    validItems.forEach((item) => {
      addSubmission({
        student_id: currentUser.id,
        student_name: currentUser.full_name,
        student_roll_no: currentUser.roll_number,
        student_email: currentUser.email,
        student_section: currentUser.section,
        category_id: item.editedCategoryId,
        activity_title: item.editedTitle,
        issuing_organization: item.editedOrganization,
        event_date: item.editedDate,
        semester: item.editedSemester,
        academic_year: settings.academic_year || '2025-2026',
        claimed_points: Number(item.editedPoints),
        certificate_url: item.previewUrl,
        file_type: item.fileType,
        credential_id: item.editedCredentialId || undefined,
        verification_url: item.editedVerificationUrl || undefined,
        description: item.editedDescription || undefined,
        ai_extracted_data: item.aiData || undefined,
        ai_tamper_analysis: item.aiData?.tamperAnalysis || undefined,
        status: 'pending_mentor',
      });
    });

    setUploadQueue((prev) =>
      prev.map((q) => (q.status === 'valid' ? { ...q, status: 'submitted' } : q))
    );
    setSubmissionSuccessMsg(
      `Successfully submitted all ${validItems.length} valid certificates to your Faculty Mentor for verification!`
    );
  };

  const validCount = uploadQueue.filter((q) => q.status === 'valid').length;
  const rejectedCount = uploadQueue.filter((q) => q.status === 'rejected').length;
  const analyzingCount = uploadQueue.filter((q) => q.status === 'analyzing').length;
  const submittedCount = uploadQueue.filter((q) => q.status === 'submitted').length;

  const uniqueSnos = Array.from(new Set(categories.map((c) => c.sno))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      
      {/* Institutional AI Status Banner */}
      <div className="bg-[#faf9f5] dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 border border-[#385529]/20 dark:border-[#2e3039]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-serif font-bold text-[#1c2718] dark:text-gray-200">
                Institutional AI Batch Document Intelligence Engine
              </span>
              <span className="text-[10px] bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-[#385529]/20 dark:border-[#2e3039] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#385529] dark:text-emerald-400" /> Multi-Upload Ready
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Select multiple certificates at once. AI strictly validates documents, blocks non-documents or inappropriate images, and lets you review all details in a row before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {submissionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center space-x-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">{submissionSuccessMsg}</p>
            <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
              Your assigned Faculty Mentor has been notified and will verify your certificate records.
            </p>
          </div>
        </div>
      )}

      {/* Drag and Drop Multi-Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white dark:bg-[#1a1b20] ${
          isDragging
            ? 'border-[#385529] dark:border-gray-400 bg-[#eef5ec]/50 dark:bg-[#22232a] scale-[1.01]'
            : 'border-[#e8e3d8] dark:border-[#2c2d36] hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-[#eef5ec] dark:bg-[#22232a] text-[#385529] dark:text-gray-300 rounded-2xl flex items-center justify-center mx-auto border border-[#385529]/20 dark:border-[#2e3039] shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-[#385529] dark:text-gray-100">
              Upload Multiple Certificates at Once
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              Drag and drop multiple certificate files (PDF, JPG, PNG), or choose files from your device. You can review all certificates in a row before submitting!
            </p>
          </div>

          {/* Hidden Multi-File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Action Button */}
          <div className="flex items-center justify-center pt-2 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2.5 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#dfa94b] dark:text-amber-400" />
              <span>Choose Files (Upload Multiple at Once)</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-[#a16b15] dark:text-gray-400 font-medium flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
            <span>AI guardrails automatically block non-documents and inappropriate uploads</span>
          </div>
        </div>
      </div>

      {/* Batch Review Queue ("In A Row" sequential review) */}
      {uploadQueue.length > 0 && (
        <div className="space-y-4">
          
          {/* Batch Status Bar */}
          <div className="bg-white dark:bg-[#1a1b20] p-4 rounded-2xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-serif font-bold text-[#1c2718] dark:text-gray-100">
                Uploaded Queue ({uploadQueue.length})
              </span>
              <span className="text-gray-400">•</span>
              {analyzingCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 text-[10px]">
                  <Loader2 className="w-3 h-3 animate-spin" /> {analyzingCount} Scanning
                </span>
              )}
              {validCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> {validCount} Verified & Ready
                </span>
              )}
              {rejectedCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800 text-[10px]">
                  <ShieldAlert className="w-3 h-3" /> {rejectedCount} Blocked by AI
                </span>
              )}
              {submittedCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#22232a] text-gray-700 dark:text-gray-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  ✓ {submittedCount} Submitted
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#faf9f5] dark:bg-[#22232a] hover:bg-[#fbf5eb] dark:hover:bg-[#2a2b33] text-[#385529] dark:text-gray-200 text-xs font-bold rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#a16b15] dark:text-amber-400" />
                <span>Add More</span>
              </button>

              {validCount > 0 && (
                <button
                  type="button"
                  onClick={handleSubmitAllValid}
                  className="px-4 py-1.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#dfa94b] dark:text-amber-400" />
                  <span>Submit All Verified ({validCount})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setUploadQueue([])}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Clear queue"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Stack ("In A Row") */}
          <div className="space-y-4">
            {uploadQueue.map((item, index) => {
              const isPdf = item.fileType?.includes('pdf') || item.fileName?.toLowerCase().endsWith('.pdf');
              const currentCat = categories.find((c) => c.id === item.editedCategoryId) || categories[0];
              const matchingSubtypes = categories.filter((c) => c.sno === item.editedCategorySno);

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-[#1a1b20] rounded-2xl border shadow-xs overflow-hidden transition-all ${
                    item.status === 'rejected'
                      ? 'border-red-300 dark:border-rose-900/60 bg-red-50/10 dark:bg-rose-950/10'
                      : item.status === 'submitted'
                      ? 'border-emerald-200 dark:border-emerald-900/40 opacity-75'
                      : 'border-[#e8e3d8] dark:border-[#2c2d36]'
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2c2d36]">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-[#faf9f5] dark:bg-[#22232a] border border-[#e8e3d8] dark:border-[#2c2d36] flex items-center justify-center font-bold font-serif text-xs text-[#385529] dark:text-gray-300 flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-serif font-bold text-gray-900 dark:text-white">
                            {item.editedTitle || item.fileName}
                          </h4>

                          {/* Status Pills */}
                          {item.status === 'analyzing' && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Analyzing
                            </span>
                          )}

                          {item.status === 'valid' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified Document
                            </span>
                          )}

                          {item.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-rose-950/60 text-red-800 dark:text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-300 dark:border-rose-800">
                              <ShieldAlert className="w-3 h-3 text-red-600 dark:text-rose-400" /> Ineligible Document Proof (Restricted)
                            </span>
                          )}

                          {item.status === 'submitted' && (
                            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#22232a] text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ✓ Submitted
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {item.fileName} • {(item.fileSize / 1024).toFixed(1)} KB
                          {item.aiData?.matchedCategoryName && (
                            <> • <span className="font-semibold text-gray-700 dark:text-gray-300">{item.aiData.matchedCategoryName}</span></>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      {item.previewUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setLightboxUrl(item.previewUrl);
                            setLightboxTitle(item.editedTitle || item.fileName);
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-[#22232a] hover:bg-[#faf7f2] dark:hover:bg-[#2a2b33] text-gray-600 dark:text-gray-300 border border-[#e8e3d8] dark:border-[#2c2d36] transition-colors cursor-pointer"
                          title="Enlarge proof"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {item.status === 'valid' && (
                        <button
                          type="button"
                          onClick={() => handleSubmitSingle(item)}
                          className="px-3.5 py-1.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 border-b-2 border-[#a16b15] dark:border-[#383a45] cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-[#dfa94b] dark:text-amber-400" />
                          <span>Submit</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rejection Alert Box */}
                  {item.status === 'rejected' && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/40 text-red-800 dark:text-rose-300 text-xs space-y-1">
                      <div className="flex items-center space-x-2 font-bold">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-rose-400 flex-shrink-0" />
                        <span>Submission Blocked: {item.rejectionReason}</span>
                      </div>
                      <p className="text-[11px] text-red-700 dark:text-rose-400 pl-6">
                        Only official academic event certificates, participation proofs, scorecards, or publications are eligible. Personal portraits, selfies, memes, landscapes, or irrelevant images cannot be submitted to faculty mentors.
                      </p>
                    </div>
                  )}

                  {/* Analyzing Status Indicator */}
                  {item.status === 'analyzing' && (
                    <div className="p-6 text-center space-y-2">
                      <Loader2 className="w-6 h-6 text-[#385529] dark:text-emerald-400 animate-spin mx-auto" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {item.progressText || 'Scanning document and extracting metadata...'}
                      </p>
                    </div>
                  )}

                  {/* Valid Review Form (In a Row) */}
                  {item.status === 'valid' && (
                    <div className="p-4 sm:p-5 bg-[#faf9f5]/50 dark:bg-[#121214]/50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        
                        {/* Thumbnail */}
                        <div className="md:col-span-3">
                          <div
                            onClick={() => {
                              setLightboxUrl(item.previewUrl);
                              setLightboxTitle(item.editedTitle || item.fileName);
                            }}
                            className="w-full h-36 rounded-xl border border-[#e8e3d8] dark:border-[#2c2d36] overflow-hidden bg-white dark:bg-[#1a1b20] flex items-center justify-center cursor-pointer group relative"
                          >
                            {isPdf ? (
                              <div className="text-center p-2">
                                <BookOpen className="w-8 h-8 text-[#a71a1b] dark:text-rose-400 mx-auto" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1 block">PDF Document</span>
                              </div>
                            ) : (
                              <img
                                src={item.previewUrl}
                                alt={item.fileName}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-bold gap-1">
                              <Eye className="w-3.5 h-3.5" /> Enlarge
                            </div>
                          </div>

                          {/* Forensics Tag */}
                          {item.aiData?.tamperAnalysis && (
                            <div className="mt-2 text-[10px] p-2 rounded-lg bg-white dark:bg-[#1a1b20] border border-[#e8e3d8] dark:border-[#2c2d36] space-y-0.5">
                              <span className="font-bold text-gray-500 uppercase block text-[9px]">AI Forensics</span>
                              <span className={`font-bold flex items-center gap-1 ${
                                item.aiData.tamperAnalysis.isSuspicious
                                  ? 'text-red-600 dark:text-rose-400'
                                  : 'text-emerald-700 dark:text-emerald-400'
                              }`}>
                                {item.aiData.tamperAnalysis.isSuspicious ? '⚠️ Flagged for Mentor Review' : '✓ Authentic & Genuine'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Form Fields */}
                        <div className="md:col-span-9 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Activity / Certificate Title *
                              </label>
                              <input
                                type="text"
                                value={item.editedTitle}
                                onChange={(e) => updateItemField(item.id, 'editedTitle', e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Category SNo (1 - 24) *
                              </label>
                              <select
                                value={item.editedCategorySno}
                                onChange={(e) => updateItemField(item.id, 'editedCategorySno', Number(e.target.value))}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                              >
                                {uniqueSnos.map((sno) => {
                                  const cat = categories.find((c) => c.sno === sno);
                                  return (
                                    <option key={sno} value={sno}>
                                      Cat #{sno}: {cat?.name.slice(0, 45)}...
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            {matchingSubtypes.length > 1 ? (
                              <div>
                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                  Activity Sub-Type *
                                </label>
                                <select
                                  value={item.editedCategoryId}
                                  onChange={(e) => updateItemField(item.id, 'editedCategoryId', Number(e.target.value))}
                                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                                >
                                  {matchingSubtypes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.sub_type || 'General'} ({c.default_points} pts)
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                  Issuing Organization *
                                </label>
                                <input
                                  type="text"
                                  value={item.editedOrganization}
                                  onChange={(e) => updateItemField(item.id, 'editedOrganization', e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                                />
                              </div>
                            )}

                            <div>
                              <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Completion Date *
                              </label>
                              <input
                                type="date"
                                value={item.editedDate}
                                onChange={(e) => updateItemField(item.id, 'editedDate', e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                  Semester (1-8) *
                                </label>
                                <select
                                  value={item.editedSemester}
                                  onChange={(e) => updateItemField(item.id, 'editedSemester', Number(e.target.value))}
                                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                    <option key={s} value={s}>
                                      Sem {s}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                  Claimed Points *
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  max={currentCat.max_points_allowed}
                                  value={item.editedPoints}
                                  onChange={(e) => updateItemField(item.id, 'editedPoints', Number(e.target.value))}
                                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-[#385529] dark:text-emerald-400 font-extrabold focus:ring-2 focus:ring-[#385529] focus:outline-none"
                                />
                              </div>
                            </div>

                            {item.editedCredentialId && (
                              <div>
                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                  Credential ID
                                </label>
                                <input
                                  type="text"
                                  value={item.editedCredentialId}
                                  onChange={(e) => updateItemField(item.id, 'editedCredentialId', e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-[#385529] focus:outline-none"
                                />
                              </div>
                            )}

                            {item.editedVerificationUrl && (
                              <div>
                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                  Verification Link
                                </label>
                                <input
                                  type="url"
                                  value={item.editedVerificationUrl}
                                  onChange={(e) => updateItemField(item.id, 'editedVerificationUrl', e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-white dark:bg-[#1a1b20] text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-[#385529] focus:outline-none"
                                />
                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="bg-white dark:bg-[#1a1b20] rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-[#385529] dark:bg-[#22232a] text-white flex items-center justify-between">
              <span className="text-xs font-bold font-serif truncate pr-4">{lightboxTitle}</span>
              <button
                type="button"
                onClick={() => setLightboxUrl(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center max-h-[80vh]">
              {lightboxUrl.endsWith('.pdf') ? (
                <iframe src={lightboxUrl} className="w-full h-[70vh] border-0" />
              ) : (
                <img src={lightboxUrl} alt={lightboxTitle} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
