import { NextRequest, NextResponse } from 'next/server';

// Minimal test middleware
export function middleware(request: NextRequest) {
  console.log('TEST MIDDLEWARE EXECUTED - PATH:', request.nextUrl.pathname);
  
  // Always redirect root to /en
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    console.log('TEST MIDDLEWARE - REDIRECTING TO:', url.pathname);
    return NextResponse.redirect(url, 307);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};

