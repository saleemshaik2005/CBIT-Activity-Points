<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CBIT SPMS — Permanent Development and Operational Safety Rules

## 1. Branch Protection & Git Workflow
- The production branch is `main`. All development and feature work must occur on `dev` or feature branches branched from `dev`.
- Never commit development changes directly to `main`.
- Never push development builds or unreviewed commits directly to the live production deployment.
- Merges to `main` must occur only after full verification on staging and with explicit user approval.

## 2. Environment & Credential Isolation
- Staging and production MUST be fully isolated across all layers:
  - Separate Git branch (`main` vs `dev`)
  - Separate Vercel deployments (production domain vs preview/staging URL)
  - Separate Supabase projects (different database, different auth users, different storage buckets)
  - Separate test identities and synthetic certificates in staging; never copy real student PII or certificates to staging.
- Never use production Supabase credentials in local development or staging.
- Local development defaults strictly to the staging configuration.
- Never commit service-role keys, passwords, API tokens, private keys, or `.env*` files (except `.env.example`).
- Never print production service keys, auth tokens, or passwords to terminal logs, client bundles, or chat.

## 3. Database Migrations & Data Safety
- Production data (student profiles, faculty assignments, submissions, approval history) is live and must be preserved.
- All database modifications must be written as version-controlled, additive SQL migration scripts under `supabase/migrations/`.
- Never run destructive operations (`DROP TABLE`, `TRUNCATE`, column deletions) without explicit approval.
- Migrations must be applied and tested on the staging Supabase project first.
- Applying any migration to production requires explicit user consent and a verified database backup.

## 4. Server-Authoritative Authentication & Authorization
- Authorization must be enforced strictly server-side using cryptographically verified Supabase session cookies.
- Every protected route and API handler must resolve the caller's session via `@supabase/ssr` and retrieve the verified role from `public.profiles`.
- Never trust `localStorage`, client-side state, unverified JWT payloads, or client-provided student/mentor IDs for permissions.
- Inactive accounts (`is_active = false`) are denied access.
- Faculty with `must_change_password = true` are restricted to password-change and session endpoints until their password is updated.
- Student accounts authenticate only through official Google OAuth. Faculty accounts authenticate via college email and password.

## 5. Testing & Verification Standards
- Run real automated tests for authentication matrices, MAR calculations, category caps, RLS enforcement, and profile persistence.
- Never report simulated or fabricated test passes. Clearly distinguish executed tests from blocked or unverified items.
- Maintain production buildability (`next build` with Turbopack) at all checkpoints.

## 6. Production Release Gates
- Production releases require a strict checklist:
  1. Fresh production database backup.
  2. Staging test pass across all 5 roles + admin.
  3. User review and explicit approval of migration files and faculty provisioning.
  4. Final PR merge from `dev` into `main`.

