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

  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [stages, setStages] = useState<PipelineStageInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [expandedStages, setExpandedStages] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
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

      setExpandedStages({
        1: mode === 'decrypt',
        2: false,
        3: false,
        4: mode === 'encrypt',
      });

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
    <MobileShell title="Super Enkripsi" subtitle="Multi-Layered Cryptosystem Pipeline">
      <div className="space-y-4">

        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Multi-Layered Cryptosystem</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Penggabungan estafet 4 algoritma kriptografi: Vigenere → Rail Fence → Rijndael (AES) → RSA. Lapisan ini memastikan kombinasi sifat substitusi, transposisi, simetris dan asimetris.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
            <div className="bg-slate-900/80 border border-cyan-500/30 p-1.5 rounded-lg text-cyan-300">Vigenere</div>
            <div className="bg-slate-900/80 border border-emerald-500/30 p-1.5 rounded-lg text-emerald-300">Rail Fence</div>
            <div className="bg-slate-900/80 border border-blue-500/30 p-1.5 rounded-lg text-blue-300">Rijndael</div>
            <div className="bg-slate-900/80 border border-purple-500/30 p-1.5 rounded-lg text-purple-300">RSA</div>
          </div>
        </div>

        {/* Tombol pilihan mode */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setFinalResult(null);
              setStages([]);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'encrypt'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Enkripsi
          </button>
          <button
            onClick={() => {
              setMode('decrypt');
              setFinalResult(null);
              setStages([]);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'decrypt'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" /> Dekripsi
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Konfigurasi Kunci (K)' : 'Konfigurasi Kunci (K)'}</span>

            <button
              onClick={handleGenerateAllKeys}
              disabled={isGeneratingRsa}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-700 flex items-center gap-1 font-semibold disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingRsa ? 'animate-spin' : ''}`} />
              Acak RSA
            </button>
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="grid grid-cols-1 gap-2.5 text-xs font-mono">

              {/* 1. Kunci Vigenère */}
              <div className="space-y-2">
                <span className="text-amber-400 font-semibold text-[11px] block">1. Kunci Vigenère:</span>
                <input
                  type="text"
                  value={vigenereKey}
                  onChange={(e) => setVigenereKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 uppercase focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* 2. Kedalaman Rel Rail Fence */}
              <div className="space-y-2">
                <span className="text-amber-400 font-semibold text-[11px] block">2. Kedalaman Rel Rail Fence (k):</span>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={railFenceRails}
                  onChange={(e) => setRailFenceRails(Math.max(2, parseInt(e.target.value, 10) || 2))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* 3. Passphrase Rijndael */}
              <div className="space-y-2">
                <span className="text-amber-400 font-semibold text-[11px] block">3. Passphrase Rijndael (AES):</span>
                <input
                  type="text"
                  value={rijndaelKey}
                  onChange={(e) => setRijndaelKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* 4. Pasangan Kunci RSA */}
              <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <span className="text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  4. Pasangan Kunci RSA (2048 bit):
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                  ✓ Siap (OAEP)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Teks */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext (P)' : 'Super Ciphertext (Input Dekripsi)'}</span>
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

        {/* Error */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tombol Utama */}
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <Layers className="w-4 h-4" />
          {isProcessing ? 'Memproses Estafet...' : mode === 'encrypt' ? 'Enkripsi Super Pipeline' : 'Dekripsi Super Pipeline'}
        </button>

        {/* ──────────── HASIL PIPELINE ──────────── */}
        {finalResult && (
          <div className="space-y-4 pt-2">

            {/* Output Card */}
            <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    Hasil Akhir {mode === 'encrypt' ? 'Super Ciphertext' : 'Plaintext Terpulihkan'}
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

              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span>{finalResult.length} Karakter</span>
                <span>{stages.length} Lapisan Dilalui</span>
              </div>
            </div>

            {/* Container Detail Tracing */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-slate-200">Tracing Per Lapisan (Pipeline)</h3>
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  {showDetails ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showDetails && (
                <div className="space-y-2 pt-1">
                  {stages.map((stage) => {
                    const isExpanded = expandedStages[stage.stage] ?? false;

                    // Tentukan warna & ikon tema berdasarkan algoritma di lapisan ini,
                    // supaya setiap lapisan mudah dikenali sekilas tanpa membaca nama penuh.
                    let themeColor = 'text-amber-400';
                    let StageIcon = Layers;
                    if (stage.name.includes('Vigenere')) {
                      themeColor = 'text-cyan-400';
                      StageIcon = Key;
                    } else if (stage.name.includes('Rail Fence')) {
                      themeColor = 'text-emerald-400';
                      StageIcon = Grid;
                    } else if (stage.name.includes('Rijndael')) {
                      themeColor = 'text-blue-400';
                      StageIcon = Cpu;
                    } else if (stage.name.includes('RSA')) {
                      themeColor = 'text-purple-400';
                      StageIcon = ShieldCheck;
                    }

                    return (
                      <div key={stage.stage} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">

                        <div
                          onClick={() => toggleStageExpand(stage.stage)}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-900/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-md bg-slate-950 flex items-center justify-center text-[10px] font-bold border border-slate-800 ${themeColor}`}>
                              {stage.stage}
                            </span>
                            <StageIcon className={`w-3.5 h-3.5 ${themeColor}`} />
                            <span className="text-xs font-bold text-slate-200">{stage.name}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </div>

                        {isExpanded && (
                          <div className="p-3 pt-0 space-y-2 border-t border-slate-800/50 mt-1">

                            <p className="text-[10px] text-slate-400 font-mono">
                              Kunci: <span className={`font-semibold ${themeColor}`}>{stage.keyUsed}</span>
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                                <span className="text-slate-500 block mb-1">Masukan (Input)</span>
                                <p className="text-slate-300 truncate">{stage.input}</p>
                              </div>
                              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                                <span className="text-slate-500 block mb-1">Keluaran (Output)</span>
                                <p className="text-amber-300 font-bold truncate">{stage.output}</p>
                              </div>
                            </div>

                            {/* Vigenere sebelumnya tidak punya panel detail khusus seperti 3 lapisan
                                lain di bawah — ini melengkapi bagian yang hilang itu. Penjelasan
                                konsep dipakai karena field metadata Vigenere (mis. keystream per
                                huruf) belum terlihat di tipe PipelineStageInfo yang dibagikan;
                                kirim lib/super-encryption.ts kalau field itu sudah ada dan Anda
                                ingin tabel keystream sebenarnya ditampilkan di sini. */}
                            {stage.name.includes('Vigenere') && (
                              <div className="bg-slate-950/80 p-2 rounded-lg border border-cyan-500/20 text-[9px] font-mono text-cyan-300/80 space-y-1">
                                <p className="font-bold text-cyan-400 flex items-center gap-1">
                                  <Key className="w-3 h-3" /> Substitusi Polyalphabetic
                                </p>
                                <p className="text-cyan-300/70">
                                  Tiap huruf plaintext digeser sesuai huruf kunci &quot;<span className="font-semibold">{stage.keyUsed}</span>&quot; yang diulang (mod 26) di sepanjang teks.
                                </p>
                                {(stage.metadata as any)?.keystream && (
                                  <p className="break-all pt-1 border-t border-cyan-900/40">
                                    Keystream: {(stage.metadata as any).keystream}
                                  </p>
                                )}
                              </div>
                            )}

                            {stage.metadata?.railMatrix && (
                              <div className="bg-slate-950/80 p-2 rounded-lg border border-emerald-500/20 text-[9px] font-mono overflow-x-auto text-emerald-300/80">
                                <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                                  <Grid className="w-3 h-3" /> Pola Zig-Zag Transposisi
                                </p>
                                {stage.metadata.railMatrix.slice(0, 3).map((row, r) => (
                                  <div key={r} className="whitespace-nowrap">Rel {r + 1}: {row.slice(0, 40).map(c => c || '·').join(' ')}</div>
                                ))}
                              </div>
                            )}

                            {stage.metadata?.ivHex && (
                              <div className="bg-slate-950/80 p-2 rounded-lg border border-blue-500/20 text-[9px] font-mono text-blue-300/80 space-y-1">
                                <p className="font-bold text-blue-400 flex items-center gap-1">
                                  <Cpu className="w-3 h-3" /> Parameter AES-256-GCM
                                </p>
                                <p className="truncate">IV: {stage.metadata.ivHex}</p>
                                <p className="truncate">Tag: {stage.metadata.authTagHex}</p>
                              </div>
                            )}

                            {stage.metadata?.rsaChunksCount && (
                              <div className="bg-slate-950/80 p-2 rounded-lg border border-purple-500/20 text-[9px] font-mono text-purple-300/80 space-y-1">
                                <p className="font-bold text-purple-400 flex items-center gap-1">
                                  <Binary className="w-3 h-3" /> Parameter RSA-OAEP
                                </p>
                                <p>{stage.metadata.extraInfo}</p>
                                <p>Eksekusi: {stage.metadata.formula}</p>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </MobileShell>
  );
}
