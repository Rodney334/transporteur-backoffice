// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Récupérer le token depuis les cookies
  const token = request.cookies.get("auth-token")?.value;

  // Routes protégées (nécessitent une authentification)
  const protectedRoutes = ["/dashboard", "/admin", "/user"];

  // Routes d'authentification (rediriger si déjà connecté)
  const authRoutes = ["/login", "/register"];

  // Vérifier si la route actuelle est protégée
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Vérifier si la route actuelle est une route d'auth
  const isAuthRoute = authRoutes.includes(pathname);

  // 🔒 Redirection si tentative d'accès à une route protégée sans token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔄 Redirection si déjà connecté et tentative d'accès à login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
