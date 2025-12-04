// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const url = req.nextUrl;
  if (url.pathname.startsWith('/admin')) {
    const token = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
    if (!token) {
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};