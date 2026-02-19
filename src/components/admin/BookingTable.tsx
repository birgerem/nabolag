"use client";

// ============================================================
// BookingTable – Listevisning av alle bookinger for admin
// ============================================================

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, formatTime, formatPrice, STATUS_LABELS } from "@/lib/constants";
import { updateBookingStatus, deleteBooking } from "@/actions/booking";
import type { Booking } from "@/lib/types";

// Hent ukenummer fra dato-streng
function getWeekFromDate(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

interface BookingTableProps {
  bookings: Booking[];
  onRefresh: () => void;
}

export default function BookingTable({ bookings, onRefresh }: BookingTableProps) {
  const [filter, setFilter] = useState<string>("alle");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filters = [
    { key: "alle", label: "Alle" },
    { key: "ny", label: "Nye" },
    { key: "bekreftet", label: "Bekreftede" },
    { key: "fullfort", label: "Fullførte" },
    { key: "avlyst", label: "Avlyste" },
  ];

  const filtered =
    filter === "alle"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  // Sorter etter dato (nyeste først)
  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
  );

  async function handleStatusChange(
    bookingId: string,
    status: "ny" | "bekreftet" | "fullfort" | "avlyst"
  ) {
    setActionLoading(bookingId);
    await updateBookingStatus(bookingId, status);
    onRefresh();
    setActionLoading(null);
  }

  async function handleDelete(bookingId: string) {
    if (!confirm("Er du sikker på at du vil slette denne bookingen?")) return;
    setActionLoading(bookingId);
    await deleteBooking(bookingId);
    onRefresh();
    setActionLoading(null);
  }

  return (
    <div>
      {/* Filtre */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`
              px-4 py-2 rounded-lg font-medium cursor-pointer
              transition-colors duration-200
              ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-surface-warm text-text hover:bg-border-light"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Antall */}
      <p className="text-text-muted mb-4">
        Viser {sorted.length} {sorted.length === 1 ? "booking" : "bookinger"}
      </p>

      {sorted.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 border border-border-light text-center">
          <p className="text-lg text-text-muted">Ingen bookinger å vise.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((booking) => (
            <div
              key={booking.id}
              className="bg-surface rounded-xl p-4 md:p-6 border border-border-light shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-text">
                      {booking.service_name}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-text">
                    {booking.is_flexible ? (
                      <>
                        📅 <span className="font-semibold text-secondary">Fleksibel</span>
                        {" — "}{booking.customer_comment?.match(/\[Uke (\d+)\]/)?.[0]?.replace("[", "").replace("]", "") || `Uke ${getWeekFromDate(booking.booking_date)}`}
                        {" "}({booking.duration_hours}{" "}
                        {booking.duration_hours === 1 ? "time" : "timer"})
                      </>
                    ) : (
                      <>
                        📅 {formatDate(booking.booking_date)} kl.{" "}
                        {formatTime(booking.booking_time)} ({booking.duration_hours}{" "}
                        {booking.duration_hours === 1 ? "time" : "timer"})
                      </>
                    )}
                  </p>
                  <p className="text-text">
                    👤 {booking.customer_name}
                  </p>
                  <p className="text-text-muted">
                    📍 {booking.customer_address}
                  </p>
                  <p className="text-text">
                    📞 {booking.customer_phone}
                  </p>
                  {booking.customer_comment && (
                    <p className="text-text-muted italic">
                      💬 {booking.customer_comment}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(booking.total_price)}
                  </p>
                </div>

                {/* Handlinger */}
                <div className="flex flex-wrap gap-2">
                  {booking.status === "ny" && (
                    <button
                      onClick={() => handleStatusChange(booking.id, "bekreftet")}
                      disabled={actionLoading === booking.id}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium
                        hover:bg-primary-dark cursor-pointer disabled:opacity-50"
                    >
                      Bekreft
                    </button>
                  )}
                  {(booking.status === "ny" || booking.status === "bekreftet") && (
                    <button
                      onClick={() => handleStatusChange(booking.id, "fullfort")}
                      disabled={actionLoading === booking.id}
                      className="px-4 py-2 bg-secondary text-white rounded-lg font-medium
                        hover:bg-secondary-dark cursor-pointer disabled:opacity-50"
                    >
                      Fullført
                    </button>
                  )}
                  {booking.status !== "avlyst" && (
                    <button
                      onClick={() => handleStatusChange(booking.id, "avlyst")}
                      disabled={actionLoading === booking.id}
                      className="px-4 py-2 bg-warning text-white rounded-lg font-medium
                        hover:brightness-90 cursor-pointer disabled:opacity-50"
                    >
                      Avlys
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(booking.id)}
                    disabled={actionLoading === booking.id}
                    className="px-4 py-2 bg-error text-white rounded-lg font-medium
                      hover:brightness-90 cursor-pointer disabled:opacity-50"
                  >
                    Slett
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
