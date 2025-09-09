'use client';

import { useState, useEffect } from 'react';
import { db } from '@lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useUser } from '@/lib/hooks/useUser';

type Card = {
  id: string;
  text: string;
  description?: string;
  uid: string;
};

export default function UpdatePage() {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // カード取得
  useEffect(() => {
    const fetchCards = async () => {
      if (!user) return;
      const q = query(collection(db, 'cards'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const userCards = snapshot.docs.map(d => ({
        id: d.id,
        text: d.data().text,
        description: d.data().description,
        uid: d.data().uid
      }));
      setCards(userCards);
    };
    fetchCards();
  }, [user]);

  const startEdit = (card: Card) => {
    setEditingId(card.id);
    setEditText(card.text);
    setEditDescription(card.description || '');
  };

  const saveEdit = async () => {
    if (!editingId || !user) return;
    const cardRef = doc(db, 'cards', editingId);
    await updateDoc(cardRef, { text: editText, description: editDescription });
    setCards(cards.map(c => 
      c.id === editingId ? { ...c, text: editText, description: editDescription } : c
    ));
    setEditingId(null);
    setEditText('');
    setEditDescription('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-8 tracking-wide">カード編集</h1>

      <div className="flex flex-wrap gap-8 justify-center">
        {cards.length === 0 && (
          <p className="text-center text-gray-400 w-full">編集可能なカードがありません。</p>
        )}

        {cards.map((card) => (
          <div
            key={card.id}
            className="relative w-[300px] h-[420px] rounded-lg shadow-xl overflow-hidden border-4 border-[#8B4513] bg-gradient-to-b from-[#e0c097] to-[#d6a76c] p-4 flex flex-col justify-between"
          >
            {/* タイトル部分固定 */}
            <div className="text-center text-4xl text-[#3a1f00] mt-4 font-script-title tracking-wider">
              Echo of Wisdom
            </div>

            {/* テキスト部分 */}
            <div className="absolute top-24 left-4 right-4 h-40 p-3 rounded-md border-2 border-[#ccc] text-[20px] font-script-body italic drop-shadow-md flex items-center justify-center">
              {editingId === card.id ? (
                <textarea
  value={editDescription}
  onChange={(e) => setEditDescription(e.target.value)}
  className="w-full p-1 rounded resize-none bg-white text-black"
/>

              ) : (
                <span className="text-[#fefefe] text-center">{card.text}</span>
              )}
            </div>

            {/* 説明部分 */}
            <div className="absolute bottom-4 left-4 right-4 text-xs italic bg-black p-2 rounded border border-[#a67c52]">
              {editingId === card.id ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-1 rounded text-black resize-none"
                />
              ) : (
                card.description || 'あなたの記憶に刻まれた言葉が、力となって現れる…'
              )}
            </div>

            {/* 編集ボタン or 保存キャンセル */}
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {editingId === card.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    キャンセル
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(card)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  編集
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



