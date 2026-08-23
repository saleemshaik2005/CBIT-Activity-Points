import { GoogleGenAI } from '@google/genai';
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

  // Normalize mime type for Gemini
  let cleanMime = mimeType;
  if (cleanMime.includes('heic') || cleanMime.includes('heif')) {
    cleanMime = 'image/jpeg';
  }

  const systemInstruction = `You are an elite academic document intelligence engine for Chaitanya Bharathi Institute of Technology (CBIT Autonomous), Hyderabad.
Your job is to perform Optical Character Recognition (OCR) and deep semantic analysis on student certificates/documents (images or PDFs).

The official 24 CBIT Mandatory Additional Requirements (MAR) Categories are:
${MAR_CATEGORIES_PROMPT_REFERENCE}

Task Instructions:
1. Perform thorough OCR on the uploaded certificate image/PDF:
   - Identify the exact title of the course, competition, paper, event, or workshop.
   - Identify the recipient student name printed on the document.
   - Identify the issuing organization, university, club, company, platform, or authority (e.g. NPTEL, Coursera, IEEE, NSS, CBIT, Hackathon Organizers, Sports Board, etc.).
   - Extract the exact date of completion, award, or issue. Convert it to standard ISO format (YYYY-MM-DD). If only month and year are given (e.g. "April 2024"), use "2024-04-15".
   - Extract duration if stated (e.g. "12 weeks", "8 weeks", "4 weeks", "30 hours", "3 days").
2. Match the activity to EXACTLY ONE of the 24 CBIT MAR categories (SNo 1 to 24) based on the criteria.
3. Determine the correct sub-type (e.g. "12 weeks", "8 weeks", "Organizer", "Participant", "College level", "State level", "National level", "Editor", "Writer", etc.) and the corresponding default points from the CBIT rubric.
4. Estimate student academic semester (1 to 8) if inferrable, or default to appropriate current semester.
5. Provide a 2-line concise factual summary of what the certificate validates.
6. Extract 3 to 6 key topic/skill tags.

CRITICAL: Output STRICTLY valid JSON with no markdown tags or additional conversational text. Format:
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

  // Method 1: Try official GoogleGenAI SDK
  try {
    const ai = new GoogleGenAI({ apiKey: key });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: fileBufferBase64,
                mimeType: cleanMime,
              },
            },
            {
              text: "Analyze this certificate image/document thoroughly. Extract the real event title, recipient name, issuer, dates, match with CBIT 24 MAR categories, and output the structured JSON.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const rawText = response.text || "{}";
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned) as AIExtractionResult;

    if (!parsed.matchedCategorySno || parsed.matchedCategorySno < 1 || parsed.matchedCategorySno > 24) {
      parsed.matchedCategorySno = 1;
      parsed.matchedCategoryName = "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)";
    }

    return parsed;
  } catch (sdkError: any) {
    console.warn("Google GenAI SDK call failed, attempting direct Gemini REST API fallback...", sdkError?.message);

    // Method 2: Direct REST API Fallback to Gemini 2.0 Flash / 1.5 Flash
    try {
      const restEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
      const restBody = {
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
      };

      const res = await fetch(restEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini REST API error (${res.status}): ${errorText}`);
      }

      const restData = await res.json();
      const textOutput = restData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as AIExtractionResult;

      return parsed;
    } catch (fallbackError: any) {
      console.error("Gemini direct REST fallback also failed:", fallbackError);
      throw new Error(`Gemini AI analysis failed: ${fallbackError.message || 'Check API key or network'}`);
    }
  }
}
