import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { analyzeCertificateDocument } from '@/lib/gemini';
import { geminiCircuitBreaker } from '@/lib/circuit-breaker/ai-circuit-breaker';
import { recordAuditLog } from '@/lib/audit/audit-ledger';
import { validateStateTransition, CertificateProcessingState } from '@/lib/state-machine/certificate-state-machine';
import { broadcastSubmissionStatus } from '@/lib/events/event-broker';

export interface EnqueueJobParams {
  submissionId: string;
  studentId: string;
  fileUrl: string;
  storagePath: string;
  fileHash: string;
  studentName?: string;
  studentRollNo?: string;
  clientOcrText?: string;
  clientQrPayloads?: string[];
  fileName?: string;
}

/**
 * SHA-256 Hash Deduplication Checker
 * Detects duplicate submissions by the same student and leverages system-wide
 * extraction caching to prevent redundant token consumption.
 */
export async function checkDocumentDeduplication(
  studentId: string,
  fileHash: string
): Promise<{
  isDuplicateForStudent: boolean;
  cachedExtraction: any | null;
  matchedSubmissionId?: string;
}> {
  if (!fileHash || fileHash.length < 32) {
    return { isDuplicateForStudent: false, cachedExtraction: null };
  }

  // 1. Check if same student already uploaded this certificate
  const { data: ownDuplicate } = await supabaseAdmin
    .from('student_submissions')
    .select('id, activity_title, status, created_at')
    .eq('student_id', studentId)
    .eq('file_hash', fileHash)
    .maybeSingle();

  if (ownDuplicate) {
    return {
      isDuplicateForStudent: true,
      cachedExtraction: null,
      matchedSubmissionId: ownDuplicate.id,
    };
  }

  // 2. Check if identical document has already been analyzed anywhere in system
  const { data: systemCache } = await supabaseAdmin
    .from('student_submissions')
    .select('id, ai_extracted_data')
    .eq('file_hash', fileHash)
    .not('ai_extracted_data', 'is', null)
    .limit(1)
    .maybeSingle();

  if (systemCache?.ai_extracted_data) {
    return {
      isDuplicateForStudent: false,
      cachedExtraction: systemCache.ai_extracted_data,
      matchedSubmissionId: systemCache.id,
    };
  }

  return { isDuplicateForStudent: false, cachedExtraction: null };
}

/**
 * Enqueue certificate for asynchronous background processing
 */
