"use server";

// ============================================================
// Server Actions for booking-systemet
// Opprette, oppdatere og slette bookinger
// Sender ALLTID e-post til Edvard, lagrer i Supabase hvis mulig
// ============================================================

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { bookingSchema } from "@/lib/validation";
import { FALLBACK_WEEKLY_SLOTS } from "@/lib/constants";
import { sendBookingNotification } from "@/lib/email";

// Opprett ny booking (brukes fra bestill-siden)
// Støtter både vanlig booking (bestemt tid) og fleksibel (kun uke)
export async function createBooking(formData: {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  total_price: number;
  is_flexible?: boolean;
  customer_comment: string;
}) {
  try {
    // Valider input
    const validated = bookingSchema.parse({
      ...formData,
      is_flexible: formData.is_flexible ?? false,
    });

    let bookingId: string | null = null;
    let dbSuccess = false;

    // Prøv å lagre i Supabase (men ikke krasj hvis det feiler)
    if (isAdminConfigured()) {
      try {
        const supabase = createAdminClient();

        // For vanlige bookinger: sjekk at tidspunktet fortsatt er ledig
        if (!validated.is_flexible) {
          const { data: existing } = await supabase
            .from("bookings")
            .select("id")
            .eq("booking_date", validated.booking_date)
            .eq("booking_time", validated.booking_time)
            .neq("status", "avlyst")
            .eq("is_flexible", false)
            .maybeSingle();

          if (existing) {
            return {
              success: false,
              error: "Denne tiden er dessverre ikke lenger ledig. Vennligst velg en annen tid.",
            };
          }
        }

        // Opprett booking i databasen
        const { data, error } = await supabase
          .from("bookings")
          .insert({
            customer_name: validated.customer_name,
            customer_address: validated.customer_address,
            customer_phone: validated.customer_phone,
            service_id: validated.service_id,
            service_name: validated.service_name,
            booking_date: validated.booking_date,
            booking_time: validated.booking_time,
            duration_hours: validated.duration_hours,
            total_price: validated.total_price,
            is_flexible: validated.is_flexible,
            customer_comment: validated.customer_comment || null,
            status: "ny",
          })
          .select("id")
          .single();

        if (!error && data) {
          bookingId = data.id;
          dbSuccess = true;
        } else {
          console.error("Supabase booking-feil:", error);
        }
      } catch (dbErr) {
        console.error("Database-feil (fortsetter med e-post):", dbErr);
      }
    }

    // Send e-postvarsling ALLTID (uavhengig av database)
    // Hent ukenummer fra kommentarfeltet for fleksibel booking
    let weekNumber: number | undefined;
    if (validated.is_flexible && validated.customer_comment) {
      const weekMatch = validated.customer_comment.match(/\[Uke (\d+)\]/);
      if (weekMatch) weekNumber = parseInt(weekMatch[1]);
    }

    const emailSent = await sendBookingNotification({
      customer_name: validated.customer_name,
      customer_phone: validated.customer_phone,
      customer_address: validated.customer_address,
      service_name: validated.service_name,
      booking_date: validated.booking_date,
      booking_time: validated.booking_time,
      duration_hours: validated.duration_hours,
      total_price: validated.total_price,
      is_flexible: validated.is_flexible,
      customer_comment: validated.customer_comment || undefined,
      week_number: weekNumber,
    });

    // Booking er vellykket hvis e-post ble sendt ELLER lagret i DB
    if (dbSuccess || emailSent) {
      return {
        success: true,
        bookingId: bookingId || "email-only",
      };
    }

    // Begge feilet
    return {
      success: false,
      error: "Noe gikk galt. Vennligst prøv igjen, eller ring oss direkte.",
    };
  } catch (err) {
    console.error("Validering/booking-feil:", err);
    return {
      success: false,
      error: "Ugyldig data. Vennligst sjekk at alle felt er fylt ut riktig.",
    };
  }
}

// Oppdater booking-status (brukes fra admin)
export async function updateBookingStatus(
  bookingId: string,
  status: "ny" | "bekreftet" | "fullfort" | "avlyst"
) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      return { success: false, error: "Kunne ikke oppdatere status." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Slett booking (brukes fra admin)
export async function deleteBooking(bookingId: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      return { success: false, error: "Kunne ikke slette bookingen." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Hent ledige tider for en dato
export async function getAvailableSlots(date: string) {
  try {
    const supabase = createAdminClient();
    const selectedDate = new Date(date + "T00:00:00");
    const dayOfWeek = selectedDate.getDay();

    // Sjekk om datoen er blokkert
    const { data: blocked } = await supabase
      .from("blocked_dates")
      .select("id")
      .eq("blocked_date", date)
      .maybeSingle();

    if (blocked) return [];

    // Hent ukentlige tider for denne ukedagen
    const { data: slots } = await supabase
      .from("available_slots")
      .select("start_time, end_time")
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true)
      .order("start_time");

    if (!slots || slots.length === 0) return [];

    // Hent eksisterende bookinger for denne datoen (ikke avlyste)
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("booking_time, duration_hours")
      .eq("booking_date", date)
      .neq("status", "avlyst");

    // Finn tider som allerede er booket
    const bookedTimes = new Set<string>();
    (existingBookings || []).forEach((b) => {
      const [hours, minutes] = b.booking_time.split(":").map(Number);
      for (let i = 0; i < b.duration_hours; i++) {
        const h = hours + i;
        bookedTimes.add(
          `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        );
      }
    });

    // Returner kun ledige tider
    return slots
      .filter((slot) => {
        const startTime = slot.start_time.substring(0, 5);
        return !bookedTimes.has(startTime);
      })
      .map((slot) => ({
        start_time: slot.start_time.substring(0, 5),
        end_time: slot.end_time.substring(0, 5),
      }));
  } catch {
    // Fallback: bruk hardkodede tidsluker fra constants.ts
    const selectedDate = new Date(date + "T00:00:00");
    const dayOfWeek = selectedDate.getDay();
    const fallbackSlots = FALLBACK_WEEKLY_SLOTS[dayOfWeek] || [];
    return fallbackSlots.map((slot) => ({
      start_time: slot.start,
      end_time: slot.end,
    }));
  }
}
