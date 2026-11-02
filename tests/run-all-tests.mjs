import { spawn } from 'child_process';
import http from 'http';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        resolve(true);
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Server did not respond within ${timeoutMs}ms`));
        } else {
          setTimeout(check, 400);
        }
      });
    };
    check();
  });
}

async function run() {
  console.log('[Test Harness] Starting Next.js production server for testing...');
  const isWindows = process.platform === 'win32';
  const npxCmd = isWindows ? 'npx.cmd' : 'npx';

  const server = spawn('npm', ['run', 'start'], {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT) },
  });

  try {
    console.log(`[Test Harness] Waiting for ${BASE_URL} to be healthy...`);
    await waitForServer(BASE_URL);
    console.log('[Test Harness] Server is up and ready. Running test suites...\n');

    const env = { ...process.env, TEST_BASE_URL: BASE_URL };

    // Run Security Tests
    const runSec = () => new Promise((resolve, reject) => {
      const proc = spawn('node', ['tests/security.test.mjs'], { stdio: 'inherit', env, shell: true });
      proc.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Security test failed with code ${code}`)));
    });

    // Run Architecture Tests
    const runArch = () => new Promise((resolve, reject) => {
      const proc = spawn('node', ['tests/architecture.test.mjs'], { stdio: 'inherit', env, shell: true });
      proc.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Architecture test failed with code ${code}`)));
    });

    await runSec();
    console.log('\n');
    await runArch();

    console.log('\n[Test Harness] ALL SECURITY AND ARCHITECTURE TESTS PASSED SUCCESSFULLY! 🚀');
  } finally {
    console.log('\n[Test Harness] Tearing down test server...');
    if (isWindows) {
      spawn('taskkill', ['/pid', String(server.pid), '/f', '/t']);
    } else {
      server.kill('SIGTERM');
    }
  }
}

run().catch((err) => {
  console.error('[Test Harness] Fatal Error:', err.message);
  process.exit(1);
});
