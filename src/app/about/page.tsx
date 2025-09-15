'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const moonEndY = 1600;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
          if (entry.isIntersecting && !visibleSections.includes(index)) {
            setVisibleSections((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  return (
    <main className="bg-black text-white font-sans relative overflow-x-hidden">
      {/* 🌠 背景アニメーション */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="animate-shooting-star absolute top-[20%] left-[80%] w-1 h-1 bg-white rounded-full shadow-lg"></div>
      </div>

      {/* 🌕 月 & Welcome */}
      {scrollY < moonEndY && (
        <>
          <div
            className="fixed top-10 left-10 z-30 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * 0.9}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <img
              src="/moon.png"
              alt="moon"
              className="w-[24rem] h-[24rem] object-contain opacity-90 drop-shadow-2xl"
            />
          </div>
          <h1 className="fixed top-16 right-10 z-30 text-7xl font-bold italic bg-gradient-to-r from-yellow-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-xl pointer-events-none">
            WELCOME!!
          </h1>
        </>
      )}

      {/* 🌠 メッセージ */}
      {[1, 2, 3].map((step, idx) => {
        const isVisible = visibleSections.includes(idx);
        const messages = [
          'ありえないをアリエルへ',
          'タノシミを実現させて',
          'ワクワクを増やす人になりたい',
        ];
        return (
          <section
            key={step}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            className="h-screen flex items-center justify-end pr-16 relative"
          >
            <div
              className={`transition-opacity duration-1000 ease-in-out text-right ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={`/stars-${step}.png`}
                alt={`stars ${step}`}
                className="w-full max-w-2xl drop-shadow-xl mb-6"
              />
              <p className="text-3xl text-yellow-300 italic font-serif drop-shadow-md">
                {messages[idx]}
              </p>
            </div>
          </section>
        );
      })}

      {/* 🧑‍💻 プロフィール */}
      <section className="min-h-[70vh] bg-gray-900 text-white px-6 py-20 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 drop-shadow-lg">
          開発者プロフィール
        </h2>
        <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl w-full flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src="/創宇宙服.png"
              alt="プロフィール画像"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-yellow-400 object-cover object-top shadow-md"
            />
          </div>
          <div className="flex flex-col items-center sm:items-start space-y-3">
            <h3 className="text-2xl font-bold">修田　創</h3>
            <p className="text-gray-600">SHIYUUDEN HAJIME</p>
            <p className="text-sm sm:text-base text-gray-700">
              フロントエンドとUIUXデザインを軸にFirebase / Next.js / TailwindCSSで構築した、学習者体験を重視したカードゲームアプリとPython / AWS / OpenAIAPIを使用した名言ガチャアプリを開発、名言ガチャアプリは事情によりREADMEのみですがZOOM等でならお見せできます。
            </p>
            <p className="text-sm sm:text-base text-gray-500">出身地　石川県</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="https://github.com/ShuuReglus/Sproject" target="_blank">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-600 transition font-bold text-lg shadow-md">
              名言アプリGitHub READMEを見る
            </button>
          </Link>
          <Link href="https://github.com/ShuuReglus/my-vocab-webapp" target="_blank">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-600 transition font-bold text-lg shadow-md">
              カードアプリGitHub READMEを見る
            </button>
          </Link>
          <Link href="https://my-vocab-webapp.vercel.app/" target="_blank">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg hover:bg-yellow-600 transition font-bold text-lg shadow-md">
              カードアプリを体験する
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}

