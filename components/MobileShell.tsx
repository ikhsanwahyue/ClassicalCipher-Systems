'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  FileCode2,
  Grid,
  Lock,
  KeyRound,
  Layers,
} from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function MobileShell({
  children,
  title,
  subtitle,
}: MobileShellProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/vigenere',
      label: 'Vigenere',
      icon: FileCode2,
      dot: 'bg-cyan-500',
      gradient: 'from-cyan-600 to-sky-400',
      shadow: 'shadow-cyan-500/20',
      textActive: 'text-cyan-400',
      bgActive: 'bg-cyan-500/15 ring-1 ring-cyan-500/30'
    },
    {
      href: '/rail-fence',
      label: 'Rail Fence',
      icon: Grid,
      dot: 'bg-emerald-500',
      gradient: 'from-emerald-600 to-teal-400',
      shadow: 'shadow-emerald-500/20',
      textActive: 'text-emerald-400',
      bgActive: 'bg-emerald-500/15 ring-1 ring-emerald-500/30'
    },
    {
      href: '/rijndael',
      label: 'Rijndael',
      icon: Lock,
      dot: 'bg-blue-500',
      gradient: 'from-blue-600 to-indigo-400',
      shadow: 'shadow-blue-500/20',
      textActive: 'text-blue-400',
      bgActive: 'bg-blue-500/15 ring-1 ring-blue-500/30'
    },
    {
      href: '/rsa',
      label: 'RSA',
      icon: KeyRound,
      dot: 'bg-purple-500',
      gradient: 'from-purple-600 to-fuchsia-400',
      shadow: 'shadow-purple-500/20',
      textActive: 'text-purple-400',
      bgActive: 'bg-purple-500/15 ring-1 ring-purple-500/30'
    },
    {
      href: '/super-encryption',
      label: 'Super',
      icon: Layers,
      dot: 'bg-amber-500',
      gradient: 'from-amber-600 to-orange-400',
      shadow: 'shadow-amber-500/20',
      textActive: 'text-amber-400',
      bgActive: 'bg-amber-500/15 ring-1 ring-amber-500/30'
    },
  ];

  // Temukan konfigurasi menu yang sedang aktif berdasarkan URL saat ini
  const currentItem = navItems.find((item) => pathname === item.href) || navItems[0];
  const Icon = currentItem.icon;

  return (
    <div className="w-full max-w-lg min-h-screen bg-slate-900 border-x border-slate-800 flex flex-col shadow-2xl relative pb-20 mx-auto">
      {/* Top Header dengan Warna Dinamis Sesuai Menu */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentItem.gradient} flex items-center justify-center shadow-lg ${currentItem.shadow}`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={`font-bold ${currentItem.textActive} text-sm leading-tight`}>
              {title || 'Crypto Solver'}
            </h1>
            <p className={`text-xs ${currentItem.textActive} font-medium`}>
              {subtitle || 'Classical & Modern Cipher Systems'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${currentItem.dot} animate-pulse`} />
          <span className={`text-[11px] font-mono ${currentItem.textActive} uppercase tracking-wider`}>Client-Safe</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-1 py-1.5 z-50 flex justify-around items-center">
        {navItems.map((item) => {
          const NavIcon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 ${isActive
                ? `${item.textActive} font-semibold scale-105`
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${isActive ? item.bgActive : ''
                  }`}
              >
                <NavIcon className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
