'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Star,
  Bug,
  Sparkles,
  Heart,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Loader2,
  ThumbsUp,
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'suggestion', label: '💡 Feature Suggestion', icon: Sparkles },
  { id: 'bug', label: '🐛 Bug Report', icon: Bug },
  { id: 'ai_scanner', label: '🤖 AI Scanner Accuracy', icon: Sparkles },
  { id: 'praise', label: '❤️ Experience / Praise', icon: Heart },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('suggestion');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 3) {
      setErrorMsg('Please share a few words about your experience or issue.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category,
          message: message.trim(),
          user_name: currentUser?.full_name || 'Anonymous User',
          user_email: currentUser?.email || '',
          user_roll: currentUser?.roll_number || '',
          user_role: currentUser?.role || 'student',
          page_url: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit feedback.');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        setRating(5);
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1a1b20] rounded-3xl border border-[#e8e3d8] dark:border-[#2c2d36] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#faf9f5] dark:bg-[#18191e] px-6 py-4 border-b border-[#e8e3d8] dark:border-[#282932] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#eef5ec] dark:bg-[#22232a] flex items-center justify-center border border-[#385529]/20 text-[#385529] dark:text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1c2718] dark:text-gray-100">
                Share App Feedback
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Direct feedback to the CBIT AI&DS student development team
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282932] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              Your insights help us continuously polish the SPMS experience for everyone in CBIT.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                How is your experience with the app?
              </label>
              <div className="flex items-center space-x-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 ml-2">
                  {rating === 5 && '⭐ Excellent'}
                  {rating === 4 && '👍 Very Good'}
                  {rating === 3 && '👌 Good'}
                  {rating === 2 && '⚠️ Needs Work'}
                  {rating === 1 && '🛑 Significant Issues'}
                </span>
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-left font-bold text-[11px] border transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-[#385529] text-white border-[#385529] shadow-xs'
                        : 'bg-[#faf9f5] dark:bg-[#121214] text-gray-700 dark:text-gray-300 border-[#e8e3d8] dark:border-[#2c2d36] hover:border-gray-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Your Comments or Issue Details
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What worked well? What felt confusing? Did you run into any errors or have ideas for new features?"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-[#2e3039] bg-white dark:bg-[#121214] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#385529] transition-all"
              />
            </div>

            {/* Submitter Info */}
            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-[#2c2d36] pt-3">
              <span>
                Submitting as:{' '}
                <strong>{currentUser?.full_name || 'Guest User'}</strong>
                {currentUser?.roll_number ? ` (${currentUser.roll_number})` : ''}
              </span>
              <span className="capitalize text-gray-400">{currentUser?.role || 'student'}</span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-[#2e3039] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-[#22232a] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#385529] hover:bg-[#273e1c] text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
