// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authentication } from "next-firebase-auth-edge/lib/next/middleware";
import { AUTH_CONFIG } from "./config/server";

const PUBLIC_PATHS = ["/register", "/login", "/reset-password"];

function redirectToHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/home";
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectToLogin(request: NextRequest) {
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  return authentication(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: AUTH_CONFIG.apiKey,
    cookieName: AUTH_CONFIG.cookieName,
    cookieSignatureKeys: AUTH_CONFIG.cookieSignatureKeys,
    cookieSerializeOptions: AUTH_CONFIG.cookieSerializeOptions,
    serviceAccount: AUTH_CONFIG.serviceAccount,
    handleValidToken: async ({ token, decodedToken }) => {
      // Authenticated user should not be able to access /login, /register and /reset-password routes
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      return NextResponse.next();
    },
    handleInvalidToken: async () => {
      return redirectToLogin(request);
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });
      return redirectToLogin(request);
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
  ],
};
