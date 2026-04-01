import { NextResponse, NextRequest } from "next/server"
import { auth } from "./lib/auth"

export default async function middleware(req: NextRequest) {
  try {
    const session = await auth()

    if ((session?.error as string)?.startsWith("RefreshFailed")) {
      return NextResponse.redirect(new URL("/api/auth/logout", req.url))
    }

    if (!session) {
      const signInUrl = new URL("/login", req.url)
      signInUrl.searchParams.set("callbackUrl", req.url)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}