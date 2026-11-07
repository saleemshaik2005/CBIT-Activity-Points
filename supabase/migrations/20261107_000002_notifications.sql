-- ==============================================================================
-- Migration: 20261107_000002_notifications.sql
-- Description: Real database-backed notification system for CBIT SPMS
-- Replaces mock notifications with server-enforced, recipient-scoped notifications.
-- ==============================================================================

-- 1. Helper function to fetch the authoritative role of the caller in RLS policies
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated, anon, service_role;

-- 2. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_role user_role,
    type TEXT NOT NULL CHECK (type IN ('approval', 'rejection', 'submission', 'clarification', 'announcement', 'reassignment', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    related_submission_id UUID REFERENCES public.student_submissions(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid query performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Select Policy: Recipients can read their direct notifications or role-based announcements
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
USING (
    auth.uid() = recipient_id
    OR (
        recipient_id IS NULL AND (
            recipient_role IS NULL
            OR recipient_role = public.get_my_role()
        )
    )
    OR public.get_my_role() = 'admin'::user_role
);

-- Update Policy: Users can only update their own notifications (e.g., mark as read)
DROP POLICY IF EXISTS "Users can mark own notifications as read" ON public.notifications;
CREATE POLICY "Users can mark own notifications as read"
ON public.notifications FOR UPDATE
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

-- Delete Policy: Users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = recipient_id OR public.get_my_role() = 'admin'::user_role);

-- Insert Policy: Authenticated users can insert notifications targeted to appropriate parties or admin
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
);
