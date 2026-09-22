'use client';

import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { encodeLSB, decodeLSB, calculateCapacity, SteganoCapacity } from '@/lib/steganography';

export default function ImageSteganographyPage() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

  // Encode State
  const [encodeImageSrc, setEncodeImageSrc] = useState<string | null>(null);
  const [secretText, setSecretText] = useState('Ini adalah pesan rahasia yang disisipkan dengan LSB steganografi.');
  const [capacity, setCapacity] = useState<SteganoCapacity | null>(null);
  const [encodedImageResult, setEncodedImageResult] = useState<string | null>(null);
  const [encodeSuccess, setEncodeSuccess] = useState(false);
  const [encodeError, setEncodeError] = useState('');

  // Decode State
  const [decodeImageSrc, setDecodeImageSrc] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hidden Canvas Ref for pixel manipulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle Encode Image Selection
  const handleEncodeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEncodeError('');
    setEncodeSuccess(false);
    setEncodedImageResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setEncodeImageSrc(img.src);
        setCapacity(calculateCapacity(img.width, img.height));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Process LSB Embedding
  const handleProcessEncode = () => {
    if (!encodeImageSrc || !secretText) return;
    setLoading(true);
    setEncodeError('');
    setEncodeSuccess(false);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setEncodeError('Gagal menginisialisasi 2D Canvas Context.');
        setLoading(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const res = encodeLSB(imgData, secretText);
      if (!res.success) {
        setEncodeError(res.error || 'Gagal menyisipkan pesan.');
        setLoading(false);
        return;
      }

      ctx.putImageData(imgData, 0, 0);
      const outputDataUrl = canvas.toDataURL('image/png');
      setEncodedImageResult(outputDataUrl);
      setEncodeSuccess(true);
      setLoading(false);
    };
    img.src = encodeImageSrc;
  };

  // Handle Decode Image Selection
  const handleDecodeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDecodeError('');
    setExtractedMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setDecodeImageSrc(img.src);
        processDecode(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processDecode = (img: HTMLImageElement) => {
    setLoading(true);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDecodeError('Gagal menginisialisasi Canvas Context.');
      setLoading(false);
      return;
    }

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const res = decodeLSB(imgData);

    if (res.success && res.message) {
      setExtractedMessage(res.message);
    } else {
      setDecodeError(res.error || 'Tidak ditemukan payload tersembunyi.');
    }
    setLoading(false);
  };

  return (
    <MobileShell title="Image Steganography" subtitle="LSB Carrier & Extraction">
      <div className="space-y-4">
        {/* Sub-tab Navigation */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('encode')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'encode'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Sisipkan Pesan (Hide)</span>
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'decode'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ekstrak Pesan (Reveal)</span>
          </button>
        </div>

        {/* ENCODE TAB */}
        {activeTab === 'encode' && (
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                1. Pilih Gambar Pembawa (Carrier Image)
              </label>

              <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 transition-colors group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleEncodeImageUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors mb-2" />
                <span className="text-xs text-slate-300 font-medium">Klik untuk upload gambar</span>
                <span className="text-[10px] text-slate-500">PNG, JPG, atau WEBP</span>
              </label>

              {/* Image Preview & Capacity */}
              {encodeImageSrc && (
                <div className="space-y-2 pt-1">
                  <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700">
                    <img
                      src={encodeImageSrc}
                      alt="Carrier Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  {capacity && (
                    <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <HardDrive className="w-4 h-4 text-cyan-400" />
                        <span>Kapasitas LSB:</span>
                      </div>
                      <span className="font-mono text-cyan-300 font-semibold">
                        ~{capacity.maxCharacters.toLocaleString()} Karakter
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Secret Message Input */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Pesan Rahasia yang Akan Disisipkan
              </label>
              <textarea
                rows={3}
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder="Tulis pesan rahasia di sini..."
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              {encodeError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{encodeError}</span>
                </div>
              )}

              <button
                onClick={handleProcessEncode}
                disabled={loading || !encodeImageSrc || !secretText}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Menyisipkan LSB...' : 'Sisipkan Pesan ke Gambar'}</span>
              </button>
            </div>

            {/* Encoded Result & Download */}
            {encodeSuccess && encodedImageResult && (
              <div className="bg-slate-800/90 border border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pesan Berhasil Disisipkan (Format PNG Lossless)!</span>
                </div>
                <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700">
                  <img
                    src={encodedImageResult}
                    alt="Stegano Result"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <a
                  href={encodedImageResult}
                  download="stego_image.png"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 border border-emerald-500/50 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Unduh Gambar Steganografi (.png)</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* DECODE TAB */}
        {activeTab === 'decode' && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pilih Gambar Berisi Steganografi (.png)
              </label>

              <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 transition-colors group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleDecodeImageUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors mb-2" />
                <span className="text-xs text-slate-300 font-medium">Upload Gambar untuk Diekstrak</span>
                <span className="text-[10px] text-slate-500">Ekstraksi otomatis bit LSB</span>
              </label>

              {decodeImageSrc && (
                <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700 mt-2">
                  <img
                    src={decodeImageSrc}
                    alt="Decode Source"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Extracted Output */}
            {extractedMessage && (
              <div className="bg-slate-800/90 border border-cyan-500/40 rounded-2xl p-4 space-y-2 shadow-lg">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pesan Rahasia Terbaca:</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-100 border border-slate-800 break-words leading-relaxed">
                  {extractedMessage}
                </div>
              </div>
            )}

            {decodeError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{decodeError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
