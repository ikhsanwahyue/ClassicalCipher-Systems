'use client';

import React, { useState, useEffect } from 'react';
import MobileShell from '@/components/MobileShell';
import CipherResultDisplay from '@/components/CipherResultDisplay';
import {
  encryptRailFence,
  decryptRailFence,
  getSafeRailsBound,
  MAX_SAFE_RAILS,
  RailFenceResult,
} from '@/lib/rail-fence';
import {
  Layers,
  Sparkles,
  ArrowDownUp,
  Grid,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export default function RailFencePage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('TRANSPOSISIZIGZAGRAILFENCE');
  const [rails, setRails] = useState<number>(3);
  const [resultData, setResultData] = useState<RailFenceResult | null>(null);
  const [showMatrix, setShowMatrix] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hitung batas dinamis kedalaman rel agar tidak pernah melebihi panjang teks atau menyebabkan error
  const textLen = inputText.trim().length;
  const safeBound = getSafeRailsBound(textLen);

  // Otomatis sinkronisasi nilai rel jika panjang teks berkurang di bawah rel saat ini
  useEffect(() => {
    if (textLen >= 2 && rails > safeBound.max) {
      setRails(safeBound.max);
    }
  }, [textLen, safeBound.max, rails]);

  const handleProcess = () => {
    setErrorMessage(null);
    if (!inputText.trim()) {
      setErrorMessage('Silakan masukkan teks terlebih dahulu.');
      return;
    }

    if (textLen < 2) {
      setErrorMessage('Panjang teks minimal 2 karakter untuk memproses Rail Fence Cipher.');
      return;
    }

    // Pastikan kedalaman rel berada dalam batas aman
    const finalRails = Math.min(Math.max(2, rails), safeBound.max);
    if (finalRails !== rails) {
      setRails(finalRails);
    }

    if (mode === 'encrypt') {
      setResultData(encryptRailFence(inputText, finalRails));
    } else {
      setResultData(decryptRailFence(inputText, finalRails));
    }
  };

  return (
    <MobileShell title="Rail Fence Cipher" subtitle="Transposisi Zig-Zag Klasik">
      <div className="space-y-4">
        {/* Info Card */}
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

        {/* Tab Enkripsi / Dekripsi */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setResultData(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'encrypt'
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
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'decrypt'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Dekripsi
          </button>
        </div>

        {/* Error Alert jika teks terlalu pendek */}
        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext (P)' : 'Ciphertext (C)'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setErrorMessage(null);
            }}
            rows={3}
            placeholder="Ketik teks untuk ditransposisikan..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
          />
        </div>

        {/* Pengaturan Kedalaman Rel (k) dengan Validasi Batas Aman */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Kedalaman Rel (k):</span>
              <span className="text-emerald-400 font-mono font-bold">{rails} Rel</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
              Batas: 2 s/d {safeBound.max} rel
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={safeBound.min}
                max={safeBound.max}
                step="1"
                value={Math.min(rails, safeBound.max)}
                onChange={(e) => setRails(parseInt(e.target.value, 10))}
                disabled={textLen < 3}
                className="flex-1 accent-emerald-400 cursor-pointer disabled:opacity-40"
              />
              <input
                type="number"
                min={safeBound.min}
                max={safeBound.max}
                value={Math.min(rails, safeBound.max)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (isNaN(val)) return;
                  setRails(Math.min(Math.max(safeBound.min, val), safeBound.max));
                }}
                disabled={textLen < 3}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 disabled:opacity-40"
              />
            </div>

            {/* Helper Text untuk Batas Kedalaman Rail Fence */}
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 pt-0.5 border-t border-slate-800/80">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {textLen < 3 ? (
                <span className="text-amber-400">
                  Minimal 3 karakter untuk membentuk gelombang zig-zag (panjang saat ini: {textLen}).
                </span>
              ) : (
                <span>
                  Kedalaman otomatis dibatasi maksimum <strong className="text-emerald-400">{safeBound.max} rel</strong> (panjang teks - 1, maks {MAX_SAFE_RAILS}) agar tidak terjadi error transposisi.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Eksekusi */}
        <button
          onClick={handleProcess}
          disabled={textLen < 2}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Layers className="w-4 h-4" />
          {mode === 'encrypt' ? 'Jalankan Enkripsi' : 'Jalankan Dekripsi'}
        </button>

        {/* Hasil Ciphertext / Plaintext Terpulihkan dengan Full View Support */}
        {resultData && (
          <div className="space-y-4 pt-2">
            <CipherResultDisplay
              title={`Hasil ${mode === 'encrypt' ? 'Ciphertext' : 'Plaintext Terpulihkan'}`}
              value={resultData.result}
              themeColor="emerald"
              threshold={120}
              downloadFilename={mode === 'encrypt' ? 'railfence-ciphertext.txt' : 'railfence-plaintext.txt'}
              subInfo={
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <p className="text-[11px] font-semibold text-slate-400">Urutan Karakter per Rel ({resultData.rails} Rel)</p>
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {resultData.railSequences.map((seq) => (
                      <div
                        key={seq.railIndex}
                        className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-1 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-emerald-400 font-bold">Rel {seq.railIndex}:</span>
                        <span className="text-slate-200 font-semibold tracking-wider break-all select-all ml-2">
                          {seq.chars || '(kosong)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />

            {/* Matriks Visualisasi Pola Zig-Zag */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-200">Matriks Visualisasi Pola Zig-Zag</h3>
                </div>
                <button
                  onClick={() => setShowMatrix(!showMatrix)}
                  className="text-[11px] text-emerald-400 hover:underline font-semibold"
                >
                  {showMatrix ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showMatrix && (
                <div className="space-y-2">
                  {resultData.isMatrixTruncated && (
                    <p className="text-[10px] text-amber-400/90 font-mono">
                      * Menampilkan {resultData.maxVisualCols} kolom pertama visualisasi dari total {resultData.totalChars} karakter demi performa rendering.
                    </p>
                  )}
                  <div className="overflow-x-auto p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl">
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
                                className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold ${
                                  cell !== ''
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}