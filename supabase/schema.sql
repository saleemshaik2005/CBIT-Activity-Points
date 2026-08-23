-- ==============================================================================
-- CBIT MAR (Mandatory Additional Requirements) Activity Points System
-- Complete Supabase PostgreSQL Database Schema
-- ==============================================================================

-- 1. ENUMS & EXTENSIONS
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

-- 2. SYSTEM SETTINGS (Dynamic target points & college configuration)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id SERIAL PRIMARY KEY,
    college_name TEXT NOT NULL DEFAULT 'Chaitanya Bharathi Institute of Technology (Autonomous)',
    college_code TEXT NOT NULL DEFAULT 'CBIT - HYDERABAD-75',
    regular_target_points INTEGER NOT NULL DEFAULT 60,
    lateral_entry_target_points INTEGER NOT NULL DEFAULT 50,
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default system settings if empty
INSERT INTO public.system_settings (id, college_name, college_code, regular_target_points, lateral_entry_target_points)
VALUES (1, 'Chaitanya Bharathi Institute of Technology (Autonomous)', 'CBIT - HYDERABAD-75', 60, 50)
ON CONFLICT (id) DO NOTHING;

-- 3. PROFILES TABLE (Users & Roles)
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

-- Index on roll number and role
CREATE INDEX IF NOT EXISTS idx_profiles_roll ON public.profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_mentor ON public.profiles(mentor_id);

