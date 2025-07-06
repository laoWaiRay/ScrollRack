import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const publicRoutes = [
	"/login",
	"/register",
	"/verify-email",
	"/reset-password",
	"/forgot-password",
];

export async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = !publicRoutes.includes(path);
	let refreshToken = req.cookies.get("refresh_token")?.value;

	if (isProtectedRoute) {
		if (!refreshToken) {
			return NextResponse.redirect(new URL("/login", req.nextUrl));
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
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 * - icons/
		 * - images/
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons|images|installHook.js.map|icon.svg).*)",
	],
};
