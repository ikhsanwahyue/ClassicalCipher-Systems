'use client';

import React, { useState } from 'react';
import MobileShell from '@/components/MobileShell';
import {
  encryptRijndael,
  decryptRijndael,
  RijndaelEncryptionResult,
} from '@/lib/rijndael';
import {
  Lock,
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
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function RijndaelPage() {
  // State mode: 'encrypt' untuk enkripsi, 'decrypt' untuk dekripsi
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // State teks input yang akan diproses
  const [inputText, setInputText] = useState('RIJNDAEL ADVANCED ENCRYPTION STANDARD AES-256');

  // State passphrase (kata sandi) simetris yang digunakan sebagai bahan kunci AES-256
  const [passphrase, setPassphrase] = useState('SimetrisKey2026!');

  // State format output: 'base64' (standar transfer data) atau 'hex' (representasi byte)
  const [format, setFormat] = useState<'base64' | 'hex'>('base64');

  // State hasil enkripsi yang memuat ciphertext, matriks status, dan komponen GCM
  const [resultData, setResultData] = useState<RijndaelEncryptionResult | null>(null);

  // State teks plaintext yang berhasil dipulihkan setelah dekripsi
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  // State pesan error jika enkripsi/dekripsi gagal (misal: kunci salah atau format tidak valid)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State tanda salin ke clipboard
  const [copied, setCopied] = useState(false);

  // State untuk tab aktif pada visualisasi 4 transformasi putaran AES
  const [activeStepTab, setActiveStepTab] = useState<'sub' | 'shift' | 'mix' | 'key'>('sub');

  // Fungsi utama: menjalankan enkripsi atau dekripsi AES-256 secara asinkron via Web Crypto API
  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setErrorMessage(null);

    try {
      if (mode === 'encrypt') {
        const res = await encryptRijndael(inputText, passphrase);
        setResultData(res);
        setDecryptedText(null);
      } else {
        const plain = await decryptRijndael(inputText, passphrase);
        setDecryptedText(plain);
        setResultData(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memproses AES/Rijndael.');
      }
    }
  };

  // Fungsi untuk menyalin teks tertentu ke clipboard dengan umpan balik ikon sementara
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fungsi untuk membangkitkan passphrase acak 16 karakter (huruf, angka, simbol)
  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassphrase(key);
  };

  return (
    <MobileShell title="Rijndael (AES)" subtitle="Kunci Simetris Modern (AES-256)">
      <div className="space-y-4">

        {/* Kartu penjelasan algoritma Rijndael/AES-256 untuk konteks presentasi */}
        <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Rijndael (AES-256)</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Algoritma kriptografi modern berjenis kunci simetri berbasis blok (symmetric-key block cipher) yang mengamankan data melalui serangkaian putaran transformasi matriks byte menggunakan kunci bersama yang sangat tangguh.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol pilihan mode: Enkripsi (plaintext → AES-256) atau Dekripsi (AES-256 → plaintext) */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('encrypt');
              setResultData(null);
              setDecryptedText(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'encrypt'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
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
              setDecryptedText(null);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'decrypt'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Dekripsi
          </button>
        </div>

        {/* Area input teks: plaintext saat enkripsi, ciphertext Base64/Hex saat dekripsi */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64 / Hex)'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={
              mode === 'encrypt'
                ? 'Ketik teks yang ingin diamankan...'
                : 'Tempel ciphertext Base64 atau Hex di sini...'
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-mono"
          />
        </div>

        {/* Input passphrase simetris: digunakan sebagai bahan derivasi kunci AES-256 via SHA-256 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              Kunci Sandi Rahasia (Simetris)
            </label>
            <button
              onClick={generateRandomKey}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Acak Sandi
            </button>
          </div>
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Masukkan kata kunci simetris..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Pesan error ditampilkan jika proses gagal, misalnya kunci salah atau data rusak */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tombol utama untuk menjalankan enkripsi atau dekripsi AES-256 */}
        <button
          onClick={handleProcess}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Lock className="w-4 h-4" />
          {mode === 'encrypt' ? 'Jalankan Enkripsi' : 'Jalankan Dekripsi AES-256'}
        </button>

        {/* Area hasil enkripsi: muncul setelah enkripsi berhasil dijalankan */}
        {resultData && (
          <div className="space-y-4 pt-2">

            {/* Kartu output ciphertext dengan toggle format Base64 / Hex */}
            <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">Hasil Ciphertext AES-256-GCM</span>
                </div>
                {/* Toggle untuk memilih format tampilan: Base64 (lebih ringkas) atau Hex (setiap byte terlihat) */}
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                  <button
                    onClick={() => setFormat('base64')}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      format === 'base64' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Base64
                  </button>
                  <button
                    onClick={() => setFormat('hex')}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      format === 'hex' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Hex
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-xs font-mono text-blue-300 break-all select-all font-semibold leading-relaxed">
                  {format === 'base64' ? resultData.ciphertextBase64 : resultData.ciphertextHex}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    handleCopy(
                      format === 'base64' ? resultData.ciphertextBase64 : resultData.ciphertextHex
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Ciphertext ({format.toUpperCase()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visualisasi State Matrix 4×4: menampilkan blok pertama 16 byte plaintext dalam format Rijndael */}
            <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">
                    Visualisasi State Matrix 4 x 4 (Blok Pertama 16-Byte)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  128-bit Block
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Teks disusun dalam kolom-kolom matriks 4 × 4 sesuai spesifikasi Rijndael / AES. Setiap sel memuat nilai Byte dalam format Hexadecimal dan representasi karakternya :
              </p>

              <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                {resultData.stateMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="bg-slate-900 border border-blue-500/20 rounded-xl p-2 flex flex-col items-center justify-center hover:border-blue-400 transition-colors"
                    >
                      <span className="text-[9px] text-slate-500 font-bold">
                        S({rIdx},{cIdx})
                      </span>
                      <span className="text-xs font-bold text-blue-300 mt-0.5">
                        0x{cell.hex}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        '{cell.char}'
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Simulasi 4 transformasi putaran Rijndael yang berjalan dalam setiap putaran AES */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">
                    Detail Simulasi 4 Transformasi Putaran (Rounds)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">14 Putaran Total</span>
              </div>

              {/* Tab untuk berpindah antara 4 transformasi: SubBytes, ShiftRows, MixColumns, AddRoundKey */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px]">
                <button
                  onClick={() => setActiveStepTab('sub')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeStepTab === 'sub'
                      ? 'bg-blue-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SubBytes
                </button>
                <button
                  onClick={() => setActiveStepTab('shift')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeStepTab === 'shift'
                      ? 'bg-blue-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ShiftRows
                </button>
                <button
                  onClick={() => setActiveStepTab('mix')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeStepTab === 'mix'
                      ? 'bg-blue-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MixCols
                </button>
                <button
                  onClick={() => setActiveStepTab('key')}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeStepTab === 'key'
                      ? 'bg-blue-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  AddRoundKey
                </button>
              </div>

              {/* Panel detail penjelasan dan hasil matriks untuk setiap transformasi yang dipilih */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                {activeStepTab === 'sub' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">SubBytes (Substitusi S-Box)</span>
                      <span className="text-[10px] text-slate-500">Non-linear Confusion</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Setiap byte pada State Matrix diganti dengan nilai byte baru dari tabel substitusi non-linear S-Box pada lapangan hingga Galois GF(2^8).
                    </p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterSubBytes.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-blue-500/20 p-1.5 rounded-lg text-xs font-bold text-blue-300">
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {activeStepTab === 'shift' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">ShiftRows (Permutasi Siklik Baris)</span>
                      <span className="text-[10px] text-slate-500">Row Diffusion</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Baris 0 tidak digeser, Baris 1 digeser 1 byte ke kiri, Baris 2 digeser 2 byte ke kiri, dan Baris 3 digeser 3 byte ke kiri secara siklik.
                    </p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterShiftRows.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-blue-500/20 p-1.5 rounded-lg text-xs font-bold text-blue-300">
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {activeStepTab === 'mix' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">MixColumns (Difusi Kolom Polinomial)</span>
                      <span className="text-[10px] text-slate-500">Column Diffusion</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Setiap kolom matriks dikalikan dengan matriks konstan sirkulan pada polinomial modulo x^4 + 1 untuk menyebarkan bit secara maksimal.
                    </p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterMixColumns.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-blue-500/20 p-1.5 rounded-lg text-xs font-bold text-blue-300">
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {activeStepTab === 'key' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">AddRoundKey (Operasi XOR Kunci Putaran)</span>
                      <span className="text-[10px] text-slate-500">Key Injection</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Setiap byte pada State Matrix diganti dengan nilai byte baru dari tabel substitusi non-linear S-Box pada lapangan hingga Galois GF(2^8)
                    </p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterAddRoundKey.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-emerald-500/30 p-1.5 rounded-lg text-xs font-bold text-emerald-300">
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Inspeksi komponen teknis kemasan AES-256-GCM: IV, kunci turunan, dan tag autentikasi */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-200">
                Inspeksi Komponen Kemasan AES-256-GCM (Authenticated)
              </h3>

              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                {/* IV (Initialization Vector): nilai acak 96-bit yang unik untuk setiap sesi enkripsi */}
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-blue-400 font-bold">1. Initialization Vector (IV 96-bit / 12 Byte):</span>
                    <span className="text-[10px]">Unik per Enkripsi</span>
                  </div>
                  <p className="text-slate-300 break-all text-[11px]">{resultData.ivHex}</p>
                </div>

                {/* Kunci 256-bit: hasil derivasi SHA-256 dari passphrase, digunakan langsung oleh AES */}
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-blue-400 font-bold">2. Kunci 256-bit (Derivasi SHA-256 32 Byte):</span>
                    <span className="text-[10px]">Symmetric Key</span>
                  </div>
                  <p className="text-slate-300 break-all text-[11px]">{resultData.keyBytesHex}</p>
                </div>

                {/* Authentication Tag: tanda tangan GMAC 128-bit untuk memastikan integritas data */}
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-blue-400 font-bold">3. Authentication Tag (128-bit / 16 Byte GMAC):</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Integritas Terjamin</span>
                  </div>
                  <p className="text-emerald-300 break-all text-[11px]">{resultData.authTagHex}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Area hasil dekripsi: muncul ketika plaintext berhasil dipulihkan dari ciphertext */}
        {decryptedText && (
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Plaintext Asli Berhasil Dipulihkan</span>
              </div>
              <button
                onClick={() => handleCopy(decryptedText)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>Salin</span>
              </button>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <p className="text-sm font-mono text-emerald-300 break-all select-all font-semibold">
                {decryptedText}
              </p>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
