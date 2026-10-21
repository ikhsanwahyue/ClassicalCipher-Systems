'use client';

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Download,
} from 'lucide-react';

export interface CipherResultDisplayProps {
  title: string;
  value: string;
  themeColor: 'emerald' | 'blue' | 'cyan' | 'purple' | 'amber';
  formatSelector?: React.ReactNode;
  subInfo?: React.ReactNode;
  threshold?: number;
  allowDownload?: boolean;
  downloadFilename?: string;
  pulseDot?: boolean;
}

export default function CipherResultDisplay({
  title,
  value,
  themeColor,
  formatSelector,
  subInfo,
  threshold = 120,
  allowDownload = true,
  downloadFilename = 'cipher-result.txt',
  pulseDot = true,
}: CipherResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isLong = value.length > threshold;

  // Theme palettes
  const colorMap = {
    emerald: {
      border: 'border-emerald-500/40',
      badgeBorder: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      text: 'text-emerald-300',
      accentText: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      btnHover: 'hover:bg-emerald-500/20 hover:text-emerald-300',
      btnActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    blue: {
      border: 'border-blue-500/40',
      badgeBorder: 'border-blue-500/30',
      dot: 'bg-blue-400',
      text: 'text-blue-300',
      accentText: 'text-blue-400',
      bgGlow: 'from-blue-500/10 to-transparent',
      btnHover: 'hover:bg-blue-500/20 hover:text-blue-300',
      btnActive: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    cyan: {
      border: 'border-cyan-500/40',
      badgeBorder: 'border-cyan-500/30',
      dot: 'bg-cyan-400',
      text: 'text-cyan-300',
      accentText: 'text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-transparent',
      btnHover: 'hover:bg-cyan-500/20 hover:text-cyan-300',
      btnActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    purple: {
      border: 'border-purple-500/40',
      badgeBorder: 'border-purple-500/30',
      dot: 'bg-purple-400',
      text: 'text-purple-300',
      accentText: 'text-purple-400',
      bgGlow: 'from-purple-500/10 to-transparent',
      btnHover: 'hover:bg-purple-500/20 hover:text-purple-300',
      btnActive: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    amber: {
      border: 'border-amber-500/40',
      badgeBorder: 'border-amber-500/30',
      dot: 'bg-amber-400',
      text: 'text-amber-300',
      accentText: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent',
      btnHover: 'hover:bg-amber-500/20 hover:text-amber-300',
      btnActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
  };

  const theme = colorMap[themeColor];

  return (
    <>
      <div className={`bg-slate-950 border ${theme.border} rounded-2xl p-4 shadow-xl space-y-3 relative overflow-hidden transition-all duration-300`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {pulseDot && <span className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />}
            <span className="text-xs font-bold text-slate-200">{title}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {formatSelector}

            {/* Tombol Full View Modal jika teks panjang */}
            {isLong && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                title="Tampilkan teks penuh dalam jendela popup"
                className={`px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 ${theme.btnHover} flex items-center gap-1 transition-all active:scale-95 shadow-sm`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Full View</span>
              </button>
            )}

            {/* Tombol Salin */}
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className={`w-3.5 h-3.5 ${theme.accentText}`} />
                  <span className={theme.accentText}>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="relative">
          <div
            className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3 transition-all duration-300 relative ${
              isLong && !isExpanded ? 'max-h-24 overflow-hidden' : 'max-h-none'
            }`}
          >
            <p className={`text-sm font-mono ${theme.text} break-all select-all font-semibold leading-relaxed whitespace-pre-wrap`}>
              {value}
            </p>

            {/* Gradient fade overlay saat teks panjang dan terpotong */}
            {isLong && !isExpanded && (
              <div
                onClick={() => setIsExpanded(true)}
                className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex items-end justify-center pb-1.5 cursor-pointer rounded-b-xl group"
              >
                <span className="text-[11px] text-slate-400 group-hover:text-slate-200 font-medium flex items-center gap-1 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 shadow">
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                  Klik untuk melihat lebih banyak...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action & Metadata Bar */}
        <div className="flex justify-between items-center pt-1 border-t border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-2 text-slate-500 font-mono">
            <span>{value.length.toLocaleString('id-ID')} Karakter</span>
            {isLong && (
              <span className="text-slate-600">• {isExpanded ? 'Tampilan Terbuka' : 'Tampilan Ringkas'}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isLong && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span>Ciutkan</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    <span>Perluas Inline</span>
                  </>
                )}
              </button>
            )}

            {isLong && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={`text-[11px] font-semibold ${theme.accentText} hover:underline flex items-center gap-1`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Buka Modal Penuh</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Info jika ada (misal urutan rel, chunks RSA, dll) */}
        {subInfo}
      </div>

      {/* MODAL FULL VIEW DIALOG */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg bg-slate-900 border ${theme.badgeBorder}`}>
                  <FileText className={`w-4 h-4 ${theme.accentText}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {title} (Full View)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Total: <strong className={theme.accentText}>{value.length.toLocaleString('id-ID')}</strong> Karakter
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                  title="Tutup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Scrollable Text Content */}
            <div className="p-4 overflow-y-auto flex-1 bg-slate-950/50">
              <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 shadow-inner">
                <pre className={`text-xs sm:text-sm font-mono ${theme.text} break-all select-all font-semibold leading-relaxed whitespace-pre-wrap`}>
                  {value}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Siap disalin atau diunduh</span>
              </div>

              <div className="flex items-center gap-2">
                {allowDownload && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unduh .txt</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : `bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700`
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua Teks</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
