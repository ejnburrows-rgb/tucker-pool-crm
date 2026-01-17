import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

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

  // Check if path contains login
  const isLoginPath = pathname.includes('/login');

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request);

  // Redirect to login if not authenticated (and not already on login page)
  if (!user && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if authenticated and on login page
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
