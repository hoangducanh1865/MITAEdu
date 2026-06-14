import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register", "/verify-email", "/forgot-password", "/reset-password", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isPublic) return NextResponse.next();

  const token = request.cookies.get("mita_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin route protection — role cookie set by auth.ts at login
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("mita_role")?.value;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
