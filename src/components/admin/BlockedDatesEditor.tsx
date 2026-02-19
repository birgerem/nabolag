"use client";

// ============================================================
// BlockedDatesEditor – Administrer blokkerte datoer
// ============================================================

import { useState } from "react";
import { addBlockedDate, removeBlockedDate } from "@/actions/settings";
import { formatDate } from "@/lib/constants";
import BigButton from "@/components/ui/BigButton";
import type { BlockedDate } from "@/lib/types";

interface BlockedDatesEditorProps {
  blockedDates: BlockedDate[];
  onUpdate: () => void;
}

export default function BlockedDatesEditor({
  blockedDates,
  onUpdate,
}: BlockedDatesEditorProps) {
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!newDate) return;
    setSaving(true);
    await addBlockedDate(newDate, newReason);
    setNewDate("");
    setNewReason("");
    onUpdate();
    setSaving(false);
  }

  async function handleRemove(id: string) {
    await removeBlockedDate(id);
    onUpdate();
  }

  // Sorter etter dato
  const sorted = [...blockedDates].sort(
    (a, b) => new Date(a.blocked_date).getTime() - new Date(b.blocked_date).getTime()
  );

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      <h3 className="text-xl font-bold text-text mb-4">Blokkerte datoer</h3>
      <p className="text-text-muted mb-4">
        Legg til datoer du ikke kan jobbe (ferie, eksamen, osv.)
      </p>

      {/* Legg til ny */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1"
        />
        <input
          type="text"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          placeholder="Grunn (valgfritt)"
          className="flex-1"
        />
        <BigButton onClick={handleAdd} variant="primary" disabled={saving || !newDate}>
          Legg til
        </BigButton>
      </div>

      {/* Liste over blokkerte datoer */}
      {sorted.length === 0 ? (
        <p className="text-text-muted">Ingen blokkerte datoer.</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((bd) => (
            <div
              key={bd.id}
              className="flex items-center justify-between bg-surface-warm rounded-lg px-4 py-3"
            >
              <div>
                <span className="font-semibold">{formatDate(bd.blocked_date)}</span>
                {bd.reason && (
                  <span className="text-text-muted ml-2">– {bd.reason}</span>
                )}
              </div>
              <button
                onClick={() => handleRemove(bd.id)}
                className="text-error font-semibold hover:underline cursor-pointer"
              >
                Fjern
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
