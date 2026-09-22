'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  Activity,
  Layers,
  Sparkles,
  Key,
  Binary,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { caesarCipher, vigenereCipher } from '@/lib/classical';
import { xorCipher, xorDecryptHex, rc4Cipher, aesEncrypt, aesDecrypt } from '@/lib/modern';
import { superEncrypt, superDecrypt, SuperKeys } from '@/lib/super-encryption';

type TabType = 'caesar' | 'vigenere' | 'xor' | 'modern2' | 'super';

export default function TextCryptoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('caesar');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Inputs
  const [inputText, setInputText] = useState('KRIPTOGRAFI KLASIK DAN MODERN');
  const [caesarShift, setCaesarShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState('KUNCI');
  const [xorKey, setXorKey] = useState('SECRET');
  const [modern2Algo, setModern2Algo] = useState<'rc4' | 'aes'>('aes');
  const [modern2Key, setModern2Key] = useState('PassKey123');

  // Super Encryption multi-keys
  const [superKeys, setSuperKeys] = useState<SuperKeys>({
    caesarShift: 3,
    vigenereKey: 'CRYPTO',
    xorKey: 'KEYXOR',
    aesKey: 'SuperSecret2026',
  });

  // Outputs
  const [outputText, setOutputText] = useState('');
  const [formula, setFormula] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    setError('');
    setLoading(true);
    try {
      if (activeTab === 'caesar') {
        const res = caesarCipher(inputText, caesarShift, mode);
        setOutputText(res.result);
        setFormula(res.formula);
      } else if (activeTab === 'vigenere') {
        const res = vigenereCipher(inputText, vigenereKey, mode);
        setOutputText(res.result);
        setFormula(res.formula);
      } else if (activeTab === 'xor') {
        if (mode === 'encrypt') {
          const res = xorCipher(inputText, xorKey);
          setOutputText(res.result);
          setFormula(res.formula);
        } else {
          const res = xorDecryptHex(inputText, xorKey);
          setOutputText(res);
          setFormula(`P_i = C_i ⊕ K_(i mod |K|) (Hex to Decoded Text)`);
        }
      } else if (activeTab === 'modern2') {
        if (modern2Algo === 'rc4') {
          const res = rc4Cipher(inputText, modern2Key);
          setOutputText(res.result);
          setFormula(res.formula);
        } else {
          if (mode === 'encrypt') {
            const res = await aesEncrypt(inputText, modern2Key);
            setOutputText(res);
            setFormula(`AES-256-GCM (Authenticated Block Cipher + 96-bit IV)`);
          } else {
            const res = await aesDecrypt(inputText, modern2Key);
            setOutputText(res);
            setFormula(`AES-256-GCM Decrypt (Authenticated Tag Verification)`);
          }
        }
      } else if (activeTab === 'super') {
        if (mode === 'encrypt') {
          const res = await superEncrypt(inputText, superKeys);
          setOutputText(res.finalCiphertext);
          setFormula('Pipeline 4-Layer: Caesar → Vigenere → XOR → AES-256');
        } else {
          const res = await superDecrypt(inputText, superKeys);
          setOutputText(res.finalCiphertext);
          setFormula('Reverse Pipeline 4-Layer: AES-256 → XOR → Vigenere → Caesar');
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Gagal memproses kriptografi.');
      } else {
        setError('Gagal memproses kriptografi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'caesar', label: '1. Caesar', icon: Key },
    { id: 'vigenere', label: '2. Vigenere', icon: Key },
    { id: 'xor', label: '3. XOR Biner', icon: Binary },
    { id: 'modern2', label: '4. AES / RC4', icon: Lock },
    { id: 'super', label: '5. Super Enkripsi', icon: Layers },
  ];

  return (
    <MobileShell title="Text Cryptography" subtitle="5 Algoritma & Super Pipeline">
      <div className="space-y-4">
        {/* Mode Selector Pill */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('encrypt')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'encrypt'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enkripsi</span>
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'decrypt'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Dekripsi</span>
          </button>
        </div>

        {/* Algorithm Tabs (Scrollable on mobile) */}
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setOutputText('');
                  setError('');
                }}
                className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap font-medium flex items-center space-x-1.5 border transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Form Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              {mode === 'encrypt' ? 'Plaintext (Teks Asli)' : 'Ciphertext (Teks Terenkripsi)'}
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik teks di sini..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Dynamic Keys based on active tab */}
          {activeTab === 'caesar' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Pergeseran Kunci (Shift K): <span className="text-cyan-400 font-mono font-bold">{caesarShift}</span>
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={caesarShift}
                onChange={(e) => setCaesarShift(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (A)</span>
                <span>13 (ROT13)</span>
                <span>25 (Z)</span>
              </div>
            </div>
          )}

          {activeTab === 'vigenere' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kunci Teks (Keyword)
              </label>
              <input
                type="text"
                value={vigenereKey}
                onChange={(e) => setVigenereKey(e.target.value.toUpperCase())}
                placeholder="Contoh: KUNCI"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 uppercase tracking-widest focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {activeTab === 'xor' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kunci Stream Biner / XOR
              </label>
              <input
                type="text"
                value={xorKey}
                onChange={(e) => setXorKey(e.target.value)}
                placeholder="Contoh: SECRET"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                *Enkripsi menghasilkan format Hexadecimal biner.
              </p>
            </div>
          )}

          {activeTab === 'modern2' && (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setModern2Algo('aes')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                    modern2Algo === 'aes'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  AES-256 GCM (Blok)
                </button>
                <button
                  type="button"
                  onClick={() => setModern2Algo('rc4')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                    modern2Algo === 'rc4'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  RC4 Stream S-Box
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kunci Kriptografi Modern
                </label>
                <input
                  type="password"
                  value={modern2Key}
                  onChange={(e) => setModern2Key(e.target.value)}
                  placeholder="Password enkripsi"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'super' && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
              <p className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Konfigurasi 4 Layer Super Enkripsi:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">1. Caesar Shift:</span>
                  <input
                    type="number"
                    value={superKeys.caesarShift}
                    onChange={(e) =>
                      setSuperKeys({ ...superKeys, caesarShift: Number(e.target.value) })
                    }
                    className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-cyan-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">2. Vigenere Key:</span>
                  <input
                    type="text"
                    value={superKeys.vigenereKey}
                    onChange={(e) =>
                      setSuperKeys({ ...superKeys, vigenereKey: e.target.value.toUpperCase() })
                    }
                    className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-cyan-300 uppercase"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">3. XOR Stream Key:</span>
                  <input
                    type="text"
                    value={superKeys.xorKey}
                    onChange={(e) =>
                      setSuperKeys({ ...superKeys, xorKey: e.target.value })
                    }
                    className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-cyan-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">4. AES-256 Key:</span>
                  <input
                    type="text"
                    value={superKeys.aesKey}
                    onChange={(e) =>
                      setSuperKeys({ ...superKeys, aesKey: e.target.value })
                    }
                    className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-cyan-300"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={loading || !inputText}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memproses...' : `Eksekusi ${mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}`}</span>
          </button>
        </div>

        {/* Output & Tracing Shortcut Card */}
        {outputText && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Hasil ({mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}):
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 break-all leading-relaxed max-h-48 overflow-y-auto">
              {outputText}
            </div>

            {formula && (
              <p className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500">Formula: </span>{formula}
              </p>
            )}

            {/* Tracing Link */}
            <Link
              href={`/tracing?algo=${activeTab}&text=${encodeURIComponent(inputText)}&mode=${mode}&shift=${caesarShift}&key=${encodeURIComponent(vigenereKey || xorKey || '')}`}
              className="w-full py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat Visualisasi Tracing Step-by-Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
