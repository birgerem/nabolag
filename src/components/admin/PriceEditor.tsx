"use client";

// ============================================================
// PriceEditor – Rediger timepris og telefonnummer
// ============================================================

import { useState } from "react";
import { updateSettings } from "@/actions/settings";
import BigButton from "@/components/ui/BigButton";
import type { Settings } from "@/lib/types";

interface PriceEditorProps {
  settings: Settings;
  onUpdate: () => void;
}

export default function PriceEditor({ settings, onUpdate }: PriceEditorProps) {
  const [price, setPrice] = useState(settings.price_per_hour);
  const [phone, setPhone] = useState(settings.phone_number);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const result = await updateSettings({
      price_per_hour: price,
      phone_number: phone,
    });

    if (result.success) {
      setMessage({ type: "success", text: "Innstillingene er oppdatert!" });
      onUpdate();
    } else {
      setMessage({ type: "error", text: result.error || "Noe gikk galt." });
    }
    setSaving(false);
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      <h3 className="text-xl font-bold text-text mb-4">Innstillinger</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="admin-price">Timepris (kr)</label>
          <input
            id="admin-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
            min={50}
            max={1000}
          />
        </div>

        <div>
          <label htmlFor="admin-phone">Telefonnummer</label>
          <input
            id="admin-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+47 000 00 000"
          />
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
          {saving ? "Lagrer..." : "Lagre endringer"}
        </BigButton>
      </div>
    </div>
  );
}
