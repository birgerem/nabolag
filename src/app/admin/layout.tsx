// ============================================================
// Admin layout - Server-side auth-sjekk
// Login-siden er flyttet til /login (utenfor /admin) for å unngå loop
// ============================================================

import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
      }
    } catch {
      redirect("/login");
    }
  } else {
    // Supabase ikke konfigurert — ingen kan logge inn, blokker tilgang
    redirect("/login");
  }

  return <>{children}</>;
}
