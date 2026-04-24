import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      return NextResponse.json({
        success: false,
        error: 'Telegram configuration missing'
      }, { status: 500 });
    }

    console.log('Simple test - sending message directly...');

    const message = {
      chat_id: adminChatId,
      text: `🧪 Простой тест Telegram бота\n\n⏰ Время: ${new Date().toLocaleString('ru-RU')}\n\n✅ Если вы видите это сообщение, бот работает!`,
      parse_mode: 'HTML'
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw_response: responseText };
    }

    if (response.ok && result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!',
        telegram_response: result,
        config: {
          botToken: botToken.substring(0, 10) + '...',
          chatId: adminChatId
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Telegram API returned error',
        details: {
          status: response.status,
          response: result,
          config: {
            botToken: botToken.substring(0, 10) + '...',
            chatId: adminChatId
          }
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Simple test error:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout (30s)';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Request failed',
      details: {
        error_type: error instanceof Error ? error.name : 'Unknown',
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}