'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 仮ログイン処理（API連携予定ならここ）
    console.log('ログイン情報:', { email, password });
    alert('ログインボタンが押されました！');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>

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
          ログイン
        </button>
      </form>
    </div>
  );
}
