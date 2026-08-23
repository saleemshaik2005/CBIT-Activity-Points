const https = require('https');

// A 1x1 transparent PNG base64
const testPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

function buildPayload(useCamelCase) {
  if (useCamelCase) {
    return JSON.stringify({
      contents: [{
        parts: [
          { inlineData: { mimeType: "image/png", data: testPngBase64 } },
          { text: "Describe this image. Output JSON: {\"status\":\"ok\"}" }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });
  } else {
    return JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: "image/png", data: testPngBase64 } },
          { text: "Describe this image. Output JSON: {\"status\":\"ok\"}" }
        ]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.1
      }
    });
  }
}

console.log("CamelCase payload:", buildPayload(true));
console.log("SnakeCase payload:", buildPayload(false));
