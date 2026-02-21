// ============================================================
// Sommerjobb – Edvards åpne søknad til bedrifter på Tromøya
// ============================================================

import type { Metadata } from "next";
import JobApplicationForm from "@/components/sommerjobb/JobApplicationForm";

export const metadata: Metadata = {
  title: "Sommerjobb",
  description:
    "Edvard (14) fra Tromøya søker sommerjobb. Les søknaden og ta kontakt hvis du har en jobb til ham!",
};

export default function SommerjobbPage() {
  return (
    <div className="section bg-background">
      <div className="container max-w-3xl">

        {/* Toppmarkør */}
        <div className="w-12 h-1 bg-accent mx-auto mb-4 rounded-full" />

        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-3">
          Edvard søker sommerjobb
        </h1>
        <p className="text-center text-text-muted text-lg mb-10">
          Er du på jakt etter en hjelpsom og pålitelig sommervikar? Les søknaden nedenfor!
        </p>

        {/* ===== SØKNADSBREVET ===== */}
        <div className="bg-surface rounded-3xl p-8 md:p-12 card-soft border border-border-light mb-10">

          {/* Brevhode */}
          <div className="mb-8 pb-6 border-b border-border-light">
            <p className="font-semibold text-text">Edvard Flåm Emanuelsen</p>
            <p className="text-text-muted">Tromøy kirkevei 394 D</p>
            <p className="text-text-muted">4818 Færvik</p>
            <p className="text-text-muted mt-3">1. februar 2026</p>
          </div>

          {/* Tittel */}
          <h2 className="text-2xl font-bold text-primary mb-6">
            Søknad om sommerjobb
          </h2>

          {/* Søknadstekst */}
          <div className="space-y-5 text-lg leading-relaxed text-text">
            <p>
              Jeg heter Edvard, er 13 år og går i 8. klasse på Roligheden skole.
              Til sommeren fyller jeg 14 år, og jeg ønsker gjerne å søke sommerjobb hos dere.
            </p>
            <p>
              Jeg er vant til å ta ansvar hjemme. Jeg klipper plenen, hjelper til med ulike
              oppgaver i huset, lager mat og tar oppvasken. Jeg liker å ha det ryddig rundt
              meg, og jeg gjør alltid det jeg får beskjed om så godt jeg kan.
            </p>
            <p>
              Jeg er veldig glad i å lage mat og synes det er gøy å hjelpe til der det trengs.
              Jeg kan for eksempel bidra med servering, dekke bord, rydde og vaske. Jeg trives
              også godt med å prate med folk og liker å møte nye mennesker.
            </p>
            <p>
              På fritiden driver jeg med håndball, fotball og snowboard. Jeg har alltid likt
              meg på lag, og liker å samarbeide. Uken er full av aktiviteter, og jeg synes det
              er viktig å møte til riktig tid og gjøre mitt beste.
            </p>
            <p>
              Jeg håper dere vil vurdere søknaden min. Jeg stiller gjerne til en prat dersom
              dere ønsker å bli bedre kjent med meg.
            </p>
          </div>

          {/* Hilsen */}
          <div className="mt-8 pt-6 border-t border-border-light">
            <p className="text-text-muted">Vennlig hilsen</p>
            <p className="text-xl font-bold text-primary mt-1">Edvard Flåm Emanuelsen</p>
          </div>
        </div>

        {/* Tillitsbadges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          {[
            "Pålitelig og punktlig",
            "Teamspiller",
            "Foreldrestøtte",
            "Lokal fra Tromøya",
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 bg-secondary/10 px-4 py-2.5 rounded-2xl border border-secondary/20"
            >
              <span className="text-secondary font-bold text-lg">&#10003;</span>
              <span className="font-medium text-text text-sm">{badge}</span>
            </div>
          ))}
        </div>

        {/* ===== KONTAKTSKJEMA ===== */}
        <div className="w-12 h-1 bg-accent mx-auto mb-6 rounded-full" />
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          Har du en jobb til Edvard?
        </h2>

        <JobApplicationForm />

      </div>
    </div>
  );
}
