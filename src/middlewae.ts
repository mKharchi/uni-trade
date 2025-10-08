// /src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import path from "path";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Not logged in at all
  if (pathname.startsWith("/api/admin/login")) return NextResponse.next();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Rules per route
  if (pathname.startsWith("/api/users")) {
    // Must be logged in (already checked above)
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/notifications")) {
    // Must be logged in (already checked above)
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/orders")) {
    // Must be logged in (already checked above)
    return NextResponse.next();
  }
  // 2. Rules per route

  if (pathname.startsWith("/api/admin/register")) {
    // Must be super-admin
    if (token.role !== "super-admin") {
      return NextResponse.json(
        { error: "Forbidden - Super Admin only" },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    // Must be admin or super-admin
    if (token.role !== "admin" && token.role !== "super-admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // 3. Default allow
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: [
    "/api/users/:path*",
    "/api/admin/:path*",
    "/api/admin/register/:path*",
    "/api/orders/:path*",
    "/api/notifications/:path*",
  ],
};
