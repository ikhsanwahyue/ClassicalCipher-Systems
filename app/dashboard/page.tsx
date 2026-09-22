'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Image as ImageIcon,
  FileText,
  Activity,
  Layers,
  ArrowUpRight,
  LogOut,
  Sparkles,
  Key,
  Binary
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
      title: '5 Menu Kriptografi Teks',
      description: 'Caesar, Vigenere, Bitwise XOR, AES-256 & Super Enkripsi Pipeline.',
      icon: Lock,
      href: '/text-crypto',
      badge: '5 Algoritma',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      gradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    },
    {
      title: 'Steganografi Gambar',
      description: 'Sisipkan dan ekstrak pesan rahasia ke dalam piksel gambar (LSB).',
      icon: ImageIcon,
      href: '/image-steganography',
      badge: 'LSB Mode',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    },
    {
      title: 'Enkripsi Berkas Dokumen',
      description: 'Enkripsi & dekripsi file (PDF, TXT, DOCX) dengan AES-256-GCM authenticated.',
      icon: FileText,
      href: '/file-crypto',
      badge: 'File Vault',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    },
    {
      title: 'Panel Tracing & Visualisasi',
      description: 'Pantau kalkulasi matematis, pergeseran ASCII, & permutasi bit secara transparan.',
      icon: Activity,
      href: '/tracing',
      badge: 'Step-by-Step',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    },
  ];

  return (
    <MobileShell title="Crypto Hub" subtitle="Control Center">
      <div className="space-y-4">
        {/* Welcome & Profile Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Selamat Datang,</p>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                <span>{user?.username || 'User'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-normal">
                  {user?.role || 'Analyst'}
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

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center">
            <div className="flex justify-center mb-1 text-cyan-400">
              <Key className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400">Klasik</p>
            <p className="text-xs font-bold text-slate-200">Caesar & Vig</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center">
            <div className="flex justify-center mb-1 text-emerald-400">
              <Binary className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400">Modern</p>
            <p className="text-xs font-bold text-slate-200">XOR & AES</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center">
            <div className="flex justify-center mb-1 text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <p className="text-[10px] text-slate-400">Super</p>
            <p className="text-xs font-bold text-slate-200">4-Stage Chain</p>
          </div>
        </div>

        {/* Module Navigation Cards */}
        <div className="space-y-3 pt-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Modul Pembelajaran & Kriptografi
          </p>

          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                href={m.href}
                className="group block bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-200 shadow-md relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${m.gradient} opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex space-x-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
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