export async function enqueueCertificateJob(params: EnqueueJobParams): Promise<{
  success: boolean;
  jobId: string;
  status: CertificateProcessingState;
  isCached?: boolean;
}> {
  // Check for deduplication
  const dedup = await checkDocumentDeduplication(params.studentId, params.fileHash);

  if (dedup.isDuplicateForStudent) {
    throw new Error('Duplicate submission: You have already submitted this identical certificate proof.');
  }

  // If system-wide cached extraction exists, apply immediately
  if (dedup.cachedExtraction) {
    console.log(`[Queue Engine] Document cache hit for hash ${params.fileHash.slice(0, 10)}. Bypassing AI.`);
    
    // Update submission with cached AI extraction
    await supabaseAdmin
      .from('student_submissions')
      .update({
        ai_extracted_data: dedup.cachedExtraction,
        status: 'pending_mentor',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.submissionId);

    // Record audit ledger
    await recordAuditLog({
      actorId: params.studentId,
      actorRole: 'student',
      targetSubmissionId: params.submissionId,
      studentId: params.studentId,
      action: 'AI_PARSED',
      previousStatus: 'UPLOADED',
      newStatus: 'pending_mentor',
      remarks: 'Fast-path cache hit: Extracted from verified system fingerprint.',
      metadata: { fileHash: params.fileHash, cachedFrom: dedup.matchedSubmissionId },
    });

    broadcastSubmissionStatus(params.submissionId, {
      status: 'PARSED',
      submissionId: params.submissionId,
      message: 'Certificate metadata matched and verified instantly via cache.',
      aiData: dedup.cachedExtraction?.aiData || dedup.cachedExtraction,
    });

    return {
      success: true,
      jobId: 'cache-hit',
      status: 'PARSED',
      isCached: true,
    };
  }

  // Insert queued job into database
  const jobId = crypto.randomUUID();
  const jobRow = {
    id: jobId,
    submission_id: params.submissionId,
    student_id: params.studentId,
    file_url: params.fileUrl,
    storage_path: params.storagePath,
    file_hash: params.fileHash,
    status: 'QUEUED',
    retry_count: 0,
    max_retries: 3,
    circuit_breaker_status: geminiCircuitBreaker.getState(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from('certificate_processing_jobs').insert(jobRow);
  if (error) {
    console.warn('[Queue Engine] Job insert warning (table may need migration):', error.message);
  }

  // Dispatch initial QUEUED event
  broadcastSubmissionStatus(params.submissionId, {
    status: 'QUEUED',
    submissionId: params.submissionId,
    jobId,
    message: 'Certificate queued for asynchronous background AI inspection.',
  });

  // Trigger non-blocking worker execution asynchronously
  setImmediate(() => {
    executeJobWorker(jobId, params).catch((workerErr) => {
      console.error('[Queue Worker] Async processing exception:', workerErr);
    });
  });

  return {
    success: true,
    jobId,
    status: 'QUEUED',
    isCached: false,
  };
}

/**
 * Worker Processor for a single Certificate Job
 */
export async function executeJobWorker(jobId: string, params: EnqueueJobParams): Promise<void> {
  const transitionTo = async (
    state: CertificateProcessingState,
    errMsg?: string,
    resultData?: any
  ) => {
    await supabaseAdmin
      .from('certificate_processing_jobs')
      .update({
        status: state,
        error_message: errMsg || null,
        extraction_result: resultData || null,
        circuit_breaker_status: geminiCircuitBreaker.getState(),
        updated_at: new Date().toISOString(),
        completed_at: ['PARSED', 'MANUAL_REVIEW_REQUIRED', 'FAILED_FATAL'].includes(state)
          ? new Date().toISOString()
          : null,
      })
      .eq('id', jobId);

    broadcastSubmissionStatus(params.submissionId, {
      status: state,
      submissionId: params.submissionId,
      jobId,
      message: errMsg || `Certificate status updated to ${state}`,
      aiData: resultData,
    });
  };

  try {
    // 1. Transition state: QUEUED -> PROCESSING
    await transitionTo('PROCESSING');

    // 2. Check Circuit Breaker Status
    if (!geminiCircuitBreaker.canExecute()) {
      console.warn(
        '[Queue Worker] AI Circuit Breaker is OPEN. Routing job to Graceful Manual Review Queue.'
      );
      await transitionTo(
        'MANUAL_REVIEW_REQUIRED',
        'External AI service cooldown active. Submitted for priority Faculty Mentor review.'
      );

      await recordAuditLog({
        actorId: null,
        actorRole: 'system',
        targetSubmissionId: params.submissionId,
        studentId: params.studentId,
        action: 'MANUAL_REVIEW_FLAGGED',
        previousStatus: 'QUEUED',
        newStatus: 'MANUAL_REVIEW_REQUIRED',
        remarks: 'Circuit breaker tripped. Graceful degradation triggered without failing upload.',
      });
      return;
    }

    // 3. Fetch file buffer from Supabase Storage
    const { data: fileData, error: downloadErr } = await supabaseAdmin.storage
      .from('certificates')
      .download(params.storagePath);

    if (downloadErr || !fileData) {
      console.error('[Queue Worker] Failed to fetch certificate from storage:', downloadErr?.message);
      await transitionTo('FAILED_FATAL', 'Could not locate uploaded certificate file in storage.');
      return;
    }

    const arrayBuf = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const base64Data = buffer.toString('base64');
    const mimeType = fileData.type || 'image/jpeg';

    // 4. Execute AI Analysis Pipeline
    try {
      const extraction = await analyzeCertificateDocument(
        base64Data,
        mimeType,
        {
          studentName: params.studentName,
          studentRollNo: params.studentRollNo,
          clientOcrText: params.clientOcrText,
          clientQrPayloads: params.clientQrPayloads,
          fileName: params.fileName || 'certificate',
        },
        params.fileName || 'certificate'
      );

      geminiCircuitBreaker.recordSuccess();

      // Check if document was rejected as non-academic graphic
      if (extraction.isDocument === false) {
        await transitionTo(
          'FAILED_FATAL',
          extraction.documentRejectionReason ||
            'Uploaded image is not recognized as an official academic certificate.'
        );
        return;
      }

      // 5. Success: Transition to PARSED
      await transitionTo('PARSED', undefined, extraction);

      // Pack AI metadata into submission record
      const packedAiData = {
        aiData: extraction,
        tamperAnalysis: extraction.tamperAnalysis || null,
        credential_id: extraction.credentialId || null,
        verification_url: extraction.verificationUrl || null,
        suggestedPoints: extraction.suggestedPoints || 0,
      };

      await supabaseAdmin
        .from('student_submissions')
        .update({
          ai_extracted_data: packedAiData,
          category_id: extraction.matchedCategorySno || 1,
          activity_title: extraction.certificateTitle || 'Activity Certificate',
          issuing_organization: extraction.issuingOrganization || '',
          event_date: extraction.completionDate || new Date().toISOString().split('T')[0],
          status: 'pending_mentor',
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.submissionId);

      // Record Audit Ledger
      await recordAuditLog({
        actorId: params.studentId,
        actorRole: 'student',
        targetSubmissionId: params.submissionId,
        studentId: params.studentId,
        action: 'AI_PARSED',
        previousStatus: 'QUEUED',
        newStatus: 'pending_mentor',
        previousPoints: 0,
        newPoints: extraction.suggestedPoints || 0,
        remarks: `AI extraction completed. SNo ${extraction.matchedCategorySno} (${extraction.matchedCategoryName}).`,
        metadata: {
          confidence: extraction.confidenceScore,
          tamperVerdict: extraction.tamperAnalysis?.statusLabel || extraction.tamperAnalysis?.manipulationRisk,
        },
      });
    } catch (aiErr: any) {
      const isRateLimit = String(aiErr?.message).includes('429') || String(aiErr?.message).includes('quota');
      geminiCircuitBreaker.recordFailure(isRateLimit);

      console.error('[Queue Worker] AI Call failed:', aiErr.message);

      // If rate limited, degrade gracefully to manual review rather than failing student
      if (isRateLimit) {
        await transitionTo(
          'MANUAL_REVIEW_REQUIRED',
          'AI quota busy. Placed in queue for faculty mentor manual verification.'
        );
      } else {
        await transitionTo('FAILED_RETRYABLE', aiErr.message);
      }
    }
  } catch (err: any) {
    console.error('[Queue Worker] Unexpected error in worker loop:', err);
    await transitionTo('FAILED_RETRYABLE', err.message);
  }
}
