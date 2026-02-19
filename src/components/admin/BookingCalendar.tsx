"use client";

// ============================================================
// BookingCalendar – Enkel kalendervisning av bookinger
// Viser prikker på dager med bookinger, klikk for detaljer
// ============================================================

import { useState, useMemo } from "react";
import { MONTH_NAMES, formatTime, formatPrice } from "@/lib/constants";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Booking } from "@/lib/types";

interface BookingCalendarProps {
  bookings: Booking[];
}

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Grupper bookinger etter dato
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.booking_date]) map[b.booking_date] = [];
      map[b.booking_date].push(b);
    });
    return map;
  }, [bookings]);

  // Generer dager
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: (Date | null)[] = [];
    for (let i = 0; i < adjustedStart; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(viewYear, viewMonth, d));
    }
    return days;
  }, [viewMonth, viewYear]);

  const formatDateStr = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectedBookings = selectedDate ? bookingsByDate[selectedDate] || [] : [];
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  return (
    <div>
      {/* Kalender */}
      <div className="bg-surface rounded-2xl p-4 md:p-6 border border-border-light mb-6">
        {/* Navigasjon */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center
              rounded-lg bg-surface-warm hover:bg-border-light text-lg font-bold cursor-pointer"
          >
            ←
          </button>
          <h3 className="text-lg font-bold text-text">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button
            onClick={nextMonth}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center
              rounded-lg bg-surface-warm hover:bg-border-light text-lg font-bold cursor-pointer"
          >
            →
          </button>
        </div>

        {/* Ukedager */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-text-muted py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Dager */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="aspect-square" />;

            const dateStr = formatDateStr(date);
            const dayBookings = bookingsByDate[dateStr] || [];
            const hasBookings = dayBookings.length > 0;
            const isSelected = selectedDate === dateStr;
            const isToday = formatDateStr(today) === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`
                  aspect-square flex flex-col items-center justify-center
                  rounded-lg text-sm font-medium cursor-pointer
                  transition-all duration-200 relative
                  ${isSelected ? "bg-primary text-white" : "hover:bg-surface-warm"}
                  ${isToday && !isSelected ? "ring-2 ring-primary" : ""}
                `}
              >
                <span>{date.getDate()}</span>
                {hasBookings && (
                  <span
                    className={`
                      absolute bottom-1 w-2 h-2 rounded-full
                      ${isSelected ? "bg-white" : "bg-primary"}
                    `}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookinger for valgt dag */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-bold text-text mb-3">
            Bookinger {selectedDate}
          </h3>
          {selectedBookings.length === 0 ? (
            <p className="text-text-muted">Ingen bookinger denne dagen.</p>
          ) : (
            <div className="space-y-3">
              {selectedBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface rounded-xl p-4 border border-border-light"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{formatTime(b.booking_time)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="font-semibold">{b.service_name}</p>
                  <p className="text-text-muted">
                    {b.customer_name} – {b.customer_phone}
                  </p>
                  <p className="text-primary font-semibold">{formatPrice(b.total_price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
