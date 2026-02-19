// ============================================================
// Supabase admin-klient med service_role-nøkkel
// Brukes KUN server-side for admin-operasjoner
// Omgår Row Level Security
// ============================================================

import { createClient } from "@supabase/supabase-js";

export function isAdminConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(
    url &&
    key &&
    !url.includes("placeholder") &&
    !key.includes("placeholder") &&
    (key.startsWith("eyJ") || key.startsWith("sb_secret_"))
  );
}

export function createAdminClient() {
  if (!isAdminConfigured()) {
    throw new Error("Supabase admin er ikke konfigurert med gyldig service_role JWT-nøkkel");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
