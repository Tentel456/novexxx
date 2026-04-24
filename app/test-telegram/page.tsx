"use client";

import { useState } from "react";

export default function TestTelegramPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testType, setTestType] = useState<'real' | 'mock' | 'simple'>('real');

  const testTelegramNotification = async (useMock = false) => {
    setLoading(true);
    setResult(null);

    try {
      const endpoint = useMock ? '/api/mock-telegram' : '/api/test-telegram';
      const response = await fetch(endpoint, {
        method: 'GET',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testSimpleTelegram = async () => {
    setTestType('simple');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/simple-telegram-test', {
        method: 'GET',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Тест Telegram уведомлений
          </h1>

          <div className="space-y-6">
            {/* Диагностика сети */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ⚠️ Проблема с доступом к Telegram API
              </h3>
              <p className="text-red-700 mb-3">
                Обнаружена блокировка api.telegram.org в вашей сети.
              </p>
              <div className="space-y-2 text-sm text-red-600">
                <p><strong>Возможные решения:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Включите VPN</li>
                  <li>Используйте другую сеть</li>
                  <li>Протестируйте мок-версию ниже</li>
                </ul>
              </div>
            </div>

            {/* Кнопки тестирования */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => testTelegramNotification(false)}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                {loading && testType === 'real' ? 'Отправка...' : 'Тест с реальным API'}
              </button>
              
              <button
                onClick={() => testSimpleTelegram()}
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                {loading && testType === 'simple' ? 'Отправка...' : 'Простой тест'}
              </button>
              
              <button
                onClick={() => {
                  setTestType('mock');
                  testTelegramNotification(true);
                }}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                {loading && testType === 'mock' ? 'Тестирование...' : 'Мок-тест (без API)'}
              </button>
            </div>

            {result && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Результат:</h3>
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Инструкция по настройке:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-yellow-700">
                <li>Создайте Telegram бота через @BotFather</li>
                <li>Получите токен бота</li>
                <li>Получите ваш Chat ID через @userinfobot</li>
                <li>Добавьте переменные в .env.local:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>TELEGRAM_BOT_TOKEN=ваш_токен</li>
                    <li>TELEGRAM_ADMIN_CHAT_ID=ваш_chat_id</li>
                  </ul>
                </li>
                <li>Перезапустите сервер разработки</li>
                <li><strong>Включите VPN</strong> если Telegram заблокирован</li>
                <li>Нажмите кнопку выше для тестирования</li>
              </ol>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Альтернативные решения:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-blue-700">
                <li><strong>Webhook через ngrok:</strong> Для production используйте ngrok или подобные сервисы</li>
                <li><strong>Telegram Bot API сервер:</strong> Разверните собственный Bot API сервер</li>
                <li><strong>Email уведомления:</strong> Используйте email вместо Telegram</li>
                <li><strong>Discord/Slack:</strong> Альтернативные мессенджеры</li>
              </ul>
            </div>

            <div className="text-center">
              <a
                href="/auth"
                className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                ← Вернуться к авторизации
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}