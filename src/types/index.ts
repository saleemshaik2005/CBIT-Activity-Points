export type UserRole = 'student' | 'mentor' | 'class_teacher' | 'hod' | 'admin';

export type SubmissionStatus = 'draft' | 'pending_mentor' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  roll_number?: string;
  department: string;
  section?: string;
  batch_year: string;
  is_lateral_entry: boolean;
  mentor_id?: string;
  mentor_name?: string;
  phone_number?: string;
  created_at?: string;
}

export interface ActivityCategory {
  id: number;
  sno: number;
  name: string;
  sub_type?: string;
  default_points: number;
  max_points_allowed: number;
  description?: string;
  is_active?: boolean;
}

export interface StudentSubmission {
  id: string;
  student_id: string;
  student_name?: string;
  student_roll_no?: string;
  category_id: number;
  category?: ActivityCategory;
  activity_title: string;
  issuing_organization: string;
  event_date: string;
  semester: number; // 1 - 8
  academic_year: string;
  claimed_points: number;
  awarded_points: number;
  certificate_url: string;
  file_type?: string;
  credential_id?: string;
  verification_url?: string;
  ai_extracted_data?: AIExtractionResult;
  status: SubmissionStatus;
  mentor_remarks?: string;
  approved_by?: string;
  approver_name?: string;
  approved_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface AIExtractionResult {
  certificateTitle: string;
  recipientName: string;
  issuingOrganization: string;
  completionDate: string;
  durationOrHours?: string;
  credentialId?: string;
  verificationUrl?: string;
  matchedCategorySno: number;
  matchedCategoryName: string;
  matchedSubType?: string;
  suggestedPoints: number;
  confidenceScore: number; // 0.0 to 1.0
  summary: string;
  keySkillsOrTopics?: string[];
  rawTextExcerpt?: string;
}

export interface SystemSettings {
  id: number;
  college_name: string;
  college_code: string;
  regular_target_points: number;
  lateral_entry_target_points: number;
  academic_year: string;
}

export interface MARSemesterSummary {
  semester: number;
  pointsEarned: number;
  submissionsCount: number;
}

export interface MARCategoryProgress {
  sno: number;
  name: string;
  maxPointsAllowed: number;
  pointsEarned: number;
  isCapped: boolean;
}

export interface MARCalculationResult {
  totalApprovedPoints: number;
  totalUncappedApprovedPoints: number;
  totalPendingPoints: number;
  targetPoints: number;
  percentage: number;
  isCompleted: boolean;
  pointsRemaining: number;
  semesterBreakdown: Record<number, number>;
  categoryPointsMap: Record<number, number>;
  approvedCount: number;
  pendingCount: number;
}

