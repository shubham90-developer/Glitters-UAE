import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // If user tries to access `/` then redirect to login
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

// Only match root
export const config = {
  matcher: ['/'],
}
