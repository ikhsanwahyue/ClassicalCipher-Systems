'use client';

import React, { useState } from 'react';
import MobileShell from '@/components/MobileShell';
import { encryptVigenere, decryptVigenere, VigenereResult } from '@/lib/vigenere';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowDownUp,
  Table as TableIcon,
  HelpCircle,
} from 'lucide-react';

export default function VigenerePage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('KRIPTOGRAFI KLASIK POLIALFABETIK');
  const [key, setKey] = useState('KUNCI');
  const [resultData, setResultData] = useState<VigenereResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTracing, setShowTracing] = useState(true);

  const handleProcess = () => {
    if (!inputText.trim()) return;
    if (mode === 'encrypt') {
      setResultData(encryptVigenere(inputText, key));
    } else {
      setResultData(decryptVigenere(inputText, key));
    }
  };

  const handleCopy = () => {
    if (resultData?.result) {
      navigator.clipboard.writeText(resultData.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateRandomKey = () => {
    const keys = ['CIPHER', 'SECURITY', 'MATEMATIKA', 'RAHASIA', 'ALGORITMA', 'INFORMATIKA'];
    const random = keys[Math.floor(Math.random() * keys.length)];
    setKey(random);
  };

  return (
    <MobileShell title="Vigenere Cipher" subtitle="Substitusi Polialfabetik Klasik">
      <div className="space-y-4">
        {/* Header Info Banner */}
        <div className="bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Vigenere Cipher</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Algoritma kriptografi klasik yang dikembangkan dengan metode substitusi abjad-majemuk (polyalphabetic substitution cipher).
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
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
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
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
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
            <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Ketik teks yang akan diproses..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
          />
        </div>

        {/* Key Configuration Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              Kata Kunci
            </label>
            <button
              onClick={generateRandomKey}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Acak Kunci
            </button>
          </div>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Contoh: KUNCI / SECRET"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100 uppercase tracking-wider font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleProcess}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4" />
          {mode === 'encrypt' ? 'Jalankan Enkripsi' : 'Jalankan Dekripsi'}
        </button>

        {/* Output Box */}
        {resultData && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    Hasil {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext Terpulihkan'}
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
                <p className="text-sm font-mono text-cyan-300 break-all select-all font-semibold">
                  {resultData.result}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-500">{resultData.result.length} Karakter</span>
              </div>
            </div>

            {/* Tracing Table Collapsible */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-slate-200">Detail Proses</h3>
                </div>
                <button
                  onClick={() => setShowTracing(!showTracing)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  {showTracing ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showTracing && (
                <div className="overflow-x-auto max-h-60 overflow-y-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 sticky top-0 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2.5">#</th>
                        <th className="py-2 px-2.5">Input (P)</th>
                        <th className="py-2 px-2.5">Kunci (K)</th>
                        <th className="py-2 px-2.5">Operasi Modular</th>
                        <th className="py-2 px-2.5 text-cyan-400">Output</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {resultData.steps.map((step) => (
                        <tr key={step.index} className="hover:bg-slate-900/50">
                          <td className="py-1.5 px-2.5 text-slate-500">{step.index}</td>
                          <td className="py-1.5 px-2.5 text-slate-200 font-bold">
                            {step.plainChar}{' '}
                            {step.plainVal >= 0 && (
                              <span className="text-[10px] text-slate-500">({step.plainVal})</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2.5 text-amber-400">
                            {step.keyChar}{' '}
                            {step.keyVal >= 0 && (
                              <span className="text-[10px] text-slate-500">({step.keyVal})</span>
                            )}
                          </td>
                          <td className="py-1.5 px-2.5 text-slate-400 text-[11px]">{step.operation}</td>
                          <td className="py-1.5 px-2.5 text-cyan-300 font-bold">{step.cipherChar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
