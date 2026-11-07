-- ==============================================================================
-- Migration: 20261107_000004_rls_hardening.sql
-- Description: Hardens Row-Level Security (RLS), adds privilege escalation guards,
-- and creates atomic transactional RPCs for mentor reviews.
-- ==============================================================================

-- 1. Function to prevent unauthorized modification of sensitive profile fields
CREATE OR REPLACE FUNCTION public.guard_profile_updates()
RETURNS TRIGGER AS $$
DECLARE
    caller_role user_role;
BEGIN
    -- Allow service role and database admin unconditionally
    IF current_setting('role', true) = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Fetch caller's current authoritative role
    SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();

    -- If caller is not an admin, freeze protected columns
    IF caller_role IS NULL OR caller_role <> 'admin' THEN
        IF NEW.role IS DISTINCT FROM OLD.role THEN
            RAISE EXCEPTION 'Unauthorized: Users cannot modify their own role.';
        END IF;

        IF NEW.login_method IS DISTINCT FROM OLD.login_method THEN
            RAISE EXCEPTION 'Unauthorized: Users cannot modify their login method.';
        END IF;

        IF NEW.must_change_password IS DISTINCT FROM OLD.must_change_password THEN
            RAISE EXCEPTION 'Unauthorized: must_change_password can only be updated by the server password change flow.';
        END IF;

        IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
            RAISE EXCEPTION 'Unauthorized: Account activation status cannot be changed by the user.';
        END IF;

        IF NEW.mentor_id IS DISTINCT FROM OLD.mentor_id THEN
            RAISE EXCEPTION 'Unauthorized: Mentor assignments can only be changed by HoD or Admin.';
        END IF;

        IF NEW.roll_number IS DISTINCT FROM OLD.roll_number THEN
            RAISE EXCEPTION 'Unauthorized: Roll numbers are immutable and assigned from official rosters.';
        END IF;
    END IF;

    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_profile_updates ON public.profiles;
CREATE TRIGGER trg_guard_profile_updates
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.guard_profile_updates();


-- 2. Guard against students self-approving or altering points
CREATE OR REPLACE FUNCTION public.guard_submission_updates()
RETURNS TRIGGER AS $$
DECLARE
    caller_role user_role;
BEGIN
    IF current_setting('role', true) = 'service_role' THEN
        RETURN NEW;
    END IF;

    SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();

    -- Student safety checks
    IF caller_role = 'student' THEN
        IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
            RAISE EXCEPTION 'Forbidden: Students cannot self-approve submissions.';
        END IF;

        IF NEW.awarded_points IS DISTINCT FROM OLD.awarded_points AND NEW.awarded_points > 0 THEN
            RAISE EXCEPTION 'Forbidden: Students cannot award themselves points.';
        END IF;

        IF OLD.status = 'approved' THEN
            RAISE EXCEPTION 'Forbidden: Approved submissions are locked and cannot be edited by students.';
        END IF;
    END IF;

    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_submission_updates ON public.student_submissions;
CREATE TRIGGER trg_guard_submission_updates
BEFORE UPDATE ON public.student_submissions
FOR EACH ROW
EXECUTE FUNCTION public.guard_submission_updates();


-- 3. Atomic Mentor Review RPC Function
CREATE OR REPLACE FUNCTION public.review_submission_rpc(
    p_submission_id UUID,
    p_status submission_status,
    p_awarded_points INTEGER,
    p_remarks TEXT
) RETURNS JSONB AS $$
DECLARE
    v_sub public.student_submissions%ROWTYPE;
    v_caller_role user_role;
    v_student_mentor UUID;
    v_max_cap INTEGER;
BEGIN
    -- 1. Identify caller
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role IS NULL OR v_caller_role = 'student' THEN
        RAISE EXCEPTION 'Unauthorized: Only faculty mentors, class coordinators, HoD, or admins can review submissions.';
    END IF;

    -- 2. Fetch target submission
    SELECT * INTO v_sub FROM public.student_submissions WHERE id = p_submission_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission not found: %', p_submission_id;
    END IF;

    -- 3. Verify mentor assignment (mentors can only review assigned mentees)
    SELECT mentor_id INTO v_student_mentor FROM public.profiles WHERE id = v_sub.student_id;
    IF v_caller_role = 'mentor' AND (v_student_mentor IS NULL OR v_student_mentor <> auth.uid()) THEN
        RAISE EXCEPTION 'Unauthorized: You are not assigned as the mentor for this student.';
    END IF;

    -- 4. Check category cap
    SELECT max_points_allowed INTO v_max_cap FROM public.activity_categories WHERE id = v_sub.category_id;
    IF v_max_cap IS NOT NULL AND p_awarded_points > v_max_cap THEN
        RAISE EXCEPTION 'Points awarded (%) exceed the maximum allowable cap (%) for this category.', p_awarded_points, v_max_cap;
    END IF;

    -- 5. Perform update
    UPDATE public.student_submissions
    SET
        status = p_status,
        awarded_points = CASE WHEN p_status = 'approved' THEN p_awarded_points ELSE 0 END,
        mentor_remarks = p_remarks,
        approved_by = CASE WHEN p_status = 'approved' THEN auth.uid() ELSE NULL END,
        approved_at = CASE WHEN p_status = 'approved' THEN NOW() ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_submission_id;

    -- 6. Insert notification for the student
    INSERT INTO public.notifications (
        recipient_id,
        recipient_role,
        type,
        title,
        message,
        link,
        related_submission_id,
        sender_id,
        sender_name
    ) VALUES (
        v_sub.student_id,
        'student',
        CASE
            WHEN p_status = 'approved' THEN 'approval'
            WHEN p_status = 'rejected' THEN 'rejection'
            ELSE 'clarification'
        END,
        CASE
            WHEN p_status = 'approved' THEN 'Certificate Approved (+' || p_awarded_points || ' Points)'
            WHEN p_status = 'rejected' THEN 'Certificate Rejected'
            ELSE 'Mentor Requested Clarification'
        END,
        COALESCE(p_remarks, 'Status updated to ' || p_status),
        '/student/history',
        p_submission_id,
        auth.uid(),
        (SELECT full_name FROM public.profiles WHERE id = auth.uid())
    );

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'new_status', p_status,
        'awarded_points', p_awarded_points
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
