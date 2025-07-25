'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-50" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="p-2 text-white hover:text-yellow-300">
        <Settings size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700"
          >
            <ul className="divide-y divide-gray-700">
              <li>
                <Link
                  href="/create"
                  className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  📝 カードを作成
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  👤 プロフィール
                </Link>
                <Link
                  href="/quiz"
                  className="block px-4 py-2 hover:bg-gray-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  🧠 クイズに挑戦
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
