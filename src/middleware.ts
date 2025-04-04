// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware básico que adiciona headers de segurança
function middleware(request: NextRequest) {
  // For dev routes, just allow access in development
  if (request.nextUrl.pathname.startsWith('/dev')) {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.redirect(new URL('/404', request.url));
    }
    return NextResponse.next();
  }

  const response = NextResponse.next();
  
  // Adicionar headers de segurança
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  
  return response;
}

// Exportar o middleware com autenticação
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      // Always allow dev routes
      if (req.nextUrl.pathname.startsWith('/dev')) {
        return true;
      }
      // Require authentication for other protected routes
      return !!token;
    },
  },
});

// Configurar quais rotas devem ser protegidas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/dev/:path*"
  ]
};
