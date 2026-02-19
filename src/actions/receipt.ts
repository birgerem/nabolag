"use server";

// ============================================================
// Server Action: Send kvittering til kunde
// Brukes fra admin BookingTable etter fullført oppdrag
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import { sendReceiptEmail } from "@/lib/email";
import { DEFAULT_PHONE } from "@/lib/constants";

export async function sendReceipt(bookingId: string, customerEmail: string, adminMessage?: string) {
  try {
    const supabase = createAdminClient();

    // Hent booking-detaljer
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: "Fant ikke bookingen." };
    }

    // Hent telefonnummer (Vipps-nummer)
    let vippsNumber = DEFAULT_PHONE;
    const { data: settings } = await supabase
      .from("settings")
      .select("phone_number")
      .eq("id", 1)
      .single();
    if (settings?.phone_number) {
      vippsNumber = settings.phone_number;
    }

    // Send kvittering
    const sent = await sendReceiptEmail({
      customer_name: booking.customer_name,
      customer_email: customerEmail,
      customer_phone: booking.customer_phone,
      customer_address: booking.customer_address,
      service_name: booking.service_name,
      booking_date: booking.booking_date,
      booking_time: booking.booking_time,
      duration_hours: booking.duration_hours,
      total_price: booking.total_price,
      is_flexible: booking.is_flexible,
      vipps_number: vippsNumber,
      admin_message: adminMessage,
    });

    if (!sent) {
      return { success: false, error: "Kunne ikke sende kvittering. Sjekk at RESEND_API_KEY er satt i Vercel." };
    }

    return { success: true };
  } catch (err) {
    console.error("Kvittering feil:", err);
    return { success: false, error: "Noe gikk galt ved sending av kvittering." };
  }
}
