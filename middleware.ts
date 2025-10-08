import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/auth/admin/register") {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

      if (!token) {
        return new NextResponse(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      if ((token as any).role !== "super-admin") {
        return new NextResponse(
          JSON.stringify({ success: false, error: "Forbidden: super-admin required" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (_err) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/admin/register"],
};


