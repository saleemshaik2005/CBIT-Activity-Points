# CBIT SPMS — Database Migrations Guide

## Migration Sequence & Order

All migrations are version-controlled, strictly additive, and backward compatible. Existing tables, columns, UUIDs, and foreign key relationships are strictly preserved.

| Sequence | Migration File | Description | Rollback Consideration |
|---|---|---|---|
| 0 | `20261107_000000_baseline.sql` | Canonical baseline schema representing production tables (`system_settings`, `profiles`, `activity_categories`, `student_submissions`) + `get_my_role()` helper. | Baseline reference only (`IF NOT EXISTS`). Safe to re-run. |
| 1 | `20261107_000001_auth_and_profiles.sql` | Additive columns: `login_method`, `must_change_password`, `is_active`, `skills`, `github_url`, `linkedin_url`, `resume_url`. Sets faculty to password auth. | Columns are nullable or have defaults. Dropping columns if rolled back does not impact core schema. |
| 2 | `20261107_000002_notifications.sql` | Real database notifications table with recipient-scoped RLS, `get_my_role()` guard, and performance indexes. | Can be dropped with `DROP TABLE public.notifications CASCADE;` if rolled back. |
| 3 | `20261107_000003_web_push.sql` | Web Push browser subscriptions table with owner-only RLS. | Can be dropped with `DROP TABLE public.push_subscriptions CASCADE;` if rolled back. |
| 4 | `20261107_000004_rls_hardening.sql` | Triggers preventing unauthorized self-role promotion or student self-approval, plus atomic `review_submission_rpc` transaction. | Drop triggers `trg_guard_profile_updates` and `trg_guard_submission_updates`, and function `review_submission_rpc`. |
| 5 | `20261107_000005_audit_and_indexes.sql` | Covering and composite indexes for analytics and rapid search. | Can drop added indexes safely without impacting tables. |

## Staging Application Instructions
If you already applied migrations 0 and 1, you can continue directly from migration 2:
1. In the **Staging** Supabase project dashboard, open the **SQL Editor**.
2. Run `20261107_000002_notifications.sql` (now defines `public.get_my_role()` before RLS policies).
3. Run `20261107_000003_web_push.sql`.
4. Run `20261107_000004_rls_hardening.sql`.
5. Run `20261107_000005_audit_and_indexes.sql`.

*Note: If starting with a brand new database from scratch, run 0 through 5 in sequential order.*

## Production Safety Rule
**Never apply migrations to the live production Supabase project without explicit approval and an active, verified database backup.**
