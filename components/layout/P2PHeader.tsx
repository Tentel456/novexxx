"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/hooks/useUser";

export default function P2PHeader() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("RU");
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, loading, signOut } = useUser();

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Если загружается, показываем скелетон
  if (loading) {
    return (
      <header className="relative z-[500] bg-[#fcfcfd]">
        <div className="container max-w-[1550px] mx-auto px-4">
          <div className="flex items-center justify-between gap-8 min-h-[64px] py-[18px]">
            <div className="flex items-center gap-12 flex-1 min-w-0">
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/assets/logo/novex_logo.png" 
                  alt="NOVEX" 
                  width={120} 
                  height={40} 
                  className="object-contain"
                />
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Если пользователь не авторизован, редирект на auth
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
    return null;
  }

  return (
    <header className="relative z-[500] bg-[#fcfcfd]">
      <div className="container max-w-[1550px] mx-auto px-4">
        <div className="flex items-center justify-between gap-8 min-h-[64px] py-[18px]">
          {/* Left Side - Logo + Nav */}
          <div className="flex items-center gap-12 flex-1 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/assets/logo/novex_logo.png" 
                alt="NOVEX" 
                width={120} 
                height={40} 
                className="object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10 flex-1">
              {/* Купить криптовалюту - Mega Menu */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsCryptoOpen(true)}
                  onMouseLeave={() => setIsCryptoOpen(false)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-black hover:text-[#1e2329] transition"
                >
                  Купить криптовалюту
                  <svg className={`w-3 h-3 transition-transform ${isCryptoOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
                
                {/* Mega Dropdown */}
                {isCryptoOpen && (
                  <div
                    onMouseEnter={() => setIsCryptoOpen(true)}
                    onMouseLeave={() => setIsCryptoOpen(false)}
                    className="absolute top-full left-0 mt-4 w-[320px] bg-white rounded-2xl border border-[#eef0f3] shadow-xl z-50"
                  >
                    <div className="p-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e2329] mb-3.5">
                        Купить криптовалюту
                      </h3>
                      <div className="flex flex-col gap-1">
                        <Link href="/p2p" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2b6aff]/5 transition">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[#2b6aff]/10 text-[#2b6aff]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[#1e2329] mb-1">P2P торговля</div>
                            <div className="text-xs text-[#6b7280] leading-snug">
                              Покупайте и продавайте криптовалюту напрямую у других пользователей
                            </div>
                          </div>
                        </Link>
                        <Link href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2b6aff]/5 transition">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[#2b6aff]/10 text-[#2b6aff]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[#1e2329] mb-1">Быстрая покупка</div>
                            <div className="text-xs text-[#6b7280] leading-snug">
                              Покупка криптовалюты банковской картой в несколько кликов
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Конвертация */}
              <Link href="#" className="text-sm font-semibold text-black hover:text-[#1e2329] transition">
                Конвертация
              </Link>

              {/* Торговля - Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsTradeOpen(true)}
                  onMouseLeave={() => setIsTradeOpen(false)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-black hover:text-[#1e2329] transition"
                >
                  Торговля
                  <svg className={`w-3 h-3 transition-transform ${isTradeOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
                
                {/* Trade Dropdown */}
                {isTradeOpen && (
                  <div
                    onMouseEnter={() => setIsTradeOpen(true)}
                    onMouseLeave={() => setIsTradeOpen(false)}
                    className="absolute top-full left-0 mt-4 w-[260px] bg-white rounded-2xl border border-[#eef0f3] shadow-xl p-1.5 z-50"
                  >
                    <Link href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2b6aff]/7 transition">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(43,106,255,0.06)] text-[#2b6aff]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 17V10M12 17V7M18 17V4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0f172a] mb-0.5">Спот</div>
                        <div className="text-xs text-[#6b7280] leading-tight">Классическая торговля криптовалютой</div>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2b6aff]/7 transition">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(43,106,255,0.06)] text-[#2b6aff] text-lg font-bold">
                        %
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0f172a] mb-0.5">Маржа</div>
                        <div className="text-xs text-[#6b7280] leading-tight">Используйте заемные средства для увеличения потенциала</div>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2b6aff]/7 transition">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(43,106,255,0.06)] text-[#2b6aff]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16L9 11L13 15L20 8M14 8H20V14" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0f172a] mb-0.5">Опционы</div>
                        <div className="text-xs text-[#6b7280] leading-tight">Профессиональные инструменты и гибкие стратегии</div>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2b6aff]/7 transition">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[rgba(43,106,255,0.06)] text-[#2b6aff] text-xs font-bold tracking-wide">
                        NFT
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0f172a] mb-0.5">NFT маркетплейс</div>
                        <div className="text-xs text-[#6b7280] leading-tight">Покупайте, продавайте и создавайте NFT</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* О нас */}
              <Link href="#" className="text-sm font-semibold text-black hover:text-[#1e2329] transition">
                О нас
              </Link>

              {/* Поддержка */}
              <Link href="#" className="text-sm font-semibold text-black hover:text-[#1e2329] transition">
                Поддержка
              </Link>
            </nav>
          </div>

          {/* Right Side - Actions */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-1 py-2 text-[#474d57] hover:text-[#1e2329] hover:bg-[#2b6aff]/6 rounded-md transition"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" />
                </svg>
                <span className="text-sm font-semibold text-black">{currentLang}</span>
                <svg className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              {isLangOpen && (
                <ul className="absolute top-full right-0 mt-1.5 w-[140px] bg-white border border-[#e8eaed] rounded-xl shadow-lg p-2 z-50">
                  <li>
                    <button
                      onClick={() => { setCurrentLang("RU"); setIsLangOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-[#474d57] hover:text-[#1e2329] hover:bg-[#2b6aff]/6 rounded-lg transition"
                    >
                      RU
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { setCurrentLang("EN"); setIsLangOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-[#474d57] hover:text-[#1e2329] hover:bg-[#2b6aff]/6 rounded-lg transition"
                    >
                      EN
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#2b6aff]/6 rounded-xl transition"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2b6aff] to-[#1f5ae6] flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitial(user.email || "U")
                  )}
                </div>
                {/* Email */}
                <span className="text-sm font-semibold text-[#1e2329] max-w-[120px] truncate">
                  {user.email}
                </span>
                <svg className={`w-3 h-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-[220px] bg-white border border-[#e8eaed] rounded-xl shadow-xl p-2 z-50">
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#474d57] hover:text-[#1e2329] hover:bg-[#2b6aff]/6 rounded-lg transition"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Аккаунт
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#474d57] hover:text-[#1e2329] hover:bg-[#2b6aff]/6 rounded-lg transition"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Кошелек
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#474d57] hover:text-[#1e2329] hover:bg-[#2b6aff]/6 rounded-lg transition"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Настройки
                  </Link>
                  <div className="my-2 border-t border-[#e8eaed]"></div>
                  <button
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-[#ef4444] hover:bg-red-50 rounded-lg transition"
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl hover:bg-[#2b6aff]/8 transition"
          >
            <Image src="/novex-home/burger-menu.svg" alt="Menu" width={20} height={14} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[1000] bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Profile in Mobile */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2b6aff] to-[#1f5ae6] flex items-center justify-center text-white font-bold text-lg">
                {getInitial(user.email || "U")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1e2329] truncate">{user.email}</div>
                <Link href="#" className="text-xs text-[#2b6aff] hover:underline">Настройки</Link>
              </div>
            </div>

            <nav className="flex flex-col gap-6">
              <Link href="/p2p" className="text-lg font-semibold text-[#1e2329] hover:text-[#2b6aff]">Купить криптовалюту</Link>
              <Link href="#" className="text-lg font-semibold text-[#1e2329] hover:text-[#2b6aff]">Конвертация</Link>
              <Link href="#" className="text-lg font-semibold text-[#1e2329] hover:text-[#2b6aff]">Торговля</Link>
              <Link href="#" className="text-lg font-semibold text-[#1e2329] hover:text-[#2b6aff]">О нас</Link>
              <Link href="#" className="text-lg font-semibold text-[#1e2329] hover:text-[#2b6aff]">Поддержка</Link>
              <div className="border-t border-gray-200 pt-6">
                <Link href="#" className="flex items-center gap-3 text-base font-semibold text-[#1e2329] hover:text-[#2b6aff] mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Аккаунт
                </Link>
                <Link href="#" className="flex items-center gap-3 text-base font-semibold text-[#1e2329] hover:text-[#2b6aff] mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Кошелек
                </Link>
                <button className="flex items-center gap-3 text-base font-semibold text-[#ef4444] hover:text-[#dc2626]" onClick={signOut}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Выйти
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
