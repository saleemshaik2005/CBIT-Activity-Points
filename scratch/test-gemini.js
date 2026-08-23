const https = require('https');
const fs = require('fs');

let apiKey = '';
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

console.log('GEMINI_API_KEY from .env.local:', apiKey ? `Found (length ${apiKey.length})` : 'EMPTY / NOT FOUND');

const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];

async function testModel(model) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: "Hello! Return JSON: {\"status\": \"ok\"}" }] }],
      generationConfig: { response_mime_type: "application/json" }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${model}] HTTP ${res.statusCode}:`, data.slice(0, 300));
        resolve({ model, status: res.statusCode, data });
      });
    });

    req.on('error', err => {
      console.log(`[${model}] Error:`, err.message);
      resolve({ model, error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const m of models) {
    await testModel(m);
  }
}

run();
