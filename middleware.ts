import { NextResponse, type NextRequest } from 'next/server';

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

  // Skip API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Handle root path - redirect to welcome page
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}/welcome`;
    return NextResponse.redirect(url);
  }

  // Redirect login page to welcome (no auth required)
  if (pathname.includes('/login')) {
    const locale = getLocaleFromPath(pathname) || defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/welcome`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
