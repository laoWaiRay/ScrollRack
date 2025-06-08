import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const path =  req.nextUrl.pathname;
  const isProtectedRoute = !publicRoutes.includes(path);
  const cookie = req.cookies.get(".AspNetCore.Identity.Application");
  
  if (isProtectedRoute && cookie === undefined) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}