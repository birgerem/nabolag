"use client";

// ============================================================
// DatePicker – Egenutviklet stor kalender for eldre brukere
// Store dagknapper, enkel navigasjon, ingen native date-picker
// ============================================================

import { useState, useMemo } from "react";
import { MONTH_NAMES, DAY_NAMES_SHORT } from "@/lib/constants";

interface DatePickerProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  blockedDates?: string[];
  inactiveDays?: number[]; // Ukedager uten aktive tidsluker (f.eks. [0, 2, 4])
}

export default function DatePicker({
  selectedDate,
  onSelect,
  blockedDates = [],
  inactiveDays = [],
}: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  // Maks 8 uker frem
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 56);

  // Generer dager i måneden
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0=Søndag

    // Juster for norsk uke (mandag = start)
    const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: (Date | null)[] = [];

    // Tomme celler før måneden starter
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null);
    }

    // Dager i måneden
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(viewYear, viewMonth, d));
    }

    return days;
  }, [viewMonth, viewYear]);

  // Naviger til forrige/neste måned
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Sjekk om en dag kan velges
  const isSelectable = (date: Date) => {
    if (date < today) return false;
    if (date > maxDate) return false;
    if (inactiveDays.includes(date.getDay())) return false; // Dager uten tidsluker
    const dateStr = formatDateStr(date);
    if (blockedDates.includes(dateStr)) return false;
    return true;
  };

  // Format dato til "YYYY-MM-DD"
  const formatDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Kan vi gå til forrige måned?
  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  // Kan vi gå til neste måned?
  const canGoNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth());

  // Norsk ukedag-rekkefølge (mandag først)
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-4">2. Velg dato</h2>

      <div className="bg-surface rounded-2xl p-4 md:p-6 border border-border-light">
        {/* Måned-navigasjon */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl
              bg-surface-warm hover:bg-border-light disabled:opacity-30 disabled:cursor-not-allowed
              text-xl font-bold cursor-pointer"
            aria-label="Forrige måned"
          >
            ←
          </button>
          <h3 className="text-xl font-bold text-text">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl
              bg-surface-warm hover:bg-border-light disabled:opacity-30 disabled:cursor-not-allowed
              text-xl font-bold cursor-pointer"
            aria-label="Neste måned"
          >
            →
          </button>
        </div>

        {/* Ukedager */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-text-muted py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dager */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const dateStr = formatDateStr(date);
            const selectable = isSelectable(date);
            const isSelected = selectedDate === dateStr;
            const isToday = formatDateStr(today) === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => selectable && onSelect(dateStr)}
                disabled={!selectable}
                className={`
                  aspect-square flex items-center justify-center
                  rounded-xl text-lg font-medium
                  transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? "bg-primary text-white shadow-md"
                      : selectable
                        ? "bg-surface-warm hover:bg-surface hover:border-primary text-text"
                        : "text-border cursor-not-allowed"
                  }
                  ${isToday && !isSelected ? "ring-2 ring-primary" : ""}
                `}
                aria-label={`${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Hjelpetekst */}
        <p className="text-sm text-text-muted mt-4 text-center">
          Grå dager er ikke tilgjengelig. Velg en dag for å se ledige tider.
        </p>
      </div>
    </div>
  );
}
