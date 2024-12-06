import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle /he and /en routes
  if (pathname === '/he' || pathname === '/en') {
    const lang = pathname.slice(1);
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Always update the cookie with the new language choice
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
  matcher: ['/he', '/en']
} 