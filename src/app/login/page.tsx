'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  EmailAuthProvider,
  linkWithCredential,
  deleteUser,
  User,
} from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  // 📝 サンプルカードを5枚作成
  const createSampleCards = async (user: User) => {
    try {
      const q = query(collection(db, 'cards'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log('カードはすでに存在するので作成しません');
        return;
      }

      const sampleCards = Array.from({ length: 5 }, (_, i) => ({
        text: `サンプルカード ${i + 1}`,
        description: `これはサンプルカード ${i + 1} の説明です`,
        uid: user.uid,
      }));

      for (const card of sampleCards) {
        await addDoc(collection(db, 'cards'), card);
      }

      console.log('サンプルカードを作成しました');
    } catch (err) {
      console.error('サンプルカード作成エラー:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let user: User | null = null;

      if (isRegister) {
        const currentUser = auth.currentUser;

        if (currentUser && currentUser.isAnonymous) {
          // 🔗 匿名ユーザーが本登録する場合
          const credential = EmailAuthProvider.credential(email, password);
          const linkedUser = await linkWithCredential(currentUser, credential);
          user = linkedUser.user;
          toast.success('🎉 匿名アカウントが登録に引き継がれました！');
        } else {
          // ✨ 通常の新規登録
          const result = await createUserWithEmailAndPassword(auth, email, password);
          user = result.user;
          toast.success('🎉 ユーザー登録が完了しました！');
        }

        if (user) {
          await createSampleCards(user); // 初回ログイン時にサンプル作成
        }

        router.push('/dashboard');
      } else {
        // 🔐 通常ログイン
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
        toast.success('✅ ログイン成功！');
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`🚨 エラー: ${error.message}`);
      } else {
        toast.error('予期せぬエラーが発生しました');
      }
    }
  };

  const loginAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      console.log('ゲストログイン成功:', user);
      toast.success('🙌 ゲストとしてログインしました');

      await createSampleCards(user); // ゲストにもカード作成
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('ゲストログインエラー:', error);
        toast.error(`ゲストログイン失敗: ${error.message}`);
      } else {
        console.error('不明なエラー:', error);
        toast.error('ゲストログイン失敗: 不明なエラー');
      }
    }
  };

  // 🗑️ ゲストはアプリ閉じたら削除
  useEffect(() => {
    const handleUnload = async () => {
      const user = auth.currentUser;
      if (user && user.isAnonymous) {
        try {
          await deleteUser(user);
          console.log('匿名ユーザーを削除しました');
        } catch (err) {
          console.error('匿名ユーザー削除エラー:', err);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isRegister ? '新規登録' : 'ログイン'}
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-sm">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-lg font-semibold"
        >
          {isRegister ? '新規登録' : 'ログイン'}
        </button>

        <p className="text-sm mt-4 text-center">
          {isRegister ? 'すでにアカウントをお持ちですか？' : 'まだアカウントを持っていませんか？'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 underline ml-1"
          >
            {isRegister ? 'ログインはこちら' : '新規登録'}
          </button>
        </p>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={loginAsGuest}
            className="text-sm text-gray-300 underline hover:text-white"
          >
            ゲストで始める
          </button>
        </div>
      </form>
    </div>
  );
}

