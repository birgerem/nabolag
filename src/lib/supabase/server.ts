// ============================================================
// Supabase-klient for Server Components og Server Actions
// Bruker cookies for å håndtere auth-sesjon
// Kaster feil hvis Supabase ikke er konfigurert med gyldige nøkler
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Sjekker om Supabase er konfigurert med gyldige nøkler (JWT eller nye sb_publishable) */
export function isSupabaseConfigured(): boolean {
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

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase er ikke konfigurert med gyldige JWT-nøkler");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll kan feile i Server Components (read-only cookies)
            // Det er OK – cookies settes via middleware i stedet
          }
        },
      },
    }
  );
}
