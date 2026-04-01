import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = req.auth
  const { pathname, search } = req.nextUrl

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isApiRoute = pathname.startsWith("/api")
  const isNextRoute = pathname.startsWith("/_next")
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/logout")
  const isFileRoute = pathname.includes(".")

  if (isApiRoute || isNextRoute || isFileRoute || isAuthRoute) {
    return NextResponse.next()
  }

  if ((session?.error as string | undefined)?.startsWith("RefreshFailed")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (!session && isDashboardRoute) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // ← Solo redirige si es exactamente "/" o rutas realmente públicas
  if (session && !isDashboardRoute && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}