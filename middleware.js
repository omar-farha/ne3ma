import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if user is authenticated for protected routes
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.log('[Middleware] Error getting user:', error.message)
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') ||
                     request.nextUrl.pathname.startsWith('/signup')

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/add-new-listing') ||
                          request.nextUrl.pathname.startsWith('/edit-listing')

  // Debug logging
  if (isProtectedRoute || isAuthPage) {
    const cookies = request.cookies.getAll()
    const authCookies = cookies.filter(c => c.name.includes('supabase') || c.name.includes('auth'))
    console.log(`[Middleware] Path: ${request.nextUrl.pathname}, User: ${user ? 'Authenticated (' + user.email + ')' : 'Not authenticated'}, Auth cookies: ${authCookies.length}`)
    if (authCookies.length > 0) {
      console.log('[Middleware] Cookie names:', authCookies.map(c => c.name).join(', '))
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && user) {
    console.log(`[Middleware] Redirecting authenticated user from ${request.nextUrl.pathname} to /donate`)
    return NextResponse.redirect(new URL('/donate', request.url))
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${request.nextUrl.pathname} to /sign-in`)
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
