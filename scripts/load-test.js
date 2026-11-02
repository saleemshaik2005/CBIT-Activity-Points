import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom Metrics
const errorRate = new Rate('custom_error_rate');
const syncDuration = new Trend('sync_duration_ms');
const loginDuration = new Trend('login_duration_ms');

// Target Configuration
const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    // 1. Standard Ramping Concurrency Test (Target: 1,000 to 2,000 Concurrent VUs)
    ramping_concurrency: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 100 },   // Warm-up to 100 VUs
        { duration: '1m', target: 500 },    // Scale to 500 VUs
        { duration: '2m', target: 1000 },   // Scale to 1,000 VUs
        { duration: '2m', target: 2000 },   // Peak target: 2,000 concurrent VUs
        { duration: '1m', target: 2000 },   // Sustain 2,000 concurrent VUs
        { duration: '1m', target: 0 },      // Graceful ramp-down
      ],
      gracefulRampDown: '30s',
    },

    // 2. Optional Spike Test Scenario (Uncomment to execute dedicated spike test)
    /*
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },
        { duration: '1m', target: 2000 }, // Sudden burst
        { duration: '30s', target: 2000 },
        { duration: '30s', target: 100 },
        { duration: '10s', target: 0 },
      ],
    },
    */

    // 3. Optional Soak Test Scenario (Uncomment to execute 1-hour sustained test)
    /*
    soak_test: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '60m',
    },
    */
  },

  thresholds: {
    // p95 response time must be under 1s (1000ms), error rate under 1%
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    custom_error_rate: ['rate<0.01'],
    sync_duration_ms: ['p(95)<800'],
    login_duration_ms: ['p(95)<1200'],
  },
};

export default function () {
  const rollNumber = '160124771129';
  const dummyPassword = 'TestPassword123!';

  // ==========================================
  // Flow 1: Authentication / Login Check
  // ==========================================
  group('Auth Flow', function () {
    const loginPayload = JSON.stringify({
      identifier: rollNumber,
      password: dummyPassword,
    });

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'POST_api_auth_login' },
    });

    loginDuration.add(loginRes.timings.duration);

    // Either 200 (if credentials matched) or 401/429 (rejected by rate limiter)
    const loginSuccess = check(loginRes, {
      'login status is 200, 401 or 429': (r) => [200, 401, 429].includes(r.status),
      'login response time < 1500ms': (r) => r.timings.duration < 1500,
    });

    if (!loginSuccess) {
      errorRate.add(1);
    }
  });

  sleep(1);

  // ==========================================
  // Flow 2: Core Read Path - Data Sync (/api/sync)
  // ==========================================
  group('Main Read Path - Sync Query', function () {
    const syncRes = http.get(`${BASE_URL}/api/sync`, {
      tags: { name: 'GET_api_sync' },
    });

    syncDuration.add(syncRes.timings.duration);

    const syncSuccess = check(syncRes, {
      'sync status is 200': (r) => r.status === 200,
      'sync returned valid JSON': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true;
        } catch {
          return false;
        }
      },
      'sync response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    if (!syncSuccess) {
      errorRate.add(1);
    }
  });

  sleep(1);

  // ==========================================
  // Flow 3: Secondary Read Path - Students Directory
  // ==========================================
  group('Directory Read Path - Students Query', function () {
    const studentsRes = http.get(`${BASE_URL}/api/students?role=student`, {
      tags: { name: 'GET_api_students' },
    });

    const dirSuccess = check(studentsRes, {
      'students status is 200 or 401': (r) => [200, 401].includes(r.status),
    });

    if (!dirSuccess) {
      errorRate.add(1);
    }
  });

  sleep(1);

  // ==========================================
  // Flow 4: Write Path - Adding Submission Draft / Mutation
  // ==========================================
  group('Main Write Path - Mutation', function () {
    const mutationPayload = JSON.stringify({
      action: 'add_submission',
      payload: {
        category_id: 1,
        activity_title: 'Load Test Verification Certificate',
        issuing_organization: 'NPTEL SWAYAM Online Portal',
        claimed_points: 10,
        semester: 5,
        academic_year: '2025-2026',
        status: 'draft',
      },
    });

    const mutateRes = http.post(`${BASE_URL}/api/sync`, mutationPayload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'POST_api_sync_mutate' },
    });

    const mutateSuccess = check(mutateRes, {
      'mutation status is 200 or 401 (auth required)': (r) => [200, 401].includes(r.status),
    });

    if (!mutateSuccess) {
      errorRate.add(1);
    }
  });

  // Random user think time (1 - 3s)
  sleep(Math.random() * 2 + 1);
}
