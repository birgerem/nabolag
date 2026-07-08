"use client";

// ============================================================
// TestimonialForm – Kunder sender inn egen referanse
// Havner til godkjenning i admin før den vises på siden.
// ============================================================

import { useState } from "react";
import { submitTestimonial } from "@/actions/settings";
import BigButton from "@/components/ui/BigButton";

interface TestimonialFormProps {
  serviceNames: string[];
}

export default function TestimonialForm({ serviceNames }: TestimonialFormProps) {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (name.trim().length < 2 || quote.trim().length < 10) {
      setError("Fyll ut navn og en referanse på minst 10 tegn.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const result = await submitTestimonial({
      name: name.trim(),
      service: service.trim(),
      quote: quote.trim(),
    });

    if (result.success) {
      setDone(true);
    } else {
      setError(result.error || "Noe gikk galt. Prøv igjen.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-secondary-dark/10 rounded-2xl p-8 border border-secondary/25 text-center">
        <div className="text-5xl mb-3">🌿</div>
        <h3 className="text-xl font-bold text-text mb-2">Tusen takk!</h3>
        <p className="text-text-muted">
          Referansen din er sendt inn. Den vises her så snart Edvard har
          godkjent den.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
      <h3 className="text-2xl font-bold text-text mb-2">Del din opplevelse</h3>
      <p className="text-text-muted mb-5">
        Har Edvard hjulpet deg? Skriv gjerne noen ord – det hjelper andre naboer
        å tørre å be om hjelp. Referansen vises etter godkjenning.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="ref-name">Navn (og gjerne sted)</label>
          <input
            id="ref-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="F.eks. Kari, Brekka"
          />
        </div>

        <div>
          <label htmlFor="ref-service">Hvilken tjeneste? (valgfritt)</label>
          <select
            id="ref-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Velg tjeneste …</option>
            {serviceNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ref-quote">Din referanse</label>
          <textarea
            id="ref-quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Fortell kort hvordan du opplevde hjelpen …"
          />
        </div>

        {error && (
          <div className="bg-error-light rounded-xl p-4 border border-error/20">
            <p className="text-error font-semibold">{error}</p>
          </div>
        )}

        <BigButton
          onClick={handleSubmit}
          variant="primary"
          fullWidth
          disabled={submitting}
        >
          {submitting ? "Sender …" : "Send inn referanse"}
        </BigButton>
      </div>
    </div>
  );
}
