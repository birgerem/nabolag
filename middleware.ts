// ============================================================
// Middleware – Beskytter admin-ruter og oppdaterer auth-sesjon
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
    url.startsWith("https://") &&
    key.length > 20
  );
}

export async function middleware(request: NextRequest) {
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login");

  // Hvis Supabase ikke er konfigurert, blokker alltid /admin
  if (!isSupabaseReady()) {
    if (isAdminRoute) {
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

  // Beskytt admin-ruter – uinnloggede sendes alltid til login
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
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
