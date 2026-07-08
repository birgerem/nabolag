// ============================================================
// Enkelt-referanse – egen side per referanse (for Facebook-deling)
// Facebook henter delekortet fra opengraph-image.tsx i denne mappen.
// ============================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findTestimonial, facebookShareUrl } from "@/lib/testimonials";
import { truncate } from "@/lib/constants";
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
          <a
            href={facebookShareUrl(t.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-white font-semibold no-underline transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: "#1877F2" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
            </svg>
            Del på Facebook
          </a>
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
