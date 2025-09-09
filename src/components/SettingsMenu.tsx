'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '@lib/firebase';
import { doc, getDoc} from 'firebase/firestore';
import { useUser } from '@/lib/hooks/useUser';

type Card = {
  id: string;
  text: string;
};

interface SettingsMenuProps {
  cards: Card[];
  onDelete: (id: string) => void; // CollectionPage の handleDeleteCard を渡す
}

export default function SettingsMenu({ cards, onDelete }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<number | null>(null);
  const { user } = useUser();

  // 外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        setShowDeleteList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ポイント取得
  useEffect(() => {
    const fetchPoints = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'dailyReward', 'status');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setPoints(data.totalPoints || 0);
      }
    };
    fetchPoints();
  }, [user]);

  
  // カード削除
const handleClickDelete = (id: string) => {
  onDelete(id);
  setOpen(false);
};


  return (
    <div className="absolute top-4 right-4 z-50" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-white hover:text-yellow-300"
      >
        <Settings size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 w-64 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-2"
          >
            {!showDeleteList ? (
  <div>
    <ul className="divide-y divide-gray-700">
      <li>
        <Link
          href="/create"
          className="block px-4 py-2 hover:bg-gray-800 transition-colors"
          onClick={() => setOpen(false)}
        >
          📝 カードを作成
        </Link>
        <Link
          href="/profile"
          className="block px-4 py-2 hover:bg-gray-800 transition-colors"
          onClick={() => setOpen(false)}
        >
          👤 プロフィール
        </Link>
        <Link
          href="/quiz"
          className="block px-4 py-2 hover:bg-gray-800 transition-colors"
          onClick={() => setOpen(false)}
        >
          🧠 クイズに挑戦
        </Link>
        <Link
  href="/update"
  className="block px-4 py-2 hover:bg-gray-800 transition-colors"
  onClick={() => setOpen(false)}
>
  ✏️ カードを変更
</Link>


      </li>
    </ul>

    {/* 🗑️ カード削除ボタンは ul の外に置く */}
    <button
      className="w-full text-left px-4 py-2 hover:bg-red-700 transition-colors mt-2"
      onClick={() => setShowDeleteList(true)}
    >
      🗑️ カードを消す
    </button>
  </div>
) : (
  <div>
    <p className="px-4 py-2 text-sm text-gray-400">
      削除するカードを選んでください
    </p>
    <ul className="max-h-48 overflow-y-auto">
      {cards.map((card) => (
        <li
          key={card.id}
          className="px-4 py-2 hover:bg-red-700 cursor-pointer transition-colors"
          onClick={() => handleClickDelete(card.id)}
        >
          {card.text}
        </li>
      ))}
    </ul>
    <button
      className="w-full px-4 py-2 text-center text-gray-400 hover:text-white"
      onClick={() => setShowDeleteList(false)}
    >
      ← 戻る
    </button>
  </div>
)}

            
            {points !== null && !showDeleteList && (
              <p className="px-4 py-2 text-sm text-yellow-400">
                ポイント: {points}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



