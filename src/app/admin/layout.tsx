// ============================================================
// Admin layout - Server-side auth-sjekk (dobbel sikkerhet i tillegg til middleware)
// ============================================================

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Finn ut hvilken side vi er på via headeren som middleware setter
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "";

  // Ikke kjør auth-sjekk på login-siden (ville gitt uendelig redirect-loop)
  const isLoginPage = pathname.startsWith("/admin/login");

  if (!isLoginPage && isSupabaseConfigured()) {
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
