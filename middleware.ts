import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
const token = request.cookies.get('token')
console.log(token)
  const isMainPage = request.nextUrl.pathname === '/'
  const isAuthPage = request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup'

  if (token && isMainPage || token && isAuthPage) {
    try {
      // Verify token with your backend
      const pp = new FormData()
      pp.append("token", token?.value || '')
      const response = await fetch(`https://backend.shancloudservice.com/authenticate`, {
        method: 'POST',
        body: pp,
      })

      if (response.ok) {
        // If token is valid, redirect to dashboard
        console.log("ok then why its happen")
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      console.log("ithaan pirachinai")
    } catch (error) {
      // If token verification fails, clear the token
      const response = NextResponse.next()
      console.log("something wrong")
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signin', '/signup'],
}
