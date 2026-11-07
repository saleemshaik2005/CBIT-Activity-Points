-- ==============================================================================
-- Migration: 20261107_000005_audit_and_indexes.sql
-- Description: Composite and covering indexes for production queries and analytics
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_submissions_student_category ON public.student_submissions(student_id, category_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_status ON public.student_submissions(student_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_desc ON public.student_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_storage_path ON public.student_submissions(storage_path);
CREATE INDEX IF NOT EXISTS idx_profiles_role_dept ON public.profiles(role, department);
