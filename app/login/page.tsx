'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { sha256, verifyPassword, DEFAULT_USER } from '@/lib/crypto-hash';
import MobileShell from '@/components/MobileShell';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [liveHash, setLiveHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Compute live hash as user types password
  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val) {
      const h = await sha256(val);
      setLiveHash(h);
    } else {
      setLiveHash('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (username !== DEFAULT_USER.username) {
        setError('Username tidak ditemukan. Gunakan akun default "admin".');
        setLoading(false);
        return;
      }

      const isValid = await verifyPassword(password, DEFAULT_USER.passwordHash);

      if (isValid) {
        setSuccess(true);
        localStorage.setItem(
          'crypto_auth_user',
          JSON.stringify({
            username: DEFAULT_USER.username,
            role: DEFAULT_USER.role,
            loginAt: new Date().toISOString(),
          })
        );
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setError('Kata sandi salah! Hash tidak cocok dengan database otentikasi.');
      }
    } catch (err: unknown) {
      setError('Terjadi kesalahan saat memverifikasi hash.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell title="Authentication" subtitle="SHA-256 Hash Guard">
      <div className="flex flex-col justify-center min-h-[80vh] px-2 py-6">
        {/* Cyber Logo / Header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center shadow-xl shadow-cyan-500/25 mb-3 ring-4 ring-cyan-500/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">CRYPTO SOLVER</h2>
          <p className="text-xs text-slate-400 mt-1">Sistem Otentikasi Kriptografis Berbasis SHA-256</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Otentikasi berhasil! Mengalihkan ke Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Live SHA-256 Digest Visualizer */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                <span>Computed SHA-256 Digest:</span>
                <span className="text-slate-500">256-bit</span>
              </div>
              <p className="font-mono text-[11px] text-slate-300 break-all leading-tight bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                {liveHash || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 active:scale-[0.99] text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
            >
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Credentials Reminder */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 text-center">
            <p className="text-xs text-slate-400">
              Akun Bawaan Praktikum: <br />
              <span className="text-cyan-400 font-mono">admin</span> / <span className="text-cyan-400 font-mono">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
