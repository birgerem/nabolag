// ============================================================
// Enkelt-referanse – egen side per referanse (for Facebook-deling)
// Facebook henter delekortet fra opengraph-image.tsx i denne mappen.
// ============================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findTestimonial } from "@/lib/testimonials";
import { truncate } from "@/lib/constants";
import ShareButton from "@/components/testimonials/ShareButton";
import BigButton from "@/components/ui/BigButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await findTestimonial(id);
  if (!t) return { title: "Referanse" };

  const title = `${t.name} anbefaler Nabolagshjelpen`;
  const description = truncate(t.quote, 200);
  return {
    title,
    description,
    alternates: { canonical: `/referanser/${id}` },
    openGraph: {
      title,
      description,
      url: `/referanser/${id}`,
      type: "article",
    },
  };
}

export default async function TestimonialPage({ params }: PageProps) {
  const { id } = await params;
  const t = await findTestimonial(id);
  if (!t) notFound();

  return (
    <div className="section">
      <div className="container max-w-2xl mx-auto">
        <figure className="bg-surface rounded-3xl p-8 md:p-12 card-soft border border-border-light relative overflow-hidden">
          <span
            aria-hidden="true"
            className="absolute top-4 right-8 text-9xl leading-none font-serif text-primary/10 select-none"
          >
            &rdquo;
          </span>

          <blockquote className="relative text-2xl md:text-3xl text-text leading-relaxed font-medium">
            {t.quote}
          </blockquote>

          <figcaption className="mt-8">
            <span className="block text-xl font-bold text-text">{t.name}</span>
            {t.service && (
              <span className="text-primary font-semibold">{t.service}</span>
            )}
          </figcaption>
        </figure>

        {/* Del + CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ShareButton
            id={t.id}
            name={t.name}
            className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl px-6 py-3.5 text-white font-semibold bg-[#1877F2] transition-transform hover:scale-[1.03]"
          />
          <BigButton href="/bestill" variant="accent">
            Bestill hjelp nå
          </BigButton>
        </div>

        <div className="text-center mt-8">
          <a href="/referanser" className="text-primary font-semibold hover:underline">
            ← Se alle referanser
          </a>
        </div>
      </div>
    </div>
  );
}
