// src/app/about/page.tsx
'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">🎓 ポートフォリオ紹介</h1>
      <p className="mb-6 text-lg text-gray-300 max-w-xl text-center">
        このページは開発者が作成したクイズ学習アプリの紹介用ページです。Firebase, Next.js, Tailwind
        CSS を使用しています。
      </p>
      <Link href="/">
        <button className="bg-yellow-500 text-black px-6 py-3 rounded hover:bg-yellow-600 transition font-bold">
          アプリを体験する
        </button>
      </Link>
    </main>
  );
}
