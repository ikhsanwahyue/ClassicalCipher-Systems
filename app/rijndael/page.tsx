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
  ShieldCheck,
  Cpu,
  Info,
  Grid,
  ArrowRight,
  KeyRound,
  UnlockKeyhole,
  AlertTriangle,
  CheckCircle2,
  Hash,
} from 'lucide-react';

export default function RijndaelPage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('RIJNDAEL ADVANCED ENCRYPTION STANDARD AES-256');
  const [passphrase, setPassphrase] = useState('SimetrisKey2026!');
  const [format, setFormat] = useState<'base64' | 'hex'>('base64');
  const [resultData, setResultData] = useState<RijndaelEncryptionResult | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [decryptSteps, setDecryptSteps] = useState<{
    inputLength: number;
    ivHex: string;
    cipherHex: string;
    authTagHex: string;
    keyHex: string;
    passphrase: string;
    plaintext: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'sub' | 'shift' | 'mix' | 'key'>('sub');

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setErrorMessage(null);
    setDecryptSteps(null);

    try {
      if (mode === 'encrypt') {
        const res = await encryptRijndael(inputText, passphrase);
        setResultData(res);
        setDecryptedText(null);
      } else {
        // Sebelum dekripsi, tampilkan proses
        const enc = new TextEncoder();
        const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passphrase || 'DEFAULT_KEY_AES'));
        const keyHex = Array.from(new Uint8Array(rawKeyData))
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');

        // Parse IV dari input
        let ivHexDisplay = 'N/A';
        let cipherHexDisplay = 'N/A';
        let authTagHexDisplay = 'N/A';
        try {
          const cleanInput = inputText.trim();
          let combined: Uint8Array;
          if (cleanInput.includes(' ') || /^[0-9a-fA-F]{24,}$/.test(cleanInput)) {
            const cleanHex = cleanInput.replace(/[^0-9a-fA-F]/g, '');
            combined = new Uint8Array(cleanHex.length / 2);
            for (let i = 0; i < cleanHex.length; i += 2) {
              combined[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
            }
          } else {
            const binaryString = atob(cleanInput);
            combined = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              combined[i] = binaryString.charCodeAt(i);
            }
          }
          if (combined.length >= 13) {
            const iv = combined.slice(0, 12);
            const cipherAndTag = combined.slice(12);
            const authTag = cipherAndTag.slice(cipherAndTag.length - 16);
            const cipherOnly = cipherAndTag.slice(0, cipherAndTag.length - 16);
            ivHexDisplay = Array.from(iv).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
            authTagHexDisplay = Array.from(authTag).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
            cipherHexDisplay = Array.from(cipherOnly.slice(0, 16)).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ') + (cipherOnly.length > 16 ? ' ...' : '');
          }
        } catch {}

        const plain = await decryptRijndael(inputText, passphrase);
        setDecryptedText(plain);
        setDecryptSteps({
          inputLength: inputText.trim().length,
          ivHex: ivHexDisplay,
          cipherHex: cipherHexDisplay,
          authTagHex: authTagHexDisplay,
          keyHex,
          passphrase: passphrase || 'DEFAULT_KEY_AES',
          plaintext: plain,
        });
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

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Header info */}
        <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-lg">
          <h2 className="text-base font-bold text-slate-100 mt-1">Rijndael (AES-256-GCM)</h2>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Algoritma block cipher simetri modern. Enkripsi 14 putaran (SubBytes → ShiftRows → MixColumns → AddRoundKey) dengan autentikasi GHASH 128-bit.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => { setMode('encrypt'); setResultData(null); setDecryptedText(null); setDecryptSteps(null); setErrorMessage(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'encrypt' ? 'bg-blue-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Enkripsi
          </button>
          <button
            onClick={() => { setMode('decrypt'); setResultData(null); setDecryptedText(null); setDecryptSteps(null); setErrorMessage(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'decrypt' ? 'bg-blue-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" /> Dekripsi
          </button>
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64 / Hex)'}</span>
            <span className="text-[11px] text-slate-500 font-mono">{inputText.length} karakter</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={mode === 'encrypt' ? 'Ketik teks yang ingin diamankan...' : 'Tempel ciphertext Base64 atau Hex di sini...'}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-mono"
          />
        </div>

        {/* Passphrase */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Kunci Sandi Rahasia (Simetris)</label>
            <button onClick={generateRandomKey} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
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
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Lock className="w-4 h-4" />
          {mode === 'encrypt' ? 'Jalankan Enkripsi AES-256' : 'Jalankan Dekripsi AES-256'}
        </button>

        {/* ──────────── ENKRIPSI HASIL ──────────── */}
        {resultData && (
          <div className="space-y-4 pt-2">

            {/* Ciphertext output */}
            <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">Hasil Ciphertext AES-256-GCM</span>
                </div>
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                  <button onClick={() => setFormat('base64')} className={`px-2 py-0.5 text-[10px] font-mono rounded ${format === 'base64' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Base64</button>
                  <button onClick={() => setFormat('hex')} className={`px-2 py-0.5 text-[10px] font-mono rounded ${format === 'hex' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Hex</button>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-xs font-mono text-blue-300 break-all select-all font-semibold leading-relaxed">
                  {format === 'base64' ? resultData.ciphertextBase64 : resultData.ciphertextHex}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(format === 'base64' ? resultData.ciphertextBase64 : resultData.ciphertextHex)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Tersalin</span></> : <><Copy className="w-3.5 h-3.5 text-slate-400" /><span>Salin ({format.toUpperCase()})</span></>}
                </button>
              </div>
            </div>

            {/* Alur Proses Enkripsi Step-by-Step */}
            <div className="bg-slate-950/90 border border-blue-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-200">Alur Proses Enkripsi AES-256-GCM</h3>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                {/* Step 1 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] border border-blue-500/30 shrink-0">1</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-blue-300 font-bold">Derive Key: SHA-256(Passphrase) → 256-bit Key</p>
                    <p className="text-slate-500">SHA-256(&quot;{passphrase}&quot;) →</p>
                    <p className="text-slate-300 break-all text-[10px]">{resultData.keyBytesHex}</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] border border-blue-500/30 shrink-0">2</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-blue-300 font-bold">Generate IV Acak (Nonce 96-bit / 12 Byte)</p>
                    <p className="text-slate-500">IV unik setiap sesi → ciphertext selalu berbeda</p>
                    <p className="text-slate-300 break-all">{resultData.ivHex}</p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] border border-blue-500/30 shrink-0">3</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-blue-300 font-bold">Susun State Matrix 4×4 (Blok 16-byte)</p>
                    <p className="text-slate-500">Column-major: byte 0→S(0,0), byte 1→S(1,0), dst.</p>
                    <p className="text-slate-400 text-[10px]">Blok pertama plaintext ditampilkan di bawah ↓</p>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] border border-blue-500/30 shrink-0">4</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-blue-300 font-bold">14 Putaran Transformasi Rijndael</p>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {['SubBytes (S-Box)', 'ShiftRows (Siklik)', 'MixColumns (GF2⁸)', 'AddRoundKey (XOR)'].map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="w-4 h-4 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">{i + 1}</span>
                          {s}
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-500 text-[10px]">Putaran ke-14: tanpa MixColumns</p>
                  </div>
                </div>
                {/* Step 5 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-emerald-800/40">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/30 shrink-0">5</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-emerald-300 font-bold">Output: Base64(IV ∥ Ciphertext ∥ AuthTag)</p>
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      <div className="bg-slate-950 border border-slate-800 rounded p-1.5 text-center">
                        <p className="text-slate-500">IV</p>
                        <p className="text-blue-300 font-bold">12 byte</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded p-1.5 text-center">
                        <p className="text-slate-500">Cipher</p>
                        <p className="text-blue-300 font-bold">n byte</p>
                      </div>
                      <div className="bg-slate-950 border border-emerald-800/40 rounded p-1.5 text-center">
                        <p className="text-slate-500">Auth Tag</p>
                        <p className="text-emerald-300 font-bold">16 byte</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[10px]">Auth Tag = GHASH(H, ciphertext), H = AES(Key, 0¹²⁸)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* State Matrix */}
            <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">State Matrix 4×4 (Blok Pertama 16-Byte)</h3>
                </div>
                <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Column-Major</span>
              </div>
              <p className="text-[11px] text-slate-400">Pengisian: byte 0→S(0,0), byte 1→S(1,0), byte 2→S(2,0), byte 3→S(3,0), byte 4→S(0,1), dst.</p>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                {resultData.stateMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`} className="bg-slate-900 border border-blue-500/20 rounded-xl p-2 flex flex-col items-center justify-center hover:border-blue-400 transition-colors">
                      <span className="text-[9px] text-slate-500 font-bold">S({rIdx},{cIdx})</span>
                      <span className="text-xs font-bold text-blue-300 mt-0.5">0x{cell.hex}</span>
                      <span className="text-[10px] text-slate-400 font-sans">'{cell.char}'</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Simulasi 4 Transformasi */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">Simulasi 4 Transformasi Per Putaran</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">14 Putaran</span>
              </div>

              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px]">
                {(['sub', 'shift', 'mix', 'key'] as const).map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveStepTab(tab)}
                    className={`py-1.5 rounded-lg font-bold transition-all ${activeStepTab === tab ? 'bg-blue-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {['SubBytes', 'ShiftRows', 'MixCols', 'AddKey'][i]}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
                {activeStepTab === 'sub' && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">SubBytes — Substitusi S-Box Nonlinear</span>
                      <span className="text-[10px] text-slate-500">Confusion Layer</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Setiap byte di-lookup di S-Box 16×16. Cara baca: nibble atas = baris, nibble bawah = kolom. Contoh: 0x48 → baris 4, kolom 8 → 0x52</p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterSubBytes.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-blue-500/20 p-1.5 rounded-lg text-xs font-bold text-blue-300 flex flex-col">
                            <span className="text-[9px] text-slate-600 font-normal">S({r},{c})</span>
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
                      <span className="font-bold text-blue-300">ShiftRows — Geser Siklik ke Kiri</span>
                      <span className="text-[10px] text-slate-500">Row Diffusion</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-400 text-center">
                      {['Baris 0: shift 0', 'Baris 1: shift 1', 'Baris 2: shift 2', 'Baris 3: shift 3'].map((s, i) => (
                        <div key={i} className="bg-slate-950/60 border border-slate-800 rounded p-1">{s}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterShiftRows.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-blue-500/20 p-1.5 rounded-lg text-xs font-bold text-blue-300 flex flex-col">
                            <span className="text-[9px] text-slate-600 font-normal">S({r},{c})</span>
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
                      <span className="font-bold text-blue-300">MixColumns — Difusi Galois Field GF(2⁸)</span>
                      <span className="text-[10px] text-slate-500">Column Diffusion</span>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-400 space-y-0.5">
                      <p className="text-slate-300 font-bold">Matriks konstanta MixColumns:</p>
                      {[['2','3','1','1'],['1','2','3','1'],['1','1','2','3'],['3','1','1','2']].map((row, i) => (
                        <p key={i}>[{row.join('  ')}]  → s{i}&apos; = {
                          i === 0 ? '2·s0 ⊕ 3·s1 ⊕ s2 ⊕ s3' :
                          i === 1 ? 's0 ⊕ 2·s1 ⊕ 3·s2 ⊕ s3' :
                          i === 2 ? 's0 ⊕ s1 ⊕ 2·s2 ⊕ 3·s3' :
                                    '3·s0 ⊕ s1 ⊕ s2 ⊕ 2·s3'
                        }</p>
                      ))}
                      <p className="text-slate-500 pt-1">· = Perkalian di GF(2⁸) mod x⁸+x⁴+x³+x+1 | ⊕ = XOR</p>
                    </div>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterMixColumns.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-blue-500/20 p-1.5 rounded-lg text-xs font-bold text-blue-300 flex flex-col">
                            <span className="text-[9px] text-slate-600 font-normal">S({r},{c})</span>
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
                      <span className="font-bold text-blue-300">AddRoundKey — XOR State ⊕ Round Key</span>
                      <span className="text-[10px] text-slate-500">Key Injection</span>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-400 space-y-0.5">
                      <p className="text-slate-300 font-bold">Key Schedule (AES-256):</p>
                      <p>Kunci 256-bit → 15 Round Key × 128-bit</p>
                      <p>Round Key ke-r = Word[4r] ∥ Word[4r+1] ∥ Word[4r+2] ∥ Word[4r+3]</p>
                      <p className="pt-1 text-slate-300">Operasi: state[r][c] = state[r][c] ⊕ roundKey[r][c]</p>
                    </div>
                    <p className="text-[11px] text-slate-400">State setelah XOR dengan Round Key putaran 1:</p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                      {resultData.simulation.afterAddRoundKey.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-emerald-500/30 p-1.5 rounded-lg text-xs font-bold text-emerald-300 flex flex-col">
                            <span className="text-[9px] text-slate-600 font-normal">S({r},{c})</span>
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Round Key digunakan (16 byte pertama dari key schedule):</p>
                    <div className="grid grid-cols-4 gap-1 font-mono text-center">
                      {resultData.simulation.roundKeyPreview.map((row, r) =>
                        row.map((val, c) => (
                          <div key={`${r}-${c}`} className="bg-slate-950 border border-slate-700 p-1.5 rounded-lg text-xs font-bold text-slate-400 flex flex-col">
                            <span className="text-[9px] text-slate-600 font-normal">K({r},{c})</span>
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Komponen GCM */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-200">Komponen Kemasan AES-256-GCM</h3>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">1. IV Nonce (96-bit / 12 Byte):</span>
                    <span className="text-[10px] text-slate-500">Acak per Sesi</span>
                  </div>
                  <p className="text-slate-300 break-all text-[11px]">{resultData.ivHex}</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">2. Kunci SHA-256 (256-bit / 32 Byte):</span>
                    <span className="text-[10px] text-slate-500">Simetris</span>
                  </div>
                  <p className="text-slate-300 break-all text-[11px]">{resultData.keyBytesHex}</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-800/40 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-bold">3. Auth Tag GMAC (128-bit / 16 Byte):</span>
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Integritas</span>
                  </div>
                  <p className="text-emerald-300 break-all text-[11px]">{resultData.authTagHex}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────────── DEKRIPSI HASIL ──────────── */}
        {decryptedText !== null && decryptSteps && (
          <div className="space-y-4 pt-2">

            {/* Hasil plaintext */}
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Plaintext Berhasil Dipulihkan</span>
                </div>
                <button onClick={() => handleCopy(decryptedText)} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Salin</span>
                </button>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-sm font-mono text-emerald-300 break-all select-all font-semibold">{decryptedText}</p>
              </div>
            </div>

            {/* Alur Proses Dekripsi Step-by-Step */}
            <div className="bg-slate-950/90 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <UnlockKeyhole className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200">Alur Proses Dekripsi AES-256-GCM (Step-by-Step)</h3>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                {/* Step 1 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/30 shrink-0">1</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-emerald-300 font-bold">Base64 Decode → Pisah Komponen</p>
                    <p className="text-slate-500">Input: {decryptSteps.inputLength} karakter Base64/Hex</p>
                    <div className="grid grid-cols-3 gap-1 text-[10px] pt-1">
                      <div className="bg-slate-950 border border-slate-800 rounded p-1.5">
                        <p className="text-slate-500">byte[0..11] = IV</p>
                        <p className="text-blue-300 text-[9px] break-all">{decryptSteps.ivHex.slice(0, 23)}...</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded p-1.5">
                        <p className="text-slate-500">byte[12..n-17]</p>
                        <p className="text-slate-400 text-[9px]">Ciphertext</p>
                      </div>
                      <div className="bg-slate-950 border border-emerald-800/40 rounded p-1.5">
                        <p className="text-slate-500">byte[n-16..n]</p>
                        <p className="text-emerald-400 text-[9px]">Auth Tag</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/30 shrink-0">2</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-emerald-300 font-bold">Derive Key: SHA-256(Passphrase)</p>
                    <p className="text-slate-500">Input: &quot;{decryptSteps.passphrase}&quot;</p>
                    <p className="text-slate-300 break-all text-[10px]">{decryptSteps.keyHex}</p>
                    <p className="text-slate-500 text-[10px]">⚠ Kunci harus IDENTIK dengan saat enkripsi</p>
                  </div>
                </div>

                {/* Step 3 — Auth Tag Verification */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-emerald-700/40">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/30 shrink-0">3</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-emerald-300 font-bold">Verifikasi GHASH Authentication Tag</p>
                    <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-lg p-2 space-y-1">
                      <p className="text-slate-400">H = AES(Key, 0¹²⁸) → konstanta GHASH</p>
                      <p className="text-slate-400">Tag_hitung = GHASH(H, CipherBytes)</p>
                      <p className="text-slate-400">Tag_tersimpan = byte[n-16..n] dari ciphertext</p>
                      <div className="flex items-center gap-2 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <p className="text-emerald-300 font-bold">Tag Valid ✓ — Data Tidak Rusak, Kunci Cocok</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[10px]">🔒 GCM menolak dekripsi jika tag tidak valid tanpa expose data</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/30 shrink-0">4</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-emerald-300 font-bold">AES-CTR Dekripsi (14 Putaran Invers)</p>
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 space-y-1 text-[10px]">
                      <p className="text-slate-300 font-bold">Urutan Invers Transformasi:</p>
                      <div className="space-y-0.5 text-slate-400">
                        <p>Putaran 14 → <span className="text-blue-300">InvAddRoundKey</span> → <span className="text-blue-300">InvShiftRows</span> → <span className="text-blue-300">InvSubBytes</span></p>
                        <p>Putaran 13..1 → InvAddRoundKey → <span className="text-blue-300">InvMixColumns</span> → InvShiftRows → InvSubBytes</p>
                        <p>Putaran 0 → InvAddRoundKey</p>
                      </div>
                      <div className="pt-1 border-t border-slate-800 grid grid-cols-2 gap-1">
                        <div>
                          <p className="text-slate-300">InvShiftRows: geser ke <span className="text-yellow-400">kanan</span></p>
                          <p className="text-slate-500">Br1: [a b c d]→[d a b c]</p>
                        </div>
                        <div>
                          <p className="text-slate-300">InvMixColumns: matriks invers</p>
                          <p className="text-slate-500">[E B D 9 / 9 E B D / ...]</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-[10px]">CTR: PlainBlock = CipherBlock ⊕ AES(Key, Counter_i)</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3 items-start bg-slate-900 rounded-xl p-3 border border-emerald-700/40">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/30 shrink-0">5</span>
                  <div className="flex-1 space-y-1">
                    <p className="text-emerald-300 font-bold">UTF-8 Decode → Plaintext</p>
                    <p className="text-slate-500">Byte array → TextDecoder(&apos;utf-8&apos;).decode()</p>
                    <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-2">
                      <p className="text-emerald-300 font-semibold break-all">&quot;{decryptSteps.plaintext}&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skenario Error */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-bold text-slate-200">Skenario Kegagalan Dekripsi</h3>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  { label: 'Kunci salah', desc: 'SHA-256 berbeda → GHASH tag mismatch → Error sebelum dekripsi' },
                  { label: 'Data rusak', desc: '1 bit berubah → Auth Tag tidak cocok → Ditolak otomatis' },
                  { label: 'IV hilang', desc: 'Tidak bisa reconstruct counter → plaintext acak / error' },
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

            {/* Perbandingan Alur */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-200">Ringkasan: Enkripsi vs Dekripsi</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div className="bg-blue-950/30 border border-blue-700/30 rounded-xl p-3 space-y-1">
                  <p className="text-blue-300 font-bold">ENKRIPSI</p>
                  {['Plaintext', '↓ SHA-256(key)', '↓ Generate IV (acak)', '↓ AES-CTR encrypt', '↓ GHASH tag', '↓ Base64(IV+C+Tag)'].map((s,i) => <p key={i} className="text-slate-400">{s}</p>)}
                </div>
                <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-xl p-3 space-y-1">
                  <p className="text-emerald-300 font-bold">DEKRIPSI</p>
                  {['Base64 decode', '↓ Extract IV[0..11]', '↓ SHA-256(key)', '↓ Verify Auth Tag', '↓ AES-CTR decrypt (invers)', '↓ UTF-8 Plaintext'].map((s,i) => <p key={i} className="text-slate-400">{s}</p>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
