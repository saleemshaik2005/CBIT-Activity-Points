'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { AIExtractionResult } from '@/types';
import { fileToPermanentDataURL } from '@/lib/storage-db';
import {
  prepareOptimizedFileAndScanQR,
  runClientTesseractOCR,
  buildOfflineCertificateExtraction,
} from '@/lib/upload-scanner';

export interface BatchUploadItem {
  id: string;
  file?: File;
  fileName: string;
  fileSize: number;
  originalSize?: number;
  fileType: string;
  previewUrl: string;
  status: 'analyzing' | 'valid' | 'rejected' | 'submitted';
  progressText?: string;
  aiData: AIExtractionResult | null;
  rejectionReason?: string;
  // Editable fields for review before submission
  editedRecipient: string;
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

interface UploadContextType {
  uploadQueue: BatchUploadItem[];
  isAnalyzingAny: boolean;
  activeProcessingItem: BatchUploadItem | null;
  validCount: number;
  analyzingCount: number;
  rejectedCount: number;
  submittedCount: number;
  submissionSuccessMsg: string | null;
  setSubmissionSuccessMsg: (msg: string | null) => void;
  processFileList: (files: File[]) => Promise<void>;
  updateItemField: (id: string, field: keyof BatchUploadItem, val: any) => void;
  removeItem: (id: string) => void;
  clearCompletedQueue: () => void;
  clearAllQueue: () => void;
  handleSubmitSingle: (item: BatchUploadItem) => void;
  handleSubmitAllValid: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

async function computeFileSha256(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, categories, settings, addSubmission, submissions } = useApp();
  const [uploadQueue, setUploadQueue] = useState<BatchUploadItem[]>([]);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  const DAILY_UPLOAD_LIMIT = 50;
  const studentUploadsLast24h = useMemo(() => {
    if (!currentUser?.id || !Array.isArray(submissions)) return 0;
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return submissions.filter((s) => {
      const isOwner =
        s.student_id === currentUser.id ||
        (s.student_roll_no && s.student_roll_no === currentUser.roll_number) ||
        (s.student_name && s.student_name === currentUser.full_name);
      if (!isOwner) return false;
      const t = new Date(s.created_at || Date.now()).getTime();
      return !isNaN(t) && t >= cutoff;
    }).length;
  }, [submissions, currentUser]);

  const uploadsRemainingToday = Math.max(0, DAILY_UPLOAD_LIMIT - studentUploadsLast24h);
  const isDailyLimitReached = studentUploadsLast24h >= DAILY_UPLOAD_LIMIT;

  const findCategory = useCallback(
    (sno: number, subType?: string) => {
      const matching = categories.filter((c) => c.sno === sno);
      if (matching.length === 0) return categories[0] || { sno: 2, id: 4, default_points: 3 };
      if (matching.length === 1) return matching[0];
      if (subType) {
        const matchSub = matching.find(
          (c) => c.sub_type?.toLowerCase() === subType.toLowerCase()
        );
        if (matchSub) return matchSub;
      }
      return matching[0];
    },
    [categories]
  );

  const processFileList = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setSubmissionSuccessMsg(null);

      const validFiles: File[] = [];
      const rejectedBySize: string[] = [];

      files.forEach((f) => {
        if (f.size > 25 * 1024 * 1024) {
          rejectedBySize.push(f.name);
        } else {
          validFiles.push(f);
        }
      });

      if (isDailyLimitReached) {
        alert(
          'Daily upload quota reached (maximum 50 certificates per student per 24 hours). Please wait until tomorrow or contact your faculty mentor.'
        );
        return;
      }

      if (validFiles.length > uploadsRemainingToday) {
        alert(
          `You have ${uploadsRemainingToday} upload(s) remaining today (daily limit: 50). You selected ${validFiles.length} files. Please select ${uploadsRemainingToday} or fewer files.`
        );
        return;
      }

      if (!validFiles.length) return;

