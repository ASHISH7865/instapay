import { authMiddleware } from '@clerk/nextjs'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ['/', '/api/webhook/clerk', '/api/webhooks/stripe', '/(api|trpc)(.*)'],
  ignoredRoutes: ['/api/webhook/clerk'],
  // Optimize for faster logout redirects
  afterAuth(auth, req) {
    // Handle logout redirects more efficiently
    if (!auth.userId && req.nextUrl.pathname.startsWith('/dashboard')) {
      return Response.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(dashboard)(.*)'],
}
