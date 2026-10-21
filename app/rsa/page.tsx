'use client';

import React, { useState, useEffect } from 'react';
import MobileShell from '@/components/MobileShell';
import CipherResultDisplay from '@/components/CipherResultDisplay';
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
  Info,
  Binary,
  UnlockKeyhole,
  AlertTriangle,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';

function ProcessStep({
  index,
  title,
  description,
  accent = 'purple',
  icon,
}: {
  index: number;
  title: string;
  description: React.ReactNode;
  accent?: 'purple' | 'emerald';
  icon?: React.ReactNode;
}) {
  const isEmerald = accent === 'emerald';
  return (
    <div
      className={`flex gap-3 items-start rounded-xl p-3 border ${isEmerald
        ? 'bg-emerald-950/20 border-emerald-800/30'
        : 'bg-slate-900/60 border-slate-800/80'
        }`}
    >
      <span
        className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[9px] shrink-0 ${isEmerald ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
          }`}
      >
        {icon ?? index}
      </span>
      <div className="flex-1 space-y-1">
        <p className={`font-bold flex items-center gap-1 text-[11px] ${isEmerald ? 'text-emerald-300' : 'text-purple-300'}`}>
          {title}
        </p>
        <div className="text-slate-400 text-[9px] leading-relaxed">{description}</div>
      </div>
    </div>
  );
}

function DecryptBlockTrace({ chunkIndex, status }: { chunkIndex: number; status: string }) {
  const isValid = /valid|success|ok|berhasil/i.test(status);
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[9px] shrink-0">
          {chunkIndex}
        </span>
        <span className="text-[11px] font-semibold text-slate-300">Blok #{chunkIndex}</span>
      </div>
      <div
        className={`flex items-center gap-1 text-[10px] font-mono font-semibold ${isValid ? 'text-emerald-400' : 'text-rose-400'
          }`}
      >
        {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        {status}
      </div>
    </div>
  );
}

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

  const [showDetails, setShowDetails] = useState(true);

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

        let chunksCount = 0;
        try {
          const parsed = JSON.parse(atob(inputText));
          if (parsed.chunks && Array.isArray(parsed.chunks)) {
            chunksCount = parsed.chunks.length;
          }
        } catch { }

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

        <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Kunci Publik (RSA - Rivest, Shamir, Adleman)</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Algoritma kriptografi asimetris (public-key). Menggunakan Kunci Publik untuk enkripsi dan Kunci Privat untuk dekripsi. Diperkuat dengan Optimal Asymmetric Encryption Padding (OAEP) serta fungsi hash Secure Hash Algorithm 256-bit (SHA 256) untuk mencegah berbagai bentuk serangan matematis.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setEncryptionResult(null);
              setDecryptionResult(null);
              setDecryptSteps(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'encrypt' ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
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
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'decrypt' ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" /> Dekripsi
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-300 flex justify-between">
            Manajemen Kunci (2048-bit)
          </h3>
          <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-3.5 space-y-4 shadow-lg">
            <div className="flex items-center justify-end">
              <button
                onClick={handleGenerateKeys}
                disabled={isGenerating}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 flex items-center gap-1 font-semibold disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Membuat...' : 'Buat Kunci Baru'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-2 border-t border-slate-800/80">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-purple-300 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Kunci Publik (Untuk Enkripsi)
                  </span>
                  <button onClick={() => handleCopyText(publicKeyInput, 'pub')} className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    {copiedKey === 'pub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>Salin</span>
                  </button>
                </div>
                <textarea
                  value={publicKeyInput}
                  onChange={(e) => setPublicKeyInput(e.target.value)}
                  rows={5}
                  placeholder="-----BEGIN PUBLIC KEY-----"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[9px] font-mono text-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-rose-300 flex items-center gap-1">
                    <Key className="w-3 h-3" /> Kunci Privat (Untuk Dekripsi)
                  </span>
                  <button onClick={() => handleCopyText(privateKeyInput, 'priv')} className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    {copiedKey === 'priv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>Salin</span>
                  </button>
                </div>
                <textarea
                  value={privateKeyInput}
                  onChange={(e) => setPrivateKeyInput(e.target.value)}
                  rows={5}
                  placeholder="-----BEGIN PRIVATE KEY-----"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[9px] font-mono text-slate-400 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>
        </div>

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

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          <KeyRound className="w-4 h-4" />
          {isProcessing ? 'Memproses...' : mode === 'encrypt' ? 'Enkripsi (Kunci Publik)' : 'Dekripsi (Kunci Privat)'}
        </button>

        {encryptionResult && (
          <div className="space-y-4 pt-2">

            <CipherResultDisplay
              title="Hasil Ciphertext RSA-OAEP"
              value={encryptionResult.ciphertextBase64}
              themeColor="purple"
              threshold={120}
              downloadFilename="rsa-ciphertext-payload.txt"
              subInfo={
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>{encryptionResult.chunksCount} Blok Chunk</span>
                  <span>Modulus: 2048-bit (256 Byte/Blok)</span>
                </div>
              }
            />

            <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-slate-200">Alur Proses Enkripsi RSA-OAEP 2048</h3>
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[11px] text-purple-400 hover:underline"
                >
                  {showDetails ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showDetails && (
                <div className="space-y-3 font-mono text-xs pt-1">

                  {/* Langkah 1 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 1
                      </span>
                      <span className="text-slate-400 text-[10px]">Data Segmentation</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Pembagian Blok (Chunking Teks)</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Plaintext berukuran {inputText.length} karakter dibagi menjadi blok-blok maksimal 190 byte agar muat dienkripsi dengan modulus 2048-bit (256 byte).
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">Kapasitas Blok</span>
                        <span className="text-purple-300 font-bold">190 Byte</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">Jumlah Blok</span>
                        <span className="text-slate-200 font-bold">{encryptionResult.chunksCount} Chunk</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-purple-800/40 text-center">
                        <span className="text-slate-500 block text-[9px]">Ukuran Terenkripsi</span>
                        <span className="text-purple-300 font-bold">256 Byte/Blok</span>
                      </div>
                    </div>
                  </div>

                  {/* Langkah 2 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 2
                      </span>
                      <span className="text-slate-400 text-[10px]">Probabilistic Padding</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Penerapan OAEP (Optimal Asymmetric Encryption Padding)</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Menggunakan SHA-256 dan Mask Generation Function (MGF1) untuk menambahkan keacakan (*seed random*), mencegah serangan Coppersmith dan chosen-ciphertext.
                    </p>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 text-[10px]">
                      <span className="text-slate-500 block">Struktur Blok Padding (256 Byte):</span>
                      <span className="text-purple-300 font-mono block break-all font-semibold">0x00 ∥ maskedSeed (32B) ∥ maskedDB (223B)</span>
                    </div>
                  </div>

                  {/* Langkah 3 */}
                  <div className="bg-slate-900/90 border border-purple-700/40 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 3
                      </span>
                      <span className="text-purple-400 text-[10px] font-bold">Modular Arithmetic</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Eksponensial Modular Kunci Publik</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Tiap blok ber-padding $M$ dipangkatkan eksponen publik $e = 65537$ modulo $n$ untuk menghasilkan nilai ciphertext integer $C$.
                    </p>
                    <div className="flex items-center justify-between bg-purple-950/30 border border-purple-700/30 p-2.5 rounded-lg">
                      <span className="text-purple-300 text-[11px] font-bold">Rumus: C_i = (M_padded)^e mod n</span>
                      <span className="text-[10px] text-purple-400 font-mono bg-purple-900/40 px-2 py-0.5 rounded border border-purple-600/40">e = 65537</span>
                    </div>
                  </div>

                  {/* Langkah 4 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 4
                      </span>
                      <span className="text-slate-400 text-[10px]">Assembly & Encoding</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Pengemasan Payload JSON Base64</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Seluruh ciphertext chunk dikemas ke dalam payload JSON standar <span className="font-mono text-purple-300">RSA-OAEP-2048</span> lalu di-encode menjadi string Base64 yang ringkas.
                    </p>
                  </div>

                  {/* Tracing Matematika Detail */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-purple-400" /> Tracing Matematika per Blok
                    </div>
                    {encryptionResult.chunkTraces.map((trace) => (
                      <div key={trace.chunkIndex} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-purple-400/80 text-[10px] font-bold border-b border-slate-800/80 pb-2">
                          <span className="text-purple-300">Blok #{trace.chunkIndex} ({trace.plainByteLength} Byte)</span>
                          <span className="text-slate-500 text-[9px]">{trace.cipherLengthBytes} Byte Cipher</span>
                        </div>

                        <div className="space-y-2 text-[9px] font-mono">
                          <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block mb-1">Plaintext M (Integer Hex):</span>
                            <p className="text-slate-300 font-bold break-all max-h-16 overflow-y-auto custom-scrollbar">{trace.mathTrace?.mInteger}</p>
                          </div>

                          <div className="bg-slate-950/80 p-2 rounded border border-purple-900/50">
                            <span className="text-purple-400 block mb-1">C = (M_padded)^65537 mod n (Integer):</span>
                            <p className="text-purple-300 font-bold break-all max-h-16 overflow-y-auto custom-scrollbar">{trace.mathTrace?.cInteger}</p>
                          </div>

                          <div className="bg-slate-950/80 p-2 rounded border border-slate-800/80 flex items-center justify-between">
                            <span className="text-slate-500">Hasil Blok Base64:</span>
                            <span className="text-slate-300 truncate max-w-[200px]" title={trace.cipherBase64}>{trace.cipherBase64}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {decryptionResult && decryptSteps && (
          <div className="space-y-4 pt-2">

            <CipherResultDisplay
              title="Plaintext Terpulihkan"
              value={decryptionResult.plaintext}
              themeColor="purple"
              threshold={120}
              downloadFilename="rsa-decrypted-plaintext.txt"
              subInfo={
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>{decryptionResult.plaintext.length} Karakter</span>
                  <span>{decryptSteps.chunksCount} Blok Chunk</span>
                </div>
              }
            />

            <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <UnlockKeyhole className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-slate-200">Alur Proses Dekripsi RSA-OAEP 2048</h3>
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[11px] text-purple-400 hover:underline"
                >
                  {showDetails ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showDetails && (
                <div className="space-y-3 font-mono text-xs pt-1">

                  {/* Langkah 1 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 1
                      </span>
                      <span className="text-slate-400 text-[10px]">Payload Parsing</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Dekode Base64 & Pemisahan Blok</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      String Base64 di-decode menjadi objek payload JSON untuk mengekstrak {decryptSteps.chunksCount} blok ciphertext biner masing-masing 256 byte.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">Input Payload</span>
                        <span className="text-purple-300 font-bold">{decryptSteps.inputLength} Karakter</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">Jumlah Blok Chunk</span>
                        <span className="text-slate-200 font-bold">{decryptSteps.chunksCount} Blok</span>
                      </div>
                    </div>
                  </div>

                  {/* Langkah 2 */}
                  <div className="bg-slate-900/90 border border-purple-700/40 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 2
                      </span>
                      <span className="text-purple-400 text-[10px] font-bold">Modular Inversion</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Eksponensial Modular Kunci Privat (CRT)</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Menghitung nilai plaintext ber-padding dengan memangkatkan tiap blok terhadap eksponen privat $d$ modulo $n$ dengan akselerasi Chinese Remainder Theorem.
                    </p>
                    <div className="flex items-center justify-between bg-purple-950/30 border border-purple-700/30 p-2.5 rounded-lg">
                      <span className="text-purple-300 text-[11px] font-bold">Rumus: M_padded = C^d mod n</span>
                      <span className="text-[10px] text-purple-400 font-mono">Modulus 2048-bit</span>
                    </div>
                  </div>

                  {/* Langkah 3 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 3
                      </span>
                      <span className="text-slate-400 text-[10px]">OAEP Unpadding</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Verifikasi Masking & Ekstraksi Plaintext</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Memulihkan *seed* acak dan *Data Block (DB)* melalui pembalikan fungsi MGF1 SHA-256, lalu memverifikasi header byte 0x00 serta pemisah 0x01.
                    </p>
                    <div className="flex items-center gap-2 bg-purple-950/20 border border-purple-700/30 p-2.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-purple-300 text-[11px]">Integritas OAEP valid pada semua blok. Tidak ada anomali padding.</span>
                    </div>
                  </div>

                  {/* Langkah 4 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                        Langkah 4
                      </span>
                      <span className="text-slate-400 text-[10px]">Plaintext Recovery</span>
                    </div>
                    <p className="text-slate-200 font-bold text-xs">Rekonstruksi & Penggabungan Teks Asli</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Menggabungkan seluruh array byte dari tiap blok dan mendekodenya kembali ke karakter UTF-8 seutuhnya.
                    </p>
                  </div>

                  {/* Detail Per Blok */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-purple-400" /> Hasil Validasi Per Blok
                    </div>
                    {decryptionResult.traces.map((trace) => (
                      <DecryptBlockTrace key={trace.chunkIndex} chunkIndex={trace.chunkIndex} status={trace.status} />
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