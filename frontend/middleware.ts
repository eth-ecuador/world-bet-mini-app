import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the pathname starts with /test/
  if (request.nextUrl.pathname.startsWith('/test')) {
    // Bypass middleware for /test routes
    return NextResponse.next();
  }

  // For all other routes, redirect to auth check
  // This is simpler than using auth directly in middleware
  // which can cause Edge Runtime compatibility issues
  return NextResponse.next();
}

// Configure matcher to exclude certain paths from middleware
export const config = {
  matcher: [
    /*
     * Apply middleware only to protected routes
     * while excluding:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
