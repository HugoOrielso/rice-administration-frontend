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

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // ✅ autenticado si tiene cualquiera de los dos tokens
  // si accessToken expiró pero hay refreshToken, axios hará el refresh
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // ✅ usuario autenticado intentando entrar a ruta pública (excepto "/")
  if (isAuthenticated && isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL(defaultAuthenticatedRoute, req.url));
  }

  // ✅ usuario no autenticado intentando entrar a ruta privada
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