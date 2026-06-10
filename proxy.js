import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const publicPaths = ['/login', '/register', '/landing', '/favicon.ico'];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow all auth-related paths to pass through
  if (
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/trpc') ||
    pathname.startsWith('/api/uploadthing')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/landing', request.url));
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|api/trpc|api/uploadthing).*)',
  ],
};
