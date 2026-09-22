'use client';

import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Unlock,
  Upload,
  Download,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { encryptFile, decryptFile, EncryptedFilePackage, DecryptedFilePackage } from '@/lib/file-crypto';

export default function FileCryptoPage() {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Encryption State
  const [encFile, setEncFile] = useState<File | null>(null);
  const [encPassword, setEncPassword] = useState('FileSecret2026');
  const [encResult, setEncResult] = useState<EncryptedFilePackage | null>(null);

  // Decryption State
  const [decFile, setDecFile] = useState<File | null>(null);
  const [decPassword, setDecPassword] = useState('FileSecret2026');
  const [decResult, setDecResult] = useState<DecryptedFilePackage | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcessEncrypt = async () => {
    if (!encFile || !encPassword) return;
    setError('');
    setLoading(true);
    setEncResult(null);

    try {
      const res = await encryptFile(encFile, encPassword);
      setEncResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal mengenkripsi berkas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProcessDecrypt = async () => {
    if (!decFile || !decPassword) return;
    setError('');
    setLoading(true);
    setDecResult(null);

    try {
      const res = await decryptFile(decFile, decPassword);
      setDecResult(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal mendekripsi berkas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MobileShell title="File Cryptography" subtitle="AES-256 Authenticated Vault">
      <div className="space-y-4">
        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('encrypt');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'encrypt'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enkripsi Berkas</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('decrypt');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'decrypt'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Dekripsi Berkas</span>
          </button>
        </div>

        {/* ENCRYPT TAB */}
        {activeTab === 'encrypt' && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                1. Pilih Berkas / Dokumen
              </label>

              <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 transition-colors group">
                <input
                  type="file"
                  onChange={(e) => {
                    setEncFile(e.target.files?.[0] || null);
                    setEncResult(null);
                  }}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors mb-2" />
                <span className="text-xs text-slate-300 font-medium">
                  {encFile ? encFile.name : 'Pilih dokumen (PDF, TXT, DOCX, ZIP)'}
                </span>
                {encFile && (
                  <span className="text-[10px] text-cyan-400 font-mono mt-0.5">
                    {(encFile.size / 1024).toFixed(2)} KB
                  </span>
                )}
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Kata Sandi Kunci Enkripsi (AES-256)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={encPassword}
                    onChange={(e) => setEncPassword(e.target.value)}
                    placeholder="Masukkan password kunci"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleProcessEncrypt}
                disabled={loading || !encFile || !encPassword}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Mengenkripsi Berkas...' : 'Enkripsi & Kunci Berkas'}</span>
              </button>
            </div>

            {/* Encrypt Result Card */}
            {encResult && (
              <div className="bg-slate-800/90 border border-cyan-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Berkas Berhasil Terenkripsi Aman!</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Enkripsi:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{encResult.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ukuran:</span>
                    <span className="font-mono text-slate-300">{(encResult.fileSize / 1024).toFixed(2)} KB</span>
                  </div>
                </div>

                <button
                  onClick={() => downloadBlob(encResult.encryptedBlob, encResult.fileName)}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas Terenkripsi (.enc)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* DECRYPT TAB */}
        {activeTab === 'decrypt' && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                1. Pilih Berkas Terenkripsi (.enc)
              </label>

              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 transition-colors group">
                <input
                  type="file"
                  onChange={(e) => {
                    setDecFile(e.target.files?.[0] || null);
                    setDecResult(null);
                  }}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors mb-2" />
                <span className="text-xs text-slate-300 font-medium">
                  {decFile ? decFile.name : 'Pilih berkas format .enc'}
                </span>
                {decFile && (
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    {(decFile.size / 1024).toFixed(2)} KB
                  </span>
                )}
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Kata Sandi Kunci Dekripsi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={decPassword}
                    onChange={(e) => setDecPassword(e.target.value)}
                    placeholder="Masukkan password kunci"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleProcessDecrypt}
                disabled={loading || !decFile || !decPassword}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Mendekripsi Berkas...' : 'Buka Kunci & Dekripsi Berkas'}</span>
              </button>
            </div>

            {/* Decrypt Result Card */}
            {decResult && (
              <div className="bg-slate-800/90 border border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>Berkas Berhasil Dipulihkan!</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Asli:</span>
                    <span className="font-mono text-emerald-300 font-semibold">{decResult.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipe MIME:</span>
                    <span className="font-mono text-slate-300">{decResult.mimeType}</span>
                  </div>
                </div>

                <button
                  onClick={() => downloadBlob(decResult.decryptedBlob, decResult.fileName)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen Asli ({decResult.fileName})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
