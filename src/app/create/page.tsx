'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db } from '@lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateCardPage() {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false); // ★ モーダル表示用
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleCreateCard = async () => {
    if (!text.trim()) {
      alert('名言を入力してください');
      return;
    }

    if (!user) {
      alert('ログイン状態を確認できません');
      return;
    }

    try {
      await addDoc(collection(db, 'cards'), {
        uid: user.uid,
        text,
        description,
        createdAt: serverTimestamp(),
      });

      if (user.isAnonymous) {
        setShowRegisterPrompt(true); // ★ 匿名ならモーダル表示
      } else {
        alert('カードを作成しました！');
        router.push('/collection');
      }
    } catch (err) {
      alert('カードの作成に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">📝 カード作成</h1>

      <div className="w-full max-w-md bg-[#1f1f2f] p-6 rounded-2xl shadow-lg space-y-6">
        <div>
          <label className="block mb-1 text-sm text-gray-300">名言 / セリフ</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
            rows={3}
            placeholder="例: I will never give up."
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">説明（任意）</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
            rows={2}
            placeholder="例: 決して諦めないという信念を表す言葉"
          />
        </div>

        <button
          onClick={handleCreateCard}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition"
        >
          カードを作成する
        </button>
      </div>

      {/* ★ 匿名ユーザー向け 登録モーダル */}
      {showRegisterPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold">登録してデータを残そう！</h2>
            <p>このままだと後からカードを見返せなくなります。アカウント登録して保存しましょう！</p>
            <div className="flex justify-end gap-4">
              <button
                className="text-gray-600 hover:underline"
                onClick={() => {
                  setShowRegisterPrompt(false);
                  router.push('/collection'); // 登録スキップ
                }}
              >
                あとで
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => router.push('/login')}
              >
                登録する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
