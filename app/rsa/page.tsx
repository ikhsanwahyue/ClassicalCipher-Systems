'use client';

import React, { useState, useEffect } from 'react';
import MobileShell from '@/components/MobileShell';
import {
  generateRsaKeyPair,
  encryptRsa,
  decryptRsa,
  RsaKeyPairPem,
  RsaEncryptionResult,
} from '@/lib/rsa';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowDownUp,
  Key,
  Shield,
  FileCode,
  Info,
  Layers,
  Cpu,
  Binary,
  GitBranch,
  ArrowRight,
  UnlockKeyhole,
  AlertTriangle,
  CheckCircle2,
  Hash
} from 'lucide-react';

export default function RsaPage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('PESAN RAHASIA ASIMETRIS KUNCI PUBLIK RSA-2048');
  const [keys, setKeys] = useState<RsaKeyPairPem | null>(null);
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState<RsaEncryptionResult | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<{ plaintext: string; chunksCount: number; traces: { chunkIndex: number; status: string }[] } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<'pub' | 'priv' | 'res' | null>(null);
  
  // States to keep track of process details for decryption
  const [decryptSteps, setDecryptSteps] = useState<{
    inputLength: number;
    chunksCount: number;
    plaintext: string;
  } | null>(null);

  useEffect(() => {
    handleGenerateKeys();
  }, []);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const pair = await generateRsaKeyPair();
      setKeys(pair);
      setPublicKeyInput(pair.publicKeyPem);
      setPrivateKeyInput(pair.privateKeyPem);
    } catch (err: unknown) {
      setErrorMessage('Gagal membuat pasangan kunci RSA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setDecryptSteps(null);

    try {
      if (mode === 'encrypt') {
        if (!publicKeyInput.trim()) {
          throw new Error('Kunci Publik (PEM) wajib diisi untuk melakukan enkripsi.');
        }
        const res = await encryptRsa(inputText, publicKeyInput);
        setEncryptionResult(res);
        setDecryptionResult(null);
      } else {
        if (!privateKeyInput.trim()) {
          throw new Error('Kunci Privat (PEM) wajib diisi untuk melakukan dekripsi.');
        }
        
        // Parse input to get chunk count for visualizer
        let chunksCount = 0;
        try {
          const parsed = JSON.parse(atob(inputText));
          if (parsed.chunks && Array.isArray(parsed.chunks)) {
            chunksCount = parsed.chunks.length;
          }
        } catch {
          // It might fail if invalid, let the actual decryptRsa handle the error
        }

        const res = await decryptRsa(inputText, privateKeyInput);
        setDecryptionResult(res);
        setEncryptionResult(null);
        
        setDecryptSteps({
          inputLength: inputText.trim().length,
          chunksCount: chunksCount || res.chunksCount,
          plaintext: res.plaintext
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kegagalan kriptografi RSA.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (text: string, type: 'pub' | 'priv' | 'res') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <MobileShell title="Kunci Publik (RSA)" subtitle="Kunci Nirsimetri Modern (RSA-OAEP 2048)">
      <div className="space-y-4">

        {/* Header info */}
        <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Kunci Publik (RSA)</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Algoritma kriptografi asimetris (public-key). Menggunakan Kunci Publik untuk mengenkripsi dan Kunci Privat untuk mendekripsi. Dilengkapi OAEP Padding (SHA-256).
              </p>
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setEncryptionResult(null);
              setDecryptionResult(null);
              setDecryptSteps(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'encrypt' ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Enkripsi
          </button>
          <button
            onClick={() => {
              setMode('decrypt');
              setEncryptionResult(null);
              setDecryptionResult(null);
              setDecryptSteps(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'decrypt' ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" /> Dekripsi
          </button>
        </div>

        {/* Manajemen Kunci */}
        <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-200">Manajemen Pasangan Kunci RSA (2048-bit)</h3>
            </div>
            <button
              onClick={handleGenerateKeys}
              disabled={isGenerating}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Membuat...' : 'Buat Kunci Baru'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-purple-300 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Kunci Publik (Public Key - PEM)
                </span>
                <button onClick={() => handleCopyText(publicKeyInput, 'pub')} className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
                  {copiedKey === 'pub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{copiedKey === 'pub' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <textarea
                value={publicKeyInput}
                onChange={(e) => setPublicKeyInput(e.target.value)}
                rows={3}
                placeholder="-----BEGIN PUBLIC KEY-----"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-purple-300/90 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-rose-300 flex items-center gap-1">
                  <Key className="w-3 h-3" /> Kunci Privat (Private Key - PEM)
                </span>
                <button onClick={() => handleCopyText(privateKeyInput, 'priv')} className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
                  {copiedKey === 'priv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{copiedKey === 'priv' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <textarea
                value={privateKeyInput}
                onChange={(e) => setPrivateKeyInput(e.target.value)}
                rows={3}
                placeholder="-----BEGIN PRIVATE KEY-----"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-rose-300/90 focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Input Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext RSA (Payload Base64)'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={mode === 'encrypt' ? 'Ketik pesan rahasia yang akan dienkripsi dengan Kunci Publik...' : 'Tempel payload ciphertext RSA Base64 di sini...'}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono"
          />
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <KeyRound className="w-4 h-4" />
          {isProcessing ? 'Memproses Kriptografi RSA...' : mode === 'encrypt' ? 'Enkripsi dengan Kunci Publik' : 'Dekripsi dengan Kunci Privat'}
        </button>

        {/* ──────────── ENKRIPSI HASIL ──────────── */}
        {encryptionResult && (
          <div className="space-y-4 pt-2">

            {/* Ciphertext output */}
            <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Hasil Ciphertext RSA-OAEP ({encryptionResult.chunksCount} Blok)</span>
                </div>
                <button onClick={() => handleCopyText(encryptionResult.ciphertextBase64, 'res')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700">
                  {copiedKey === 'res' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Salin Payload</span>
                </button>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-xs font-mono text-purple-300 break-all select-all font-semibold leading-relaxed">
                  {encryptionResult.ciphertextBase64}
                </p>
              </div>
            </div>

            {/* Alur Proses Enkripsi Step-by-Step */}
            <div className="bg-slate-950/90 border border-purple-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200">Alur Proses Enkripsi RSA-OAEP</h3>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                {/* Step 1 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">1</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Import & Parse Kunci Publik</p>
                    <p className="text-slate-500">Format PEM → ArrayBuffer (SPKI)</p>
                    <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                      <div className="bg-slate-950 border border-slate-800 rounded p-1.5">
                        <p className="text-slate-500">Modulus (n):</p>
                        <p className="text-purple-300">{encryptionResult.mathParameters.keySize}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded p-1.5">
                        <p className="text-slate-500">Public Exponent (e):</p>
                        <p className="text-purple-300">{encryptionResult.mathParameters.publicExponent}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">2</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Encode & Chunking Data</p>
                    <p className="text-slate-500">Kapasitas maksimal RSA-2048 + OAEP = 190 byte/blok.</p>
                    <p className="text-slate-400">Total blok yang dihasilkan: {encryptionResult.chunksCount} chunk.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-purple-700/40">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">3</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">OAEP Padding (Setiap Chunk)</p>
                    <div className="bg-purple-950/30 border border-purple-700/30 rounded-lg p-2 space-y-1">
                      <p className="text-slate-300">Struktur OAEP 256 byte:</p>
                      <p className="text-slate-400">0x00 ∥ maskedSeed (32B) ∥ maskedDB (223B)</p>
                      <p className="text-slate-500 pt-1">Masking menggunakan SHA-256 dan MGF1, memastikan enkripsi non-deterministik.</p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">4</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Modular Exponentiation</p>
                    <p className="text-slate-300 font-semibold bg-slate-950/60 p-1.5 rounded border border-slate-800 text-center">C = M^e mod n</p>
                    <p className="text-slate-500">M = integer 2048-bit dari blok OAEP</p>
                    <p className="text-slate-500">C = hasil ciphertext 256 byte per chunk</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">5</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Kemas Output JSON Base64</p>
                    <p className="text-slate-500">Bentuk JSON berisi metadata scheme, jumlah chunk, dan array chunk base64, kemudian di-encode ke Base64 final.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracing per blok */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-200">Detail Hasil Per Chunk</h3>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {encryptionResult.chunksCount} Blok
                </span>
              </div>
              <div className="space-y-2.5 font-mono text-xs">
                {encryptionResult.chunkTraces.map((trace) => (
                  <div key={trace.chunkIndex} className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                      <span className="font-bold text-slate-200 text-xs">Blok #{trace.chunkIndex}</span>
                      <span className="text-[10px] text-slate-400">Data Asli: {trace.plainByteLength} Byte</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px] pt-0.5">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 w-16">Data:</span>
                        <span className="text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60 truncate flex-1">&quot;{trace.plainSnippet}&quot;</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 w-16">Rumus:</span>
                        <span className="text-purple-300 font-semibold">{trace.operation}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[10px] pt-1">
                        <span className="text-slate-500 shrink-0">Output:</span>
                        <span className="text-purple-300/90 bg-slate-950 px-2 py-1 rounded border border-slate-800/80 truncate font-mono select-all flex-1 text-right">{trace.cipherBase64}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──────────── DEKRIPSI HASIL ──────────── */}
        {decryptionResult && decryptSteps && (
          <div className="space-y-4 pt-2">
            
            {/* Plaintext output */}
            <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Pesan Asli Berhasil Didekripsi</span>
                </div>
                <button onClick={() => handleCopyText(decryptionResult.plaintext, 'res')} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700">
                  {copiedKey === 'res' ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Salin</span>
                </button>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-sm font-mono text-purple-300 break-all select-all font-semibold">
                  {decryptionResult.plaintext}
                </p>
              </div>
            </div>

            {/* Alur Proses Dekripsi Step-by-Step */}
            <div className="bg-slate-950/90 border border-purple-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UnlockKeyhole className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200">Alur Proses Dekripsi RSA-OAEP</h3>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                {/* Step 1 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">1</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Base64 Decode & Parse JSON</p>
                    <p className="text-slate-500">Mengambil array chunk Base64 dari JSON payload.</p>
                    <p className="text-slate-400">Total chunk ditemukan: {decryptSteps.chunksCount} blok</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">2</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Import & Parse Kunci Privat</p>
                    <p className="text-slate-500">Format PEM → ArrayBuffer (PKCS#8)</p>
                    <p className="text-slate-400">Ekstrak Modulus (n) dan Private Exponent (d)</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">3</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Modular Exponentiation (CRT Method)</p>
                    <p className="text-slate-500">Tiap blok 256 byte didekripsi:</p>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800 space-y-1">
                      <p className="text-slate-300 font-semibold text-center">M_i = C_i^d mod n</p>
                      <p className="text-slate-500 text-[10px]">Menggunakan Chinese Remainder Theorem (CRT) dengan p, q, dp, dq, qInv agar 4x lebih cepat.</p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-purple-700/40">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">4</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">OAEP Unpadding & Verifikasi</p>
                    <div className="bg-purple-950/30 border border-purple-700/30 rounded-lg p-2 space-y-1">
                      <p className="text-slate-300">Blok M_i (256B) dipisah:</p>
                      <ul className="list-disc list-inside text-slate-400 text-[10px] space-y-0.5 pl-1">
                        <li>Cek byte[0] == 0x00</li>
                        <li>Recover seed dengan MGF1</li>
                        <li>Recover DB dengan MGF1(seed)</li>
                        <li>Verifikasi lHash (SHA-256(""))</li>
                        <li>Cari separator 0x01</li>
                      </ul>
                      <div className="flex items-center gap-2 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                        <p className="text-purple-300 font-bold">Verifikasi Berhasil → Data Diambil</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px] border border-purple-500/30 shrink-0">5</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-purple-300 font-bold">Gabungkan Chunk → UTF-8 Decode</p>
                    <p className="text-slate-500">Menyusun array byte hasil dekripsi dari tiap chunk, kemudian mendecode menjadi string UTF-8.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skenario Error */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-bold text-slate-200">Skenario Kegagalan RSA Dekripsi</h3>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  { label: 'Kunci Privat Salah', desc: 'C^d mod n menghasilkan nilai acak. OAEP Unpad gagal di tahap awal (byte pertama bukan 0x00).' },
                  { label: 'Data Tampered (Rusak)', desc: 'Sifat OAEP akan mendeteksi perubahan sekecil 1 bit. Verifikasi lHash akan gagal.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-2 items-start bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                    <span className="text-rose-400 font-bold shrink-0">✗</span>
                    <div>
                      <span className="text-rose-300 font-bold">{s.label}:</span>
                      <span className="text-slate-400 ml-1">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </MobileShell>
  );
}
