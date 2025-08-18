'use client';

import { useEffect, useState } from 'react';
import { auth } from '@lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);

        // 5秒後に /collection に遷移
        const timer = setTimeout(() => {
          router.push('/collection');
        }, 5000);

        return () => clearTimeout(timer);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">ログイン完了 </h1>
        {userEmail ? (
          <>
            <p className="text-lg mb-6">
              ようこそ、<span className="font-mono text-blue-300">{userEmail}</span> さん！
            </p>
            <p className="text-sm text-gray-400 mb-6">5秒後にコレクションページへ移動します...</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition-colors py-2 px-6 rounded-lg font-semibold"
            >
              ログアウト
            </button>
          </>
        ) : (
          <p>確認中...</p>
        )}
      </div>
    </div>
  );
}
