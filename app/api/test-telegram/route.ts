import { NextResponse } from 'next/server';
import { notifyNewUser } from '@/lib/telegram';

export async function GET() {
  try {
    // Проверяем переменные окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    console.log('Environment check:');
    console.log('Bot token exists:', !!botToken);
    console.log('Admin chat ID exists:', !!adminChatId);
    console.log('Bot token length:', botToken?.length || 0);
    console.log('Chat ID:', adminChatId);

    if (!botToken || !adminChatId) {
      return NextResponse.json({
        success: false,
        error: 'Telegram configuration missing',
        details: {
          botToken: !!botToken,
          adminChatId: !!adminChatId,
          env_check: {
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT_SET',
            TELEGRAM_ADMIN_CHAT_ID: process.env.TELEGRAM_ADMIN_CHAT_ID ? 'SET' : 'NOT_SET'
          }
        }
      }, { status: 500 });
    }

    // Тестовые данные пользователя
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

    console.log('Sending test notification with data:', testUserData);

    // Отправляем тестовое уведомление
    const result = await notifyNewUser(testUserData);

    console.log('Telegram API response:', result);

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Test notification sent successfully!',
        telegram_result: result,
        config_check: {
          botToken: botToken.substring(0, 10) + '...',
          adminChatId: adminChatId
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send notification',
        details: result,
        config_check: {
          botToken: botToken.substring(0, 10) + '...',
          adminChatId: adminChatId
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

export async function POST() {
  return GET(); // Для удобства тестирования
}