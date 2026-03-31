import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = req.auth
  const { pathname, search } = req.nextUrl

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isApiRoute = pathname.startsWith("/api")
  const isNextRoute = pathname.startsWith("/_next")
  const isFileRoute =
    pathname.includes(".") // evita archivos como favicon.ico, images, etc.

  // Ignorar rutas internas/archivos
  if (isApiRoute || isNextRoute || isFileRoute) {
    return NextResponse.next()
  }

  // Si falló refresh, cerrar sesión
  if ((session?.error as string | undefined)?.startsWith("RefreshFailed")) {
    return NextResponse.redirect(new URL("/api/auth/logout", req.url))
  }

  // No autenticado intentando entrar a dashboard
  if (!session && isDashboardRoute) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Autenticado intentando entrar a cualquier ruta pública
  if (session && !isDashboardRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
      Ejecuta middleware en todo excepto:
      - /api
      - /_next/static
      - /_next/image
      - favicon.ico
      - archivos públicos con extensión
    */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}