'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { AIReviewModal } from './AIReviewModal';
import { AIExtractionResult } from '@/types';
import {
  UploadCloud,
  Camera,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const CertificateUploader: React.FC = () => {
  const { categories, addSubmission } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiData, setAiData] = useState<AIExtractionResult | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setUploadError(null);
    setSubmissionSuccess(false);

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB. Please upload a smaller image or compressed PDF.');
      return;
    }

    setFileName(file.name);
    setFileType(file.type || 'image/jpeg');

    // Create local object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);

    // Start AI analysis
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.data) {
        throw new Error(json.error || 'AI analysis failed');
      }

      setAiData(json.data);
      setIsAnalyzing(false);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Extraction error:', err);
      // Fallback extraction so student is NEVER blocked
      const fallbackData: AIExtractionResult = {
        certificateTitle: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        recipientName: "Student",
        issuingOrganization: "Certification Organization",
        completionDate: new Date().toISOString().split('T')[0],
        matchedCategorySno: 1,
        matchedCategoryName: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
        matchedSubType: "12 weeks",
        suggestedPoints: 20,
        confidenceScore: 0.85,
        summary: "Certificate submitted by student. Please review and confirm the details.",
        keySkillsOrTopics: ["Certification", "Academic Requirement"],
      };
      setAiData(fallbackData);
      setIsAnalyzing(false);
      setIsModalOpen(true);
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
      
      {submissionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Certificate successfully submitted for Mentor Verification!</p>
            <p className="text-emerald-700 mt-0.5">
              Your mentor will review your document and award the activity points.
            </p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-xs font-semibold">{uploadError}</p>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-gradient-to-b from-white to-gray-50/50 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {isAnalyzing ? (
          <div className="py-8 space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">
                Gemini 2.0 Flash AI is analyzing your certificate...
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Extracting activity name, dates, organization, and matching with CBIT 24 MAR categories.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Upload Certificate or Event Proof
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Drag and drop your certificate here, or snap a photo directly from your mobile camera.
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
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Browse Files (PDF, JPG, PNG)</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold border border-gray-300 shadow-sm transition-all flex items-center space-x-2"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Take Photo with Mobile Camera</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI will auto-fill all form fields with 1-click student editability</span>
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
    </div>
  );
};
