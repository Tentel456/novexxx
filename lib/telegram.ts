interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  disable_web_page_preview?: boolean;
}

interface TelegramResponse {
  ok: boolean;
  result?: any;
  error_code?: number;
  description?: string;
}

export class TelegramBot {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    // Используем альтернативный URL если основной недоступен
    const useProxy = process.env.TELEGRAM_USE_PROXY === 'true';
    this.baseUrl = useProxy 
      ? `https://api.telegram.org/bot${botToken}` // Можно заменить на прокси URL
      : `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(
    chatId: string,
    text: string,
    options: {
      parse_mode?: 'HTML' | 'Markdown';
      disable_web_page_preview?: boolean;
    } = {}
  ): Promise<TelegramResponse> {
    try {
      const message: TelegramMessage = {
        chat_id: chatId,
        text,
        ...options,
      };

      console.log('Sending Telegram message to:', chatId);
      console.log('Message length:', text.length);
      console.log('Bot token (first 10 chars):', this.botToken.substring(0, 10));
      console.log('Using URL:', this.baseUrl.replace(this.botToken, 'TOKEN_HIDDEN'));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Увеличиваем до 30 секунд

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Telegram API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Telegram API error response:', errorText);
        return {
          ok: false,
          error_code: response.status,
          description: `HTTP ${response.status}: ${errorText}`
        };
      }
      
      const result = await response.json();
      console.log('Telegram API response body:', result);
      
      return result;
    } catch (error) {
      console.error('Telegram API network error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            ok: false,
            error_code: 408,
            description: 'Request timeout (30s) - Telegram API слишком медленно отвечает',
          };
        }
        
        if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
          return {
            ok: false,
            error_code: 503,
            description: 'Telegram API недоступен. Возможно заблокирован в вашей сети. Попробуйте использовать VPN.',
          };
        }
      }
      
      return {
        ok: false,
        error_code: 500,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async getMe(): Promise<TelegramResponse> {
    try {
      console.log('Testing bot token with getMe...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Увеличиваем до 30 секунд
      
      const response = await fetch(`${this.baseUrl}/getMe`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('getMe error response:', errorText);
        return {
          ok: false,
          error_code: response.status,
          description: `HTTP ${response.status}: ${errorText}`
        };
      }
      
      const result = await response.json();
      console.log('getMe response:', result);
      return result;
    } catch (error) {
      console.error('Telegram getMe error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            ok: false,
            error_code: 408,
            description: 'Request timeout (30s)',
          };
        }
        
        if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
          return {
            ok: false,
            error_code: 503,
            description: 'Telegram API недоступен. Проверьте интернет-соединение или используйте VPN.',
          };
        }
      }
      
      return {
        ok: false,
        error_code: 500,
        description: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

// Функция для отправки уведомления о новом пользователе
export async function notifyNewUser(userData: {
  email: string;
  referral_code?: string;
  created_at: string;
  provider?: string;
  user_id: string;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  console.log('notifyNewUser called with:', userData);
  console.log('Environment variables check:');
  console.log('- TELEGRAM_BOT_TOKEN:', botToken ? 'SET' : 'NOT SET');
  console.log('- TELEGRAM_ADMIN_CHAT_ID:', adminChatId ? 'SET' : 'NOT SET');

  if (!botToken || !adminChatId) {
    throw new Error(`Telegram configuration missing: botToken=${!!botToken}, adminChatId=${!!adminChatId}`);
  }

  const bot = new TelegramBot(botToken);

  // Сначала проверим, работает ли бот
  const meResult = await bot.getMe();
  if (!meResult.ok) {
    console.error('Bot token validation failed:', meResult);
    return {
      ok: false,
      error_code: meResult.error_code || 401,
      description: `Bot validation failed: ${meResult.description}`
    };
  }

  console.log('Bot info:', meResult.result);

  const message = `
🎉 <b>Новый пользователь зарегистрировался!</b>

👤 <b>Email:</b> ${userData.email}
🔗 <b>Реферальный код:</b> ${userData.referral_code || 'Не указан'}
🌐 <b>Способ регистрации:</b> ${userData.provider === 'google' ? '🔍 Google' : '📧 Email'}
⏰ <b>Время:</b> ${userData.created_at}
🆔 <b>User ID:</b> ${userData.user_id}

#новый_пользователь #регистрация
  `.trim();

  return await bot.sendMessage(adminChatId, message, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
}