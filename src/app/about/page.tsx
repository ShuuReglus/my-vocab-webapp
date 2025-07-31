// AboutPage.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef as useThreeRef } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function RotatingPlanet({
  textureUrl,
  position,
  size,
}: {
  textureUrl: string;
  position: [number, number, number];
  size: number;
}) {
  const meshRef = useThreeRef<THREE.Mesh>(null!);
  const texture = new THREE.TextureLoader().load(textureUrl);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const moonEndY = 1600; // 月が消えるy位置（プロフィールのちょい前）

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
      　　　　{/* 🌌 3D惑星表示 */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 25], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'high-performance', antialias: true }}
          frameloop="always"
          resize={{ scroll: false }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* 背景の星 */}
          <Stars
            radius={150}
            depth={80}
            count={3000}
            factor={6}
            saturation={0.8}
            fade
            speed={0.5}
          />

          {/* 地球 */}
          <RotatingPlanet textureUrl="/earth.jpg" position={[0, 0, 0]} size={2.5} />

          {/* 木星 */}
          <RotatingPlanet textureUrl="/jupiter.jpg" position={[6, 3, -2]} size={2.3} />

          {/* 火星 */}
          <RotatingPlanet textureUrl="/mars.jpg" position={[-5, -2, -3]} size={1.8} />

          <OrbitControls enableZoom={false} enableRotate={false} />
        </Canvas>
      </div>
      {/* 🌠 背景アニメーション（流れ星） */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="animate-shooting-star absolute top-[20%] left-[80%] w-1 h-1 bg-white rounded-full shadow-lg"></div>
      </div>
      {/* 🌕 月 & Welcome（特定位置だけ） */}
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
      {/* 🌠 星空とメッセージ（右寄せ） */}
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
      <section className="min-h-[60vh] bg-gray-900 text-white px-6 py-20 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
        <h2 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">👤 開発者プロフィール</h2>

        <img
          src="/profile-placeholder.png"
          alt="プロフィール画像"
          className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover shadow-xl"
        />

        <div className="backdrop-blur-md bg-white/10 px-6 py-4 rounded-xl shadow-lg max-w-xl">
          <p className="text-gray-200 text-lg leading-relaxed">
            フロントエンドとUIUXデザインを軸に、学習者体験を重視したアプリケーションを開発中。
            Firebase、Next.js、Tailwind CSSで構築。
          </p>
        </div>

        <Link href="/">
          <button className="bg-yellow-500 text-black px-8 py-3 rounded hover:bg-yellow-600 transition font-bold text-lg shadow-md">
            アプリを体験する
          </button>
        </Link>
      </section>
    </main>
  );
}
