# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Supabase (Required for Auth)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign up or log in

2. **Create a New Project**
   - Click "New Project"
   - Choose a name (e.g., "novex-crypto")
   - Set a database password
   - Select a region
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Your API Keys**
   - Go to Settings → API (left sidebar)
   - Find "Project URL" - copy this
   - Find "anon public" key - copy this

4. **Update .env.local File**
   - Open `.env.local` in the root directory
   - Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Configure Auth Providers in Supabase**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - (Optional) Enable "Google" provider for OAuth

6. **Add Redirect URLs**
   - Go to Authentication → URL Configuration
   - Add to "Redirect URLs":
     ```
     http://localhost:3000/auth/callback
     ```

## Step 3: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 🎯 What You'll See

- **Home Page (/)** - Landing page with hero section
- **Auth Page (/auth)** - Login/signup (needs Supabase setup)
- **P2P Page (/p2p)** - Trading interface

## ⚠️ Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure `.env.local` file exists in the root directory
- Check that the values are correct (no quotes, no spaces)
- Restart the dev server after changing `.env.local`

### Auth Not Working

- Verify Supabase project is active
- Check redirect URLs are configured
- Make sure email provider is enabled

### Images Not Loading

- All images should be in `/public` directory
- Paths should start with `/` (e.g., `/assets/logo/novex_logo.png`)

## 📚 Next Steps

- Read `NEXT_STEPS.md` for detailed information
- Check `README.md` for full documentation
- See `auth-page/SUPABASE_SETUP.md` for detailed Supabase setup

## 🎉 You're Ready!

Your Next.js crypto exchange is ready to go!
