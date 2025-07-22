'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import SettingsMenu from '@/components/SettingsMenu';

type Card = {
  id: string;
  text: string;
  description?: string;
};

export default function CollectionPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email);

        try {
          const q = query(collection(db, 'cards'), where('uid', '==', user.uid));
          const snapshot = await getDocs(q);
          const userCards = snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Card, 'id'>;
            return { ...data, id: doc.id };
          });
          setCards(userCards);
        } catch (error) {
          console.error('カードの取得に失敗:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [router]); // ← 依存配列に router を追加

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-8">
      <SettingsMenu />
      <h1 className="text-5xl font-bold text-center mb-8 tracking-wide">Card Collection</h1>

      {userEmail && (
        <p className="text-center mb-10 text-gray-300">
          ログイン中: <span className="font-mono text-pink-400">{userEmail}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-8 justify-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative w-[300px] h-[420px] rounded-lg shadow-xl overflow-hidden border-4 border-[#8B4513] bg-gradient-to-b from-[#e0c097] to-[#d6a76c] p-4"
          >
            {/* タイトル */}
            <div className="text-center text-4xl text-[#3a1f00] mt-4 font-script-title tracking-wider">
              Echo of Wisdom
            </div>

            {/* 名言テキスト */}
            <div className="absolute top-24 left-4 right-4 h-40 bg-[#1a1a1a] text-[#fefefe] p-3 rounded-md border-2 border-[#ccc] text-[20px] font-script-body italic drop-shadow-md leading-relaxed text-center flex items-center justify-center">
              {card.text}
            </div>

            {/* 説明欄 */}
            <div className="absolute bottom-4 left-4 right-4 text-xs italic text-[#3a1f00] bg-[#fef4dc] p-2 rounded border border-[#a67c52]">
              {card.description || 'あなたの記憶に刻まれた言葉が、力となって現れる…'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
