import { NextResponse, NextRequest } from "next/server";
import { auth } from "./lib/auth";

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const defaultAuthenticatedRoute = "/dashboard";

export default async function middleware(req: NextRequest) {
  try {
    const session = await auth();
    const { pathname, search } = req.nextUrl;

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const hasRefreshError =
      (session?.error as string | undefined)?.startsWith("RefreshFailed");

    const isAuthenticated = !!session?.user;

    // Si expiró la sesión, mandar al login limpio
    if (hasRefreshError) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("sessionExpired", "1");
      return NextResponse.redirect(signInUrl);
    }

    // Usuario autenticado entrando a páginas públicas como /login
    if (isAuthenticated && isPublicRoute && pathname !== "/") {
      return NextResponse.redirect(new URL(defaultAuthenticatedRoute, req.url));
    }

    // Usuario no autenticado entrando a rutas privadas
    if (!isAuthenticated && !isPublicRoute) {
      const signInUrl = new URL("/login", req.url);

      // Solo ruta relativa, nunca req.url completo
      const callbackUrl = `${pathname}${search || ""}`;
      signInUrl.searchParams.set("callbackUrl", callbackUrl);

      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("sessionExpired", "1");
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