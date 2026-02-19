// ============================================================
// HeroSection – Hovedseksjon med Tromøya-natur og rav/mose-palett
// ============================================================

import Image from "next/image";
import BigButton from "@/components/ui/BigButton";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Bakgrunnsbilde – grønt kystlandskap, Sørlandet-stemning */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Hovefestivallocation.jpg?w=1920&q=80&fit=max&fm=jpg"
          alt="Grønt kystlandskap med sjø og natur"
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
          Trygg og pålitelig hjelp
          <br />
          <span className="text-secondary">på Tromøya</span>
        </h1>

        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          Jeg hjelper deg med småjobber i hjem og hage &ndash; og praktisk
          hjelp i hverdagen. Pålitelig, rimelig og alltid med et smil.
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
      </div>
    </section>
  );
}
