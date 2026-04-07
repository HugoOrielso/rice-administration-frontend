import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const defaultAuthenticatedRoute = "/dashboard";

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isProduction = process.env.NODE_ENV === "production";
  const cookiePrefix = isProduction ? "__Secure-" : "dev-";

  const accessToken = req.cookies.get(`${cookiePrefix}accessToken`)?.value;
  const refreshToken = req.cookies.get(`${cookiePrefix}refreshToken`)?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL(defaultAuthenticatedRoute, req.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/login", req.url);
    const callbackUrl = `${pathname}${search || ""}`;
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/",
  ],
};