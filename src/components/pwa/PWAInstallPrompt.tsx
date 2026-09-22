'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Share, PlusSquare, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for PWA compliance
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('PWA ServiceWorker registered:', reg.scope))
          .catch((err) => console.warn('PWA ServiceWorker registration failed:', err));
      });
    }

    // 2. Check if already installed / running in standalone mode
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(checkStandalone);
    if (checkStandalone) {
      return; // Already running as an installed PWA
    }

    // 3. Check if user already dismissed recently
    const dismissedUntil = localStorage.getItem('cbit_pwa_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // 4. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isAppleDevice);

    // If on iOS and not standalone, show prompt after a brief 3s delay
    if (isAppleDevice && !checkStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 5. Standard Chromium (Android / Desktop) install prompt listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after brief delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      setInstalledSuccessfully(true);
      setTimeout(() => setInstalledSuccessfully(false), 4000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setInstalledSuccessfully(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Suppress for 3 days if dismissed
    localStorage.setItem('cbit_pwa_dismissed_until', String(Date.now() + 3 * 24 * 60 * 60 * 1000));
  };

  if (isStandalone || (!showPrompt && !installedSuccessfully)) {
    return null;
  }

  // Success Toast
  if (installedSuccessfully) {
    return (
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-[#385529] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold border border-emerald-500 animate-slide-up">
        <Check className="w-4 h-4 text-[#dfa94b]" />
        <span>CBIT SPMS App installed successfully on your device!</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#385529]/30 dark:border-emerald-600/30 backdrop-blur-md">
        
        {/* Header with App Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#385529] p-1.5 flex-shrink-0 shadow-md flex items-center justify-center">
              <img
                src="/icons/icon-192.png"
                alt="CBIT SPMS"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-serif font-extrabold text-[#385529] dark:text-gray-100">
                  CBIT SPMS App
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#a16b15] text-white">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Install for fast 1-tap access & offline certificates
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2c2d36] transition-colors cursor-pointer"
            title="Dismiss prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions / Buttons */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-[#2c2d36]">
          {isIOS ? (
            /* iOS Specific Guidance */
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2 text-[11px] bg-[#faf9f5] dark:bg-[#22232a] p-2.5 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039]">
                <Share className="w-4 h-4 text-[#385529] dark:text-emerald-400 flex-shrink-0" />
                <span>
                  Tap Safari&apos;s <strong>Share</strong> button, then scroll down and tap{' '}
                  <strong className="text-[#385529] dark:text-emerald-400">Add to Home Screen</strong>.
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full py-2 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          ) : (
            /* Android / Chrome Standard Install Button */
            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2 px-4 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#dfa94b]" />
                <span>Install Mobile App</span>
              </button>

              <button
                onClick={handleDismiss}
                className="py-2 px-3 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                Not Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
