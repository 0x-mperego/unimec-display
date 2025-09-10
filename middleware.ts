import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("admin-session");

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login") {
    const authCookie = request.cookies.get("admin-session");

    if (authCookie && authCookie.value === "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - display (public display page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|display).*)",
  ],
};
