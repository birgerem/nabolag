"use client";

// ============================================================
// SubmissionsInbox – Innsendte referanser til godkjenning
// Godkjenn -> publiseres. Avvis -> slettes.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  fetchTestimonialSubmissions,
  approveTestimonialSubmission,
  rejectTestimonialSubmission,
} from "@/actions/settings";
import type { TestimonialSubmission } from "@/lib/types";

interface SubmissionsInboxProps {
  onApproved: () => void;
}

export default function SubmissionsInbox({ onApproved }: SubmissionsInboxProps) {
  const [items, setItems] = useState<TestimonialSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await fetchTestimonialSubmissions();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(id: string) {
    setBusyId(id);
    await approveTestimonialSubmission(id);
    await load();
    onApproved();
    setBusyId(null);
  }

  async function handleReject(id: string) {
    if (!confirm("Avvise og slette denne innsendte referansen?")) return;
    setBusyId(id);
    await rejectTestimonialSubmission(id);
    await load();
    setBusyId(null);
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-xl font-bold text-text">Nye referanser til godkjenning</h3>
        {items.length > 0 && (
          <span className="bg-warning text-white text-sm font-bold rounded-full px-2.5 py-0.5">
            {items.length}
          </span>
        )}
      </div>
      <p className="text-text-muted text-sm mb-5">
        Referanser kunder har sendt inn fra nettsiden. Godkjente vises på
        «Referanser».
      </p>

      {loading ? (
        <p className="text-text-muted">Laster …</p>
      ) : items.length === 0 ? (
        <p className="text-text-muted">Ingen nye referanser akkurat nå.</p>
      ) : (
        <div className="space-y-3">
          {items.map((s) => {
            const isBusy = busyId === s.id;
            return (
              <div
                key={s.id}
                className="bg-surface-warm rounded-xl p-4 border border-border-light"
              >
                <p className="text-text italic mb-2">&ldquo;{s.quote}&rdquo;</p>
                <p className="text-sm text-text-muted mb-3">
                  <span className="font-semibold text-text">{s.name}</span>
                  {s.service ? ` · ${s.service}` : ""}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(s.id)}
                    disabled={isBusy}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? "…" : "Godkjenn"}
                  </button>
                  <button
                    onClick={() => handleReject(s.id)}
                    disabled={isBusy}
                    className="px-4 py-2 bg-surface text-error border border-error/30 rounded-lg font-medium hover:bg-error-light cursor-pointer disabled:opacity-50"
                  >
                    Avvis
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
