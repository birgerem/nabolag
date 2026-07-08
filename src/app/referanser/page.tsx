// ============================================================
// Referanser-side – Sitater fra tidligere kunder
// Henter publiserte referanser, lar kunder sende inn egne,
// og gir delekort til Facebook per referanse.
// ============================================================

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_SERVICES } from "@/lib/constants";
import { getPublicTestimonials, facebookShareUrl } from "@/lib/testimonials";
import TestimonialForm from "@/components/testimonials/TestimonialForm";
import BigButton from "@/components/ui/BigButton";

export const metadata: Metadata = {
  title: "Referanser",
  description:
    "Les hva tidligere kunder sier om Nabolagshjelpen på Tromøya. Ekte tilbakemeldinger fra fornøyde naboer.",
};

export default async function ReferanserPage() {
  const testimonials = await getPublicTestimonials();

  // Tjenestenavn til innsendingsskjemaet
  let serviceNames: string[] = FALLBACK_SERVICES.map((s) => s.name);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("name")
      .eq("is_active", true)
      .order("sort_order");
    if (data && data.length > 0) serviceNames = data.map((s) => s.name);
  } catch {
    // bruk fallback-navn
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
            {testimonials.map((t) => (
              <figure
                key={t.id}
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

                <figcaption className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-text">{t.name}</span>
                    {t.service && (
                      <span className="text-primary font-semibold">
                        {t.service}
                      </span>
                    )}
                  </div>

                  {/* Del på Facebook */}
                  <a
                    href={facebookShareUrl(t.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl px-4 py-2.5 text-white font-semibold no-underline transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: "#1877F2" }}
                    aria-label={`Del referansen fra ${t.name} på Facebook`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
                    </svg>
                    Del på Facebook
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Innsendingsskjema */}
          <div className="mt-12">
            <TestimonialForm serviceNames={serviceNames} />
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
