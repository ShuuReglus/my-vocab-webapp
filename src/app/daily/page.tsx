'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/lib/hooks/useUser';

export default function DailyPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [watched, setWatched] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const checkDailyStatus = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'dailyReward', 'status');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const lastDate = data.lastWatched?.toDate().toDateString();
        const today = new Date().toDateString();
        setPoints(data.totalPoints || 0);
        if (lastDate === today) {
          setWatched(true);
        }
      }
      setLoading(false);
    };
    checkDailyStatus();
  }, [user]);

  const handleReward = async () => {
    if (!user) return;

    const ref = doc(db, 'users', user.uid, 'dailyReward', 'status');
    await setDoc(ref, {
      totalPoints: points + 10,
      lastWatched: serverTimestamp(),
    });
    setPoints((prev) => prev + 10);
    setWatched(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">🎁 デイリーボーナス</h1>
        {loading ? (
          <p>読み込み中...</p>
        ) : watched ? (
          <>
            <p className="mb-4 text-green-400 font-semibold">今日はもう視聴済み！</p>
            <p className="text-yellow-400">現在のポイント: {points}</p>
          </>
        ) : (
          <>
            <p className="mb-4">下のボタンを押して広告を見てポイントをゲット！</p>
            <button
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
              onClick={handleReward}
            >
              広告を見る（1日1回）
            </button>
          </>
        )}
      </div>
    </div>
  );
}
