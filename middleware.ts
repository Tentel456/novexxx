import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not set. Auth middleware disabled.')
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Если пользователь не авторизован и пытается зайти на защищенные страницы
  if (!session && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/p2p'))) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // Если пользователь авторизован и пытается зайти на страницу auth
  if (session && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/p2p', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/p2p/:path*', '/auth'],
}
