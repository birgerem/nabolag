// ============================================================
// Admin layout - Server-side auth-sjekk (dobbel sikkerhet i tillegg til middleware)
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
        redirect("/admin/login");
      }
    } catch {
      redirect("/admin/login");
    }
  }

  return <>{children}</>;
}
