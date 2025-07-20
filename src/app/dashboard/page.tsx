'use client';

import { useEffect, useState } from 'react';
import { auth } from '@lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push('/login'); // 未ログインならログインへ戻す
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">ログイン完了 🎉</h1>
        {userEmail ? (
          <p className="text-lg">
            ようこそ、<span className="font-mono text-blue-300">{userEmail}</span> さん！
          </p>
        ) : (
          <p>確認中...</p>
        )}
      </div>
    </div>
  );
}
