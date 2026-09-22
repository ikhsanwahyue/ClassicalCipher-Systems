'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  Layers,
  Key,
  Binary,
  Code2,
  RefreshCw
} from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { caesarCipher, vigenereCipher, TraceStep } from '@/lib/classical';
import { xorCipher, ModernTraceStep } from '@/lib/modern';
import { superEncrypt, PipelineStage } from '@/lib/super-encryption';

function TracingContent() {
  const searchParams = useSearchParams();

  const [algo, setAlgo] = useState<'caesar' | 'vigenere' | 'xor' | 'super'>('caesar');
  const [inputText, setInputText] = useState('KRIPTO');
  const [keyParam, setKeyParam] = useState('KUNCI');
  const [shiftParam, setShiftParam] = useState(3);

  // Results
  const [classicalSteps, setClassicalSteps] = useState<TraceStep[]>([]);
  const [modernSteps, setModernSteps] = useState<ModernTraceStep[]>([]);
  const [superStages, setSuperStages] = useState<PipelineStage[]>([]);
  const [formula, setFormula] = useState('');
  const [finalOutput, setFinalOutput] = useState('');

  // Read query parameters if available
  useEffect(() => {
    const qAlgo = searchParams.get('algo');
    const qText = searchParams.get('text');
    const qKey = searchParams.get('key');
    const qShift = searchParams.get('shift');

    if (qAlgo && ['caesar', 'vigenere', 'xor', 'super'].includes(qAlgo)) {
      setAlgo(qAlgo as 'caesar' | 'vigenere' | 'xor' | 'super');
    }
    if (qText) setInputText(qText);
    if (qKey) setKeyParam(qKey);
    if (qShift) setShiftParam(Number(qShift));
  }, [searchParams]);

  useEffect(() => {
    runTracing();
  }, [algo, inputText, keyParam, shiftParam]);

  const runTracing = async () => {
    if (!inputText) return;

    if (algo === 'caesar') {
      const res = caesarCipher(inputText, shiftParam, 'encrypt');
      setClassicalSteps(res.steps);
      setModernSteps([]);
      setSuperStages([]);
      setFormula(res.formula);
      setFinalOutput(res.result);
    } else if (algo === 'vigenere') {
      const res = vigenereCipher(inputText, keyParam, 'encrypt');
      setClassicalSteps(res.steps);
      setModernSteps([]);
      setSuperStages([]);
      setFormula(res.formula);
      setFinalOutput(res.result);
    } else if (algo === 'xor') {
      const res = xorCipher(inputText, keyParam || 'KEY');
      setModernSteps(res.steps);
      setClassicalSteps([]);
      setSuperStages([]);
      setFormula(res.formula);
      setFinalOutput(res.result);
    } else if (algo === 'super') {
      const res = await superEncrypt(inputText, {
        caesarShift: shiftParam,
        vigenereKey: keyParam || 'KEY',
        xorKey: 'XORKEY',
        aesKey: 'MasterKey2026',
      });
      setSuperStages(res.stages);
      setClassicalSteps([]);
      setModernSteps([]);
      setFormula('Super Encryption 4-Layer Sequential Pipeline');
      setFinalOutput(res.finalCiphertext);
    }
  };

  return (
    <div className="space-y-4">
      {/* Algorithm Selector */}
      <div className="flex space-x-1 overflow-x-auto pb-1">
        {[
          { id: 'caesar', label: 'Caesar Tracing', icon: Key },
          { id: 'vigenere', label: 'Vigenere Tracing', icon: Key },
          { id: 'xor', label: 'XOR Bit Tracing', icon: Binary },
          { id: 'super', label: 'Super Pipeline', icon: Layers },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = algo === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAlgo(item.id as any)}
              className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap font-medium flex items-center space-x-1.5 border transition-all ${
                isSelected
                  ? 'bg-slate-800 text-amber-400 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Parameters Controls */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-md">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Input Plaintext
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        {algo === 'caesar' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Pergeseran Shift (K): <span className="text-amber-400 font-mono">{shiftParam}</span>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              value={shiftParam}
              onChange={(e) => setShiftParam(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        )}

        {(algo === 'vigenere' || algo === 'xor') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Kunci (Key)
            </label>
            <input
              type="text"
              value={keyParam}
              onChange={(e) => setKeyParam(e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">{formula}</span>
          <span className="text-emerald-400 font-bold font-mono">Result: {finalOutput.slice(0, 15)}...</span>
        </div>
      </div>

      {/* TRACING DISPLAY: CLASSICAL (Caesar & Vigenere) */}
      {classicalSteps.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Langkah Matematis Per-Karakter ({classicalSteps.length} Huruf)
          </p>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] border-b border-slate-800 uppercase">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Char</th>
                    <th className="py-2 px-3">P (0-25)</th>
                    <th className="py-2 px-3">Key</th>
                    <th className="py-2 px-3">Operasi Formula</th>
                    <th className="py-2 px-3">Cipher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {classicalSteps.map((s) => (
                    <tr key={s.index} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-500">{s.index}</td>
                      <td className="py-2 px-3 font-bold text-cyan-300">{s.inputChar}</td>
                      <td className="py-2 px-3 text-slate-300">{s.inputVal}</td>
                      <td className="py-2 px-3 text-amber-400">{s.keyVal}</td>
                      <td className="py-2 px-3 text-slate-300 text-[11px]">{s.operation}</td>
                      <td className="py-2 px-3 font-bold text-emerald-400">{s.outputChar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TRACING DISPLAY: MODERN XOR BITWISE */}
      {modernSteps.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5" />
            Operasi Biner Bitwise XOR (8-bit per Byte)
          </p>

          <div className="space-y-2.5">
            {modernSteps.map((s) => (
              <div
                key={s.index}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 space-y-1.5 font-mono text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-700 pb-1 text-[11px]">
                  <span className="text-slate-400">Byte #{s.index}: &apos;{s.inputChar}&apos; ⊕ &apos;{s.keyChar}&apos;</span>
                  <span className="text-emerald-400 font-bold">Hex: 0x{s.outputHex}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Plain Byte ({s.inputByte})</span>
                    <span className="text-cyan-300">{s.inputBinary}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Key Byte ({s.keyByte})</span>
                    <span className="text-amber-300">{s.keyBinary}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">XOR Result ({s.outputByte})</span>
                    <span className="text-emerald-300">{s.outputBinary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRACING DISPLAY: SUPER ENCRYPTION PIPELINE */}
      {superStages.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-sky-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            4-Stage Pipeline Execution Flow
          </p>

          <div className="space-y-2.5">
            {superStages.map((stg) => (
              <div
                key={stg.stage}
                className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 space-y-2 relative shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px]">
                      {stg.stage}
                    </span>
                    {stg.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 font-mono border border-slate-700">
                    {stg.keyUsed}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">{stg.description}</p>

                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="text-slate-400 truncate">
                    <span className="text-slate-500">In:  </span>{stg.input}
                  </div>
                  <div className="text-emerald-400 truncate">
                    <span className="text-slate-500">Out: </span>{stg.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TracingPage() {
  return (
    <MobileShell title="Mathematical Tracing" subtitle="Step-by-Step Visualization">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-12 text-slate-400 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Memuat kalkulasi tracing...
          </div>
        }
      >
        <TracingContent />
      </Suspense>
    </MobileShell>
  );
}
