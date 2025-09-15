'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const OpeningImage = () => {
  const [step, setStep] = useState(0);
  const router = useRouter(); // ← 追加

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), 5000);
      return () => clearTimeout(timer);
    } else if (step === 2) {
      // アニメ終了後に遷移
      const timer = setTimeout(() => {
        router.push('/login');
      }, 1500); // アニメ終わるちょっと後に遷移
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const baseStyle = 'absolute inset-0 w-full h-screen flex items-center justify-center';

  return (
    <>
      {step === 0 && (
        <div className={`${baseStyle} animate-zoomSpin bg-black`} style={{ zIndex: 30 }}>
          <Image src="/images/opening.jpg" alt="Opening" fill className="object-cover opacity-80" />
          <h1 className="text-5xl text-white font-bold animate-blink"></h1>
        </div>
      )}

      {step === 1 && (
  <div
    className={`${baseStyle} animate-rainbowSlide`}
    style={{
      background: 'linear-gradient(270deg, #A8E6CF, #66BB6A, #2E7D32)',
      backgroundSize: '1200% 1200%',
      zIndex: 20,
    }}
  >
    <h1 className="text-5xl font-bold text-white animate-slideIn">
      Echo of Wisdomはカードを作り記憶に残します
    </h1>
  </div>
)}


      {step === 2 && (
        <div className={`${baseStyle} bg-black animate-zoomOut`} style={{ zIndex: 10 }}>
          <h1 className="text-6xl font-bold text-red-600 text-shadow animate-explode">
            {"Let's go now"}
          </h1>
        </div>
      )}
    </>
  );
};
