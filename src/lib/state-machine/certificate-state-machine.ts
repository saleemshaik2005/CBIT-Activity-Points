/**
 * Deterministic State Machine for CBIT Certificate Life Cycle
 * [UPLOADED] -> [QUEUED] -> [PROCESSING] -> [PARSED / MANUAL_REVIEW_REQUIRED / FAILED_RETRYABLE / FAILED_FATAL]
 */

export type CertificateProcessingState =
  | 'UPLOADED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'PARSED'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'FAILED_RETRYABLE'
  | 'FAILED_FATAL';

export const VALID_STATE_TRANSITIONS: Record<CertificateProcessingState, CertificateProcessingState[]> = {
  UPLOADED: ['QUEUED', 'FAILED_FATAL'],
  QUEUED: ['PROCESSING', 'FAILED_FATAL', 'MANUAL_REVIEW_REQUIRED'],
  PROCESSING: [
    'PARSED',
    'MANUAL_REVIEW_REQUIRED',
    'FAILED_RETRYABLE',
    'FAILED_FATAL',
  ],
  PARSED: ['MANUAL_REVIEW_REQUIRED'], // Can be flagged for manual review if faculty requests
  MANUAL_REVIEW_REQUIRED: ['PARSED', 'FAILED_FATAL'],
  FAILED_RETRYABLE: ['QUEUED', 'FAILED_FATAL', 'MANUAL_REVIEW_REQUIRED'],
  FAILED_FATAL: [], // Terminal failure state
};

export function canTransition(
  currentState: CertificateProcessingState,
  nextState: CertificateProcessingState
): boolean {
  const allowed = VALID_STATE_TRANSITIONS[currentState] || [];
  return allowed.includes(nextState);
}

export function validateStateTransition(
  currentState: CertificateProcessingState,
  nextState: CertificateProcessingState
): { valid: boolean; reason?: string } {
  if (currentState === nextState) {
    return { valid: true };
  }
  if (!canTransition(currentState, nextState)) {
    return {
      valid: false,
      reason: `Illegal state transition from ${currentState} to ${nextState}. Allowed transitions: ${
        VALID_STATE_TRANSITIONS[currentState]?.join(', ') || 'none'
      }`,
    };
  }
  return { valid: true };
}

export function isTerminalState(state: CertificateProcessingState): boolean {
  return state === 'PARSED' || state === 'MANUAL_REVIEW_REQUIRED' || state === 'FAILED_FATAL';
}

