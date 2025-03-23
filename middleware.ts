import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath =
    path === "/auth/signin" ||
    path === "/auth/signup" ||
    path === "/" ||
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.includes(".")

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token && !isPublicPath) {

    const url = new URL("/auth/signin", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  if (token && (path === "/auth/signin" || path === "/auth/signup")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

