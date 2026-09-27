/**
 * CBIT SPMS Certificate Intelligence Bridge
 * All certificate analysis, OCR, QR decoding, and visual anomaly detection are powered
 * strictly by the local/pretrained non-Gemini pipeline in `./certificate-intelligence`.
 */
export {
  analyzeCertificateDocument,
  generateForensicTamperAssessment,
  verifyStudentNameMatch,
  OFFICIAL_STUDENT_ROSTER,
} from './certificate-intelligence';
export type { CertificatePipelineOptions } from './certificate-intelligence';
