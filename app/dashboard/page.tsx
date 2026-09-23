'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCode2,
  Grid,
  Lock,
  KeyRound,
  Layers,
  ArrowUpRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  Binary,
} from 'lucide-react';
import MobileShell from '@/components/MobileShell';

interface AuthUser {
  username: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('crypto_auth_user');
    if (!raw) {
      router.replace('/login');
    } else {
      try {
        setUser(JSON.parse(raw));
      } catch {
        router.replace('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('crypto_auth_user');
    router.replace('/login');
  };

  const modules = [
    {
      menuNumber: 'Menu 1',
      title: 'Vigenère Cipher',
      category: 'Substitusi Polialfabetik Klasik',
      description: 'Penggeseran modular alfabet menggunakan kata kunci berulang (C = (P + K) mod 26). Dilengkapi tabel tracing interaktif.',
      icon: FileCode2,
      href: '/vigenere',
      badge: 'Klasik Substitusi',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      gradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      borderColor: 'hover:border-cyan-500/50',
    },
    {
      menuNumber: 'Menu 2',
      title: 'Rail Fence Cipher',
      category: 'Transposisi Zig-Zag Klasik',
      description: 'Pengacakan posisi karakter secara bergelombang pada k rel dan membaca baris demi baris secara sistematis.',
      icon: Grid,
      href: '/rail-fence',
      badge: 'Klasik Transposisi',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'hover:border-emerald-500/50',
    },
    {
      menuNumber: 'Menu 3',
      title: 'Rijndael (AES-256)',
      category: 'Kunci Simetri Modern',
      description: 'Standar enkripsi blok simetris terotentikasi (AES-256-GCM) dengan 14 putaran transformasi (SubBytes, ShiftRows, MixColumns, AddRoundKey).',
      icon: Lock,
      href: '/rijndael',
      badge: 'Simetri Modern',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'hover:border-blue-500/50',
    },
    {
      menuNumber: 'Menu 4',
      title: 'Kunci Publik (RSA)',
      category: 'Kunci Nirsimetri Modern',
      description: 'Kriptografi asimetris berbasis faktorisasi prima dengan pasangan Kunci Publik (Enkripsi) dan Kunci Privat (Dekripsi) RSA-OAEP 2048-bit.',
      icon: KeyRound,
      href: '/rsa',
      badge: 'Nirsimetri Modern',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
      borderColor: 'hover:border-purple-500/50',
    },
    {
      menuNumber: 'Menu 5',
      title: 'Super Enkripsi',
      category: 'Multi-Layered Cryptosystem Pipeline',
      description: 'Integrasi estafet 4 lapisan berurutan: Vigenère → Rail Fence → Rijndael/AES → Kunci Publik RSA baik untuk enkripsi maupun dekripsi.',
      icon: Layers,
      href: '/super-encryption',
      badge: '4-Layer Pipeline',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'hover:border-amber-500/50',
    },
  ];

  return (
    <MobileShell title="Crypto Academic Suite" subtitle="5 Menu Kriptografi Teks Murni">
      <div className="space-y-4">
        {/* User Profile Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pengguna Aktif,</p>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                <span>{user?.username || 'Mahasiswa'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  {user?.role || 'Kriptografer'}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-400 text-slate-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center">
            <div className="flex justify-center mb-1 text-cyan-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400">Klasik</p>
            <p className="text-xs font-bold text-slate-200">Vigenère & Rail</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center">
            <div className="flex justify-center mb-1 text-blue-400">
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400">Modern</p>
            <p className="text-xs font-bold text-slate-200">AES & RSA</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center">
            <div className="flex justify-center mb-1 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400">Super</p>
            <p className="text-xs font-bold text-slate-200">Estafet 4-Lapis</p>
          </div>
        </div>

        {/* Module Cards */}
        <div className="space-y-2.5 pt-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            5 Menu Utama Kriptografi Teks
          </p>

          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                href={m.href}
                className={`group block bg-slate-800/80 hover:bg-slate-800 border border-slate-700 ${m.borderColor} rounded-2xl p-3.5 transition-all duration-200 shadow-md relative overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${m.gradient} opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <div className="flex space-x-3 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          {m.menuNumber}:
                        </span>
                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {m.title}
                        </h3>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full border font-mono ${m.badgeColor}`}
                        >
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
