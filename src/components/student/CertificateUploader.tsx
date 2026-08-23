'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AIReviewModal } from './AIReviewModal';
import { AIExtractionResult } from '@/types';
import { CBIT_24_CATEGORIES } from '@/lib/mar-constants';
import {
  UploadCloud,
  Camera,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  ShieldCheck,
  Check,
  Settings2,
} from 'lucide-react';

const MAR_PROMPT_REF = CBIT_24_CATEGORIES.map(c => 
  `SNo ${c.sno}: ${c.name} [Sub-type: ${c.sub_type || 'General'}] -> Points: ${c.default_points} (Max Cap: ${c.max_points_allowed})`
).join('\n');

const BROWSER_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export const CertificateUploader: React.FC = () => {
  const { categories, addSubmission } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Custom API Key Management (Optional for advanced users)
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiData, setAiData] = useState<AIExtractionResult | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('cbit_mar_gemini_key');
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (e) {}
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('cbit_mar_gemini_key', apiKey.trim());
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowKeyModal(false);
      }, 1500);
    } catch (e) {}
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const callGeminiDirectlyFromBrowser = async (base64Data: string, mimeType: string, key: string): Promise<AIExtractionResult> => {
    let cleanMime = mimeType || 'image/jpeg';
    if (cleanMime.includes('heic') || cleanMime.includes('heif')) cleanMime = 'image/jpeg';

    const systemInstruction = `You are an expert academic certificate analyzer for Chaitanya Bharathi Institute of Technology (CBIT Autonomous), Hyderabad.
Extract real text from this certificate:
1. Exact certificate/activity title
2. Recipient student name
3. Issuing organization
4. Completion/award date in YYYY-MM-DD format
5. Credential ID / Certificate ID / Roll No if present
6. QR verification link URL if printed or visible
7. Match with one of the 24 CBIT MAR categories:
${MAR_PROMPT_REF}

Return strictly a JSON object:
{
  "certificateTitle": "string",
  "recipientName": "string",
  "issuingOrganization": "string",
  "completionDate": "YYYY-MM-DD",
  "durationOrHours": "string",
  "credentialId": "string or null",
  "verificationUrl": "string or null",
  "matchedCategorySno": number (1-24),
  "matchedCategoryName": "string",
  "matchedSubType": "string",
  "suggestedPoints": number,
  "confidenceScore": number (0.0 to 1.0),
  "summary": "string",
  "keySkillsOrTopics": ["string"]
}`;

    const body = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: cleanMime,
                data: base64Data,
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

    let lastErr: any = null;

    for (const model of BROWSER_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Google API Error (${res.status}): ${errorText}`);
        }

        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as AIExtractionResult;
      } catch (e) {
        lastErr = e;
        continue;
      }
    }

    throw lastErr || new Error('Gemini API call failed across candidate models.');
  };

  const handleFileProcess = async (file: File) => {
    setUploadError(null);
    setSubmissionSuccess(false);

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB. Please upload a smaller image or compressed PDF.');
      return;
    }

    setFileName(file.name);
    const mimeType = file.type || 'image/jpeg';
    setFileType(mimeType);

    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);

    setIsAnalyzing(true);

    try {
      const base64Data = await fileToBase64(file);
      let extractedData: AIExtractionResult | null = null;

      // Method 1: Use Server Route
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (apiKey && apiKey.trim()) {
          formData.append('apiKey', apiKey.trim());
        }

        const serverRes = await fetch('/api/ai/analyze', {
          method: 'POST',
          body: formData,
        });

        const json = await serverRes.json();
        if (serverRes.ok && json.data) {
          extractedData = json.data;
        } else {
          throw new Error(json.error || 'Server processing error');
        }
      } catch (serverErr: any) {
        console.warn('Server route notice, trying browser direct method if key present:', serverErr?.message);
        
        if (apiKey && apiKey.trim()) {
          extractedData = await callGeminiDirectlyFromBrowser(base64Data, mimeType, apiKey);
        } else {
          throw new Error(serverErr?.message || 'AI document analysis is currently unavailable.');
        }
      }

      if (!extractedData) {
        throw new Error('Could not parse certificate data.');
      }

      setAiData(extractedData);
      setIsAnalyzing(false);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setIsAnalyzing(false);
      setUploadError(
        err.message || 'AI analysis encountered an error. You can still fill the details manually in review.'
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleModalSubmit = (finalData: any) => {
    addSubmission(finalData);
    setIsModalOpen(false);
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Seamless AI Status Banner */}
      <div className="bg-[#faf9f5] border border-[#e8e3d8] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#eef5ec] text-[#385529] border border-[#385529]/30">
            <Sparkles className="w-5 h-5 text-[#385529]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-serif font-bold text-[#1c2718]">Google Gemini Multimodal AI Engine</span>
              <span className="text-[10px] bg-[#eef5ec] text-[#385529] font-bold px-2 py-0.5 rounded-full border border-[#385529]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#385529]" /> Ready to Scan
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Upload any certificate image (JPG, PNG, HEIC) or PDF. Real event titles, dates, issuer, and MAR category points will be automatically detected.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="px-3 py-1 bg-white hover:bg-[#faf7f2] text-gray-600 hover:text-[#385529] font-medium text-[11px] rounded-lg border border-[#e8e3d8] transition-all flex items-center space-x-1"
            title="Custom API key configuration"
          >
            <Settings2 className="w-3 h-3 text-[#a16b15]" />
            <span>{apiKey ? 'API Key Configured' : 'AI Settings'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {submissionSuccess && (
        <div className="p-4 rounded-xl bg-[#eef5ec] border border-[#385529]/30 text-[#273e1c] flex items-center space-x-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#385529] flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Certificate successfully submitted for Faculty Mentor Verification!</p>
            <p className="text-[#385529] mt-0.5">
              Your mentor will inspect your document and award the activity points to your official record.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-[#fdf2f2] border border-[#a71a1b]/30 text-[#a71a1b] flex items-start space-x-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-[#a71a1b] flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white ${
          isDragging
            ? 'border-[#385529] bg-[#eef5ec]/50 scale-[1.01]'
            : 'border-[#e8e3d8] hover:border-[#a16b15]'
        }`}
      >
        {isAnalyzing ? (
          <div className="py-8 space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-[#385529] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#a16b15] absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-[#385529]">
                Gemini AI is reading your certificate...
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Extracting certificate title, recipient name, issuer, dates, and mapping with CBIT 24 categories.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#eef5ec] text-[#385529] rounded-2xl flex items-center justify-center mx-auto border border-[#385529]/20 shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-[#385529]">
                Upload Certificate or Event Proof
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Drag and drop your certificate here, or snap a photo directly from your smartphone camera.
              </p>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 border-b-2 border-[#a16b15]"
              >
                <FileText className="w-4 h-4 text-[#dfa94b]" />
                <span>Browse Files (PDF, JPG, PNG)</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#faf7f2] text-[#385529] text-xs font-bold border border-[#e8e3d8] shadow-xs transition-all flex items-center space-x-2"
              >
                <Camera className="w-4 h-4 text-[#a16b15]" />
                <span>Take Photo with Mobile Camera</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[#a16b15] font-medium flex items-center justify-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#a16b15]" />
              <span>AI automatically parses event details & dates with 1-click student editability</span>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal Trigger */}
      {aiData && (
        <AIReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          aiData={aiData}
          filePreviewUrl={filePreviewUrl}
          fileName={fileName}
          fileType={fileType}
          categories={categories}
        />
      )}

      {/* Optional Custom Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e3d8] max-w-md w-full p-6 space-y-4">
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#fbf5eb] text-[#a16b15] rounded-xl border border-[#a16b15]/30">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#385529]">
                  Custom Gemini API Key
                </h3>
                <p className="text-xs text-gray-500">
                  Optional: Override the server default API key for your browser session.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Gemini API Key (AIzaSy...)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to use server default"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#385529] font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#faf9f5] border border-[#e8e3d8] text-[11px] text-gray-600 space-y-1">
                <p>
                  Get your free personal key anytime from Google AI Studio:
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-[#a16b15] font-bold hover:underline"
                >
                  <span>Get Free Key at aistudio.google.com</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                >
                  {keySaved ? <Check className="w-4 h-4 text-[#dfa94b]" /> : null}
                  <span>{keySaved ? 'Saved!' : 'Save Key'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
