import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware di autenticazione.
 * Protegge le rotte /auth/* – reindirizza al login se non autenticato.
 * Reindirizza alla domus se già autenticato sulle pagine pubbliche.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name)                    { return request.cookies.get(name)?.value },
        set(name, value, options)    { response.cookies.set({ name, value, ...options }) },
        remove(name, options)        { response.cookies.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Rotte protette – richiede autenticazione
  const isProtectedRoute = path.startsWith('/domus')
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Pagine pubbliche – reindirizza se già autenticato
  const isPublicRoute = path === '/login' || path === '/register'
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL('/domus', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Escludi asset statici e API
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
