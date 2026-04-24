"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "signup" | "login";
type AuthStep = "email" | "code";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]); // 8 цифр
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 минуты
  const [canResend, setCanResend] = useState(false);

  const supabase = createClient();

  // Countdown timer
  useEffect(() => {
    if (step === "code" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Если вставили весь код
      const digits = value.slice(0, 8).split("");
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (i < 8) newCode[i] = digit;
      });
      setCode(newCode);
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Автоматический переход к следующему полю
    if (value && index < 7) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Отправляем OTP код на email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: mode === "signup",
          data: {
            referral_code: referralCode || null,
          },
        },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Код отправлен на вашу почту!",
      });
      
      // Переходим к вводу кода
      setStep("code");
      setCountdown(180);
      setCanResend(false);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const otpCode = code.join("");
    
    if (otpCode.length !== 8) {
      setMessage({ type: "error", text: "Введите полный код из 8 цифр" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Успешно! Перенаправление..." });
      
      // Redirect to P2P page
      setTimeout(() => {
        window.location.href = "/p2p";
      }, 1000);
    } catch (error: any) {
      setMessage({ type: "error", text: "Неверный код. Попробуйте еще раз." });
      setCode(["", "", "", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: mode === "signup",
          data: {
            referral_code: referralCode || null,
          },
        },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Новый код отправлен!",
      });
      
      setCountdown(180);
      setCanResend(false);
      setCode(["", "", "", "", "", "", "", ""]);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    setCode(["", "", "", "", "", "", "", ""]);
    setMessage(null);
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };

  // Если на этапе ввода кода
  if (step === "code") {
    return (
      <div className="flex items-start pt-12 justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Подтвердите свой email
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Мы отправили 8-значный код подтверждения<br />на вашу почту
        </p>

        {/* Email Display */}
        <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-900 font-medium">{email}</span>
          <button
            onClick={handleChangeEmail}
            className="text-blue-600 hover:underline text-sm"
          >
            Изменить email
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Code Input */}
        <form onSubmit={handleVerifyCode}>
          <p className="text-sm text-gray-600 mb-3 text-center">Введите код из письма</p>
          <div className="flex justify-center gap-2 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeInput(index, e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                className="w-11 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            ))}
          </div>

          {/* Countdown */}
          <p className="text-center text-sm text-gray-500 mb-6">
            Код действует еще{" "}
            <span className="font-semibold text-blue-600">{formatTime(countdown)}</span>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || code.some((d) => !d)}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-4"
          >
            {loading ? "Проверка..." : "Подтвердить"}
          </button>

          {/* Resend */}
          <p className="text-center text-sm text-gray-600">
            Не получили код?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || loading}
              className={`font-medium ${
                canResend
                  ? "text-blue-600 hover:underline"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Отправить повторно
            </button>
          </p>
        </form>
      </div>
    </div>
    );
  }

  // Этап ввода email
  return (
    <div className="flex items-start pt-12 min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button
          onClick={() => setMode("signup")}
          className={`pb-3 text-lg font-semibold transition relative ${
            mode === "signup" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          Регистрация
          {mode === "signup" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setMode("login")}
          className={`pb-3 text-lg font-semibold transition relative ${
            mode === "login" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          Вход
          {mode === "login" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {mode === "signup" ? "Создайте аккаунт" : "Войдите в аккаунт"}
      </h2>
      <p className="text-gray-600 mb-6">
        {mode === "signup" ? "Начните торговать на NOVEX" : "Продолжите торговать на NOVEX"}
      </p>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSendCode} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📧 Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Password Input (only for login with password - optional) */}
        {mode === "login" && false && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        )}

        {/* Referral Code (only for signup) */}
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎁 Реферальный код (необязательно)
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Введите реферальный код"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        )}

        {/* Terms Checkbox (only for signup) */}
        {mode === "signup" && (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Я принимаю{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Пользовательское соглашение
              </a>{" "}
              и{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Политику конфиденциальности
              </a>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (mode === "signup" && !acceptTerms)}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading
            ? "Отправка..."
            : mode === "signup"
            ? "Получить код"
            : "Получить код для входа"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">
          или продолжите с
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleGoogleAuth}
          className="py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-medium">Google</span>
        </button>
        <button
          className="py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <span className="text-gray-700 font-medium">Apple</span>
        </button>
      </div>

      {/* Footer Link */}
      {mode === "login" && (
        <p className="text-center text-sm text-gray-600 mt-6">
          Уже есть аккаунт?{" "}
          <button
            onClick={() => setMode("signup")}
            className="text-blue-600 hover:underline font-medium"
          >
            Войти
          </button>
        </p>
      )}
    </div>
  </div>
  );
}
