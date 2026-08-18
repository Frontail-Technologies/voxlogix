import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE_NAME = "voxlogix_access_token";
const REFRESH_TOKEN_COOKIE_NAME = "voxlogix_refresh_token";

const ROLE_PREFIXES: Record<string, string> = {
  "/admin": "ADMIN",
  "/master": "MASTER",
  "/planner": "PLANNER",
  "/execution": "EXECUTION",
};

type TokenPayload = {
  role?: string;
  exp?: number;
};

function decodePayload(token: string): TokenPayload | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;
    const json = Buffer.from(payloadSegment, "base64url").toString("utf8");
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

function decodeRole(token: string): string | null {
  const payload = decodePayload(token);
  return typeof payload?.role === "string" ? payload.role : null;
}

function isExpired(token: string) {
  const payload = decodePayload(token);
  return (
    typeof payload?.exp === "number" &&
    payload.exp <= Math.floor(Date.now() / 1000)
  );
}

function protectedRoleFor(pathname: string) {
  const entry = Object.entries(ROLE_PREFIXES).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return entry?.[1] ?? null;
}

export function middleware(request: NextRequest) {
  const requiredRole = protectedRoleFor(request.nextUrl.pathname);
  if (!requiredRole) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const usableAccessToken =
    accessToken && !isExpired(accessToken) ? accessToken : null;
  const usableRefreshToken =
    refreshToken && !isExpired(refreshToken) ? refreshToken : null;
  const tokenForRole = usableAccessToken ?? usableRefreshToken;

  if (!tokenForRole)
    return NextResponse.redirect(new URL("/login", request.url));

  const role = decodeRole(tokenForRole);
  if (role !== requiredRole)
    return NextResponse.redirect(new URL("/unauthorized", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/master/:path*",
    "/planner/:path*",
    "/execution/:path*",
  ],
};
