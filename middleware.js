import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/landing', '/api/auth'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p)) || pathname.startsWith('/_next') || pathname.startsWith('/favicon');

  if (isPublic) {
    return NextResponse.next();
  }

  const session = await getServerSession(authOptions);
  if (!session && pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url));
  }
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};