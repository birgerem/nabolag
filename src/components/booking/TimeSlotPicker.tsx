"use client";

// ============================================================
// TimeSlotPicker – Viser ledige tider som store knapper
// Kun ledige tider vises (ikke grå/disabled – det forvirrer eldre)
// ============================================================

import type { TimeSlot } from "@/lib/types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading: boolean;
}

export default function TimeSlotPicker({
  slots,
  selectedTime,
  onSelect,
  loading,
}: TimeSlotPickerProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-4">3. Velg tidspunkt</h2>

      {loading ? (
        <div className="bg-surface rounded-2xl p-6 border border-border-light text-center">
          <p className="text-lg text-text-muted">Laster ledige tider...</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-warning-light rounded-2xl p-6 border border-warning/25 text-center">
          <p className="text-lg text-warning font-semibold">
            Ingen ledige tider denne dagen
          </p>
          <p className="text-text-muted mt-2">
            Prøv en annen dag, eller ring oss for å avtale.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.start_time}
              onClick={() => onSelect(slot.start_time)}
              className={`
                min-h-[48px] px-4 py-3 rounded-xl
                text-lg font-semibold
                transition-all duration-200 cursor-pointer
                ${
                  selectedTime === slot.start_time
                    ? "bg-primary text-white shadow-md border-2 border-primary"
                    : "bg-surface text-text border-2 border-border-light hover:border-primary hover:bg-surface-warm"
                }
              `}
            >
              {selectedTime === slot.start_time && "✓ "}
              {slot.start_time} – {slot.end_time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
