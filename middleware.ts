import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'tucker_auth_session';
const locales = ['en', 'es'];
const defaultLocale = 'en';

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return segments[1];
  }
  return null;
}

function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  return authCookie?.value === 'authenticated';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Get locale from path or use default
  const locale = getLocaleFromPath(pathname) || defaultLocale;
  const isLoginPath = pathname.includes('/login');
  const isLoggedIn = isAuthenticated(request);

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (isLoggedIn && isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
