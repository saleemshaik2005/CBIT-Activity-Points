#!/usr/bin/env node

/**
 * ==============================================================================
 * CBIT SPMS — Secure Faculty Provisioning Script
 * ==============================================================================
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY="..." NEXT_PUBLIC_SUPABASE_URL="..." node scripts/provision-faculty.mjs --confirm-project-ref=<PROJECT_REF> [OPTIONS]
 *
 * Options:
 *   --dry-run                    Inspect and simulate actions without altering Auth or Database.
 *   --confirm-project-ref=<ref>  Mandatory guard: must match the target Supabase project ref.
 *   --config=<path>              Path to JSON config (default: .local/faculty.json).
 *   --reset-passwords            Force generation of new random temp passwords for existing accounts.
 *   --output=<path>              Output file for generated credentials (default: .local/provisioned-credentials.txt).
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Prevent UNABLE_TO_VERIFY_LEAF_SIGNATURE errors on Windows local environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Parse Command Line Arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const forceResetPasswords = args.includes('--reset-passwords');

const projectRefArg = args.find((a) => a.startsWith('--confirm-project-ref='));
const confirmedProjectRef = projectRefArg ? projectRefArg.split('=')[1].trim() : null;

const configArg = args.find((a) => a.startsWith('--config='));
const configPath = configArg
  ? path.resolve(rootDir, configArg.split('=')[1].trim())
  : path.resolve(rootDir, '.local/faculty.json');

const outputArg = args.find((a) => a.startsWith('--output='));
const outputPath = outputArg
  ? path.resolve(rootDir, outputArg.split('=')[1].trim())
  : path.resolve(rootDir, '.local/provisioned-credentials.txt');

// 2. Load Environment Variables (Never hardcoded)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is missing. Supply it via environment variable.');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is missing. Supply it via environment variable.');
  process.exit(1);
}

// 3. Project Reference Safety Guard
let actualProjectRef = '';
try {
  const urlObj = new URL(supabaseUrl);
  actualProjectRef = urlObj.hostname.split('.')[0];
} catch (e) {
  console.error('ERROR: Invalid NEXT_PUBLIC_SUPABASE_URL format:', supabaseUrl);
  process.exit(1);
}

if (!confirmedProjectRef) {
  console.error('\nSAFETY GUARD TRIGGERED:');
  console.error(`You must explicitly confirm the target project ref using --confirm-project-ref=<ref>`);
  console.error(`Target detected from URL: "${actualProjectRef}"`);
  console.error('This prevents accidental execution against the wrong environment (staging vs production).\n');
  process.exit(1);
}

if (confirmedProjectRef !== actualProjectRef) {
  console.error('\nSAFETY GUARD ERROR: Project ref mismatch!');
  console.error(`Provided with --confirm-project-ref : "${confirmedProjectRef}"`);
  console.error(`Detected from SUPABASE_URL         : "${actualProjectRef}"`);
  console.error('Execution halted to protect database integrity.\n');
  process.exit(1);
}

// 4. Load Faculty Configuration
if (!fs.existsSync(configPath)) {
  console.error(`ERROR: Configuration file not found at: ${configPath}`);
  console.error('Create a gitignored .local/faculty.json with the faculty configuration array.');
  process.exit(1);
}

let facultyList = [];
try {
  facultyList = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!Array.isArray(facultyList) || facultyList.length === 0) {
    throw new Error('Config file must contain a non-empty JSON array of faculty members.');
  }
} catch (err) {
  console.error(`ERROR: Failed to parse configuration file:`, err.message);
  process.exit(1);
}

// Helper: Generate Cryptographically Secure 24-character Password
function generateSecurePassword() {
  const rawBytes = crypto.randomBytes(18); // 18 bytes -> 24 base64 characters
  const baseStr = rawBytes.toString('base64');
  // Inject guaranteed symbols and mixed case
  const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*'];
  const symbol1 = specialChars[crypto.randomInt(0, specialChars.length)];
  const symbol2 = specialChars[crypto.randomInt(0, specialChars.length)];
  const cleaned = baseStr.replace(/[+/=]/g, (c) => ({ '+': 'K', '/': 'X', '=': 'Z' }[c]));
  return `${cleaned.slice(0, 10)}${symbol1}${cleaned.slice(10, 20)}${symbol2}`;
}

// 5. Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('================================================================');
  console.log(`CBIT SPMS Faculty Provisioning Script`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (Simulated)' : 'LIVE EXECUTION'}`);
  console.log(`Target Project: ${actualProjectRef}`);
  console.log(`Config File: ${configPath}`);
  console.log(`Accounts to Process: ${facultyList.length}`);
  console.log('================================================================\n');

  // Fetch existing Auth users to preserve UUIDs
  console.log('Fetching existing Auth users to preserve UUID associations...');
  const { data: authUsersData, error: listErr } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listErr) {
    console.error('ERROR: Failed to query existing Supabase Auth users:', listErr.message);
    process.exit(1);
  }

  const existingAuthUsers = authUsersData?.users || [];
  const authUserMap = new Map();
  for (const u of existingAuthUsers) {
    if (u.email) authUserMap.set(u.email.toLowerCase(), u);
  }

  const results = [];

  for (const faculty of facultyList) {
    const email = String(faculty.email).trim().toLowerCase();
    const fullName = String(faculty.full_name).trim();
    const role = faculty.role;
    const department = faculty.department || 'Artificial Intelligence and Data Science (AI&DS)';
    const section = faculty.section || '2';
    const batchYear = faculty.batch_year || 'Faculty';
    const rollNumber = faculty.roll_number || null;

    console.log(`\nProcessing: ${fullName} <${email}> [Role: ${role}]`);

    const existingAuthUser = authUserMap.get(email);
    let userId = existingAuthUser ? existingAuthUser.id : null;
    let tempPassword = null;
    let isNewAccount = !existingAuthUser;

    if (isNewAccount || forceResetPasswords) {
      tempPassword = generateSecurePassword();
    }

    if (isDryRun) {
      console.log(`  [DRY-RUN] Existing User: ${existingAuthUser ? `YES (UUID: ${userId})` : 'NO (Will Create)'}`);
      console.log(`  [DRY-RUN] Password Status: ${tempPassword ? 'Will set new 24-char temporary password' : 'Keep existing'}`);
      console.log(`  [DRY-RUN] Profile Upsert: role=${role}, login_method=password, must_change_password=true, is_active=true`);
      results.push({
        fullName,
        email,
        role,
        userId: userId || 'DRY-RUN-SIMULATED-UUID',
        tempPassword: tempPassword || '(Existing password preserved)',
        action: isNewAccount ? 'CREATE' : forceResetPasswords ? 'RESET_PASSWORD' : 'UPDATE_PROFILE',
      });
      continue;
    }

    // 1. Auth Provisioning
    if (isNewAccount) {
      console.log(`  Creating new Auth user with email confirmation...`);
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName, role },
      });

      if (createErr) {
        console.error(`  ERROR creating Auth user for ${email}:`, createErr.message);
        continue;
      }
      userId = created.user.id;
      console.log(`  Created Auth user successfully. UUID: ${userId}`);
    } else {
      console.log(`  Existing Auth user found (UUID: ${userId}). Preserving UUID.`);
      if (forceResetPasswords && tempPassword) {
        console.log(`  Updating password with new secure temporary password...`);
        const { error: updateAuthErr } = await supabase.auth.admin.updateUserById(userId, {
          password: tempPassword,
          email_confirm: true,
        });
        if (updateAuthErr) {
          console.error(`  ERROR resetting password for ${email}:`, updateAuthErr.message);
          continue;
        }
      }
    }

    // 2. Database Profile Upsert
    console.log(`  Upserting public.profiles record...`);
    const profileRow = {
      id: userId,
      email,
      full_name: fullName,
      role,
      department,
      section,
      batch_year: batchYear,
      roll_number: rollNumber,
      login_method: 'password',
      must_change_password: true,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert(profileRow, { onConflict: 'id' });

    if (profileErr) {
      console.error(`  ERROR upserting profile for ${email}:`, profileErr.message);
      continue;
    }

    console.log(`  Profile synchronized successfully.`);
    results.push({
      fullName,
      email,
      role,
      userId,
      tempPassword: tempPassword || '(Existing password preserved)',
      action: isNewAccount ? 'CREATED' : forceResetPasswords ? 'PASSWORD_RESET' : 'UPDATED',
    });
  }

  // 6. Write Protected Local Output File
  if (!isDryRun) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const outputLines = [
      '# ==============================================================================',
      '# CBIT SPMS — Generated Faculty Credentials (CONFIDENTIAL)',
      `# Date Generated: ${new Date().toISOString()}`,
      `# Target Project: ${actualProjectRef}`,
      '# ==============================================================================',
      '# Distribute each individual temporary password securely to the faculty member.',
      '# On first login, they will be required to set their own permanent password.',
      '# ==============================================================================\n',
    ];

    for (const r of results) {
      outputLines.push(`Role:        ${r.role}`);
      outputLines.push(`Name:        ${r.fullName}`);
      outputLines.push(`Email:       ${r.email}`);
      outputLines.push(`Temp Pass:   ${r.tempPassword}`);
      outputLines.push(`User UUID:   ${r.userId}`);
      outputLines.push(`Action:      ${r.action}`);
      outputLines.push('------------------------------------------------------------------');
    }

    fs.writeFileSync(outputPath, outputLines.join('\n'), { mode: 0o600 });
    console.log(`\nCredentials written once to protected local file: ${outputPath}`);
    console.log('NOTE: This file is excluded from Git (.gitignore). Never commit or share it publicly.');
  }

  console.log('\n================================================================');
  console.log(`Provisioning ${isDryRun ? 'Dry-Run ' : ''}Complete! Processed: ${results.length} accounts.`);
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
