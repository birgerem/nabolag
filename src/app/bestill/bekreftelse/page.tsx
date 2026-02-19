// ============================================================
// Bekreftelsesside – Vises etter vellykket booking
// ============================================================

import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatTime, formatPrice } from "@/lib/constants";
import BigButton from "@/components/ui/BigButton";
import type { Booking } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bestilling bekreftet",
};

export default async function BekreftelsePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; fleksibel?: string; uke?: string }>;
}) {
  const params = await searchParams;
  const bookingId = params.id;
  const isFlexible = params.fleksibel === "true";
  const weekNumber = params.uke;

  if (!bookingId) {
    return (
      <div className="section">
        <div className="container max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-text mb-4">
            Ingen bestilling funnet
          </h1>
          <BigButton href="/bestill" variant="primary">
            Gå til bestilling
          </BigButton>
        </div>
      </div>
    );
  }

  // Hent booking-detaljer
  let booking: Booking | null = null;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();
    if (data) booking = data;
  } catch {
    // Vis generell bekreftelse
  }

  return (
    <div className="section">
      <div className="container max-w-2xl mx-auto text-center">
        {/* Suksess-ikon */}
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl font-bold text-text mb-4">
          Bestillingen din er mottatt!
        </h1>

        <p className="text-xl text-text-muted mb-8">
          {isFlexible || booking?.is_flexible
            ? `Tusen takk! Edvard tar kontakt med deg for å avtale tid i uke ${weekNumber || ""}.`
            : "Tusen takk! Jeg tar kontakt med deg på telefon for å bekrefte."}
        </p>

        {booking && (
          <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border-light text-left mb-8">
            <h2 className="text-xl font-bold text-text mb-4 text-center">
              Detaljer for din bestilling
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="font-medium">Tjeneste:</span>
                <span className="font-semibold">{booking.service_name}</span>
              </div>
              {booking.is_flexible ? (
                <div className="flex justify-between py-2 border-b border-border-light">
                  <span className="font-medium">Tidsperiode:</span>
                  <span className="font-semibold text-secondary">
                    Uke {weekNumber || "—"} — avtaler tid senere
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="font-medium">Dato:</span>
                    <span className="font-semibold">
                      {formatDate(booking.booking_date)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="font-medium">Tidspunkt:</span>
                    <span className="font-semibold">
                      {formatTime(booking.booking_time)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2 border-b border-border-light">
                <span className="font-medium">Varighet:</span>
                <span className="font-semibold">
                  {booking.duration_hours}{" "}
                  {booking.duration_hours === 1 ? "time" : "timer"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-xl font-bold">
                  {booking.is_flexible ? "Estimert pris:" : "Totalpris:"}
                </span>
                <span className={`text-xl font-bold ${booking.is_flexible ? "text-secondary" : "text-primary"}`}>
                  {formatPrice(booking.total_price)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <BigButton href="/" variant="primary" fullWidth>
            Tilbake til forsiden
          </BigButton>
          <BigButton href="/bestill" variant="light" fullWidth>
            Bestill en tjeneste til
          </BigButton>
        </div>
      </div>
    </div>
  );
}
