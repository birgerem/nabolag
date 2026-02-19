// ============================================================
// Middleware – Beskytter admin-ruter og oppdaterer auth-sesjon
// Login-siden er på /login (utenfor /admin) og trenger ikke beskyttelse
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
  // Alle ruter under /admin krever innlogging
  // Login-siden er på /login (utenfor matcher), så den treffes aldri her

  // Hvis Supabase ikke er konfigurert, blokker alltid /admin
  if (!isSupabaseReady()) {
    return NextResponse.redirect(new URL("/login", request.url));
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

  // Uinnloggede sendes til /login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  // Matcher KUN /admin-ruter. /login ligger utenfor og treffes aldri.
  matcher: ["/admin/:path*"],
};
