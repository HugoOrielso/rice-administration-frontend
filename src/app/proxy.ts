import { auth } from "../lib/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const session = req.auth;
  const isLoginPage = req.nextUrl.pathname === "/";

  // Si hay error de refresh y no está en login → redirigir
  if (session?.error?.startsWith("RefreshFailed") && !isLoginPage) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(loginUrl);
  }

  // Si no hay sesión y no está en login → redirigir
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

