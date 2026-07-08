"use client";

// ============================================================
// TestimonialsEditor – Legg inn og rediger kundereferanser
// Vises på /referanser. Lagres i settings.testimonials (Supabase).
// ============================================================

import { useState } from "react";
import { updateTestimonials } from "@/actions/settings";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";
import BigButton from "@/components/ui/BigButton";
import type { Testimonial } from "@/lib/types";

interface TestimonialsEditorProps {
  testimonials?: Testimonial[] | null;
  onUpdate: () => void;
}

// Rader i editoren kan mangle id (nye rader) – id tildeles ved lagring.
type EditableTestimonial = { id?: string; quote: string; name: string; service: string };

const EMPTY: EditableTestimonial = { quote: "", name: "", service: "" };

export default function TestimonialsEditor({
  testimonials,
  onUpdate,
}: TestimonialsEditorProps) {
  // Start med lagrede referanser, ellers eksemplene så det er noe å redigere
  const initial =
    testimonials && testimonials.length > 0
      ? testimonials
      : FALLBACK_TESTIMONIALS;

  const [items, setItems] = useState<EditableTestimonial[]>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function updateItem(index: number, field: keyof EditableTestimonial, value: string) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const result = await updateTestimonials(items);

    if (result.success) {
      setMessage({ type: "success", text: "Referansene er oppdatert!" });
      onUpdate();
    } else {
      setMessage({ type: "error", text: result.error || "Noe gikk galt." });
    }
    setSaving(false);
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      <h3 className="text-xl font-bold text-text mb-1">Kundereferanser</h3>
      <p className="text-text-muted text-sm mb-5">
        Referansene vises på siden «Referanser». Tomme rader lagres ikke.
      </p>

      <div className="space-y-5">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-surface-warm rounded-xl p-4 border border-border-light"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                💬 Referanse {i + 1}
              </p>
              <button
                onClick={() => removeItem(i)}
                className="text-sm text-error font-medium hover:underline cursor-pointer"
              >
                Fjern
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor={`quote-${i}`}
                  className="text-sm font-medium text-text block mb-1"
                >
                  Sitat
                </label>
                <textarea
                  id={`quote-${i}`}
                  value={item.quote}
                  onChange={(e) => updateItem(i, "quote", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Det kunden sa om hjelpen de fikk..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`name-${i}`}
                    className="text-sm font-medium text-text block mb-1"
                  >
                    Navn (og evt. sted)
                  </label>
                  <input
                    id={`name-${i}`}
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(i, "name", e.target.value)}
                    placeholder="Kari, Brekka"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`service-${i}`}
                    className="text-sm font-medium text-text block mb-1"
                  >
                    Tjeneste
                  </label>
                  <input
                    id={`service-${i}`}
                    type="text"
                    value={item.service}
                    onChange={(e) => updateItem(i, "service", e.target.value)}
                    placeholder="Plenklipping/stell i hagen"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full py-3 rounded-xl border-2 border-dashed border-border text-text-muted font-medium hover:border-primary hover:text-primary cursor-pointer transition-colors"
        >
          + Legg til referanse
        </button>

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
          {saving ? "Lagrer..." : "Lagre referanser"}
        </BigButton>
      </div>
    </div>
  );
}
