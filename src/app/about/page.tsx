'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-black text-white">
      {/* 月と背景 */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-900 z-0" />
        <div
          className="z-10"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <img src="/moon.png" alt="moon" className="w-48 h-48 object-contain opacity-90" />
        </div>
        <h1 className="z-20 text-4xl font-bold text-yellow-300">ようこそ</h1>
      </section>

      {/* 星空エフェクト段階表示 */}
      {[1, 2, 3].map((step) => {
        const visible = scrollY > step * 200;
        return (
          <section key={step} className="h-screen flex items-center justify-center relative">
            <div
              className={`transition-opacity duration-1000 ${
                visible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={`/stars-${step}.png`} alt={`stars ${step}`} className="w-full max-w-md" />
            </div>
          </section>
        );
      })}

      {/* プロフィール + アプリ体験 */}
      <section className="min-h-[60vh] bg-gray-900 text-white px-6 py-16 flex flex-col items-center justify-center text-center space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400">👤 開発者プロフィール</h2>
        <p className="max-w-xl text-gray-300">
          フロントエンドとUIUXデザインを軸に、学習者体験を重視したアプリケーションを開発中。
          Firebase、Next.js、Tailwind CSSで構築。
        </p>
        <Link href="/">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded hover:bg-yellow-600 transition font-bold">
            アプリを体験する
          </button>
        </Link>
      </section>
    </main>
  );
}
