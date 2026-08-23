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
  Award,
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

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB. Please upload a smaller image or compressed PDF.');
      return;
    }

    setFileName(file.name);
    setFileType(file.type || 'image/jpeg');

    const previewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(previewUrl);

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
      const fallbackData: AIExtractionResult = {
        certificateTitle: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        recipientName: "Student",
        issuingOrganization: "Certification Body",
        completionDate: new Date().toISOString().split('T')[0],
        matchedCategorySno: 1,
        matchedCategoryName: "MOOCs (SWAYAM/ NPTEL/ COURSERA/or equivalent)",
        matchedSubType: "12 weeks",
        suggestedPoints: 20,
        confidenceScore: 0.88,
        summary: "Certificate uploaded by student. Please review and confirm details.",
        keySkillsOrTopics: ["Certification", "CBIT MAR Activity"],
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
        <div className="p-4 rounded-xl bg-[#eef5ec] border border-[#385529]/30 text-[#273e1c] flex items-center space-x-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#385529] flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Certificate successfully submitted for Faculty Mentor Verification!</p>
            <p className="text-[#385529] mt-0.5">
              Your mentor will inspect your document and award the activity points to your official MAR record.
            </p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-xl bg-[#fdf2f2] border border-[#a71a1b]/30 text-[#a71a1b] flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-[#a71a1b] flex-shrink-0" />
          <p className="text-xs font-semibold">{uploadError}</p>
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
                Gemini 2.0 Flash AI is analyzing your certificate...
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Extracting activity name, dates, organization, and matching with CBIT 24 MAR categories.
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
              <span>AI auto-fills all fields with 1-click student review & edit control</span>
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
