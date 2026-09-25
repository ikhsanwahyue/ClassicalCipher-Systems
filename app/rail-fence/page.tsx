'use client';

import React, { useState } from 'react';
import MobileShell from '@/components/MobileShell';
import { encryptRailFence, decryptRailFence, RailFenceResult } from '@/lib/rail-fence';
import {
  Layers,
  Copy,
  Check,
  Sparkles,
  ArrowDownUp,
  Grid,
  Hash,
} from 'lucide-react';

export default function RailFencePage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('TRANSPOSISIZIGZAGRAILFENCE');
  const [rails, setRails] = useState<number>(3);
  const [resultData, setResultData] = useState<RailFenceResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showMatrix, setShowMatrix] = useState(true);

  const handleProcess = () => {
    if (!inputText.trim()) return;
    if (mode === 'encrypt') {
      setResultData(encryptRailFence(inputText, rails));
    } else {
      setResultData(decryptRailFence(inputText, rails));
    }
  };

  const handleCopy = () => {
    if (resultData?.result) {
      navigator.clipboard.writeText(resultData.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <MobileShell title="Rail Fence Cipher" subtitle="Transposisi Zig-Zag Klasik">
      <div className="space-y-4">
        {/* Header Info Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Rail Fence Cipher</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Metode transposisi klasik dengan memplot karakter secara bergelombang (zig-zag) pada (k) rel horizontal dan membacanya per baris.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setResultData(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'encrypt'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enkripsi
          </button>
          <button
            onClick={() => {
              setMode('decrypt');
              setResultData(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'decrypt'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Dekripsi
          </button>
        </div>

        {/* Input Text Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Teks Transposisi)'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Ketik teks untuk ditransposisikan..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
          />
        </div>

        {/* Rails (Depth) Slider & Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              Jumlah Rel (K)
            </label>
            <span className="text-emerald-400 font-mono font-bold text-xs"></span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={rails}
              onChange={(e) => setRails(parseInt(e.target.value, 10))}
              className="flex-1 accent-emerald-400 cursor-pointer"
            />
            <input
              type="number"
              min="2"
              max="15"
              value={rails}
              onChange={(e) => setRails(Math.max(2, parseInt(e.target.value, 10) || 2))}
              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleProcess}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Layers className="w-4 h-4" />
          {mode === 'encrypt' ? 'Jalankan Transposisi Rail Fence' : 'Jalankan Pemulihan Rail Fence'}
        </button>

        {/* Output Box */}
        {resultData && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    Hasil {mode === 'encrypt' ? 'Ciphertext Transposisi' : 'Plaintext Terpulihkan'}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-sm font-mono text-emerald-300 break-all select-all font-semibold">
                  {resultData.result}
                </p>
              </div>

              {/* Rail Sequences Breakdown */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400">Urutan Karakter per Rel:</p>
                <div className="grid grid-cols-1 gap-1">
                  {resultData.railSequences.map((seq) => (
                    <div
                      key={seq.railIndex}
                      className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-1 flex items-center justify-between text-xs font-mono"
                    >
                      <span className="text-emerald-400 font-bold">Rel #{seq.railIndex}:</span>
                      <span className="text-slate-200 font-semibold tracking-wider">{seq.chars || '(kosong)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Zig-Zag Grid Visualization */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-200">Matriks Visualisasi Pola Zig-Zag</h3>
                </div>
                <button
                  onClick={() => setShowMatrix(!showMatrix)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  {showMatrix ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showMatrix && (
                <div className="overflow-x-auto p-2 bg-slate-900/90 border border-slate-800 rounded-xl">
                  <div className="space-y-1.5 font-mono text-xs select-none">
                    {resultData.matrix.map((row, rIdx) => (
                      <div key={rIdx} className="flex items-center space-x-1">
                        <span className="w-12 shrink-0 text-[10px] text-slate-500 font-bold">
                          Rel {rIdx + 1}:
                        </span>
                        <div className="flex space-x-1">
                          {row.map((cell, cIdx) => (
                            <span
                              key={cIdx}
                              className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold ${cell !== ''
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                : 'text-slate-700 bg-slate-950/40'
                                }`}
                            >
                              {cell || '·'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
