// ============================================================
// Bekreftelsesside – Vises etter vellykket booking
// Viser bestillingsdetaljer + Vipps-betalingsinformasjon
// ============================================================

import type { Metadata } from "next";
import { isAdminConfigured } from "@/lib/supabase/admin";
import BigButton from "@/components/ui/BigButton";
import { DEFAULT_PHONE, formatDate, formatTime, formatPrice } from "@/lib/constants";

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

  // Hent innstillinger og bestillingsdetaljer fra Supabase
  let phone = DEFAULT_PHONE;
  let vippsNumber = DEFAULT_PHONE.replace(/\s/g, "");
  let booking: {
    customer_name: string;
    service_name: string;
    booking_date: string;
    booking_time: string;
    duration_hours: number;
    total_price: number;
    is_flexible: boolean;
    customer_comment?: string | null;
  } | null = null;

  if (isAdminConfigured() && bookingId && bookingId !== "email-only") {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();

      const [settingsResult, bookingResult] = await Promise.all([
        supabase.from("settings").select("phone_number").eq("id", 1).single(),
        supabase
          .from("bookings")
          .select("customer_name, service_name, booking_date, booking_time, duration_hours, total_price, is_flexible, customer_comment")
          .eq("id", bookingId)
          .single(),
      ]);

      if (settingsResult.data?.phone_number) {
        phone = settingsResult.data.phone_number;
        vippsNumber = phone.replace(/\s/g, "");
      }
      if (bookingResult.data) {
        booking = bookingResult.data;
      }
    } catch {
      // Bruk default
    }
  } else if (isAdminConfigured()) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();
      const { data } = await supabase.from("settings").select("phone_number").eq("id", 1).single();
      if (data?.phone_number) {
        phone = data.phone_number;
        vippsNumber = phone.replace(/\s/g, "");
      }
    } catch {
      // Bruk default
    }
  }

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

  const telLink = `tel:${vippsNumber}`;

  return (
    <div className="section">
      <div className="container max-w-2xl mx-auto">

        {/* Suksess-header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-text mb-3">
            Bestillingen din er mottatt!
          </h1>
          <p className="text-xl text-text-muted">
            {isFlexible
              ? `Tusen takk! Edvard tar kontakt med deg for å avtale tid i uke ${weekNumber || ""}.`
              : "Tusen takk! Edvard tar kontakt med deg på telefon for å bekrefte."}
          </p>
        </div>

        {/* Bestillingsdetaljer */}
        {booking && (
          <div className="bg-surface rounded-2xl p-6 border border-border-light mb-6">
            <h2 className="text-xl font-bold text-text mb-4">Din bestilling</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Tjeneste</span>
                <span className="font-semibold text-text">{booking.service_name}</span>
              </div>
              {booking.is_flexible ? (
                <div className="flex justify-between">
                  <span className="text-text-muted">Tidspunkt</span>
                  <span className="font-semibold text-text">Uke {weekNumber} — avtales</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Dato</span>
                    <span className="font-semibold text-text">{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Tidspunkt</span>
                    <span className="font-semibold text-text">{formatTime(booking.booking_time)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Varighet</span>
                <span className="font-semibold text-text">
                  {booking.duration_hours} {booking.duration_hours === 1 ? "time" : "timer"}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border-light">
                <span className="text-lg font-bold text-text">Totalt</span>
                <span className="text-lg font-bold text-primary">{formatPrice(booking.total_price)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Vipps-betalingsinformasjon */}
        <div className="rounded-2xl p-6 mb-6 border-2" style={{ backgroundColor: "#FF5B24", borderColor: "#e04a17" }}>
          <div className="flex items-center gap-3 mb-4">
            {/* Vipps-logo (tekst-basert siden vi ikke har SVG) */}
            <div className="bg-white rounded-xl px-3 py-1.5">
              <span className="font-black text-xl tracking-tight" style={{ color: "#FF5B24" }}>
                vipps
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Betal med Vipps</h2>
          </div>

          <p className="text-white/90 mb-4 text-lg">
            Betal etter at jobben er gjort. Send betaling til Edvard på Vipps:
          </p>

          <div className="bg-white/15 rounded-xl p-4 text-center mb-4">
            <p className="text-white/80 text-sm mb-1">Vipps-nummer</p>
            <p className="text-white font-black text-4xl tracking-widest">{phone}</p>
            <p className="text-white/70 text-sm mt-1">Edvard – Nabolagshjelpen</p>
          </div>

          {booking && (
            <div className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-white/80 text-sm">Beløp å betale</p>
              <p className="text-white font-black text-3xl">{formatPrice(booking.total_price)}</p>
              <p className="text-white/70 text-xs mt-1">
                Merk betalingen med &ldquo;{booking.service_name}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Kontaktboks */}
        <div className="bg-surface rounded-2xl p-6 border border-border-light mb-8">
          <h2 className="text-xl font-bold text-text mb-3">
            Har du spørsmål?
          </h2>
          <p className="text-text-muted mb-4">
            Ring eller send melding til Edvard:
          </p>
          <a
            href={telLink}
            className="inline-flex items-center gap-2 text-primary font-bold text-2xl no-underline hover:underline"
          >
            📞 {phone}
          </a>
          <p className="text-sm text-text-muted mt-3">
            Du mottar en kvittering fra Edvard etter at oppdraget er fullført.
          </p>
        </div>

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
