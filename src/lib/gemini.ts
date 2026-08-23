import https from 'https';
import { AIExtractionResult } from '@/types';
import { CBIT_24_CATEGORIES } from './mar-constants';

const MAR_CATEGORIES_PROMPT_REFERENCE = CBIT_24_CATEGORIES.map(c => 
  `SNo ${c.sno}: ${c.name} [Sub-type: ${c.sub_type || 'General'}] -> Points: ${c.default_points} (Max Cap: ${c.max_points_allowed}) - Desc: ${c.description}`
).join('\n');

export async function analyzeCertificateDocument(
  fileBufferBase64: string,
  mimeType: string = 'image/jpeg',
  apiKey?: string
): Promise<AIExtractionResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key || key.trim() === '' || key.startsWith('AIzaSy_placeholder')) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please enter your free Gemini API Key in the top banner or in .env.local to enable live AI certificate intelligence.'
    );
  }

  let cleanMime = mimeType;
  if (cleanMime.includes('heic') || cleanMime.includes('heif')) {
    cleanMime = 'image/jpeg';
  }

  const systemInstruction = `You are an expert academic certificate analyzer for Chaitanya Bharathi Institute of Technology (CBIT Autonomous), Hyderabad.
Your job is to read student certificates/documents (images or PDFs) and extract key information according to the college's 24 Mandatory Additional Requirements (MAR) Activity Points categories.

The official 24 CBIT MAR Categories are:
${MAR_CATEGORIES_PROMPT_REFERENCE}

Instructions:
1. Examine the certificate thoroughly:
   - Extract the real certificate/activity title (course name, hackathon, workshop, sport, NSS, publication title).
   - Extract the recipient student name.
   - Extract the issuing body/organization (NPTEL, Coursera, IEEE, CBIT, NSS, Sports Board, etc.).
   - Extract the completion/award date in YYYY-MM-DD format (if only month/year is shown, use e.g. 2024-04-15).
   - Extract duration if stated (e.g. "12 weeks", "8 weeks", "30 hours").
2. Match the activity to EXACTLY ONE of the 24 CBIT MAR categories (SNo 1 to 24).
3. Determine the correct sub-type and the standard activity points according to the CBIT rubric above.
4. Provide a 2-line concise factual summary of what the certificate validates.
5. Extract 3 to 6 key skill/topic tags.

Output STRICTLY valid JSON with no markdown formatting or surrounding backticks:
{
  "certificateTitle": "string",
  "recipientName": "string",
  "issuingOrganization": "string",
  "completionDate": "YYYY-MM-DD",
  "durationOrHours": "string",
  "matchedCategorySno": number (1 to 24),
  "matchedCategoryName": "string",
  "matchedSubType": "string",
  "suggestedPoints": number,
  "confidenceScore": number (0.0 to 1.0),
  "summary": "string",
  "keySkillsOrTopics": ["string"]
}`;

  const payload = JSON.stringify({
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: cleanMime,
              data: fileBufferBase64,
            },
          },
          {
            text: `${systemInstruction}\n\nAnalyze this certificate image/document and return JSON only.`,
          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.1,
    },
  });

  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${key.trim()}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      // Bypass SSL verification errors in local proxy / college network environments
      rejectUnauthorized: false,
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`Google Gemini API error (${res.statusCode}): ${data}`));
          }

          const parsedResponse = JSON.parse(data);
          const rawText = parsedResponse.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const extraction = JSON.parse(cleanJson) as AIExtractionResult;

          if (!extraction.matchedCategorySno || extraction.matchedCategorySno < 1 || extraction.matchedCategorySno > 24) {
            extraction.matchedCategorySno = 1;
            extraction.matchedCategoryName = "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)";
          }

          resolve(extraction);
        } catch (err: any) {
          reject(new Error(`Failed to parse Gemini response: ${err.message}. Raw output: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Network connection error calling Google Gemini: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to Google Gemini timed out after 30 seconds.'));
    });

    req.write(payload);
    req.end();
  });
}
