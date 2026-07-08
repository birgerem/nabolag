// ============================================================
// HeroSection – Hovedseksjon med Tromøya-natur og rav/mose-palett
// Tekst hentes fra Supabase settings.page_content (med fallback)
// ============================================================

import Image from "next/image";
import BigButton from "@/components/ui/BigButton";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_HEADING = "Trygg og pålitelig hjelp";
const DEFAULT_SUBHEADING =
  "Jeg hjelper deg med småjobber i hjem og hage – og praktisk hjelp i hverdagen. Pålitelig, rimelig og alltid med et smil.";

export default async function HeroSection() {
  let heading = DEFAULT_HEADING;
  let subheading = DEFAULT_SUBHEADING;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("page_content")
      .eq("id", 1)
      .single();

    if (data?.page_content) {
      heading = data.page_content.hero_heading || DEFAULT_HEADING;
      subheading = data.page_content.hero_subheading || DEFAULT_SUBHEADING;
    }
  } catch {
    // Bruk fallback-tekst hvis DB ikke er tilgjengelig
  }

  return (
    <section className="relative overflow-hidden">
      {/* Bakgrunnsbilde – grønt kystlandskap, Sørlandet-stemning */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bakgrunn.jpg"
          alt="Grønt kystlandskap med sjø og natur på Tromøya"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/95" />
      </div>

      {/* Innhold */}
      <div className="relative z-10 container text-center py-16 md:py-24">
        <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />

        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-5 leading-tight">
          {heading}
          <br />
          <span className="text-secondary">på Tromøya</span>
        </h1>

        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          {subheading}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <BigButton href="/tjenester" variant="primary" fullWidth>
            Se tjenester
          </BigButton>
          <BigButton href="/priser" variant="light" fullWidth>
            Se priser
          </BigButton>
          <BigButton href="/bestill" variant="accent" fullWidth>
            Bestill hjelp
          </BigButton>
        </div>

        {/* Enkel bestilling – ekstra tydelig, for de som vil ha det enkelt */}
        <div className="max-w-lg mx-auto mt-5">
          <a
            href="/enkel-bestilling"
            className="flex items-center justify-center gap-2 w-full min-h-[58px] px-6 rounded-2xl bg-surface border-2 border-primary/30 text-primary text-lg font-bold no-underline hover:bg-primary/5 transition-colors"
          >
            📞 Enkel bestilling – legg igjen nummeret, så ringer vi deg
          </a>
        </div>
      </div>
    </section>
  );
}
