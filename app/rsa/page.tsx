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
  const [showMathDetails, setShowMathDetails] = useState(true);

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
        const res = await decryptRsa(inputText, privateKeyInput);
        setDecryptionResult(res);
        setEncryptionResult(null);
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
    <MobileShell title="Menu 4: Kunci Publik / RSA" subtitle="Kunci Nirsimetri Modern (RSA-OAEP 2048)">
      <div className="space-y-4">
        {/* Header Info Banner */}
        <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Menu 4 • Nirsimetri Modern
              </span>
              <h2 className="text-base font-bold text-slate-100 mt-1">Kunci Publik (RSA)</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Kriptografi asimetris berbasis pasangan Kunci Publik ($e, n$) dan Kunci Privat ($d, n$) dengan skema padding aman RSAES-OAEP.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setEncryptionResult(null);
              setDecryptionResult(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'encrypt'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enkripsi (Public Key)
          </button>
          <button
            onClick={() => {
              setMode('decrypt');
              setEncryptionResult(null);
              setDecryptionResult(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'decrypt'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Dekripsi (Private Key)
          </button>
        </div>

        {/* RSA Key Management Panel */}
        <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
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
            {/* Public Key Display/Editor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-purple-300 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Kunci Publik (Public Key - PEM)
                </span>
                <button
                  onClick={() => handleCopyText(publicKeyInput, 'pub')}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
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

            {/* Private Key Display/Editor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-rose-300 flex items-center gap-1">
                  <Key className="w-3 h-3" /> Kunci Privat (Private Key - PEM)
                </span>
                <button
                  onClick={() => handleCopyText(privateKeyInput, 'priv')}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
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

        {/* Input Text Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext (Pesan Asli)' : 'Ciphertext RSA (Payload Base64)'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={
              mode === 'encrypt'
                ? 'Ketik pesan rahasia yang akan dienkripsi dengan Kunci Publik...'
                : 'Tempel payload ciphertext RSA Base64 di sini...'
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono"
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
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <KeyRound className="w-4 h-4" />
          {isProcessing
            ? 'Memproses Kriptografi RSA...'
            : mode === 'encrypt'
            ? 'Enkripsi dengan Kunci Publik'
            : 'Dekripsi dengan Kunci Privat'}
        </button>

        {/* ENCRYPTION RESULT & PROCESS DETAILS */}
        {encryptionResult && (
          <div className="space-y-4 pt-2">
            {/* Ciphertext Output Card */}
            <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    Hasil Ciphertext RSA-OAEP ({encryptionResult.chunksCount} Blok)
                  </span>
                </div>
                <button
                  onClick={() => handleCopyText(encryptionResult.ciphertextBase64, 'res')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
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

            {/* VISUAL PROCESS DETAIL 1: Mathematical Parameters */}
            <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-slate-200">
                    Parameter Matematis Kriptografi Asimetris RSA
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  FIPS Compliant
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-slate-500 text-[10px] block">Modulus (n = p × q):</span>
                  <span className="text-purple-300 font-bold">{encryptionResult.mathParameters.keySize}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-slate-500 text-[10px] block">Public Exponent (e):</span>
                  <span className="text-purple-300 font-bold">{encryptionResult.mathParameters.publicExponent}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-slate-500 text-[10px] block">Fungsi Hash Digest:</span>
                  <span className="text-slate-200">{encryptionResult.mathParameters.hashFunction}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-slate-500 text-[10px] block">Skema Padding:</span>
                  <span className="text-slate-200">{encryptionResult.mathParameters.paddingScheme}</span>
                </div>
              </div>
            </div>

            {/* VISUAL PROCESS DETAIL 2: Chunk-by-Chunk Modular Exponentiation Trace */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-slate-200">
                    Rincian Pemrosesan per Blok ($C_i = M_i^e \pmod n$)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {encryptionResult.chunksCount} Blok Terenkripsi
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {encryptionResult.chunkTraces.map((trace) => (
                  <div
                    key={trace.chunkIndex}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-400">
                        Blok #{trace.chunkIndex} ({trace.plainByteLength} Byte)
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Padded: {trace.cipherLengthBytes} Byte (2048-bit)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <span className="text-slate-500">Teks Masukan:</span> "{trace.plainSnippet}"
                    </p>
                    <p className="text-[10px] text-purple-300">
                      <span className="text-slate-500">Operasi:</span> {trace.operation}
                    </p>
                    <div className="text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded-lg border border-slate-850 truncate">
                      <span className="text-slate-500">Keluaran Blok Base64: </span>
                      <span className="text-purple-300 font-semibold">{trace.cipherBase64}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DECRYPTION RESULT & PROCESS DETAILS */}
        {decryptionResult && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Pesan Asli Berhasil Didekripsi</span>
                </div>
                <button
                  onClick={() => handleCopyText(decryptionResult.plaintext, 'res')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedKey === 'res' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Salin</span>
                </button>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-sm font-mono text-emerald-300 break-all select-all font-semibold">
                  {decryptionResult.plaintext}
                </p>
              </div>
            </div>

            {/* Decryption Step Breakdown */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-200">
                Laporan Verifikasi Pemulihan Blok Asimetris ($M_i = C_i^d \pmod n$)
              </h3>
              <div className="space-y-1 text-xs font-mono">
                {decryptionResult.traces.map((t) => (
                  <div key={t.chunkIndex} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-emerald-400 font-bold">Blok #{t.chunkIndex}:</span> {t.status}
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
