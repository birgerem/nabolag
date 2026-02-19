// ============================================================
// Middleware – Beskytter admin-ruter og oppdaterer auth-sesjon
// Hopper over auth-sjekk hvis Supabase ikke er konfigurert
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isSupabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    !url.includes("placeholder") &&
    !key.includes("placeholder") &&
    (key.startsWith("eyJ") || key.startsWith("sb_publishable_"))
  );
}

export async function middleware(request: NextRequest) {
  // Hvis Supabase ikke er konfigurert, redirect admin til login med feilmelding
  if (!isSupabaseReady()) {
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      !request.nextUrl.pathname.startsWith("/admin/login")
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Oppdater auth-sesjon
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Beskytt admin-ruter (unntatt login-siden)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Hvis innlogget admin prøver å gå til login-siden, redirect til dashboard
  if (request.nextUrl.pathname === "/admin/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
