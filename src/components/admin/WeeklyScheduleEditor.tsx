"use client";

// ============================================================
// WeeklyScheduleEditor – Visuelt ukegrid for admin
// Edvard kan skru tidsluker av/på, legge til nye, slette
// ============================================================

import { useState, useEffect } from "react";
import {
  fetchAllSlots,
  toggleSlotActive,
  addTimeSlot,
  deleteTimeSlot,
} from "@/actions/slots";
import { DAY_NAMES } from "@/lib/constants";
import BigButton from "@/components/ui/BigButton";
import type { AvailableSlot } from "@/lib/types";

interface WeeklyScheduleEditorProps {
  onUpdate: () => void;
}

export default function WeeklyScheduleEditor({
  onUpdate,
}: WeeklyScheduleEditorProps) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  // Skjema for ny tidsluke
  const [newDay, setNewDay] = useState(1);
  const [newStartTime, setNewStartTime] = useState("15:00");
  const [newEndTime, setNewEndTime] = useState("16:00");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    setLoading(true);
    const result = await fetchAllSlots();
    setSlots(result.slots);
    setLoading(false);
  }

  async function handleToggle(slotId: string, currentActive: boolean) {
    setToggling(slotId);
    const result = await toggleSlotActive(slotId, !currentActive);
    if (result.success) {
      // Oppdater lokalt for rask feedback
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, is_active: !currentActive } : s
        )
      );
      onUpdate();
    }
    setToggling(null);
  }

  async function handleDelete(slotId: string) {
    if (!confirm("Er du sikker på at du vil slette denne tidsluken?")) return;
    const result = await deleteTimeSlot(slotId);
    if (result.success) {
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      onUpdate();
    } else {
      alert(result.error);
    }
  }

  async function handleAdd() {
    setAdding(true);
    setFormError(null);
    const result = await addTimeSlot({
      day_of_week: newDay,
      start_time: newStartTime,
      end_time: newEndTime,
    });

    if (result.success) {
      setShowAddForm(false);
      setNewStartTime("15:00");
      setNewEndTime("16:00");
      await loadSlots();
      onUpdate();
    } else {
      setFormError(result.error || "Noe gikk galt.");
    }
    setAdding(false);
  }

  // Grupper slots etter dag
  const slotsByDay: Record<number, AvailableSlot[]> = {};
  for (let i = 0; i <= 6; i++) {
    slotsByDay[i] = slots
      .filter((s) => s.day_of_week === i)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl p-6 border border-border-light">
        <p className="text-text-muted">Laster ukentlig timeplan...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-light">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-text">Ukentlig timeplan</h3>
          <p className="text-sm text-text-muted">
            Skru tider av eller på basert på når du er ledig
          </p>
        </div>
        <BigButton
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormError(null);
          }}
          variant={showAddForm ? "secondary" : "primary"}
        >
          {showAddForm ? "Avbryt" : "+ Legg til tid"}
        </BigButton>
      </div>

      {/* Legg til ny tidsluke */}
      {showAddForm && (
        <div className="bg-surface-warm rounded-xl p-4 mb-6 border border-border-light">
          <h4 className="font-semibold text-text mb-3">Legg til ny tidsluke</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="new-day" className="text-sm">
                Ukedag
              </label>
              <select
                id="new-day"
                value={newDay}
                onChange={(e) => setNewDay(parseInt(e.target.value))}
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-surface text-text"
              >
                {DAY_NAMES.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label htmlFor="new-start" className="text-sm">
                Fra
              </label>
              <input
                id="new-start"
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="new-end" className="text-sm">
                Til
              </label>
              <input
                id="new-end"
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <BigButton
                onClick={handleAdd}
                variant="accent"
                fullWidth
                disabled={adding}
              >
                {adding ? "Legger til..." : "Legg til"}
              </BigButton>
            </div>
          </div>
          {formError && (
            <p className="text-error text-sm mt-2 font-semibold">{formError}</p>
          )}
        </div>
      )}

      {/* Ukegrid — mandag til søndag */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
          const daySlots = slotsByDay[dayNum];
          const activeCount = daySlots.filter((s) => s.is_active).length;

          return (
            <div
              key={dayNum}
              className="border border-border-light rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-text">{DAY_NAMES[dayNum]}</h4>
                <span className="text-sm text-text-muted">
                  {activeCount > 0
                    ? `${activeCount} aktive tider`
                    : "Ingen tider"}
                </span>
              </div>

              {daySlots.length === 0 ? (
                <p className="text-text-muted text-sm italic">
                  Ingen tider denne dagen — kunder kan ikke booke.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`
                        rounded-lg p-3 border-2 transition-all
                        ${
                          slot.is_active
                            ? "bg-success-light border-success/30"
                            : "bg-surface-warm border-border-light opacity-60"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-text">
                          {slot.start_time.substring(0, 5)}–
                          {slot.end_time.substring(0, 5)}
                        </span>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="text-error text-xs hover:underline cursor-pointer
                            ml-1 opacity-60 hover:opacity-100"
                          title="Slett tidsluke"
                        >
                          ✕
                        </button>
                      </div>
                      <button
                        onClick={() => handleToggle(slot.id, slot.is_active)}
                        disabled={toggling === slot.id}
                        className={`
                          w-full py-1.5 rounded text-sm font-semibold cursor-pointer
                          transition-colors duration-200
                          ${
                            slot.is_active
                              ? "bg-success text-white hover:bg-success/80"
                              : "bg-border text-text hover:bg-border-light"
                          }
                          ${toggling === slot.id ? "opacity-50" : ""}
                        `}
                      >
                        {toggling === slot.id
                          ? "..."
                          : slot.is_active
                            ? "Aktiv"
                            : "Skru på"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hjelpetekst */}
      <div className="mt-4 bg-surface-warm rounded-lg p-4 border border-border-light">
        <p className="text-sm text-text-muted">
          <strong>Tips:</strong> Grønne tider kan bookes av kunder. Grå tider
          er skjulte. Du kan ikke slette tider som har fremtidige bookinger —
          avlys bookingene først.
        </p>
      </div>
    </div>
  );
}
