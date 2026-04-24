"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("RU");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Check user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Mask email: show first 2 chars and domain
  const maskEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    const masked = localPart.substring(0, 2) + 'x'.repeat(Math.min(localPart.length - 2, 5));
    return `${masked}@${'x'.repeat(Math.min(domain.length - 4, 4))}${domain.slice(-4)}`;
  };

  // Get user initials for avatar
  const getUserInitials = (email: string) => {
    if (!email) return '?';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-8 transition-colors">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center">
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
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                Купить криптовалюту
                <svg className={`w-4 h-4 transition-transform ${isCryptoOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isCryptoOpen && (
                <div
                  onMouseEnter={() => setIsCryptoOpen(true)}
                  onMouseLeave={() => setIsCryptoOpen(false)}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <Link href="/p2p" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    P2P торговля
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Быстрая покупка
                  </Link>
                </div>
              )}
            </div>

            {/* Конвертация */}
            <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              Конвертация
            </Link>

            {/* Торговля */}
            <div className="relative group">
              <button
                onMouseEnter={() => setIsTradeOpen(true)}
                onMouseLeave={() => setIsTradeOpen(false)}
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                Торговля
                <svg className={`w-4 h-4 transition-transform ${isTradeOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isTradeOpen && (
                <div
                  onMouseEnter={() => setIsTradeOpen(true)}
                  onMouseLeave={() => setIsTradeOpen(false)}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <Link href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Спот
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Фьючерсы
                  </Link>
                </div>
              )}
            </div>

            {/* О нас */}
            <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              О нас
            </Link>

            {/* Поддержка */}
            <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              Поддержка
            </Link>
          </nav>

          {/* Right Side Icons & Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {currentLang}
                <svg className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isLangOpen && (
                <ul className="absolute top-full right-0 mt-2 w-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <li
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
                    onClick={() => { setCurrentLang("RU"); setIsLangOpen(false); }}
                  >
                    RU
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
                    onClick={() => { setCurrentLang("EN"); setIsLangOpen(false); }}
                  >
                    EN
                  </li>
                </ul>
              )}
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Login/Register or User Profile */}
            {loading ? (
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ) : user ? (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getUserInitials(user.email || '')}
                  </div>
                  {/* Email */}
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {maskEmail(user.email || '')}
                  </span>
                  {/* Dropdown Arrow */}
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {getUserInitials(user.email || '')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {user.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      👤 Мой профиль
                    </Link>
                    <Link
                      href="/wallet"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      💰 Кошелек
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      📋 Мои ордера
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      ⚙️ Настройки
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        🚪 Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Register Buttons */
              <>
                <Link
                  href="/auth"
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Вход
                </Link>
                <Link
                  href="/auth"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 z-[1100]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Mobile Menu */}
          <nav
            className={`fixed top-0 right-0 h-screen w-80 bg-white z-[1000] transition-transform duration-300 shadow-2xl ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } lg:hidden flex flex-col p-8 pt-24 overflow-y-auto`}
          >
            <ul className="flex flex-col gap-6">
              <li>
                <Link href="/p2p" className="text-lg text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  Купить криптовалюту
                </Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  Конвертация
                </Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  Торговля
                </Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  О нас
                </Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                  Поддержка
                </Link>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/auth"
                className="w-full text-center px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Вход
              </Link>
              <Link
                href="/auth"
                className="w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
