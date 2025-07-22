'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || '');
          setBio(data.bio || '');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          name,
          bio,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert('プロフィールを保存しました！');
    } catch (err) {
      console.error('保存エラー:', err);
      alert('プロフィールの保存に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">👤 プロフィール</h1>

      <div className="max-w-md mx-auto bg-[#16213e] p-6 rounded-2xl shadow space-y-6">
        <div>
          <label className="block text-sm mb-1 text-gray-300">名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
            placeholder="あなたの名前"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-300">自己紹介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
            placeholder="好きな趣味など"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded transition"
        >
          保存する
        </button>
      </div>
    </div>
  );
}
