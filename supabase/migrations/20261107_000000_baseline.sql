-- ==============================================================================
-- Migration: 20261107_000000_baseline.sql
-- Description: Establishes the canonical baseline schema of CBIT SPMS
-- Preserves existing production tables, types, and baseline data.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'mentor', 'class_teacher', 'hod', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('draft', 'pending_mentor', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- System Settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id SERIAL PRIMARY KEY,
    college_name TEXT NOT NULL DEFAULT 'Chaitanya Bharathi Institute of Technology (Autonomous)',
    college_code TEXT NOT NULL DEFAULT 'CBIT - HYDERABAD-75',
    regular_target_points INTEGER NOT NULL DEFAULT 60,
    lateral_entry_target_points INTEGER NOT NULL DEFAULT 45,
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    roll_number TEXT UNIQUE,
    department TEXT DEFAULT 'CSE',
    section TEXT DEFAULT 'A',
    batch_year TEXT DEFAULT '2022-2026',
    is_lateral_entry BOOLEAN DEFAULT FALSE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_roll ON public.profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_mentor ON public.profiles(mentor_id);

-- Helper function to fetch the authoritative role of the caller in RLS policies
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated, anon, service_role;

-- Activity Categories
CREATE TABLE IF NOT EXISTS public.activity_categories (
    id SERIAL PRIMARY KEY,
    sno INTEGER NOT NULL,
    name TEXT NOT NULL,
    sub_type TEXT NOT NULL DEFAULT 'General',
    default_points INTEGER NOT NULL,
    max_points_allowed INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_activity_category_sno_subtype UNIQUE (sno, sub_type)
);

-- Student Submissions Table
CREATE TABLE IF NOT EXISTS public.student_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES public.activity_categories(id),
    activity_title TEXT NOT NULL,
    issuing_organization TEXT,
    event_date DATE,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    academic_year TEXT DEFAULT '2024-2025',
    claimed_points INTEGER NOT NULL,
    awarded_points INTEGER DEFAULT 0,
    certificate_url TEXT NOT NULL,
    storage_bucket TEXT DEFAULT 'certificates',
    storage_path TEXT,
    file_type TEXT,
    ai_extracted_data JSONB,
    status submission_status NOT NULL DEFAULT 'pending_mentor',
    mentor_remarks TEXT,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.student_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.student_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_semester ON public.student_submissions(semester);
