"use client";

// ============================================================
// PageContentEditor – Rediger forsidestekst fra admin-panelet
// Hero-overskrift/undertekst og Om meg-avsnittene
// ============================================================

import { useState } from "react";
import { updatePageContent } from "@/actions/settings";
import BigButton from "@/components/ui/BigButton";
import type { PageContent } from "@/lib/types";

const DEFAULT_CONTENT: PageContent = {
  hero_heading: "Trygg og pålitelig hjelp",
  hero_subheading:
    "Jeg hjelper deg med småjobber i hjem og hage – og praktisk hjelp i hverdagen. Pålitelig, rimelig og alltid med et smil.",
  about_paragraph1:
    "Jeg er 13 år og bor på Brekka på Tromøya. Jeg går på Roligheden skole, og på fritiden spiller jeg håndball og fotball – og er veldig glad i snowboard!",
  about_paragraph2:
    "Jeg har to yngre søsken og er vant til å hjelpe til hjemme. Jeg liker å være til nytte for andre, og det er derfor jeg har startet Nabolagshjelpen. Jeg tilbyr hjelp med alt fra gressklipping og snømåking til å bære handleposer og annet enkelt arbeid i hjemmet.",
  about_paragraph3:
    "Foreldrene mine støtter meg i dette, og du kan alltid ta kontakt med dem hvis du har spørsmål. Det skal alltid være trygt å be om hjelp i nabolaget!",
};

interface PageContentEditorProps {
  pageContent?: PageContent | null;
  onUpdate: () => void;
}

export default function PageContentEditor({
  pageContent,
  onUpdate,
}: PageContentEditorProps) {
  const initial = { ...DEFAULT_CONTENT, ...(pageContent ?? {}) };

  const [heroHeading, setHeroHeading] = useState(initial.hero_heading);
  const [heroSubheading, setHeroSubheading] = useState(initial.hero_subheading);
  const [about1, setAbout1] = useState(initial.about_paragraph1);
  const [about2, setAbout2] = useState(initial.about_paragraph2);
  const [about3, setAbout3] = useState(initial.about_paragraph3);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const result = await updatePageContent({
      hero_heading: heroHeading,
      hero_subheading: heroSubheading,
      about_paragraph1: about1,
      about_paragraph2: about2,
      about_paragraph3: about3,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Teksten er oppdatert på forsiden!" });
      onUpdate();
    } else {
      setMessage({ type: "error", text: result.error || "Noe gikk galt." });
    }
    setSaving(false);
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      <h3 className="text-xl font-bold text-text mb-1">Rediger forsidestekst</h3>
      <p className="text-text-muted text-sm mb-5">
        Endringer vises umiddelbart på forsiden etter lagring.
      </p>

      <div className="space-y-5">
        {/* Hero */}
        <div className="bg-surface-warm rounded-xl p-4 border border-border-light">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
            🏠 Topp-seksjon (Hero)
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="hero-heading" className="text-sm font-medium text-text block mb-1">
                Overskrift
              </label>
              <input
                id="hero-heading"
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="Trygg og pålitelig hjelp"
              />
            </div>

            <div>
              <label htmlFor="hero-sub" className="text-sm font-medium text-text block mb-1">
                Undertekst
              </label>
              <textarea
                id="hero-sub"
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Kort beskrivelse som vises under overskriften..."
              />
            </div>
          </div>
        </div>

        {/* Om meg */}
        <div className="bg-surface-warm rounded-xl p-4 border border-border-light">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
            👦 Om meg-seksjon
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="about-1" className="text-sm font-medium text-text block mb-1">
                Avsnitt 1 — Presentasjon
              </label>
              <textarea
                id="about-1"
                value={about1}
                onChange={(e) => setAbout1(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label htmlFor="about-2" className="text-sm font-medium text-text block mb-1">
                Avsnitt 2 — Hva jeg tilbyr
              </label>
              <textarea
                id="about-2"
                value={about2}
                onChange={(e) => setAbout2(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label htmlFor="about-3" className="text-sm font-medium text-text block mb-1">
                Avsnitt 3 — Trygghet og foreldre
              </label>
              <textarea
                id="about-3"
                value={about3}
                onChange={(e) => setAbout3(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-xl p-4 border ${
              message.type === "success"
                ? "bg-success-light border-green-200 text-success"
                : "bg-error-light border-red-200 text-error"
            }`}
          >
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        <BigButton
          onClick={handleSave}
          variant="primary"
          fullWidth
          disabled={saving}
        >
          {saving ? "Lagrer..." : "Lagre forsidestekst"}
        </BigButton>
      </div>
    </div>
  );
}
