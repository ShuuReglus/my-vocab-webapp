'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db, auth } from '@lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Image from 'next/image';

type Card = {
  id: string;
  text: string;
  description: string;
  uid: string;
};

async function createGuestCards(uid: string) {
  const guestCards = [
    { text: 'サンプルカード 1', description: 'どんな大きな挑戦も小さな一歩から始まる', uid },
    { text: 'サンプルカード 2', description: '学びは人生を切り拓く最強の武器である', uid },
    { text: 'サンプルカード 3', description: 'すぐに結果は出なくても努力を続けることが大切', uid },
    { text: 'サンプルカード 4', description: '失敗を恐れず挑戦することで強くなれる', uid },
    { text: 'サンプルカード 5', description: '共に歩む仲間の存在が人生を豊かにする', uid },
  ];
  for (const card of guestCards) {
    await addDoc(collection(db, 'cards'), card);
  }
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, userLoading] = useAuthState(auth);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setQuizData([]);
      setLoading(false);
      return;
    }

    const fetchCards = async () => {
      // ✅ 自分のカードのみ取得（出題用テキスト）
      const userQ = query(collection(db, 'cards'), where('uid', '==', user.uid));
      const userSnapshot = await getDocs(userQ);
      let userCards = userSnapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Card, 'id'>),
        id: doc.id,
      }));

      // ✅ ゲストカード生成
      if (user.isAnonymous && userCards.length === 0) {
        await createGuestCards(user.uid);
        const newSnapshot = await getDocs(userQ);
        userCards = newSnapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<Card, 'id'>),
          id: doc.id,
        }));
      }

      // ✅ 全ユーザーのカード（選択肢用）
      const allSnapshot = await getDocs(collection(db, 'cards'));
      const allData = allSnapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Card, 'id'>),
        id: doc.id,
      }));

      setAllCards(allData);

      const shuffled = userCards.sort(() => Math.random() - 0.5).slice(0, 5);
      setQuizData(shuffled);
      setLoading(false);
    };

    fetchCards();
  }, [user, userLoading]);

  const currentCard = quizData[currentIndex];

  const handleAnswer = (choice: string) => {
    setSelectedOption(choice);
    if (choice === currentCard.description) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  if (loading) return <div className="text-center text-white p-4">読み込み中...</div>;

  if (!quizData.length) {
    return <div className="text-center text-white p-6">カードがありません。</div>;
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center text-white text-center p-6">
        {score === quizData.length ? (
          <Image src="/victory.png" alt="Victory" width={600} height={200} className="mb-6" />
        ) : (
          <h1 className="text-6xl font-bold text-yellow-300 mb-6">Clear</h1>
        )}

        <p className="text-xl tracking-wide">
          正解率:{' '}
          <span className="text-yellow-400 text-2xl font-bold">
            {score} / {quizData.length}
          </span>
        </p>
      </div>
    );
  }

  // ✅ 選択肢は全カードから作成
  const options = allCards
    .filter((card) => card.id !== currentCard.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .concat(currentCard)
    .sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-gray-800/80 rounded-2xl shadow-2xl p-6 border border-gray-600 backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-4 text-yellow-300">
          Q{currentIndex + 1}: 「{currentCard.text}」の説明として正しいのはどれ？
        </h1>
        <div className="space-y-4">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.description)}
              disabled={selectedOption !== null}
              className={`w-full py-3 px-4 rounded-lg border-2 transition-colors duration-300 ${
                selectedOption === option.description
                  ? option.description === currentCard.description
                    ? 'bg-green-600 border-green-400 text-white shadow-md'
                    : 'bg-red-600 border-red-400 text-white shadow-md'
                  : 'bg-gray-900 border-gray-500 hover:bg-gray-700'
              }`}
            >
              {option.description}
            </button>
          ))}
        </div>

        {selectedOption && (
          <div className="text-center mt-6">
            <button
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg shadow-md"
            >
              次へ進む
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


