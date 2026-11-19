import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/locales";

// Redirect any path without a locale prefix to the default locale (German).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (favicon, images…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
