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
  UnlockKeyhole,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Layers
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
  const [activeRound, setActiveRound] = useState<number>(1);

  const [showDetails, setShowDetails] = useState(true);

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
        const enc = new TextEncoder();
        const rawKeyData = await crypto.subtle.digest('SHA-256', enc.encode(passphrase || 'DEFAULT_KEY_AES'));
        const keyHex = Array.from(new Uint8Array(rawKeyData))
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');

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
        } catch { }

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
    <MobileShell title="Rijndael (AES - 256)" subtitle="Kunci Simetris Modern">
      <div className="space-y-4">

        <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 mt-1">Rijndael (Advanced Encryption Standard - 256)</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Algoritma block cipher simetri modern. Menggunakan 14 putaran (SubBytes → ShiftRows → MixColumns → AddRoundKey) dengan autentikasi Galois/Counter Mode (GHASH 128-bit) untuk menjamin kerahasiaan dan integritas data.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => { setMode('encrypt'); setResultData(null); setDecryptedText(null); setDecryptSteps(null); setErrorMessage(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'encrypt' ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Enkripsi
          </button>
          <button
            onClick={() => { setMode('decrypt'); setResultData(null); setDecryptedText(null); setDecryptSteps(null); setErrorMessage(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'decrypt' ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" /> Dekripsi
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>{mode === 'encrypt' ? 'Plaintext (P)' : 'Ciphertext (C)'}</span>
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">Kunci Rahasia Simetris (K)</label>
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

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={handleProcess}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Lock className="w-4 h-4" />
          {mode === 'encrypt' ? 'Jalankan Enkripsi' : 'Jalankan Dekripsi AES-256'}
        </button>

        {resultData && (
          <div className="space-y-4 pt-2">

            <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Hasil Ciphertext</span>
                </div>
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                  <button onClick={() => setFormat('base64')} className={`px-2 py-0.5 text-[10px] font-mono rounded ${format === 'base64' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Base64</button>
                  <button onClick={() => setFormat('hex')} className={`px-2 py-0.5 text-[10px] font-mono rounded ${format === 'hex' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Hex</button>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-sm font-mono text-blue-300 break-all select-all font-semibold leading-relaxed">
                  {format === 'base64' ? resultData.ciphertextBase64 : resultData.ciphertextHex}
                </p>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 font-mono">{format === 'base64' ? resultData.ciphertextBase64.length : resultData.ciphertextHex.length} Karakter</span>
                <button
                  onClick={() => handleCopy(format === 'base64' ? resultData.ciphertextBase64 : resultData.ciphertextHex)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-blue-400" /><span className="text-blue-400">Tersalin</span></> : <><Copy className="w-3.5 h-3.5 text-slate-400" /><span>Salin ({format.toUpperCase()})</span></>}
                </button>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">Detail Proses</h3>
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  {showDetails ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              {showDetails && (
                <div className="space-y-4 pt-1">

                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">

                      Komponen Galois/Counter Mode (GCM)
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-[10px] font-mono">
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-400 font-bold">1. IV Nonce (Initialization Vector — 96 bit / 12 Byte)</span>
                        </div>
                        <p className="text-slate-300 break-all">{resultData.ivHex}</p>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-400 font-bold">2. Kunci Simetris (Key Derivation — 256 bit / 32 Byte)</span>
                        </div>
                        <p className="text-slate-300 break-all">{resultData.keyBytesHex}</p>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-blue-800/40 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-400 font-bold">3. Auth Tag / GMAC (Authentication Tag — 128 bit / 16 Byte)</span>
                        </div>
                        <p className="text-slate-300 break-all">{resultData.authTagHex}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        Simulasi 14 Putaran Rijndael
                      </h4>
                      <select
                        className="bg-slate-950 border border-slate-800 text-slate-300 text-[9px] rounded px-2 py-1 outline-none"
                        value={activeRound}
                        onChange={(e) => {
                          setActiveRound(Number(e.target.value));
                          setActiveStepTab(Number(e.target.value) === 0 ? 'key' : 'sub');
                        }}
                      >
                        <option value={0}>Putaran 0 (Initial AddKey)</option>
                        {Array.from({ length: 14 }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>Putaran {i + 1}</option>
                        ))}
                      </select>
                    </div>

                    {activeRound === 0 ? (
                      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 space-y-2 min-h-[140px]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-blue-300">Initial AddRoundKey (Putaran 0)</span>
                          <span className="text-[9px] text-slate-500">State ⊕ RoundKey[0]</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                          {resultData.fullSimulation[0].afterAddRoundKey.map((row, r) =>
                            row.map((val, c) => (
                              <div key={`${r}-${c}`} className="bg-slate-900 border border-slate-800 p-1.5 rounded-md text-[10px] font-bold text-blue-300 flex flex-col">
                                {val}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-[9px]">
                          {(['sub', 'shift', 'mix', 'key'] as const).map((tab, i) => (
                            <button
                              key={tab}
                              onClick={() => setActiveStepTab(tab)}
                              disabled={tab === 'mix' && activeRound === 14}
                              className={`py-1.5 rounded-md font-bold transition-all ${activeStepTab === tab ? 'bg-blue-500 text-slate-950 shadow'
                                : tab === 'mix' && activeRound === 14 ? 'opacity-20 cursor-not-allowed'
                                  : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                              {['SubBytes', 'ShiftRows', 'MixCols', 'AddKey'][i]}
                            </button>
                          ))}
                        </div>

                        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 space-y-2 min-h-[140px]">
                          {activeStepTab === 'sub' && resultData.fullSimulation[activeRound].afterSubBytes && (
                            <>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-blue-300">Substitusi S-Box Nonlinear</span>
                                <span className="text-[9px] text-slate-500">Confusion</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                                {resultData.fullSimulation[activeRound].afterSubBytes!.map((row, r) =>
                                  row.map((val, c) => (
                                    <div key={`${r}-${c}`} className="bg-slate-900 border border-slate-800 p-1.5 rounded-md text-[10px] font-bold text-blue-300 flex flex-col">
                                      {val}
                                    </div>
                                  ))
                                )}
                              </div>
                            </>
                          )}

                          {activeStepTab === 'shift' && resultData.fullSimulation[activeRound].afterShiftRows && (
                            <>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-blue-300">Geser Siklik Kiri</span>
                                <span className="text-[9px] text-slate-500">Diffusion</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                                {resultData.fullSimulation[activeRound].afterShiftRows!.map((row, r) =>
                                  row.map((val, c) => (
                                    <div key={`${r}-${c}`} className="bg-slate-900 border border-slate-800 p-1.5 rounded-md text-[10px] font-bold text-blue-300 flex flex-col">
                                      {val}
                                    </div>
                                  ))
                                )}
                              </div>
                            </>
                          )}

                          {activeStepTab === 'mix' && resultData.fullSimulation[activeRound].afterMixColumns && (
                            <>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-blue-300">Galois Field GF(2⁸)</span>
                                <span className="text-[9px] text-slate-500">Difusi Kolom</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                                {resultData.fullSimulation[activeRound].afterMixColumns!.map((row, r) =>
                                  row.map((val, c) => (
                                    <div key={`${r}-${c}`} className="bg-slate-900 border border-slate-800 p-1.5 rounded-md text-[10px] font-bold text-blue-300 flex flex-col">
                                      {val}
                                    </div>
                                  ))
                                )}
                              </div>
                            </>
                          )}

                          {activeStepTab === 'key' && (
                            <>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-blue-300">XOR State & Round Key</span>
                                <span className="text-[9px] text-slate-500">Key Injection</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 font-mono text-center pt-1">
                                {resultData.fullSimulation[activeRound].afterAddRoundKey.map((row, r) =>
                                  row.map((val, c) => (
                                    <div key={`${r}-${c}`} className="bg-slate-900 border border-slate-800 p-1.5 rounded-md text-[10px] font-bold text-blue-300 flex flex-col">
                                      {val}
                                    </div>
                                  ))
                                )}
                              </div>
                              <div className="text-[8px] text-slate-500 text-center mt-2 border-t border-slate-800 pt-2">
                                Round Key {activeRound}:<br /><span className="text-emerald-400 font-bold">{resultData.fullSimulation[activeRound].roundKey.map(r => r.join(' ')).join(' ')}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* State Matrix Awal */}
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      State Matrix 4×4 Awal
                    </h4>
                    <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                      {resultData.stateMatrix.map((row, rIdx) =>
                        row.map((cell, cIdx) => (
                          <div key={`${rIdx}-${cIdx}`} className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center">
                            <span className="text-[8px] text-slate-500 font-bold">S({rIdx},{cIdx})</span>
                            <span className="text-[11px] font-bold text-blue-300 mt-0.5">0x{cell.hex}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {decryptedText !== null && decryptSteps && (
          <div className="space-y-4 pt-2">

            {/* Hasil plaintext */}
            <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Plaintext Terpulihkan</span>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <p className="text-sm font-mono text-cyan-300 break-all select-all font-semibold">{decryptedText}</p>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 font-mono">{decryptedText.length} Karakter</span>
                <button onClick={() => handleCopy(decryptedText)} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700">
                  {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Salin</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <UnlockKeyhole className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200">Alur Proses Dekripsi AES-256-GCM</h3>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Secure Mode
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
                      Langkah 1
                    </span>
                    <span className="text-slate-400 text-[10px]">Payload Parsing</span>
                  </div>
                  <p className="text-slate-200 font-bold text-xs">Dekode Payload & Pemisahan Komponen</p>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-slate-500 block">IV (Nonce)</span>
                      <span className="text-blue-300 font-bold">12 Byte</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-slate-500 block">Ciphertext</span>
                      <span className="text-slate-300 font-bold">Variabel</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-blue-800/40 text-center">
                      <span className="text-slate-500 block">Auth Tag</span>
                      <span className="text-blue-300 font-bold">16 Byte</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
                      Langkah 2
                    </span>
                    <span className="text-slate-400 text-[10px]">Key Derivation</span>
                  </div>
                  <p className="text-slate-200 font-bold text-xs">Penurunan Kunci Rahasia (SHA-256)</p>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Kunci Simetris (Hex Preview):</span>
                    <span className="text-blue-300 font-mono text-[11px] break-all block">{decryptSteps.keyHex}</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-blue-700/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
                      Langkah 3
                    </span>
                    <span className="text-blue-400 text-[10px] font-bold">Integrity Check</span>
                  </div>
                  <p className="text-slate-200 font-bold text-xs">Verifikasi GHASH Tag</p>
                  <div className="flex items-center gap-2 bg-blue-950/30 border border-blue-700/30 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-blue-300 text-[11px]">Data utuh dan kunci cocok. Melanjutkan ke inversi AES-CTR.</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
                      Langkah 4
                    </span>
                    <span className="text-slate-400 text-[10px]">Block Cipher</span>
                  </div>
                  <p className="text-slate-200 font-bold text-xs">AES-CTR Dekripsi (14 Putaran Invers)</p>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <span className="text-slate-500 block text-[10px]">Urutan Transformasi Invers:</span>
                    <span className="text-blue-300 font-semibold">InvAddRoundKey → InvShiftRows → InvSubBytes → InvMixColumns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}