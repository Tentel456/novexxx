# Настройка Supabase для авторизации

## Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте аккаунт или войдите
3. Нажмите "New Project"
4. Заполните данные проекта:
   - Project name: `novex-auth` (или любое другое имя)
   - Database Password: создайте надежный пароль
   - Region: выберите ближайший регион
5. Нажмите "Create new project"

## Шаг 2: Получение API ключей

1. В боковом меню выберите "Settings" → "API"
2. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon/public key** (длинный ключ)

3. Откройте файл `supabase-config.js` и замените:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Вставьте Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Вставьте anon key
```

## Шаг 3: Настройка Email Authentication

### 3.1 Включение Email Provider

1. В боковом меню Supabase выберите **"Authentication"** (иконка с замком)
2. Затем выберите вкладку **"Providers"** (в верхнем меню)
3. Найдите в списке **"Email"** и убедитесь, что переключатель включен (зеленый)
4. Нажмите на "Email" чтобы открыть настройки:
   - **Confirm email**: оставьте включенным (пользователи должны подтверждать email)
   - **Secure email change**: включите для безопасности
   - Нажмите **"Save"**

### 3.2 Настройка Email Templates (Шаблоны писем)

**Где найти Email Templates:**

1. В боковом меню выберите **"Authentication"** (иконка с замком)
2. В верхнем меню выберите вкладку **"Email Templates"**
3. Вы увидите список шаблонов:
   - **Confirm signup** - письмо для подтверждения регистрации
   - **Invite user** - приглашение пользователя
   - **Magic Link** - письмо с магической ссылкой для входа (это то, что мы используем!)
   - **Change Email Address** - подтверждение смены email
   - **Reset Password** - сброс пароля

**Настройка шаблона Magic Link (самый важный для нашего проекта):**

1. Нажмите на **"Magic Link"** в списке
2. Вы увидите редактор шаблона с полями:
   - **Subject line**: тема письма (например: "Sign in to NOVEX")
   - **Message body**: тело письма в HTML формате

3. Пример настройки:
   ```
   Subject: Sign in to NOVEX
   
   Message body:
   <h2>Welcome to NOVEX!</h2>
   <p>Click the link below to sign in to your account:</p>
   <p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
   <p>This link expires in 24 hours.</p>
   <p>If you didn't request this, you can safely ignore this email.</p>
   ```

4. **Важно**: Переменная `{{ .ConfirmationURL }}` автоматически заменяется на ссылку для входа
5. Нажмите **"Save"** внизу страницы

**Дополнительные настройки (опционально):**

- Вы можете кастомизировать каждый шаблон под свой бренд
- Добавить логотип NOVEX
- Изменить цвета и стили
- Добавить футер с контактами

### Настройка SMTP (опционально, для кастомных email)

**Важно для production!**

По умолчанию Supabase использует свой SMTP сервер с ограничениями:
- **Бесплатный план**: 3 письма в час
- **Pro план**: больше лимит

Для production настоятельно рекомендуется настроить свой SMTP:

**Как настроить Custom SMTP:**

1. В боковом меню выберите **"Settings"** (иконка шестеренки)
2. Выберите **"Auth"** в левом подменю
3. Прокрутите вниз до раздела **"SMTP Settings"**
4. Нажмите **"Enable Custom SMTP"**
5. Заполните данные:
   - **Sender email**: ваш email (например: noreply@novex.com)
   - **Sender name**: NOVEX
   - **Host**: SMTP сервер (например: smtp.gmail.com)
   - **Port**: обычно 587 или 465
   - **Username**: ваш email или username
   - **Password**: пароль приложения (не обычный пароль!)

**Популярные SMTP провайдеры:**

- **Gmail**: 
  - Host: smtp.gmail.com
  - Port: 587
  - Нужно создать "App Password" в настройках Google аккаунта
  
- **SendGrid** (рекомендуется для production):
  - Host: smtp.sendgrid.net
  - Port: 587
  - Бесплатно до 100 писем в день
  
- **Mailgun**:
  - Host: smtp.mailgun.org
  - Port: 587
  - Хорошие лимиты

6. Нажмите **"Save"** и протестируйте отправку письма

## Шаг 4: Настройка Google OAuth

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com)
2. Включите Google+ API
3. Создайте OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: добавьте:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (замените YOUR_PROJECT_REF на ваш project reference из Supabase)

4. Скопируйте Client ID и Client Secret

5. В Supabase:
   - Authentication → Providers → Google
   - Включите Google provider
   - Вставьте Client ID и Client Secret
   - Сохраните

## Шаг 5: Настройка URL Redirect

1. Settings → Auth → URL Configuration
2. Добавьте разрешенные URL для редиректа:
   ```
   http://localhost:5500/auth-page/auth.html
   http://127.0.0.1:5500/auth-page/auth.html
   https://yourdomain.com/auth-page/auth.html
   ```

## Шаг 6: Настройка Email Confirmation

По умолчанию Supabase требует подтверждение email. Вы можете изменить это:

1. Settings → Auth → Email Auth
2. Настройте:
   - **Confirm email**: включено (рекомендуется)
   - **Double confirm email changes**: включено
   - **Secure email change**: включено

## Шаг 7: Тестирование

1. Откройте `auth-page/auth.html` в браузере
2. Попробуйте зарегистрироваться с email
3. Проверьте почту на наличие письма с подтверждением
4. Попробуйте войти через Google

## Дополнительные настройки

### Создание таблицы для хранения дополнительных данных пользователя

```sql
-- Создание таблицы profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  referral_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Включение Row Level Security
alter table profiles enable row level security;