      const newItems: BatchUploadItem[] = validFiles.map((file, idx) => ({
        id: `queue-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        originalSize: file.size,
        fileType: file.type || 'image/jpeg',
        previewUrl: '',
        status: 'analyzing',
        progressText: 'Compressing image & decoding QR codes...',
        aiData: null,
        editedRecipient: '',
        editedTitle: '',
        editedCategorySno: 2,
        editedCategoryId: 4,
        editedOrganization: '',
        editedDate: '',
        editedSemester: 5,
        editedPoints: 3,
        editedCredentialId: '',
        editedVerificationUrl: '',
        editedDescription: '',
        isExpanded: true,
      }));

      // Append to the active global queue immediately
      setUploadQueue((prev) => [...prev, ...newItems]);

      // Process items asynchronously in background without unmounting interruption
      for (const item of newItems) {
        try {
          if (!item.file) continue;

          // 1. Image compression + client jsQR detection
          const { optimizedFile, qrPayloads } = await prepareOptimizedFileAndScanQR(item.file);
          const fileHash = await computeFileSha256(optimizedFile);

          // 2. Direct Cloud Storage Presigned URL Upload Flow
          let storagePath = '';
          let serverUrl = '';
          let finalCompressedBytes = optimizedFile.size;

          if (typeof navigator === 'undefined' || navigator.onLine) {
            try {
              const presignRes = await fetch('/api/storage/presigned-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  filename: optimizedFile.name,
                  fileType: optimizedFile.type || 'image/jpeg',
                  fileSize: optimizedFile.size,
                  bucket: 'certificates',
                }),
              });

              if (presignRes.ok) {
                const presignData = await presignRes.json();
                if (presignData.success && presignData.signedUrl) {
                  // Direct binary upload to Cloud Storage
                  const directUploadRes = await fetch(presignData.signedUrl, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': optimizedFile.type || 'image/jpeg',
                    },
                    body: optimizedFile,
                  });

                  if (directUploadRes.ok) {
                    storagePath = presignData.storagePath;
                    serverUrl = presignData.publicUrl;
                  }
                } else if (presignData.publicUrl) {
                  storagePath = presignData.storagePath;
                  serverUrl = presignData.publicUrl;
                }
              }
            } catch (uploadErr) {
              console.warn('[Direct Upload] Presigned storage upload warning:', uploadErr);
            }
          }

          const previewUrl = serverUrl || (await fileToPermanentDataURL(optimizedFile));
          if (!storagePath) {
            storagePath = `${currentUser?.id || 'anonymous'}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
          }

          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    previewUrl,
                    fileSize: finalCompressedBytes,
                    progressText: 'Queued for Asynchronous Neural OCR & Authenticity Forensics...',
                  }
                : q
            )
          );

          // 3. Run client-side Tesseract OCR on contrast-enhanced canvas
          const clientOcrText = await runClientTesseractOCR(optimizedFile);

          // 4. Register Upload Completion & Trigger Asynchronous AI Pipeline
          let extractionResult: AIExtractionResult | null = null;
          let isRejected = false;
          let rejectionMessage = '';
          let sseStreamUrl = '';

