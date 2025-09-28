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
          <h1 className="fixed top-16 right-10 z-30 text-7xl font-bold italic text-yellow-400 drop-shadow-xl pointer-events-none">
            WELCOME!!
          </h1>
        </>
      )}

      {/* 🌠 メッセージと動画 */}
      {/* 1つ目の星 */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="h-screen flex items-center justify-end pr-16 relative"
      >
        <div
          className={`transition-opacity duration-1000 ease-in-out text-right ${
            visibleSections.includes(0) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/stars-1.png"
            alt="stars 1"
            className="w-[48rem] h-[27rem] object-cover rounded-lg drop-shadow-xl mb-6"
          />
          <p className="text-3xl text-yellow-300 italic font-serif drop-shadow-md">
            ありえないをアリエルへ
          </p>
        </div>
      </section>

      {/* 1つ目の動画 */}
      <section className="h-screen flex items-center justify-end pr-16 relative">
        <div className="text-right">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">カードゲームアプリ</h3>
          <video
            controls
            className="w-[36rem] h-[20rem] object-cover rounded-lg drop-shadow-xl mb-4"
            poster="/card-app-thumbnail.jpg"
          >
            <source src="/card-app-demo.mp4" type="video/mp4" />
            お使いのブラウザは動画をサポートしていません。
          </video>
          <p className="text-lg text-gray-300">Firebase / Next.js / TailwindCSSで構築</p>
        </div>
      </section>

      {/* 2つ目の星 */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="h-screen flex items-center justify-end pr-16 relative"
      >
        <div
          className={`transition-opacity duration-1000 ease-in-out text-right ${
            visibleSections.includes(1) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/stars-2.png"
            alt="stars 2"
            className="w-[48rem] h-[27rem] object-cover rounded-lg drop-shadow-xl mb-6"
          />
          <p className="text-3xl text-yellow-300 italic font-serif drop-shadow-md">
            タノシミを実現させて
          </p>
        </div>
      </section>

      {/* 2つ目の動画 */}
      <section className="h-screen flex items-center justify-end pr-16 relative">
        <div className="text-right">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">名言ガチャアプリ</h3>
          <video
            controls
            className="w-[36rem] h-[20rem] object-cover rounded-lg drop-shadow-xl mb-4"
            poster="/meigen_screenshot1.jpg"
          >
            <source src="/douga_small.mp4" type="video/mp4" />
            お使いのブラウザは動画をサポートしていません。
          </video>
          <p className="text-lg text-gray-300">Python / AWS / OpenAI APIを使用</p>
        </div>
      </section>

      {/* 3つ目の星 */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="h-screen flex items-center justify-end pr-16 relative"
      >
        <div
          className={`transition-opacity duration-1000 ease-in-out text-right ${
            visibleSections.includes(2) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src="/stars-3.png"
            alt="stars 3"
            className="w-[48rem] h-[27rem] object-cover rounded-lg drop-shadow-xl mb-6"
          />
          <p className="text-3xl text-yellow-300 italic font-serif drop-shadow-md">
            ワクワクを増やす人になりたい
          </p>
        </div>
      </section>

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
            <p className="text-sm sm:text-base text-gray-700 font-sans text-left text-justify">
              フロントエンドとUIUXデザインを軸にFirebase / Next.js /
              TailwindCSSで構築した、学習者体験を重視したカードゲームアプリとPython / AWS /
              OpenAIAPIを使用した名言ガチャアプリを開発、名言ガチャアプリは事情によりREADMEのみですがZOOM等でならお見せできます。
            </p>
            <p className="text-sm sm:text-base text-gray-500">出身地　石川県</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* カードアプリ */}
          <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg border-2 border-yellow-400/30">
            <h4 className="text-yellow-400 font-bold mb-3">カードアプリ</h4>
            <div className="flex flex-col gap-2">
              <Link href="https://github.com/ShuuReglus/my-vocab-webapp" target="_blank">
                <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition font-bold text-base shadow-md w-full sm:w-56">
                  GitHub READMEを見る
                </button>
              </Link>
              <Link href="https://my-vocab-webapp.vercel.app/" target="_blank">
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-bold text-base shadow-md w-full sm:w-56">
                  アプリを体験する
                </button>
              </Link>
            </div>
          </div>

          {/* 名言アプリ */}
          <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg border-2 border-yellow-400/30">
            <h4 className="text-yellow-400 font-bold mb-3">名言アプリ</h4>
            <Link href="https://github.com/ShuuReglus/Sproject" target="_blank">
              <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition font-bold text-base shadow-md w-full sm:w-56">
                GitHub READMEを見る
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 動画紹介セクション */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-yellow-400 text-center mb-4">アプリ紹介動画</h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            開発したアプリケーションの機能と特徴をご紹介します
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* カードアプリ動画 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
                カードゲームアプリ
              </h3>
              <video
                controls
                className="w-full rounded-lg shadow-lg mb-4"
                poster="/card-app-thumbnail.jpg"
              >
                <source src="/card-app-demo.mp4" type="video/mp4" />
                お使いのブラウザは動画をサポートしていません。
              </video>
              <p className="text-gray-300 text-sm">
                Firebase / Next.js / TailwindCSSで構築した学習者体験重視のカードゲームアプリ
              </p>
            </div>

            {/* 名言アプリ動画 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
                名言ガチャアプリ
              </h3>
              <video
                controls
                className="w-full rounded-lg shadow-lg mb-4"
                poster="/meigen_screenshot1.jpg"
              >
                <source src="/douga_small.mp4" type="video/mp4" />
                お使いのブラウザは動画をサポートしていません。
              </video>
              <p className="text-gray-300 text-sm">
                Python / AWS / OpenAI APIを使用した名言ガチャアプリ
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