-- Политика: пользователи могут читать только свои данные
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Политика: пользователи могут обновлять только свои данные
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Функция для автоматического создания профиля при регистрации
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'referral_code'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Триггер для создания профиля
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Troubleshooting

### ⚠️ ВАЖНО: Проблема с file:// протоколом

**Проблема**: OAuth (Google, Facebook и т.д.) и многие функции Supabase НЕ РАБОТАЮТ при открытии файла напрямую через `file://` протокол.

**Решение**: Нужно запустить локальный веб-сервер.

#### Способ 1: Live Server (VS Code) - РЕКОМЕНДУЕТСЯ

1. Установите расширение "Live Server" в VS Code
2. Откройте проект в VS Code
3. Правой кнопкой на `auth.html` → "Open with Live Server"
4. Сайт откроется на `http://127.0.0.1:5500` или `http://localhost:5500`

#### Способ 2: Python HTTP Server

Если у вас установлен Python:

```bash
# Перейдите в корневую папку проекта
cd путь/к/проекту

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Затем откройте: `http://localhost:8000/auth-page/auth.html`

#### Способ 3: Node.js http-server

Если у вас установлен Node.js:

```bash
# Установите http-server глобально (один раз)
npm install -g http-server

# Запустите в папке проекта
http-server -p 8000

# Или с CORS (если нужно)
http-server -p 8000 --cors
```

Затем откройте: `http://localhost:8000/auth-page/auth.html`

#### Способ 4: PHP встроенный сервер

Если у вас установлен PHP:

```bash
php -S localhost:8000
```

### После запуска сервера:

1. Обновите `supabase-config.js` если нужно
2. В Supabase Settings → Auth → URL Configuration добавьте:
   ```
   http://localhost:8000/auth-page/auth.html
   http://127.0.0.1:8000/auth-page/auth.html
   ```
3. Теперь Google OAuth будет работать!

---

### Проблема: Письма не приходят
- Проверьте спам-папку
- Убедитесь, что SMTP настроен правильно
- В бесплатном плане есть лимит 3 письма в час

### Проблема: Google OAuth не работает
- Проверьте, что redirect URI правильно настроен в Google Console
- Убедитесь, что Client ID и Secret правильно скопированы
- Проверьте, что Google provider включен в Supabase

### Проблема: CORS ошибки
- Убедитесь, что ваш домен добавлен в разрешенные URL в Supabase
- Для локальной разработки используйте Live Server или аналогичный инструмент

## Полезные ссылки

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
