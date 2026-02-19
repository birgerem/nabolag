// ============================================================
// Bekreftelsesside – Vises etter vellykket booking
// Fungerer med og uten database
// ============================================================

import type { Metadata } from "next";
import { isAdminConfigured } from "@/lib/supabase/admin";
import BigButton from "@/components/ui/BigButton";
import { DEFAULT_PHONE } from "@/lib/constants";

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

  // Hent telefonnummer fra settings hvis mulig
  let phone = DEFAULT_PHONE;
  if (isAdminConfigured()) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("settings")
        .select("phone_number")
        .eq("id", 1)
        .single();
      if (data?.phone_number) phone = data.phone_number;
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

  const telLink = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div className="section">
      <div className="container max-w-2xl mx-auto text-center">
        {/* Suksess-ikon */}
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl font-bold text-text mb-4">
          Bestillingen din er mottatt!
        </h1>

        <p className="text-xl text-text-muted mb-8">
          {isFlexible
            ? `Tusen takk! Edvard tar kontakt med deg for å avtale tid i uke ${weekNumber || ""}.`
            : "Tusen takk! Edvard tar kontakt med deg på telefon for å bekrefte."}
        </p>

        {/* Kontaktboks */}
        <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border-light mb-8">
          <h2 className="text-xl font-bold text-text mb-3">
            Har du spørsmål?
          </h2>
          <p className="text-text-muted mb-4">
            Du kan alltid ringe eller sende melding:
          </p>
          <a
            href={telLink}
            className="inline-flex items-center gap-2 text-primary font-bold text-2xl no-underline hover:underline"
          >
            📞 {phone}
          </a>
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
