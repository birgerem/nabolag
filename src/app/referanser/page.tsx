// ============================================================
// Referanser-side – Sitater fra tidligere kunder
// Henter referanser fra Supabase (settings.testimonials),
// faller tilbake til eksempler til ekte er lagt inn i admin.
// ============================================================

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";
import BigButton from "@/components/ui/BigButton";
import type { Testimonial } from "@/lib/types";

export const metadata: Metadata = {
  title: "Referanser",
  description:
    "Les hva tidligere kunder sier om Nabolagshjelpen på Tromøya. Ekte tilbakemeldinger fra fornøyde naboer.",
};

export default async function ReferanserPage() {
  let testimonials: Testimonial[] = FALLBACK_TESTIMONIALS;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("testimonials")
      .eq("id", 1)
      .single();
    if (data?.testimonials && data.testimonials.length > 0) {
      testimonials = data.testimonials as Testimonial[];
    }
  } catch {
    // Bruk eksempel-referanser
  }

  return (
    <div>
      {/* Toppseksjon */}
      <section className="section bg-surface-warm">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="w-12 h-1 bg-accent-warm mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Referanser
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Her er noen hilsener fra naboer jeg har hjulpet. Takk til alle
            som har latt meg bidra i hverdagen!
          </p>
        </div>
      </section>

      {/* Referanser */}
      <section className="section bg-background">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-6">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="bg-surface rounded-3xl p-8 md:p-10 card-soft border border-border-light relative overflow-hidden"
              >
                {/* Dekorativt anførselstegn */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-6 text-8xl leading-none font-serif text-primary/10 select-none"
                >
                  &rdquo;
                </span>

                <blockquote className="relative text-xl md:text-2xl text-text leading-relaxed font-medium">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-6 flex flex-col">
                  <span className="text-lg font-bold text-text">{t.name}</span>
                  {t.service && (
                    <span className="text-primary font-semibold">
                      {t.service}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-lg text-text-muted mb-5">
              Vil du også ha hjelp av en pålitelig nabo?
            </p>
            <BigButton href="/bestill" variant="accent">
              Bestill hjelp nå
            </BigButton>
          </div>
        </div>
      </section>
    </div>
  );
}
