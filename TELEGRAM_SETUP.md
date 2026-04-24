# Настройка Telegram уведомлений

## Шаг 1: Создание Telegram бота

1. Откройте Telegram и найдите бота [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Введите имя для вашего бота (например: "NOVEX Admin Bot")
4. Введите username для бота (например: "novex_admin_bot")
5. BotFather даст вам **токен бота** - скопируйте его

## Шаг 2: Получение Chat ID администратора

### Способ 1: Через специального бота
1. Найдите бота [@userinfobot](https://t.me/userinfobot)
2. Отправьте ему любое сообщение
3. Он ответит с вашим Chat ID

### Способ 2: Через API
1. Отправьте сообщение вашему новому боту
2. Откройте в браузере: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Найдите ваше сообщение и скопируйте `chat.id`

## Шаг 3: Настройка переменных окружения

Добавьте в файл `.env.local`:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789
```

**Важно**: Замените значения на ваши реальные токен и Chat ID!

## Шаг 4: Настройка Supabase Database Function

Создайте функцию в Supabase для автоматической отправки уведомлений:

### 4.1 Создание функции уведомления

В Supabase SQL Editor выполните:

```sql
-- Создаем функцию для отправки HTTP запроса
CREATE OR REPLACE FUNCTION notify_telegram_new_user()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://your-domain.com/api/telegram/notify';
  payload JSON;
BEGIN
  -- Формируем payload для отправки
  payload := json_build_object(
    'event_type', 'user.created',
    'user', json_build_object(
      'id', NEW.id,
      'email', NEW.email,
      'created_at', NEW.created_at,
      'user_metadata', NEW.raw_user_meta_data,
      'app_metadata', NEW.raw_app_meta_data
    )
  );

  -- Отправляем HTTP запрос (требует расширение http)
  PERFORM
    net.http_post(
      url := webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := payload::jsonb
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.2 Создание триггера

```sql
-- Создаем триггер на таблицу auth.users
CREATE TRIGGER on_auth_user_created_telegram
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION notify_telegram_new_user();
```

### 4.3 Включение HTTP расширения (если не включено)

```sql
-- Включаем расширение для HTTP запросов
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
```

## Шаг 5: Альтернативный способ через Edge Functions

Если HTTP расширение недоступно, можно использовать Supabase Edge Functions:

### 5.1 Создание Edge Function

Создайте файл `supabase/functions/telegram-notify/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const adminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')
    
    if (!botToken || !adminChatId) {
      throw new Error('Telegram configuration missing')
    }

    const message = `
🎉 Новый пользователь зарегистрировался!

👤 Email: ${record.email || 'N/A'}
🔗 Реферальный код: ${record.raw_user_meta_data?.referral_code || 'Не указан'}
⏰ Время: ${new Date(record.created_at).toLocaleString('ru-RU')}
🆔 User ID: ${record.id}

#новый_пользователь #регистрация
    `.trim()

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: message,
          parse_mode: 'HTML'
        }),
      }
    )

    const result = await telegramResponse.json()
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
```

### 5.2 Деплой Edge Function

```bash
supabase functions deploy telegram-notify --project-ref your-project-ref
```

### 5.3 Создание Database Webhook

В Supabase Dashboard:
1. Database → Webhooks
2. Create a new webhook
3. Name: "Telegram New User Notification"
4. Table: `auth.users`
5. Events: `INSERT`
6. HTTP Request:
   - Method: `POST`
   - URL: `https://your-project-ref.supabase.co/functions/v1/telegram-notify`
   - Headers: `{"Authorization": "Bearer YOUR_ANON_KEY"}`

## Шаг 6: Тестирование

### 6.1 Тест API endpoint

Откройте в браузере: `http://localhost:3000/api/telegram/notify`

Должен вернуться JSON с сообщением о работе endpoint'а.

### 6.2 Тест уведомления

Зарегистрируйте нового пользователя через ваше приложение - в Telegram должно прийти уведомление.

### 6.3 Ручной тест

Можно отправить POST запрос на `/api/telegram/notify`:

```bash
curl -X POST http://localhost:3000/api/telegram/notify \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "user.created",
    "user": {
      "id": "test-user-id",
      "email": "test@example.com",
      "created_at": "2024-01-15T10:30:00Z",
      "user_metadata": {
        "referral_code": "TEST123"
      },
      "app_metadata": {
        "provider": "google"
      }
    }
  }'
```

## Troubleshooting

### Проблема: Бот не отправляет сообщения
- Убедитесь, что токен бота правильный
- Проверьте, что Chat ID правильный
- Убедитесь, что вы отправили хотя бы одно сообщение боту

### Проблема: 403 Forbidden
- Бот заблокирован пользователем
- Неправильный Chat ID
- Бот не может писать в группу (нужно добавить бота в группу как администратора)

### Проблема: Webhook не срабатывает
- Проверьте URL webhook'а
- Убедитесь, что сервер доступен из интернета (для production)
- Проверьте логи в Supabase Dashboard

### Проблема: CORS ошибки
- Убедитесь, что CORS настроен правильно в API route
- Для Edge Functions проверьте corsHeaders

## Дополнительные возможности

### Форматирование сообщений
Можно добавить эмодзи, форматирование и кнопки:

```typescript
const message = `
🎉 <b>Новый пользователь!</b>

👤 <b>Email:</b> <code>${email}</code>
🔗 <b>Реферал:</b> ${referral || '❌ Не указан'}
🌐 <b>Регистрация:</b> ${provider === 'google' ? '🔍 Google' : '📧 Email'}
⏰ <b>Время:</b> ${time}

<a href="https://supabase.com/dashboard/project/your-project/auth/users">👥 Управление пользователями</a>
`;
```

### Уведомления о других событиях
Можно добавить уведомления для:
- Входа пользователя
- Смены пароля
- Удаления аккаунта
- Ошибок авторизации

### Группировка уведомлений
Для большого количества регистраций можно группировать уведомления по времени.

## Безопасность

1. **Никогда не коммитьте токены** в git
2. **Используйте переменные окружения** для всех секретных данных
3. **Ограничьте доступ к webhook'ам** через авторизацию
4. **Регулярно обновляйте токены** ботов