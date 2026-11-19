import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { ROLE_REDIRECTS } from './config/roles.config'

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token
    const { pathname } = (req as unknown as NextRequest).nextUrl

    // Redirect authenticated users from auth pages
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      const role = token.role as keyof typeof ROLE_REDIRECTS
      const redirect = ROLE_REDIRECTS[role] ?? '/'
      return NextResponse.redirect(new URL(redirect, (req as unknown as NextRequest).url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        const protectedPrefixes = ['/owner', '/manager', '/seller', '/customer', '/delivery', '/admin']
        const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
        if (isProtected) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
