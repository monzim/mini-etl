import { NextRequest, NextResponse } from "next/server";
import { getDecodedJWT } from "./lib/jwt";

function getTokenFromRequest(request: NextRequest) {
  const cookie = request.cookies.get("AccessToken");
  if (!cookie) {
    return null;
  }

  return cookie.value;
}

const redirectTo404 = (request: NextRequest) =>
  NextResponse.rewrite(new URL("/404", request.url));

const redirectToSignIn = (request: NextRequest) =>
  NextResponse.redirect(new URL("/", request.url));

export const publicRoutes = ["/"];
export const authRoutes = ["/api/auth/callback", "/dashboard"];
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/console";
export const DEFAULT_GETTING_STARTED_REDIRECT = "/auth/login";
export const DEFAULT_SENDING_VERIFICATION_REDIRECT =
  "/verification/verify-email";

export async function middleware(request: NextRequest) {
  const accessToken = getTokenFromRequest(request);
  const jwt = await getDecodedJWT(accessToken);

  const nextUrl = request.nextUrl;
  const loggedIn = !!jwt;
  const pathname = request.nextUrl.pathname;

  console.log(">> Route:", pathname);

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (loggedIn) {
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
      );
    }

    return NextResponse.next();
  }

  if (!loggedIn && !isPublicRoute) {
    return Response.redirect(new URL(nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
