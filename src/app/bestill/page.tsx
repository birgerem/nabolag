// ============================================================
// Bestill-side – Bookingskjema med mykt, varmt design
// ============================================================

import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/booking/BookingForm";
import type { Service, Settings } from "@/lib/types";
import {
  DEFAULT_PRICE_PER_HOUR,
  DEFAULT_PHONE,
  DEFAULT_MIN_HOURS,
  DEFAULT_DISCOUNT,
  FALLBACK_SERVICES,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bestill hjelp",
  description:
    "Bestill hjelp fra Nabolagshjelpen på Tromøya. Velg tjeneste, dato og tidspunkt. Enkelt og raskt.",
};

async function BookingPageContent() {
  let services: Service[] = [];
  let settings: Settings = {
    id: 1,
    price_per_hour: DEFAULT_PRICE_PER_HOUR,
    phone_number: DEFAULT_PHONE,
    min_hours: DEFAULT_MIN_HOURS,
    discount_per_extra_hour: DEFAULT_DISCOUNT,
    updated_at: "",
  };
  // Blokkerte uker (mandag-dato + grunn) – uker Edvard er utilgjengelig
  let blockedWeeks: { monday: string; reason: string | null }[] = [];

  try {
    const supabase = await createClient();

    const [servicesResult, settingsResult, blockedResult] = await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("settings").select("*").eq("id", 1).single(),
      supabase.from("blocked_dates").select("blocked_date, reason"),
    ]);

    if (servicesResult.data && servicesResult.data.length > 0) services = servicesResult.data;
    if (settingsResult.data) settings = settingsResult.data;
    if (blockedResult.data) {
      blockedWeeks = blockedResult.data.map((b) => ({
        monday: b.blocked_date,
        reason: b.reason,
      }));
    }
  } catch {
    // Bruk standardverdier
  }

  // Bruk fallback-tjenester hvis DB ikke er tilgjengelig
  if (services.length === 0) {
    services = FALLBACK_SERVICES;
  }

  return (
    <div>
      {/* Toppseksjon */}
      <section className="section bg-surface-warm pb-4">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="w-12 h-1 bg-accent-warm mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
            Bestill hjelp
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Fyll ut skjemaet under. Det tar bare noen minutter.
          </p>
        </div>
      </section>

      <section className="section bg-background pt-6">
        <div className="container max-w-3xl mx-auto">
          {/* Enklere alternativ */}
          <div className="mb-8 bg-surface rounded-2xl p-5 card-soft border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-lg text-text-muted">
              Synes du dette blir mye?{" "}
              <strong className="text-text">Prøv enkel bestilling</strong> – legg
              bare igjen nummeret ditt, så ringer Edvard deg.
            </p>
            <a
              href="/enkel-bestilling"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary text-white font-bold px-5 py-3 no-underline hover:bg-primary-dark"
            >
              📞 Enkel bestilling →
            </a>
          </div>

          <BookingForm
            services={services}
            settings={settings}
            blockedWeeks={blockedWeeks}
          />
        </div>
      </section>
    </div>
  );
}

export default function BestillPage() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <div className="container text-center">
            <p className="text-xl text-text-muted">Laster bestillingsskjema...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
