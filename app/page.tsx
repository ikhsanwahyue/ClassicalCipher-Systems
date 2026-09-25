'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/vigenere');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono tracking-wider">Memuat Crypto Solver...</p>
      </div>
    </div>
  );
}
