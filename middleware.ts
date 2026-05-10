import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    if (pathname.startsWith("/api/")) return NextResponse.next();
    const session = request.cookies.get("ava_cms_session")?.value;
    if (!session && pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/dashboard") {
    const session = request.cookies.get("ava_cms_session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