-- 4. ACTIVITY CATEGORIES (The 24 CBIT MAR categories - Fully customizable by Admin)
CREATE TABLE IF NOT EXISTS public.activity_categories (
    id SERIAL PRIMARY KEY,
    sno INTEGER NOT NULL,
    name TEXT NOT NULL,
    sub_type TEXT,
    default_points INTEGER NOT NULL,
    max_points_allowed INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed all 24 Official CBIT MAR Categories
INSERT INTO public.activity_categories (sno, name, sub_type, default_points, max_points_allowed, description)
VALUES
    (1, 'MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)', '12 weeks', 20, 40, 'MOOC courses of 12 weeks duration or equivalent'),
    (1, 'MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)', '8 weeks', 16, 40, 'MOOC courses of 8 weeks duration or equivalent'),
    (2, 'Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.', 'Organizer', 5, 10, 'Organizer in technical fest, workshops, or conferences'),
    (2, 'Tech Fest/ R&D Day/ Freshers Workshop/ Conference/ hackathons etc.', 'Participant', 3, 6, 'Participant in technical fest, workshops, or conferences'),
    (3, 'Rural Reporting', 'General', 5, 10, 'Rural reporting activities and village survey reports'),
    (4, 'Harithaharam /plantation', 'General', 1, 5, 'Participation in Harithaharam or tree plantation drives'),
    (5, 'Participation in Relief camps', 'General', 20, 40, 'Participation in disaster relief camps / emergency relief work'),
    (6, 'Participation in Debate/ Group Discussion/ Technical Quiz', 'General', 10, 20, 'Debates, GDs, or technical quiz competitions'),
    (7, 'Publication in News Paper, Magazines in institution level (Magazine / article/internet)', 'Editor', 10, 20, 'Editor of institution-level magazine or publication'),
    (7, 'Publication in News Paper, Magazines in institution level (Magazine / article/internet)', 'Writer', 5, 10, 'Writer / contributor to institution magazine or articles'),
    (8, 'Publication in News Paper, Magazine & Blogs', 'General', 10, 20, 'Articles published in external newspapers, magazines or blogs'),
    (9, 'Research Publication (per publication)', 'General', 10, 20, 'Research papers published in conferences or journals'),
    (10, 'Innovation Projects (other than course requirements)', 'General', 20, 40, 'Innovative projects developed outside curriculum requirements'),
    (11, 'Blood donation /NSS or NCC participation', 'General', 5, 10, 'Blood donation or active participation in NSS/NCC events'),
    (12, 'Blood donation/NSS camp organization', 'General', 10, 20, 'Organizing blood donation or NSS camps'),
    (13, 'Participation in Sports/Games', 'College level', 5, 10, 'Sports & games participation at college level'),
    (13, 'Participation in Sports/Games', 'University level', 10, 20, 'Sports & games participation at university level'),
    (13, 'Participation in Sports/Games', 'Region level', 12, 24, 'Sports & games participation at regional level'),
    (13, 'Participation in Sports/Games', 'State level', 15, 30, 'Sports & games participation at state level'),
    (13, 'Participation in Sports/Games', 'National level', 20, 20, 'Sports & games participation at national level'),
    (14, 'Cultural Programme (Dance, Drama, Elocution, Music etc. )', 'General', 5, 10, 'Cultural events participation (Dance, Drama, Music, etc.)'),
    (15, 'Member of Professional Society', 'General', 5, 10, 'Membership in IEEE, CSI, IETE, ASME, ACM, etc.'),
    (16, 'Student Chapter /Cubs', 'General', 5, 10, 'Active membership in student chapters and college clubs'),
    (17, 'Relevant Industry Visit & Report', 'General', 10, 20, 'Official industrial visit along with submitted report'),
    (18, 'Photography activities in different Clubs (Photography club, Cine club)', 'General', 5, 10, 'Photography and media contributions in clubs'),
    (19, 'Participation in Yoga camp', 'General', 5, 10, 'Participation in yoga camps with certificate'),
    (20, 'Self-Entrepreneurship Program', 'General', 20, 20, 'Startup or self-entrepreneurship programs'),
    (21, 'Adventure sports with Certification', 'General', 10, 20, 'Certified adventure sports and mountaineering'),
    (22, 'Training to under privileged Physically challenged', 'General', 10, 20, 'Social training service for underprivileged or disabled'),
    (23, 'Community Service & Allied Activities', 'General', 10, 20, 'Community welfare service and allied social initiatives'),
    (24, 'Class Representative', 'General', 5, 10, 'Elected Class Representative service for academic year')
ON CONFLICT DO NOTHING;

-- 5. STUDENT SUBMISSIONS TABLE
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
    file_type TEXT,
    ai_extracted_data JSONB,
    status submission_status NOT NULL DEFAULT 'pending_mentor',
    mentor_remarks TEXT,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for queries
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.student_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.student_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_semester ON public.student_submissions(semester);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Activity Categories & System Settings are readable by everyone
CREATE POLICY "Public Read Categories" ON public.activity_categories FOR SELECT USING (true);
CREATE POLICY "Public Read System Settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admin Full Control Categories" ON public.activity_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admin Full Control Settings" ON public.system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Helper function for role checking without recursion
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profile Policies
CREATE POLICY "Authenticated users can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own basic profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.get_my_role() = 'admin');

-- Submission Policies
CREATE POLICY "Students can view own submissions" ON public.student_submissions 
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create submissions" ON public.student_submissions 
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update draft/rejected submissions" ON public.student_submissions 
    FOR UPDATE USING (student_id = auth.uid() AND status IN ('draft', 'rejected'));

CREATE POLICY "Mentors can view their mentees submissions" ON public.student_submissions 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles s 
            WHERE s.id = student_submissions.student_id AND s.mentor_id = auth.uid()
        )
    );

CREATE POLICY "Mentors can update (approve/reject) their mentees submissions" ON public.student_submissions 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles s 
            WHERE s.id = student_submissions.student_id AND s.mentor_id = auth.uid()
        )
    );

CREATE POLICY "HOD, Class Teachers, Admins can view all submissions in dept" ON public.student_submissions 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            JOIN public.profiles s ON s.department = p.department
            WHERE p.id = auth.uid() AND p.role IN ('class_teacher', 'hod', 'admin')
            AND s.id = student_submissions.student_id
        ) OR EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 7. FUNCTION: AUTO CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'student'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. STORAGE BUCKET CONFIGURATION (For Certificate uploads)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload certificates" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Public Read Access for Certificates" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'certificates');
