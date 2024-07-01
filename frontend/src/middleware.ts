import { NextRequest, NextResponse } from "next/server";
import { getDecodedJWT } from "./lib/jwt";

function getTokenFromRequest(request: NextRequest) {
  const cookie = request.cookies.get("AccessToken");
  if (!cookie) {
    return null;
  }

  return cookie.value;
}

export const protectedRoutePrefix = "/console";
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/console";

export async function middleware(request: NextRequest) {
  const accessToken = getTokenFromRequest(request);
  const jwt = await getDecodedJWT(accessToken);

  const loggedIn = !!jwt;
  const nextUrl = request.nextUrl;
  const pathname = request.nextUrl.pathname;

  const isAuthApiRoute = pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = pathname.startsWith(protectedRoutePrefix);

  if (isAuthApiRoute) {
    if (loggedIn) {
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
      );
    }

    return NextResponse.next();
  }

  if (!isAuthApiRoute) {
    return NextResponse.next();
  }

  if (!loggedIn && isProtectedRoute) {
    return Response.redirect(new URL(nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