          if (typeof navigator === 'undefined' || navigator.onLine) {
            try {
              const notifyRes = await fetch('/api/submissions/upload-complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  storagePath,
                  publicUrl: previewUrl,
                  fileHash,
                  fileName: optimizedFile.name,
                  fileSize: finalCompressedBytes,
                  clientOcrText,
                  clientQrPayloads: qrPayloads,
                  studentName: currentUser?.full_name || '',
                  studentRollNo: currentUser?.roll_number || '',
                }),
              });

              const notifyData = await notifyRes.json();

              if (!notifyRes.ok) {
                if (notifyRes.status === 409) {
                  isRejected = true;
                  rejectionMessage =
                    notifyData.error ||
                    'Duplicate Certificate: You have already submitted this identical document proof.';
                } else {
                  console.warn('[Upload Complete] Notification status:', notifyRes.status, notifyData.error);
                }
              } else if (notifyData.success) {
                if (notifyData.isCached && notifyData.status === 'PARSED') {
                  extractionResult = notifyData.aiData || null;
                } else if (notifyData.sseStreamUrl) {
                  sseStreamUrl = notifyData.sseStreamUrl;
                }
              }
            } catch (networkErr) {
              console.warn('[Notify Complete] Network exception:', networkErr);
            }
          }

          // 5. Real-Time Asynchronous Feedback Loop (Server-Sent Events)
          if (!isRejected && !extractionResult && sseStreamUrl && typeof EventSource !== 'undefined') {
            try {
              const sse = new EventSource(sseStreamUrl);
              await new Promise<void>((resolve) => {
                const timeoutTimer = setTimeout(() => {
                  try {
                    sse.close();
                  } catch {}
                  resolve();
                }, 35000);

                sse.addEventListener('status', (e: MessageEvent) => {
                  try {
                    const data = JSON.parse(e.data);
                    if (data.status === 'PROCESSING') {
                      setUploadQueue((prev) =>
                        prev.map((q) =>
                          q.id === item.id
                            ? { ...q, progressText: 'Processing with Neural OCR & AI Forensics...' }
                            : q
                        )
                      );
                    } else if (data.status === 'PARSED') {
                      clearTimeout(timeoutTimer);
                      sse.close();
                      if (data.aiData) extractionResult = data.aiData;
                      resolve();
                    } else if (data.status === 'MANUAL_REVIEW_REQUIRED') {
                      clearTimeout(timeoutTimer);
                      sse.close();
                      extractionResult =
                        data.aiData ||
                        buildOfflineCertificateExtraction(
                          clientOcrText,
                          qrPayloads,
                          currentUser?.full_name || '',
                          item.fileName
                        );
                      resolve();
                    } else if (data.status === 'FAILED_FATAL') {
                      clearTimeout(timeoutTimer);
                      sse.close();
                      isRejected = true;
                      rejectionMessage = data.message || 'Document verification failed.';
                      resolve();
                    }
                  } catch {}
                });

                sse.onerror = () => {
                  clearTimeout(timeoutTimer);
                  try {
                    sse.close();
                  } catch {}
                  resolve();
                };
              });
            } catch (sseErr) {
              console.warn('[SSE Stream] Connection exception:', sseErr);
            }
          }

          // 5. Fallback local browser extraction if offline or analyze unreachable
          if (!isRejected && !extractionResult) {
            const offlineResult = buildOfflineCertificateExtraction(
              clientOcrText,
              qrPayloads,
              currentUser?.full_name || '',
              item.fileName
            );
            if (offlineResult.isDocument === false) {
              isRejected = true;
              rejectionMessage =
                offlineResult.documentRejectionReason ||
                'Non-Document Image Blocked: Selfies and non-certificate images are not permitted.';
            } else {
              extractionResult = offlineResult;
            }
          }

          if (isRejected) {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? {
                      ...q,
                      status: 'rejected',
                      rejectionReason: rejectionMessage,
                      progressText: undefined,
                    }
                  : q
              )
            );
          } else if (extractionResult) {
            const cat = findCategory(
              extractionResult.matchedCategorySno || 2,
              extractionResult.matchedSubType
            );

            setUploadQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? {
                      ...q,
                      status: 'valid',
                      aiData: extractionResult,
                      editedRecipient: extractionResult?.recipientName || '',
                      editedTitle: extractionResult?.certificateTitle || '',
                      editedCategorySno: cat.sno,
                      editedCategoryId: cat.id,
                      editedOrganization: extractionResult?.issuingOrganization || '',
                      editedDate: extractionResult?.completionDate || '',
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
                      err.message || 'Unable to process this certificate document.',
                    progressText: undefined,
                  }
                : q
            )
          );
        }
      }
    },
    [currentUser, findCategory, isDailyLimitReached, uploadsRemainingToday]
  );

  const updateItemField = useCallback(
    (id: string, field: keyof BatchUploadItem, val: any) => {
      setUploadQueue((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const updated = { ...item, [field]: val };
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
    },
    [categories]
  );

  const removeItem = useCallback((id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompletedQueue = useCallback(() => {
    setUploadQueue((prev) => prev.filter((item) => item.status === 'analyzing'));
  }, []);

  const clearAllQueue = useCallback(() => {
    setUploadQueue([]);
  }, []);

  const handleSubmitSingle = useCallback(
    (item: BatchUploadItem) => {
      if (item.status !== 'valid') return;
      if (!item.editedTitle.trim()) {
        alert('Please verify or enter the Activity / Event Title extracted from the certificate before submitting.');
        return;
      }
      if (!item.editedDate.trim()) {
        alert('Please select or confirm the Event / Completion Date from the certificate before submitting.');
        return;
      }

      addSubmission({
        student_id: currentUser.id,
        student_name: currentUser.full_name,
        student_roll_no: currentUser.roll_number,
        student_email: currentUser.email,
        student_section: currentUser.section,
        category_id: item.editedCategoryId,
        activity_title: item.editedTitle.trim(),
        issuing_organization: item.editedOrganization.trim() || 'Chaitanya Bharathi Institute of Technology (CBIT)',
        event_date: item.editedDate.trim(),
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
    },
    [addSubmission, currentUser, settings.academic_year]
  );

  const handleSubmitAllValid = useCallback(() => {
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
      `Successfully submitted all ${validItems.length} verified certificates to your Faculty Mentor!`
    );
  }, [addSubmission, currentUser, settings.academic_year, uploadQueue]);

  const validCount = uploadQueue.filter((q) => q.status === 'valid').length;
  const rejectedCount = uploadQueue.filter((q) => q.status === 'rejected').length;
  const analyzingCount = uploadQueue.filter((q) => q.status === 'analyzing').length;
  const submittedCount = uploadQueue.filter((q) => q.status === 'submitted').length;
  const isAnalyzingAny = analyzingCount > 0;
  const activeProcessingItem = uploadQueue.find((q) => q.status === 'analyzing') || null;

  return (
    <UploadContext.Provider
      value={{
        uploadQueue,
        isAnalyzingAny,
        activeProcessingItem,
        validCount,
        analyzingCount,
        rejectedCount,
        submittedCount,
        submissionSuccessMsg,
        setSubmissionSuccessMsg,
        processFileList,
        updateItemField,
        removeItem,
        clearCompletedQueue,
        clearAllQueue,
        handleSubmitSingle,
        handleSubmitAllValid,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadQueue = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUploadQueue must be used within an UploadProvider');
  }
  return context;
};
