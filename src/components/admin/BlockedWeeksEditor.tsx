"use client";

// ============================================================
// BlockedWeeksEditor – Blokker hele uker for bestilling
// Lagrer mandagen i den blokkerte uka i blocked_dates-tabellen.
// Kundene ser blokkerte uker som «ikke ledig» med grunn.
// ============================================================

import { useState } from "react";
import { addBlockedDate, removeBlockedDate } from "@/actions/settings";
import { getUpcomingWeeks } from "@/lib/constants";
import type { BlockedDate } from "@/lib/types";

interface BlockedWeeksEditorProps {
  blockedDates: BlockedDate[];
  onUpdate: () => void;
}

export default function BlockedWeeksEditor({
  blockedDates,
  onUpdate,
}: BlockedWeeksEditorProps) {
  const [reason, setReason] = useState("Bortreist");
  const [busyMonday, setBusyMonday] = useState<string | null>(null);

  // Vis de neste 12 ukene (kundene ser 8, men Edvard kan blokkere litt lengre fram)
  const weeks = getUpcomingWeeks(12);

  // Oppslag: mandag (YYYY-MM-DD) -> blokkert rad
  const blockedByMonday = new Map(
    blockedDates.map((bd) => [bd.blocked_date, bd])
  );

  async function handleBlock(monday: string) {
    setBusyMonday(monday);
    await addBlockedDate(monday, reason.trim() || undefined);
    onUpdate();
    setBusyMonday(null);
  }

  async function handleUnblock(id: string, monday: string) {
    setBusyMonday(monday);
    await removeBlockedDate(id);
    onUpdate();
    setBusyMonday(null);
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      <h3 className="text-xl font-bold text-text mb-1">Blokkerte uker</h3>
      <p className="text-text-muted text-sm mb-4">
        Blokker uker du er bortreist eller utilgjengelig. Blokkerte uker
        vises som «ikke ledig» på bestillingssiden.
      </p>

      {/* Grunn som lagres/vises til kundene */}
      <div className="mb-5">
        <label htmlFor="block-reason" className="text-sm font-medium text-text block mb-1">
          Grunn (vises til kundene)
        </label>
        <input
          id="block-reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="F.eks. Bortreist, Ferie, Eksamen"
        />
      </div>

      {/* Ukeliste */}
      <div className="space-y-2">
        {weeks.map((w) => {
          const blocked = blockedByMonday.get(w.monday);
          const isBusy = busyMonday === w.monday;
          return (
            <div
              key={w.monday}
              className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                blocked
                  ? "bg-error-light border-error/20"
                  : "bg-surface-warm border-border-light"
              }`}
            >
              <div>
                <span className="font-semibold text-text">{w.label}</span>
                {blocked && (
                  <span className="text-error text-sm ml-2">
                    🚫 blokkert{blocked.reason ? ` – ${blocked.reason}` : ""}
                  </span>
                )}
              </div>
              {blocked ? (
                <button
                  onClick={() => handleUnblock(blocked.id, w.monday)}
                  disabled={isBusy}
                  className="text-sm font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isBusy ? "..." : "Fjern blokkering"}
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(w.monday)}
                  disabled={isBusy}
                  className="text-sm font-semibold text-error hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isBusy ? "..." : "Blokker"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
