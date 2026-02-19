"use server";

// ============================================================
// Server Actions for administrasjon av ukentlige tidsluker
// Brukes av WeeklyScheduleEditor i admin-panelet
// ============================================================

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { AvailableSlot } from "@/lib/types";
import { FALLBACK_INACTIVE_DAYS } from "@/lib/constants";

// Hent alle tidsluker (inkl. inaktive) for admin-visning
export async function fetchAllSlots(): Promise<{
  success: boolean;
  slots: AvailableSlot[];
}> {
  try {
    if (!isAdminConfigured()) {
      return { success: false, slots: [] };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("available_slots")
      .select("*")
      .order("day_of_week")
      .order("start_time");

    if (error) throw error;
    return { success: true, slots: (data || []) as AvailableSlot[] };
  } catch (err) {
    console.error("Fetch slots error:", err);
    return { success: false, slots: [] };
  }
}

// Skru en tidsluke av eller på
export async function toggleSlotActive(
  slotId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAdminConfigured()) {
      return { success: false, error: "Supabase er ikke konfigurert." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("available_slots")
      .update({ is_active: isActive })
      .eq("id", slotId);

    if (error) throw error;

    revalidatePath("/admin");
    revalidatePath("/bestill");
    return { success: true };
  } catch (err) {
    console.error("Toggle slot error:", err);
    return { success: false, error: "Kunne ikke oppdatere tidsluke." };
  }
}

// Legg til ny tidsluke
export async function addTimeSlot(data: {
  day_of_week: number;
  start_time: string;
  end_time: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAdminConfigured()) {
      return { success: false, error: "Supabase er ikke konfigurert." };
    }

    // Valider tidsrekkefølge
    if (data.start_time >= data.end_time) {
      return { success: false, error: "Starttid må være før sluttid." };
    }

    const supabase = createAdminClient();

    // Sjekk for overlappende tidsluker på samme dag
    const { data: existing } = await supabase
      .from("available_slots")
      .select("id, start_time, end_time")
      .eq("day_of_week", data.day_of_week);

    const hasOverlap = (existing || []).some((slot) => {
      const slotStart = slot.start_time.substring(0, 5);
      const slotEnd = slot.end_time.substring(0, 5);
      return data.start_time < slotEnd && data.end_time > slotStart;
    });

    if (hasOverlap) {
      return {
        success: false,
        error: "Denne tiden overlapper med en eksisterende tidsluke.",
      };
    }

    const { error } = await supabase.from("available_slots").insert({
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      is_active: true,
    });

    if (error) throw error;

    revalidatePath("/admin");
    revalidatePath("/bestill");
    return { success: true };
  } catch (err) {
    console.error("Add slot error:", err);
    return { success: false, error: "Kunne ikke legge til tidsluke." };
  }
}

// Slett en tidsluke (kun hvis ingen fremtidige bookinger bruker den)
export async function deleteTimeSlot(
  slotId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAdminConfigured()) {
      return { success: false, error: "Supabase er ikke konfigurert." };
    }

    const supabase = createAdminClient();

    // Hent slot-detaljer
    const { data: slot } = await supabase
      .from("available_slots")
      .select("day_of_week, start_time")
      .eq("id", slotId)
      .single();

    if (!slot) {
      return { success: false, error: "Tidsluke ikke funnet." };
    }

    // Sjekk om det finnes fremtidige bookinger med denne tiden
    const today = new Date().toISOString().split("T")[0];
    const startTimeShort = slot.start_time.substring(0, 5);
    const { data: futureBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_time", startTimeShort)
      .gte("booking_date", today)
      .neq("status", "avlyst");

    if (futureBookings && futureBookings.length > 0) {
      return {
        success: false,
        error:
          "Kan ikke slette — det finnes aktive bookinger på denne tiden. Avlys bookingene først.",
      };
    }

    const { error } = await supabase
      .from("available_slots")
      .delete()
      .eq("id", slotId);

    if (error) throw error;

    revalidatePath("/admin");
    revalidatePath("/bestill");
    return { success: true };
  } catch (err) {
    console.error("Delete slot error:", err);
    return { success: false, error: "Kunne ikke slette tidsluke." };
  }
}

// Hent ukedager som IKKE har aktive tidsluker
// Brukes av DatePicker for å grå ut hele dager
export async function getInactiveDays(): Promise<number[]> {
  try {
    if (!isAdminConfigured()) {
      return FALLBACK_INACTIVE_DAYS;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("available_slots")
      .select("day_of_week")
      .eq("is_active", true);

    if (error) throw error;

    // Finn hvilke dager som HAR aktive slots
    const activeDays = new Set((data || []).map((s) => s.day_of_week));

    // Returner dager som IKKE har aktive slots (0-6)
    const inactiveDays: number[] = [];
    for (let i = 0; i <= 6; i++) {
      if (!activeDays.has(i)) {
        inactiveDays.push(i);
      }
    }
    return inactiveDays;
  } catch {
    return FALLBACK_INACTIVE_DAYS;
  }
}
