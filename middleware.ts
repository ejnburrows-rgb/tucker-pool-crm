import { NextResponse, type NextRequest } from 'next/server';

// AUTH DISABLED FOR TESTING - Set to false to enable authentication
const AUTH_DISABLED = true;

const locales = ['en', 'es'];
const defaultLocale = 'en';

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return segments[1];
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get locale from path or use default
  const locale = getLocaleFromPath(pathname) || defaultLocale;

  // If auth is disabled, just pass through (redirect root to locale)
  if (AUTH_DISABLED) {
    // Redirect login page to dashboard when auth is disabled
    if (pathname.includes('/login')) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Auth enabled - import and use session management
  const { updateSession } = await import('@/lib/supabase/middleware');
  const isLoginPath = pathname.includes('/login');
  const { supabaseResponse, user } = await updateSession(request);

  if (!user && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (user && isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
