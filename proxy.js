import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/landing'];
  const isPublic =
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (isPublic) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
