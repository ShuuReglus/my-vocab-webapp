'use client';

import { useState } from 'react';
import { auth } from '@lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const currentUser = auth.currentUser;

        if (currentUser && currentUser.isAnonymous) {
          // 🔗 匿名ユーザーが本登録する場合
          const credential = EmailAuthProvider.credential(email, password);
          await linkWithCredential(currentUser, credential);
          toast.success('🎉 匿名アカウントが登録に引き継がれました！');
        } else {
          // ✨ 通常の新規登録
          await createUserWithEmailAndPassword(auth, email, password);
          toast.success('🎉 ユーザー登録が完了しました！');
        }

        router.push('/dashboard');
      } else {
        // 🔐 通常ログイン
        await signInWithEmailAndPassword(auth, email, password);
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
      console.log('ゲストログイン成功:', result.user);
      toast.success('🙌 ゲストとしてログインしました');
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
