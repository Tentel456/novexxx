"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthHeader() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("RU");
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);

  return (
    <header className="relative z-10 py-6 px-8 bg-white/90 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo/novex_logo.png"
            alt="NOVEX"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {/* Купить криптовалюту */}
          <div className="relative group">
            <button
              onMouseEnter={() => setIsCryptoOpen(true)}
              onMouseLeave={() => setIsCryptoOpen(false)}
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
            >
              Купить криптовалюту
              <svg
                className={`w-4 h-4 transition-transform ${
                  isCryptoOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isCryptoOpen && (
              <div
                onMouseEnter={() => setIsCryptoOpen(true)}
                onMouseLeave={() => setIsCryptoOpen(false)}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <Link
                  href="/p2p"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  P2P торговля
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Быстрая покупка
                </Link>
              </div>
            )}
          </div>

          {/* Конвертация */}
          <Link
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Конвертация
          </Link>

          {/* Торговля */}
          <div className="relative group">
            <button
              onMouseEnter={() => setIsTradeOpen(true)}
              onMouseLeave={() => setIsTradeOpen(false)}
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
            >
              Торговля
              <svg
                className={`w-4 h-4 transition-transform ${
                  isTradeOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isTradeOpen && (
              <div
                onMouseEnter={() => setIsTradeOpen(true)}
                onMouseLeave={() => setIsTradeOpen(false)}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Спот
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Фьючерсы
                </Link>
              </div>
            )}
          </div>

          {/* О нас */}
          <Link
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            О нас
          </Link>

          {/* Поддержка */}
          <Link
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Поддержка
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-gray-900 hover:text-gray-700 transition"
            >
              {currentLang}
              <svg
                className={`w-4 h-4 transition-transform ${
                  isLangOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isLangOpen && (
              <ul className="absolute top-full right-0 mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                  onClick={() => {
                    setCurrentLang("RU");
                    setIsLangOpen(false);
                  }}
                >
                  RU
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                  onClick={() => {
                    setCurrentLang("EN");
                    setIsLangOpen(false);
                  }}
                >
                  EN
                </li>
              </ul>
            )}
          </div>

          {/* Auth Buttons */}
          <Link
            href="/auth?mode=login"
            className="px-6 py-2 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Вход
          </Link>
          <Link
            href="/auth?mode=signup"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Регистрация
          </Link>
        </div>
      </div>
    </header>
  );
}
