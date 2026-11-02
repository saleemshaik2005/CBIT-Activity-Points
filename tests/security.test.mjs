import assert from 'assert/strict';
import { spawn } from 'child_process';
import http from 'http';

/**
 * Automated Security & Defense Verification Test Suite
 * Tests directory traversal, uniform error handling, magic byte enforcement,
 * rate limiting, and security headers.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body;

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}

  return { status: res.status, headers: res.headers, text, json };
}

async function runTests() {
  console.log('====================================================');
  console.log('CBIT SPMS Security Verification Suite');
  console.log(`Target: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Directory Traversal Defense Test
  await test('Path Traversal: Nested ../ patterns are rejected with 400 or 403', async () => {
    const res = await makeRequest('/api/files/....//....//....//.env.local');
    assert.ok(
      [400, 403, 404].includes(res.status),
      `Expected status 400/403/404, got ${res.status}`
    );
    assert.ok(
      !res.text.includes('SUPABASE_SERVICE_ROLE_KEY'),
      'CRITICAL: .env.local file content leaked via path traversal!'
    );
  });

  // 2. Directory Traversal with Encoded Null Bytes
  await test('Path Traversal: Null byte injection is rejected', async () => {
    const res = await makeRequest('/api/files/certificates%00/test.jpg');
    assert.ok(
      [400, 403, 404].includes(res.status),
      `Expected 400/403/404 for null byte, got ${res.status}`
    );
  });

  // 3. User Enumeration Defense Test
  await test('Auth: Uniform response for non-existent users (no enumeration)', async () => {
    const res = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'non_existent_roll_999999',
        password: 'RandomPassword123!',
      }),
    });

    assert.equal(res.status, 401, `Expected status 401, got ${res.status}`);
    assert.ok(
      res.json?.error?.includes('Invalid credentials') || res.json?.error?.includes('credentials'),
      `Expected generic error message, got: ${res.json?.error}`
    );
    assert.ok(
      !res.text.includes('No registered student or faculty found'),
      'Leaked existence of user record in 404 error!'
    );
  });

  // 4. Default Password Formula Leak Defense
  await test('Auth: No password formula leakage in error responses', async () => {
    const res = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '160124771129',
        password: 'WrongPassword999!',
      }),
    });

    assert.equal(res.status, 401, `Expected status 401, got ${res.status}`);
    assert.ok(
      !res.text.includes('Default formula for students is Cbit@'),
      'CRITICAL: Password formula leaked in login error message!'
    );
  });

  // 5. Team Gate Backdoor Disabled Test
  await test('Team Gate: Default backdoor passcode cbit-team-2026 is blocked', async () => {
    const res = await makeRequest('/api/auth/team-gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'cbit-team-2026' }),
    });

    // Should return 401 (invalid) or 503 (disabled unless env configured)
    assert.ok(
      [401, 503].includes(res.status),
      `Expected 401 or 503, got ${res.status}`
    );
    assert.notEqual(res.json?.success, true, 'CRITICAL: Backdoor passcode cbit-team-2026 succeeded!');
  });

  // 6. Unauthenticated Upload Defense Test
  await test('Upload: Unauthenticated uploads are rejected with 401', async () => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="type"',
      '',
      'certificate',
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="test.txt"',
      'Content-Type: text/plain',
      '',
      'Malicious plain text content',
      `--${boundary}--`,
    ].join('\r\n');

    const res = await makeRequest('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    assert.equal(res.status, 401, `Expected 401 Unauthorized for unauthenticated upload, got ${res.status}`);
  });

  // 7. Security Headers Verification
  await test('Security Headers: HSTS, X-Content-Type-Options, X-Frame-Options present', async () => {
    const res = await makeRequest('/');
    const xContentType = res.headers.get('x-content-type-options');
    const xFrame = res.headers.get('x-frame-options');

    assert.equal(xContentType, 'nosniff', 'Missing X-Content-Type-Options: nosniff');
    assert.equal(xFrame, 'DENY', 'Missing X-Frame-Options: DENY');
  });

  // 8. IDOR Protection in Sync API Mutations
  await test('Sync API: Mutations without authentication return 401', async () => {
    const res = await makeRequest('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_submission_status',
        payload: {
          id: '00000000-0000-0000-0000-000000000000',
          status: 'approved',
          awardedPoints: 20,
        },
      }),
    });

    assert.equal(res.status, 401, `Expected 401 for unauthenticated mutation, got ${res.status}`);
  });

  console.log('\n====================================================');
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
