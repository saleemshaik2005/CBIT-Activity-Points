import https from 'https';
import { AIExtractionResult, ActivityCategory } from '@/types';
import { CBIT_24_CATEGORIES } from './mar-constants';

const MAR_CATEGORIES_PROMPT_REFERENCE = CBIT_24_CATEGORIES.map(c => 
  `SNo ${c.sno}: ${c.name} [Sub-type: ${c.sub_type || 'General'}] -> Points: ${c.default_points} (Max Cap: ${c.max_points_allowed})`
).join('\n');

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
];

export async function analyzeCertificateDocument(
  fileBufferBase64: string,
  mimeType: string = 'image/jpeg',
  apiKey?: string
): Promise<AIExtractionResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  
  if (!key || !key.trim()) {
    throw new Error(
      'AI Document Intelligence is temporarily unavailable. Server API key is missing.'
    );
  }

  let cleanMime = mimeType;
  if (cleanMime.includes('heic') || cleanMime.includes('heif')) {
    cleanMime = 'image/jpeg';
  }

  const systemInstruction = `You are the Official Academic Document Intelligence Engine for Chaitanya Bharathi Institute of Technology (CBIT Autonomous), Hyderabad.
Your job is to read student activity proof documents (images or PDFs) and extract structured academic data according to the college's 24 Approved Mandatory Additional Requirements (MAR) Activity Categories.

The official 24 CBIT MAR Categories are:
${MAR_CATEGORIES_PROMPT_REFERENCE}

CRITICAL RULES:
1. STRICT DOCUMENT VALIDATION:
   - Check if this image/file is a legitimate document proof (e.g. Certificate of Participation/Appreciation/Merit, Score Sheet, NPTEL/SWAYAM/Coursera certificate, Membership card, Letter, Paper publication, Event ID proof).
   - If the image is a selfie, photo of a person, animal, meme, random scenery, vehicle, food, screenshot of non-document apps, or any non-document photo without official academic text, return:
     "isDocument": false,
     "documentRejectionReason": "The uploaded image does not appear to be an official certificate or document proof. Please upload a clear photo or PDF of your certificate."
   - If it is a valid document, return "isDocument": true.

2. ACCURATE FIELD EXTRACTION:
   - Certificate / Activity Title: Exact name of event, course, competition, or activity.
   - Recipient Name: Exact student name printed on the document.
   - Issuing Organization: Exact college / university / platform / organization name (e.g. CBIT Hyderabad, NPTEL IIT Madras, IEEE, Red Cross, Osmania University, Coursera).
   - Completion / Event Date: Format YYYY-MM-DD. (If only month/year shown, use e.g. 2024-04-15).
   - Credential ID: Look carefully for Certificate ID, Credential ID, Serial Number, Roll No, or Certificate Code (e.g. CBIT/VMEDHA/CIP/P/245, NPTEL24CS15S1, etc.).
   - QR Code & Verification Link: Scan the entire document for printed verification URLs, QR code destination links (e.g. https://nptel.ac.in/..., https://coursera.org/verify/..., http://cbit.ac.in/verify...), and transcribe the link.

3. PRECISE CATEGORY & SUB-TYPE CLASSIFICATION:
   - For Tech Fest / Workshop / Hackathons (SNo 2):
     * If text says "Certificate of Participation", "has participated in", "attended", set "matchedSubType": "Participant" and suggestedPoints: 3.
     * If text says "Organizer", "Coordinator", "Lead", "Organizing Committee", set "matchedSubType": "Organizer" and suggestedPoints: 5.
   - For MOOCs (SNo 1):
     * If 12 weeks duration, set "matchedSubType": "12 weeks" and suggestedPoints: 20.
     * If 8 weeks duration, set "matchedSubType": "8 weeks" and suggestedPoints: 16.
   - For Sports (SNo 13):
     * Check if College level (5 pts), University level (10 pts), Region level (12 pts), State level (15 pts), or National level (20 pts).
   - For Magazine / Publication (SNo 7):
     * Check if Editor (10 pts) or Writer (5 pts).

Output STRICTLY valid JSON with no markdown formatting or backticks:
{
  "isDocument": true,
  "documentRejectionReason": null,
  "certificateTitle": "string",
  "recipientName": "string",
  "issuingOrganization": "string",
  "completionDate": "YYYY-MM-DD",
  "durationOrHours": "string or null",
  "credentialId": "string or null",
  "verificationUrl": "string or null",
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
            text: `${systemInstruction}\n\nAnalyze this document image/PDF and return JSON only.`,
          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.1,
    },
  });

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const result = await makeAIRequest(model, key.trim(), payload);
      
      // Strict document check
      if (result.isDocument === false) {
        throw new Error(
          result.documentRejectionReason ||
          'The uploaded file is not recognized as an official certificate or document proof. Please upload a clear document image or PDF.'
        );
      }

      return result;
    } catch (err: any) {
      // If it's our document rejection error, rethrow immediately without trying other models
      if (err.message && err.message.includes('not recognized as an official certificate') || err.message.includes('not appear to be an official certificate')) {
        throw err;
      }
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('Institutional AI Engine failed to process the document.');
}

function makeAIRequest(model: string, key: string, payload: string): Promise<AIExtractionResult> {
  return new Promise((resolve, reject) => {
    const postData = payload;
    const path = `/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

    const options: https.RequestOptions = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      rejectUnauthorized: false, // Prevents TLS proxy rejection in enterprise/campus networks
      timeout: 35000,
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const textContent = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textContent) {
              return reject(new Error('AI response contained empty content parts.'));
            }

            const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const resultData = JSON.parse(cleanJson) as AIExtractionResult;
            resolve(resultData);
          } catch (err: any) {
            reject(new Error(`Failed to parse AI response: ${err.message}`));
          }
        } else {
          reject(new Error(`AI Service returned HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Network connection error calling AI Service: ${e.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to AI Service timed out after 35 seconds.'));
    });

    req.write(postData);
    req.end();
  });
}
