import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    // Protect main app page and API routes
    '/',
    '/api/chat/:path*',
    '/api/conversations/:path*',
    '/api/settings/:path*',
  ],
};
