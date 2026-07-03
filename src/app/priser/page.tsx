// ============================================================
// Priser-side – Tydelig, varm prisvisning med eksempler
// ============================================================

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_PRICE_PER_HOUR,
  DEFAULT_DISCOUNT,
  calculatePrice,
  formatPrice,
} from "@/lib/constants";
import BigButton from "@/components/ui/BigButton";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Enkel og tydelig prisliste for Nabolagshjelpen på Tromøya. 160 kr per time, rabatt ved lengre oppdrag.",
};

export default async function PriserPage() {
  let pricePerHour = DEFAULT_PRICE_PER_HOUR;
  let discount = DEFAULT_DISCOUNT;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("price_per_hour, discount_per_extra_hour")
      .eq("id", 1)
      .single();
    if (data) {
      pricePerHour = data.price_per_hour;
      discount = data.discount_per_extra_hour;
    }
  } catch {
    // Bruk standardverdier
  }

  const examples = [
    { hours: 1, label: "1 time" },
    { hours: 2, label: "2 timer" },
    { hours: 3, label: "3 timer" },
    { hours: 4, label: "4 timer" },
  ];

  return (
    <div>
      {/* Toppseksjon */}
      <section className="section bg-surface-warm">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="w-12 h-1 bg-accent-warm mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Priser
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Enkel og rettferdig prising. Ingen skjulte kostnader.
          </p>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container max-w-2xl mx-auto">
          {/* Hovedpris */}
          <div className="bg-surface rounded-3xl p-8 card-soft border-2 border-primary/20 text-center mb-8">
            <p className="text-text-muted text-lg mb-2">Timepris</p>
            <p className="text-5xl font-bold text-primary mb-2">
              {formatPrice(pricePerHour)}
            </p>
            <p className="text-text-muted">per time</p>
            <p className="text-base mt-4 text-text-muted">
              Minimum 1 time per oppdrag
            </p>
          </div>

          {/* Rabattinfo */}
          <div className="bg-secondary-dark/10 rounded-2xl p-6 mb-8 border border-secondary/25">
            <p className="text-lg font-semibold text-secondary-dark text-center">
              {discount} kr rabatt fra og med tredje time
            </p>
            <p className="text-text-muted text-center mt-2">
              Jo lengre oppdraget varer, jo mer sparer du!
            </p>
          </div>

          {/* Pristabell */}
          <div className="bg-surface rounded-2xl card-soft border border-border-light overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-warm border-b border-border-light">
                  <th className="text-left px-6 py-4 text-lg font-bold text-text">
                    Antall timer
                  </th>
                  <th className="text-right px-6 py-4 text-lg font-bold text-text">
                    Pris
                  </th>
                </tr>
              </thead>
              <tbody>
                {examples.map((example) => (
                  <tr
                    key={example.hours}
                    className="border-b border-border-light last:border-b-0"
                  >
                    <td className="px-6 py-4 text-lg">{example.label}</td>
                    <td className="px-6 py-4 text-lg text-right font-semibold text-primary">
                      {formatPrice(calculatePrice(example.hours, pricePerHour, discount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Eksempel */}
          <div className="bg-primary/5 rounded-2xl p-6 mb-8 border border-primary/15">
            <h3 className="text-lg font-bold text-primary mb-2">
              Eksempel
            </h3>
            <p className="text-text leading-relaxed">
              Trenger du hjelp med gressklipping i 3 timer? Da betaler du{" "}
              <strong>{formatPrice(calculatePrice(3, pricePerHour, discount))}</strong>{" "}
              totalt &ndash; i stedet for {formatPrice(pricePerHour * 3)}.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <BigButton href="/bestill" variant="accent">
              Bestill hjelp nå
            </BigButton>
          </div>
        </div>
      </section>
    </div>
  );
}
