import { NextResponse, NextRequest } from "next/server";
import { auth } from "./lib/auth";

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const defaultAuthenticatedRoute = "/dashboard";

export default async function middleware(req: NextRequest) {
  try {
    const session = await auth();
    const { pathname } = req.nextUrl;

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const hasRefreshError =
      (session?.error as string | undefined)?.startsWith("RefreshFailed");

    // Si el refresh token falló, mandamos al login
    if (hasRefreshError) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("sessionExpired", "1");
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const isAuthenticated = !!session?.user;

    // Usuario autenticado intentando entrar a rutas públicas
    if (isAuthenticated && isPublicRoute) {
      return NextResponse.redirect(new URL(defaultAuthenticatedRoute, req.url));
    }

    // Usuario no autenticado intentando entrar a rutas privadas
    if (!isAuthenticated && !isPublicRoute) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }
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