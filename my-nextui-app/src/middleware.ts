import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // Set language cookie for /he and /en routes without redirecting
  if (pathname === '/he' || pathname === '/en') {
    const lang = pathname.slice(1);
    const response = NextResponse.next();
    
    response.cookies.set('NEXT_LOCALE', lang, {
      path: '/',
      sameSite: 'strict',
      maxAge: 31536000 // 1 year
    });
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/he', '/en']
} 