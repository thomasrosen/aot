import { getLocale } from "@/lib/server/getLocale";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(
  req: NextRequest
): Promise<NextResponse | undefined> {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and already-localized paths
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  // Get the current locale
  const locale = await getLocale(req);

  // Rewrite the path to include the locale folder while keeping the URL clean
  const new_url = new URL(req.nextUrl);
  new_url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.rewrite(new_url);

  // Pass locale to downstream logic via header
  response.headers.set("X-Locale", locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
