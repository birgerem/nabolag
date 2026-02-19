// ============================================================
// Tjenester-side – Viser alle tilgjengelige tjenester
// Mykt, varmt design
// ============================================================

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BigButton from "@/components/ui/BigButton";
import { FALLBACK_SERVICES, formatPrice } from "@/lib/constants";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tjenester",
  description:
    "Se alle tjenester fra Nabolagshjelpen på Tromøya. Gressklipping, handling, rydding, matlaging og annen hjelp. 150 kr per time.",
};

export default async function TjenesterPage() {
  let services: Service[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (data && data.length > 0) services = data;
  } catch {
    // Bruk fallback
  }

  // Bruk fallback-tjenester hvis DB ikke er tilgjengelig
  if (services.length === 0) {
    services = FALLBACK_SERVICES;
  }

  return (
    <div>
      {/* Toppseksjon */}
      <section className="section bg-surface-warm pb-6">
        <div className="container text-center">
          <div className="w-12 h-1 bg-accent-warm mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Hva kan jeg hjelpe deg med?
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Her er tjenestene jeg tilbyr. Alle koster {formatPrice(150)} per time.
          </p>
        </div>
      </section>

      {/* Tjenester */}
      <section className="section bg-background pt-6">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-surface rounded-2xl p-6 card-soft border border-border-light flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-text mb-1">{service.name}</h2>
                  <p className="text-text-muted leading-relaxed">{service.description}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-lg font-semibold text-primary mb-2">
                    {formatPrice(service.price_per_hour)}/time
                  </p>
                  <BigButton
                    href={`/bestill?tjeneste=${service.id}`}
                    variant="secondary"
                  >
                    Bestill
                  </BigButton>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <BigButton href="/bestill" variant="accent">
              Bestill hjelp nå
            </BigButton>
          </div>
        </div>
      </section>
    </div>
  );
}
