'use client';

import React, { useState, useEffect } from 'react';
import MobileShell from '@/components/MobileShell';
import {
  superEncryptPipeline,
  superDecryptPipeline,
  SuperKeys,
  PipelineStageInfo,
} from '@/lib/super-encryption';
import { generateRsaKeyPair, RsaKeyPairPem } from '@/lib/rsa';
import {
  Layers,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowDownUp,
  Key,
  ShieldCheck,
  Cpu,
  Info,
  Grid,
  Binary,
  GitBranch,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function SuperEncryptionPage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('SUPER ENKRIPSI ESTAFET 4 LAPISAN KRIPTOGRAFI AKADEMIK');
  const [vigenereKey, setVigenereKey] = useState('MULTILAYER');
  const [railFenceRails, setRailFenceRails] = useState(3);
  const [rijndaelKey, setRijndaelKey] = useState('SuperSecretKey2026!');
  const [rsaKeys, setRsaKeys] = useState<RsaKeyPairPem | null>(null);
  const [isGeneratingRsa, setIsGeneratingRsa] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [stages, setStages] = useState<PipelineStageInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const [expandedStages, setExpandedStages] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  useEffect(() => {
    handleGenerateAllKeys();
  }, []);

  const handleGenerateAllKeys = async () => {
    setIsGeneratingRsa(true);
    try {
      const pair = await generateRsaKeyPair();
      setRsaKeys(pair);
    } catch (e) {
      // Ignore initial setup error
    } finally {
      setIsGeneratingRsa(false);
    }
  };

  const toggleStageExpand = (stageNum: number) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageNum]: !prev[stageNum],
    }));
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const keys: SuperKeys = {
      vigenereKey,
      railFenceRails,
      rijndaelKey,
      rsaPublicKeyPem: rsaKeys?.publicKeyPem || '',
      rsaPrivateKeyPem: rsaKeys?.privateKeyPem || '',
    };

    try {
      if (mode === 'encrypt') {
        const res = await superEncryptPipeline(inputText, keys);
        setFinalResult(res.finalCiphertext);
        setStages(res.stages);
      } else {
        const res = await superDecryptPipeline(inputText, keys);
        setFinalResult(res.recoveredPlaintext);
        setStages(res.stages);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan pada alur Super Enkripsi.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (finalResult) {
      navigator.clipboard.writeText(finalResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <MobileShell title="Menu 5: Super Enkripsi" subtitle="Multi-Layered Cryptosystem Pipeline">
      <div className="space-y-4">
        {/* Header Info Banner */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Menu 5 • Multi-Layer
              </span>
              <h2 className="text-base font-bold text-slate-100 mt-1">Multi-Layered Cryptosystem</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Penggabungan estafet 4 lapisan algoritma secara berurutan: Substitusi Klasik (Vigenère) → Transposisi Klasik (Rail Fence) → Kunci Simetri (Rijndael/AES) → Kunci Publik (RSA).
              </p>
            </div>
          </div>

          {/* Pipeline Visual Flow */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
            <div className="bg-slate-900/80 border border-cyan-500/30 p-1.5 rounded-lg text-cyan-300">
              <p className="font-bold">1. Vigenère</p>
              <p className="text-[8px] text-slate-400">Substitusi</p>
            </div>
            <div className="bg-slate-900/80 border border-emerald-500/30 p-1.5 rounded-lg text-emerald-300">
              <p className="font-bold">2. Rail Fence</p>
              <p className="text-[8px] text-slate-400">Transposisi</p>
            </div>
            <div className="bg-slate-900/80 border border-blue-500/30 p-1.5 rounded-lg text-blue-300">
              <p className="font-bold">3. Rijndael</p>
              <p className="text-[8px] text-slate-400">AES-256</p>
            </div>
            <div className="bg-slate-900/80 border border-purple-500/30 p-1.5 rounded-lg text-purple-300">
              <p className="font-bold">4. RSA</p>
              <p className="text-[8px] text-slate-400">Asimetris</p>
            </div>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setFinalResult(null);
              setStages([]);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'encrypt'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enkripsi Estafet 4-Lapis
          </button>
          <button
            onClick={() => {
              setMode('decrypt');
              setFinalResult(null);
              setStages([]);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'decrypt'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Dekripsi Estafet Terbalik
          </button>
        </div>

        {/* Key Configuration Accordion */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-200">Konfigurasi Kunci 4 Lapisan</h3>
            </div>
            <button
              onClick={handleGenerateAllKeys}
              disabled={isGeneratingRsa}
              className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingRsa ? 'animate-spin' : ''}`} />
              Acak Pasangan RSA
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
            {/* Vigenere Key */}
            <div className="space-y-1">
              <span className="text-cyan-400 font-semibold text-[11px] block">1. Kunci Vigenère:</span>
              <input
                type="text"
                value={vigenereKey}
                onChange={(e) => setVigenereKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 uppercase focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Rail Fence Depth */}
            <div className="space-y-1">
              <span className="text-emerald-400 font-semibold text-[11px] block">
                2. Kedalaman Rel Rail Fence (k):
              </span>
              <input
                type="number"
                min="2"
                max="10"
                value={railFenceRails}
                onChange={(e) => setRailFenceRails(Math.max(2, parseInt(e.target.value, 10) || 2))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Rijndael / AES Key */}
            <div className="space-y-1">
              <span className="text-blue-400 font-semibold text-[11px] block">3. Passphrase Rijndael / AES:</span>
              <input
                type="text"
                value={rijndaelKey}
                onChange={(e) => setRijndaelKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* RSA Keypair Indicator */}
            <div className="p-2 bg-purple-950/30 border border-purple-500/30 rounded-lg flex items-center justify-between">
              <span className="text-purple-300 text-[11px] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                4. Pasangan Kunci RSA (2048-bit):
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">✓ Terpasang (OAEP)</span>
            </div>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>
              {mode === 'encrypt' ? 'Plaintext (Teks Asli Input)' : 'Super Ciphertext (Input Dekripsi)'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Ketik atau tempel teks di sini..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <Layers className="w-4 h-4" />
          {isProcessing
            ? 'Memproses 4 Lapisan Estafet...'
            : mode === 'encrypt'
            ? 'Jalankan Enkripsi Super Pipeline'
            : 'Jalankan Dekripsi Super Pipeline'}
        </button>

        {/* Final Result Card */}
        {finalResult && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    Hasil Akhir {mode === 'encrypt' ? 'Super Ciphertext' : 'Plaintext Asli Terpulihkan'}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Salin Hasil</span>
                </button>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-xs font-mono text-amber-300 break-all select-all font-semibold leading-relaxed">
                  {finalResult}
                </p>
              </div>
            </div>

            {/* DETAIL PROSES VISUAL PER LAPISAN KRIPTOGRAFI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-amber-400" />
                  Detail Proses & Tracing per Lapisan ({mode === 'encrypt' ? 'Enkripsi Estafet' : 'Dekripsi Estafet'})
                </h3>
              </div>

              {stages.map((stage) => {
                const isExpanded = expandedStages[stage.stage] ?? true;
                return (
                  <div
                    key={stage.stage}
                    className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-md"
                  >
                    {/* Card Header */}
                    <div
                      onClick={() => toggleStageExpand(stage.stage)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center">
                          {stage.stage}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                            <span>{stage.name}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono font-normal">
                              {stage.category}
                            </span>
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 font-mono">
                          {isExpanded ? 'Tutup' : 'Lihat Detail'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
                        {/* Description & Keys */}
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                            {stage.description}
                          </p>
                          <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] text-amber-300 font-semibold">
                            🔑 Kunci: {stage.keyUsed}
                          </div>
                        </div>

                        {/* Input & Output Transition */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-0.5">
                            <span className="text-slate-500 block font-sans">Masukan Lapisan ({stage.stage}):</span>
                            <p className="text-slate-300 truncate font-bold">{stage.input}</p>
                          </div>
                          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-0.5">
                            <span className="text-slate-500 block font-sans">Keluaran Lapisan ({stage.stage}):</span>
                            <p className="text-cyan-300 truncate font-bold">{stage.output}</p>
                          </div>
                        </div>

                        {/* Algorithm-Specific Visualizations in Stage */}
                        {stage.metadata?.railMatrix && (
                          <div className="bg-slate-900 p-2 rounded-lg border border-emerald-500/30 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                                <Grid className="w-3 h-3" /> Pola Matriks Zig-Zag Rel
                              </span>
                              <span className="text-slate-500">{stage.metadata.extraInfo}</span>
                            </div>
                            <div className="overflow-x-auto py-1">
                              <div className="space-y-0.5 text-[10px]">
                                {stage.metadata.railMatrix.slice(0, 4).map((row, r) => (
                                  <div key={r} className="flex space-x-1">
                                    <span className="w-10 text-slate-500 shrink-0 font-bold">Rel {r + 1}:</span>
                                    {row.slice(0, 24).map((c, cIdx) => (
                                      <span
                                        key={cIdx}
                                        className={`w-4 h-4 flex items-center justify-center rounded ${
                                          c ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-700'
                                        }`}
                                      >
                                        {c || '·'}
                                      </span>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {stage.metadata?.ivHex && (
                          <div className="bg-slate-900 p-2 rounded-lg border border-blue-500/30 space-y-1 text-[10px]">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-400 font-bold flex items-center gap-1 font-sans">
                                <Cpu className="w-3 h-3" /> Komponen Rijndael AES-256-GCM
                              </span>
                              <span className="text-slate-500">{stage.metadata.extraInfo}</span>
                            </div>
                            <p className="text-slate-400 truncate">
                              <span className="text-slate-500">IV 96-bit:</span> {stage.metadata.ivHex}
                            </p>
                            <p className="text-emerald-400 truncate">
                              <span className="text-slate-500">GMAC Tag:</span> {stage.metadata.authTagHex}
                            </p>
                          </div>
                        )}

                        {stage.metadata?.rsaChunksCount && (
                          <div className="bg-slate-900 p-2 rounded-lg border border-purple-500/30 space-y-1 text-[10px]">
                            <div className="flex items-center justify-between">
                              <span className="text-purple-400 font-bold flex items-center gap-1 font-sans">
                                <Binary className="w-3 h-3" /> Parameter Asimetris RSA-OAEP
                              </span>
                              <span className="text-purple-300 font-bold">{stage.metadata.extraInfo}</span>
                            </div>
                            <p className="text-slate-400">
                              <span className="text-slate-500">Operasi:</span> {stage.metadata.formula}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
