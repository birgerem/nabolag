// ============================================================
// Enkel bestilling – Aller enkleste vei til hjelp
// Legg igjen navn + telefon (Edvard ringer), eller ring direkte.
// ============================================================

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PHONE } from "@/lib/constants";
import EnkelBestillingForm from "@/components/booking/EnkelBestillingForm";

export const metadata: Metadata = {
  title: "Enkel bestilling",
  description:
    "Enkel bestilling hos Nabolagshjelpen på Tromøya. Legg igjen navn og telefonnummer, så ringer Edvard deg – eller ring med én gang.",
};

export default async function EnkelBestillingPage() {
  let phoneNumber = DEFAULT_PHONE;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("phone_number")
      .eq("id", 1)
      .single();
    if (data?.phone_number) phoneNumber = data.phone_number;
  } catch {
    // bruk standardnummer
  }

  return (
    <div>
      <section className="section bg-surface-warm pb-4">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="w-12 h-1 bg-accent-warm mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">
            Enkel bestilling
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Vil du bare ha hjelp uten noe styr? Ring, eller legg igjen
            nummeret ditt – så tar Edvard kontakt.
          </p>
        </div>
      </section>

      <section className="section bg-background pt-6">
        <div className="container max-w-2xl mx-auto">
          <EnkelBestillingForm phoneNumber={phoneNumber} />
        </div>
      </section>
    </div>
  );
}
