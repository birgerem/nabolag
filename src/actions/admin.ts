"use server";

// ============================================================
// Server Actions for admin-dashboard
// Bruker admin-klient (service_role) for å omgå RLS
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import type { Booking, Settings, BlockedDate } from "@/lib/types";
import {
  DEFAULT_PRICE_PER_HOUR,
  DEFAULT_PHONE,
  DEFAULT_MIN_HOURS,
  DEFAULT_DISCOUNT,
} from "@/lib/constants";

export async function fetchAdminData() {
  try {
    const supabase = createAdminClient();

    const [bookingsResult, settingsResult, blockedResult] = await Promise.all([
      supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false }),
      supabase.from("settings").select("*").eq("id", 1).single(),
      supabase.from("blocked_dates").select("*").order("blocked_date"),
    ]);

    const bookings: Booking[] = bookingsResult.data || [];
    const settings: Settings = settingsResult.data || {
      id: 1,
      price_per_hour: DEFAULT_PRICE_PER_HOUR,
      phone_number: DEFAULT_PHONE,
      min_hours: DEFAULT_MIN_HOURS,
      discount_per_extra_hour: DEFAULT_DISCOUNT,
      updated_at: "",
    };
    const blockedDates: BlockedDate[] = blockedResult.data || [];

    return { bookings, settings, blockedDates };
  } catch (err) {
    console.error("Feil ved henting av admin-data:", err);
    return {
      bookings: [] as Booking[],
      settings: {
        id: 1,
        price_per_hour: DEFAULT_PRICE_PER_HOUR,
        phone_number: DEFAULT_PHONE,
        min_hours: DEFAULT_MIN_HOURS,
        discount_per_extra_hour: DEFAULT_DISCOUNT,
        updated_at: "",
      } as Settings,
      blockedDates: [] as BlockedDate[],
    };
  }
}
