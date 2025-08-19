// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Definisikan halaman publik
  const isPublicPage =
    pathname === '/' ||                 // Landing page
    pathname === '/login' ||            // Login
    pathname.startsWith('/gallery') ||  // Semua halaman gallery & turunannya
    pathname.startsWith('/images') ||    // Semua file di /public/images → publik
    pathname.startsWith('/about');

  // 2. Jika tidak ada token dan buka halaman protected → redirect ke login
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Jika sudah login dan buka halaman publik tertentu (/ atau /login) → redirect ke dashboard
  if (token && (pathname === '/' || pathname === '/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Selain itu, lanjutkan request normal
  return NextResponse.next();
}

// Konfigurasi
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)',
  ],
};
