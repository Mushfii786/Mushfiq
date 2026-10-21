import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Link as LinkIcon } from 'lucide-react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  url?: string;
}

export function ShareModal({ isOpen, onClose, title, text, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState<string | null>(null);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://mushfii.vercel.app');
  const shareText = text || `Check out "${title}" by Muhammed Mushfiq (MUSHFII)`;

  const showToast = (message: string) => {
    setCopiedFeedback(message);
    setTimeout(() => setCopiedFeedback(null), 2500);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      showToast('Failed to copy link');
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };


  const handleFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] sm:max-w-[460px] bg-[#16171d]/95 text-white border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(37,99,235,0.18)] backdrop-blur-2xl z-10 font-sans"
          >
            {/* Header: Title and Close button */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
              <div className="w-8" />
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white text-center">
                Share
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
                aria-label="Close share dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Social Share Grid matching requested UI */}
            <div className="py-5 sm:py-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3 overflow-x-auto pb-2 px-1 no-scrollbar text-center">
                
                {/* 1. Copy link */}
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
                      copied
                        ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/30'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 group-hover:scale-105 border border-white/10'
                    }`}
                  >
                    {copied ? (
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[62px] truncate">
                    {copied ? 'Copied!' : 'Copy link'}
                  </span>
                </button>

                {/* 2. WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                  aria-label="Share to WhatsApp"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/25 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[62px] truncate">
                    WhatsApp
                  </span>
                </button>

                {/* 3. Instagram */}
                <button
                  onClick={handleInstagram}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                  aria-label="Share to Instagram"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[62px] truncate">
                    Instagram
                  </span>
                </button>

                {/* 4. Facebook */}
                <button
                  onClick={handleFacebook}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                  aria-label="Share to Facebook"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[62px] truncate">
                    Facebook
                  </span>
                </button>

                {/* 5. X */}
                <button
                  onClick={handleX}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                  aria-label="Share to X"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[62px] truncate">
                    X
                  </span>
                </button>

                {/* 6. Telegram */}
                <button
                  onClick={handleTelegram}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                  aria-label="Share to Telegram"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[62px] truncate">
                    Telegram
                  </span>
                </button>
              </div>
            </div>

            {/* Toast Feedback popup */}
            <AnimatePresence>
              {copiedFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-neutral-900 border border-white/20 text-white text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{copiedFeedback}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
