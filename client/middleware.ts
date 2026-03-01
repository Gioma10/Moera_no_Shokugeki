import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route pubbliche che non richiedono autenticazione
const publicRoutes = ["/login"];

// Route accessibili solo a chi è autenticato ma in pending/rejected
const limboRoutes = ["/pending", "/rejected"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("firebase-token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isLimboRoute = limboRoutes.includes(pathname);

  // Non autenticato → manda al login (tranne se è già lì)
  if (!token && !isPublicRoute && !isLimboRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Autenticato → non può stare sul login, manda alla home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Applica il middleware a tutte le route tranne _next e file statici
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};