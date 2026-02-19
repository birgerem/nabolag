"use server";

// ============================================================
// Server Actions for innstillinger (admin)
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Oppdater timepris og telefonnummer
export async function updateSettings(data: {
  price_per_hour: number;
  phone_number: string;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("settings")
      .update({
        price_per_hour: data.price_per_hour,
        phone_number: data.phone_number,
      })
      .eq("id", 1);

    if (error) {
      return { success: false, error: "Kunne ikke oppdatere innstillinger." };
    }

    revalidatePath("/");
    revalidatePath("/priser");
    revalidatePath("/bestill");
    revalidatePath("/admin");

    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Legg til blokkert dato
export async function addBlockedDate(date: string, reason?: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("blocked_dates").insert({
      blocked_date: date,
      reason: reason || null,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Denne datoen er allerede blokkert." };
      }
      return { success: false, error: "Kunne ikke blokkere datoen." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Fjern blokkert dato
export async function removeBlockedDate(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: "Kunne ikke fjerne blokkeringen." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}
