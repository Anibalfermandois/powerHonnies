import type { MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next: MiddlewareNext) => {
  // Get session from cookies
  const sessionCookie = context.cookies.get('session');
  
  if (sessionCookie) {
    try {
      // Simple session parsing (in production, use proper JWT or encrypted sessions)
      const sessionData = JSON.parse(sessionCookie.value);
      context.locals.user = sessionData;
    } catch (error) {
      // Invalid session, clear cookie
      context.cookies.delete('session');
    }
  }

  // Check if route requires authentication
  const protectedRoutes = ['/trips', '/trip'];
  const isProtectedRoute = protectedRoutes.some(route => 
    context.url.pathname.startsWith(route)
  );

  if (isProtectedRoute && !context.locals.user) {
    return context.redirect('/login');
  }

  return next();
});