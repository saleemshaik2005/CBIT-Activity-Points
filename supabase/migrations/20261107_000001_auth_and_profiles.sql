-- ==============================================================================
-- Migration: 20261107_000001_auth_and_profiles.sql
-- Description: Additive migration for hardened authentication, faculty password
-- support, active status, forced password reset flags, and enriched profile fields.
-- Idempotent and fully backward compatible with existing records.
-- ==============================================================================

-- 1. Helper function to fetch the authoritative role of the caller in RLS policies
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated, anon, service_role;

-- 2. Additive Authentication Columns on Profiles
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS login_method TEXT DEFAULT 'google' CHECK (login_method IN ('google', 'password')),
    ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Additive Enriched Profile Persistence Columns
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS github_url TEXT,
    ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
    ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- 4. Helpful Indices
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles(lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_login_method ON public.profiles(login_method);

-- 5. Set sensible defaults for existing records:
-- Faculty and Admin should be password-authenticated by default
UPDATE public.profiles
SET login_method = 'password'
WHERE role IN ('mentor', 'class_teacher', 'hod', 'admin')
  AND (login_method IS NULL OR login_method = 'google');

-- Students remain login_method = 'google'
UPDATE public.profiles
SET login_method = 'google'
WHERE role = 'student'
  AND login_method IS NULL;
