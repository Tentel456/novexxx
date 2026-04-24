import { NextResponse } from 'next/server';

// Мок-версия для тестирования когда Telegram API недоступен
export async function GET() {
  try {
    const testUserData = {
      email: 'test@example.com',
      referral_code: 'TEST123',
      created_at: new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      provider: 'google',
      user_id: 'test-user-' + Date.now()
    };

    // Симулируем отправку уведомления
    const message = `
🎉 Новый пользователь зарегистрировался!

👤 Email: ${testUserData.email}
🔗 Реферальный код: ${testUserData.referral_code || 'Не указан'}
🌐 Способ регистрации: ${testUserData.provider === 'google' ? '🔍 Google' : '📧 Email'}
⏰ Время: ${testUserData.created_at}
🆔 User ID: ${testUserData.user_id}

#новый_пользователь #регистрация
    `.trim();

    console.log('MOCK: Would send Telegram message:');
    console.log(message);
    console.log('MOCK: To chat ID:', process.env.TELEGRAM_ADMIN_CHAT_ID);

    // Симулируем успешный ответ
    return NextResponse.json({
      success: true,
      message: 'Mock notification sent successfully!',
      mock_data: {
        would_send_to: process.env.TELEGRAM_ADMIN_CHAT_ID,
        message_content: message,
        user_data: testUserData
      },
      note: 'Это мок-версия. Реальное сообщение не отправлено из-за недоступности Telegram API.'
    });

  } catch (error) {
    console.error('Mock notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Mock internal server error',
      details: error
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}