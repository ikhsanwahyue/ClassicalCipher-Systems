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
  // State mode: 'encrypt' menggunakan Kunci Publik, 'decrypt' menggunakan Kunci Privat
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // State teks input: plaintext untuk enkripsi, ciphertext Base64 untuk dekripsi
  const [inputText, setInputText] = useState('PESAN RAHASIA ASIMETRIS KUNCI PUBLIK RSA-2048');

  // State pasangan kunci RSA yang digenerate secara otomatis saat halaman pertama dibuka
  const [keys, setKeys] = useState<RsaKeyPairPem | null>(null);

  // State teks kunci publik PEM yang dapat diedit oleh pengguna
  const [publicKeyInput, setPublicKeyInput] = useState('');

  // State teks kunci privat PEM yang dapat diedit oleh pengguna
  const [privateKeyInput, setPrivateKeyInput] = useState('');

  // State penanda apakah pasangan kunci RSA sedang dalam proses pembuatan
  const [isGenerating, setIsGenerating] = useState(false);

  // State penanda apakah proses enkripsi/dekripsi RSA sedang berjalan
  const [isProcessing, setIsProcessing] = useState(false);

  // State hasil enkripsi RSA: ciphertext, parameter matematis, dan tracing per blok
  const [encryptionResult, setEncryptionResult] = useState<RsaEncryptionResult | null>(null);

  // State hasil dekripsi RSA: plaintext yang berhasil dipulihkan dan laporan per blok
  const [decryptionResult, setDecryptionResult] = useState<{ plaintext: string; chunksCount: number; traces: { chunkIndex: number; status: string }[] } | null>(null);

  // State pesan error yang muncul jika kunci tidak valid atau operasi RSA gagal
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State untuk menandai jenis teks yang baru disalin: 'pub', 'priv', atau 'res'
  const [copiedKey, setCopiedKey] = useState<'pub' | 'priv' | 'res' | null>(null);

  // State untuk menampilkan atau menyembunyikan panel detail matematis RSA
  const [showMathDetails, setShowMathDetails] = useState(true);

  // Saat komponen pertama kali dimuat, langsung bangkitkan pasangan kunci RSA 2048-bit
  useEffect(() => {
    handleGenerateKeys();
  }, []);

  // Fungsi untuk membangkitkan pasangan kunci RSA baru menggunakan Web Crypto API
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

  // Fungsi utama: menjalankan enkripsi (dengan kunci publik) atau dekripsi (dengan kunci privat)
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

  // Fungsi untuk menyalin teks ke clipboard dengan umpan balik visual per jenis kunci/hasil
  const handleCopyText = (text: string, type: 'pub' | 'priv' | 'res') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <MobileShell title="Kunci Publik (RSA)" subtitle="Kunci Nirsimetri Modern (RSA-OAEP 2048)">
      <div className="space-y-4">

        {/* Kartu penjelasan algoritma RSA asimetris untuk konteks presentasi */}
        <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Kunci Publik (RSA)</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Algoritma kriptografi modern berjenis kunci publik atau asimetris (asymmetric cryptography) yang memanfaatkan sepasang kunci berbeda kunci publik untuk mengenkripsi dan kunci privat untuk mendeskripsikan pesan.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol pilihan mode: Enkripsi dengan Kunci Publik atau Dekripsi dengan Kunci Privat */}
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
            Enkripsi
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
            Dekripsi
          </button>
        </div>

        {/* Panel manajemen pasangan kunci RSA: tampilkan, edit, atau bangkitkan ulang kunci */}
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
            {/* Area kunci publik: digunakan untuk mengenkripsi — boleh dibagikan secara terbuka */}
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

            {/* Area kunci privat: digunakan untuk mendekripsi — HARUS dijaga kerahasiaannya */}
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

        {/* Area input teks: plaintext (pesan asli) untuk enkripsi, ciphertext RSA untuk dekripsi */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext RSA (Payload Base64)'}</span>
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

        {/* Pesan error: muncul jika kunci tidak cocok, format salah, atau operasi RSA gagal */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tombol utama untuk menjalankan enkripsi atau dekripsi RSA */}
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

        {/* Area hasil enkripsi RSA: ciphertext, parameter matematis, dan tracing per blok */}
        {encryptionResult && (
          <div className="space-y-4 pt-2">

            {/* Kartu output ciphertext RSA dalam format Base64 yang siap dikirim */}
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

            {/* Parameter matematis RSA: ukuran kunci, eksponen publik, hash, dan skema padding */}
            <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-200">
                    Parameter Matematis Kriptografi Asimetris RSA
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  FIPS Compliant
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {/* Modulus n: hasil perkalian dua bilangan prima besar p dan q */}
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                  <span className="text-slate-500 text-[10px] block">Modulus (n = p × q):</span>
                  <span className="text-purple-300 font-bold">{encryptionResult.mathParameters.keySize}</span>
                </div>
                {/* Eksponen publik e = 65537: nilai standar Fermat F4 yang umum digunakan */}
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

            {/* Tracing per blok: rincian pemrosesan setiap potongan teks dengan operasi C = M^e mod n */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-200">
                    Rincian Pemrosesan
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {encryptionResult.chunksCount} Blok Aktif
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {encryptionResult.chunkTraces.map((trace) => (
                  <div
                    key={trace.chunkIndex}
                    className="bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 transition-colors rounded-xl p-3.5 space-y-2 shadow-inner"
                  >
                    {/* Header per blok */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold border border-purple-500/30">
                          {trace.chunkIndex}
                        </span>
                        <span className="font-bold text-slate-200 text-xs">
                          Blok Data ({trace.plainByteLength} Byte Asli)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 font-mono">
                        Padding: {trace.cipherLengthBytes} Byte
                      </span>
                    </div>

                    {/* Konten detail operasi */}
                    <div className="grid grid-cols-1 gap-1.5 text-[11px] pt-0.5">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 w-24">Teks Masukan:</span>
                        <span className="text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60 truncate flex-1">
                          &quot;{trace.plainSnippet}&quot;
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 shrink-0 w-24">Formula / Aksi:</span>
                        <span className="text-purple-300 font-semibold">{trace.operation}</span>
                      </div>
                    </div>

                    {/* Baris keluaran Base64 */}
                    <div className="pt-1 border-t border-slate-800/40 flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-500 shrink-0">Output Base64:</span>
                      <span className="text-purple-300/90 bg-slate-950 px-2 py-1 rounded border border-slate-800/80 truncate font-mono select-all flex-1 text-right">
                        {trace.cipherBase64}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Area hasil dekripsi RSA: plaintext yang berhasil dipulihkan dan laporan verifikasi blok */}
        {decryptionResult && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Pesan Asli Berhasil Didekripsi</span>
                </div>
                <button
                  onClick={() => handleCopyText(decryptionResult.plaintext, 'res')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
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

            {/* Laporan verifikasi: status pemulihan setiap blok RSA dengan operasi M = C^d mod n */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-200">
                Laporan Verifikasi Pemulihan Blok Asimetris (M_i = C_i^d mod n)
              </h3>
              <div className="space-y-1 text-xs font-mono">
                {decryptionResult.traces.map((t) => (
                  <div key={t.chunkIndex} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-purple-400 font-bold">Blok #{t.chunkIndex}:</span> {t.status}
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
