// src/components/OpeningImage.tsx
import { useEffect, useState } from 'react';

export const OpeningImage = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 3000); // 3秒後にテキスト表示

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-white transition-opacity duration-1000 ${
        showText ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h1 className="text-4xl font-bold">Hello World</h1>
    </div>
  );
};
