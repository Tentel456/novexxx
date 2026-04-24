import { NextRequest, NextResponse } from 'next/server';

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

interface UserRegistrationData {
  email: string;
  referral_code?: string;
  created_at: string;
  provider?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user, event_type } = await request.json();
    
    // Проверяем, что это событие регистрации нового пользователя
    if (event_type !== 'user.created') {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      console.error('Telegram configuration missing');
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    // Формируем сообщение для админа
    const userData: UserRegistrationData = {
      email: user.email || 'N/A',
      referral_code: user.user_metadata?.referral_code || 'None',
      created_at: new Date(user.created_at).toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      provider: user.app_metadata?.provider || 'email'
    };

    const message = `
🎉 <b>Новый пользователь зарегистрировался!</b>

👤 <b>Email:</b> ${userData.email}
🔗 <b>Реферальный код:</b> ${userData.referral_code}
🌐 <b>Способ регистрации:</b> ${userData.provider === 'google' ? '🔍 Google' : '📧 Email'}
⏰ <b>Время:</b> ${userData.created_at}
🆔 <b>User ID:</b> ${user.id}

#новый_пользователь #регистрация
    `.trim();

    // Отправляем сообщение в Telegram
    const telegramMessage: TelegramMessage = {
      chat_id: adminChatId,
      text: message,
      parse_mode: 'HTML'
    };

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramMessage),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send Telegram message', details: errorData },
        { status: 500 }
      );
    }

    const result = await telegramResponse.json();
    console.log('Telegram notification sent successfully:', result);

    return NextResponse.json({ 
      message: 'Notification sent successfully',
      telegram_result: result 
    });

  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

// Для тестирования endpoint'а
export async function GET() {
  return NextResponse.json({ 
    message: 'Telegram notification endpoint is working',
    timestamp: new Date().toISOString()
  });
}