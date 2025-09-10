import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const AUTH_COOKIE_NAME = "admin-session";
const AUTH_COOKIE_VALUE = "authenticated";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function createAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return authCookie?.value === AUTH_COOKIE_VALUE;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export function createAuthResponse(
  authenticated: boolean,
  redirectTo?: string
) {
  if (authenticated) {
    return NextResponse.redirect(
      new URL(redirectTo || "/admin", process.env.NEXT_PUBLIC_APP_URL)
    );
  }
  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL)
  );
}

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const cookieStore = req.cookies;
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (authCookie?.value !== AUTH_COOKIE_VALUE) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return handler(req);
  };
}
