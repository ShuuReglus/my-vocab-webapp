'use client';

export default function DailyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">🎁 デイリーボーナス</h1>
        <p className="mb-4">下のボタンを押して広告を見てポイントをゲット！</p>
        <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
          広告を見る（1日1回）
        </button>
      </div>
    </div>
  );
}
