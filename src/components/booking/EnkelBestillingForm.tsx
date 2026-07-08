"use client";

// ============================================================
// EnkelBestillingForm – Aller enkleste bestilling
// Legg igjen navn + telefon → Edvard ringer. Store felt/knapper,
// tilpasset eldre. I tillegg en stor "Ring nå"-knapp.
// ============================================================

import { useState } from "react";
import { requestCallback } from "@/actions/booking";

interface EnkelBestillingFormProps {
  phoneNumber: string;
}

export default function EnkelBestillingForm({
  phoneNumber,
}: EnkelBestillingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const telLink = `tel:${phoneNumber.replace(/\s/g, "")}`;

  async function handleSubmit() {
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 8) {
      setError("Fyll ut navnet ditt og telefonnummeret ditt.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const result = await requestCallback({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
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
      <div className="bg-surface rounded-3xl p-8 md:p-10 card-soft border-2 border-primary/25 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-text mb-3">Tusen takk, {name.trim()}!</h2>
        <p className="text-xl text-text-muted leading-relaxed mb-6">
          Edvard ringer deg på <strong className="text-text">{phone.trim()}</strong> så
          snart han kan, for å avtale hjelpen.
        </p>
        <a
          href={telLink}
          className="inline-flex items-center justify-center gap-3 w-full min-h-[64px] px-6 rounded-2xl bg-primary text-white text-xl font-bold no-underline hover:bg-primary-dark"
        >
          📞 Eller ring Edvard nå
        </a>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-3xl p-6 md:p-10 card-soft border-2 border-primary/20">
      {/* Ring nå – helt øverst, for de som heller vil ringe */}
      <a
        href={telLink}
        className="flex items-center justify-center gap-3 w-full min-h-[68px] px-6 rounded-2xl bg-primary text-white text-2xl font-bold no-underline hover:bg-primary-dark mb-6"
      >
        📞 Ring Edvard nå
      </a>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border-light" />
        <span className="text-text-muted text-lg">eller legg igjen nummeret ditt</span>
        <div className="flex-1 h-px bg-border-light" />
      </div>

      <p className="text-xl text-text-muted mb-6 leading-relaxed">
        Fyll inn navn og telefonnummer, så ringer Edvard deg for å avtale. Du
        trenger ikke velge noe mer.
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="enkel-name" className="text-lg font-semibold text-text block mb-2">
            Navnet ditt
          </label>
          <input
            id="enkel-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ola Nordmann"
            autoComplete="name"
            className="w-full min-h-[60px] rounded-2xl border-2 border-border bg-surface px-5 text-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label htmlFor="enkel-phone" className="text-lg font-semibold text-text block mb-2">
            Telefonnummeret ditt
          </label>
          <input
            id="enkel-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="000 00 000"
            autoComplete="tel"
            className="w-full min-h-[60px] rounded-2xl border-2 border-border bg-surface px-5 text-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label htmlFor="enkel-msg" className="text-lg font-semibold text-text block mb-2">
            Hva trenger du hjelp med?{" "}
            <span className="font-normal text-text-muted">(valgfritt)</span>
          </label>
          <textarea
            id="enkel-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="F.eks. klippe plenen"
            className="w-full rounded-2xl border-2 border-border bg-surface px-5 py-3 text-xl text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {error && (
          <div className="bg-error-light rounded-2xl p-4 border border-error/20">
            <p className="text-error font-semibold text-lg">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full min-h-[68px] rounded-2xl bg-accent text-white text-2xl font-bold hover:bg-accent-dark cursor-pointer disabled:opacity-60"
        >
          {submitting ? "Sender …" : "Send – så ringer Edvard deg"}
        </button>
      </div>
    </div>
  );
}
