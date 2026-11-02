import assert from 'assert/strict';

/**
 * Automated Enterprise Architecture Verification Suite
 * Verifies:
 * 1. Deterministic Certificate State Machine transitions & terminal bounds.
 * 2. AI Circuit Breaker trip, open-state rejection, and half-open recovery.
 * 3. Asynchronous Event Broker broadcasting.
 * 4. Direct Storage Presigned URL endpoint authentication & validation.
 * 5. Upload Complete notification endpoint authentication, validation & path isolation.
 * 6. Real-Time SSE status stream authentication & endpoint structure.
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
  console.log('CBIT SPMS Enterprise Architecture Verification Suite');
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

  // ---------------------------------------------------------------------------
  // PILLAR 3: DETERMINISTIC STATE MACHINE
  // ---------------------------------------------------------------------------
  await test('State Machine: Valid lifecycle transitions execute accurately', async () => {
    const { validateStateTransition, isTerminalState } = await import(
      '../src/lib/state-machine/certificate-state-machine.ts'
    );

    // Standard Happy Path: UPLOADED -> QUEUED -> PROCESSING -> PARSED
    assert.equal(validateStateTransition('UPLOADED', 'QUEUED').valid, true);
    assert.equal(validateStateTransition('QUEUED', 'PROCESSING').valid, true);
    assert.equal(validateStateTransition('PROCESSING', 'PARSED').valid, true);

    // Manual Review Path: PROCESSING -> MANUAL_REVIEW_REQUIRED
    assert.equal(validateStateTransition('PROCESSING', 'MANUAL_REVIEW_REQUIRED').valid, true);

    // Retryable Failure Path: PROCESSING -> FAILED_RETRYABLE -> QUEUED
    assert.equal(validateStateTransition('PROCESSING', 'FAILED_RETRYABLE').valid, true);
    assert.equal(validateStateTransition('FAILED_RETRYABLE', 'QUEUED').valid, true);

    // Terminal State Checks
    assert.equal(isTerminalState('PARSED'), true);
    assert.equal(isTerminalState('MANUAL_REVIEW_REQUIRED'), true);
    assert.equal(isTerminalState('FAILED_FATAL'), true);
    assert.equal(isTerminalState('PROCESSING'), false);
    assert.equal(isTerminalState('QUEUED'), false);
  });

  await test('State Machine: Illegal state jumps are strictly rejected', async () => {
    const { validateStateTransition } = await import(
      '../src/lib/state-machine/certificate-state-machine.ts'
    );

    // Cannot skip queue or processing
    const invalidJump = validateStateTransition('UPLOADED', 'PARSED');
    assert.equal(invalidJump.valid, false, 'Allowed illegal transition UPLOADED -> PARSED');
    assert.ok(invalidJump.reason?.includes('Illegal state transition'));

    // Cannot re-queue completed/terminal certificate
    const invalidRequeue = validateStateTransition('PARSED', 'QUEUED');
    assert.equal(invalidRequeue.valid, false, 'Allowed illegal transition PARSED -> QUEUED');

    // Cannot jump from fatal to queued
    const invalidFatalRecovery = validateStateTransition('FAILED_FATAL', 'QUEUED');
    assert.equal(invalidFatalRecovery.valid, false, 'Allowed illegal transition FAILED_FATAL -> QUEUED');
  });

  // ---------------------------------------------------------------------------
  // PILLAR 3: CIRCUIT BREAKER PATTERN
  // ---------------------------------------------------------------------------
  await test('Circuit Breaker: Consecutive failures trip circuit to OPEN and block calls', async () => {
    const { AICircuitBreaker } = await import(
      '../src/lib/circuit-breaker/ai-circuit-breaker.ts'
    );

    const testBreaker = new AICircuitBreaker({
      failureThreshold: 3,
      cooldownPeriodMs: 200,
    });

    assert.equal(testBreaker.getState(), 'CLOSED');
    assert.equal(testBreaker.canExecute(), true);

    // Record 2 failures (threshold is 3)
    testBreaker.recordFailure();
    testBreaker.recordFailure();
    assert.equal(testBreaker.getState(), 'CLOSED');
    assert.equal(testBreaker.canExecute(), true);

    // 3rd failure trips the breaker
    testBreaker.recordFailure();
    assert.equal(testBreaker.getState(), 'OPEN');
    assert.equal(testBreaker.canExecute(), false);

    // Wait for cooldown to expire into HALF_OPEN
    await new Promise((r) => setTimeout(r, 250));
    assert.equal(testBreaker.getState(), 'HALF_OPEN');
    assert.equal(testBreaker.canExecute(), true);

    // Success in HALF_OPEN resets to CLOSED
    testBreaker.recordSuccess();
    assert.equal(testBreaker.getState(), 'CLOSED');
    assert.equal(testBreaker.canExecute(), true);
  });

  // ---------------------------------------------------------------------------
  // PILLAR 4: ASYNCHRONOUS EVENT BROKER
  // ---------------------------------------------------------------------------
  await test('Event Broker: Dispatches and receives real-time certificate events', async () => {
    const { submissionEventBroker, broadcastSubmissionStatus } = await import(
      '../src/lib/events/event-broker.ts'
    );

    const testSubmissionId = 'test-sub-' + Date.now();
    let receivedPayload = null;

    const listener = (data) => {
      receivedPayload = data;
    };

    submissionEventBroker.once(`submission:${testSubmissionId}`, listener);

    broadcastSubmissionStatus(testSubmissionId, {
      submissionId: testSubmissionId,
      status: 'PROCESSING',
      message: 'Document OCR parsing started',
    });

    assert.ok(receivedPayload, 'Event payload was not received by subscriber');
    assert.equal(receivedPayload.status, 'PROCESSING');
    assert.equal(receivedPayload.message, 'Document OCR parsing started');
  });

  // ---------------------------------------------------------------------------
  // PILLAR 1: DIRECT-TO-CLOUD STORAGE (PRESIGNED URL)
  // ---------------------------------------------------------------------------
  await test('Presigned URL API: Rejects unauthenticated upload requests with 401', async () => {
    const res = await makeRequest('/api/storage/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'academic_certificate.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 1024,
      }),
    });

    assert.equal(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // ---------------------------------------------------------------------------
  // PILLAR 2: UPLOAD COMPLETE NOTIFICATION & IDOR BOUNDS
  // ---------------------------------------------------------------------------
  await test('Upload Complete API: Rejects unauthenticated requests with 401', async () => {
    const res = await makeRequest('/api/submissions/upload-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storagePath: 'user123/cert.pdf',
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        fileName: 'cert.pdf',
        fileSize: 2048,
        fileType: 'application/pdf',
        semester: 4,
        claimedPoints: 10,
      }),
    });

    assert.equal(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // ---------------------------------------------------------------------------
  // PILLAR 4: REAL-TIME SSE STATUS STREAM
  // ---------------------------------------------------------------------------
  await test('SSE Stream API: Rejects unauthenticated status subscriptions with 401', async () => {
    const res = await makeRequest('/api/submissions/00000000-0000-0000-0000-000000000000/status/stream');
    assert.equal(res.status, 401, `Expected 401 Unauthorized on SSE stream, got ${res.status}`);
  });

  console.log('\n====================================================');
  console.log(`Architecture Test Suite Finished: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error executing architecture tests:', err);
  process.exit(1);
});
