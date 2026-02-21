"use client";

// ============================================================
// Admin Dashboard – Oversikt over bookinger og innstillinger
// Bruker server action for å hente data (omgår RLS)
// noindex: privat side, skal ikke indekseres av Google
// ============================================================

import { useState, useEffect } from "react";
import { logoutAction } from "@/actions/auth";
import { fetchAdminData } from "@/actions/admin";
import BookingTable from "@/components/admin/BookingTable";
import BookingCalendar from "@/components/admin/BookingCalendar";
import PriceEditor from "@/components/admin/PriceEditor";
import WeeklyScheduleEditor from "@/components/admin/WeeklyScheduleEditor";
import BlockedDatesEditor from "@/components/admin/BlockedDatesEditor";
import PageContentEditor from "@/components/admin/PageContentEditor";
import type { Booking, Settings, BlockedDate } from "@/lib/types";
import {
  DEFAULT_PRICE_PER_HOUR,
  DEFAULT_PHONE,
  DEFAULT_MIN_HOURS,
  DEFAULT_DISCOUNT,
} from "@/lib/constants";

type ViewMode = "liste" | "kalender" | "innstillinger";

export default function AdminDashboard() {
  const [view, setView] = useState<ViewMode>("liste");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<Settings>({
    id: 1,
    price_per_hour: DEFAULT_PRICE_PER_HOUR,
    phone_number: DEFAULT_PHONE,
    min_hours: DEFAULT_MIN_HOURS,
    discount_per_extra_hour: DEFAULT_DISCOUNT,
    updated_at: "",
  });
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState<string | null>(null);

  // Hent data via server action (bruker admin-klient, omgår RLS)
  const fetchData = async () => {
    const data = await fetchAdminData();
    setBookings(data.bookings);
    setSettings(data.settings);
    setBlockedDates(data.blockedDates);
    setFetchError(data.error);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutAction();
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container text-center">
          <p className="text-xl text-text-muted">Laster admin-panel...</p>
        </div>
      </div>
    );
  }

  // Tell bookinger etter status
  const counts = {
    total: bookings.length,
    nye: bookings.filter((b) => b.status === "ny").length,
    bekreftede: bookings.filter((b) => b.status === "bekreftet").length,
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text">Admin</h1>
            <p className="text-text-muted">Nabolagshjelpen kontrollpanel</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-surface-warm text-text rounded-lg font-medium
              hover:bg-border cursor-pointer"
          >
            Logg ut
          </button>
        </div>

        {/* Feilmelding fra database */}
        {fetchError && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-6">
            <p className="font-semibold text-red-700 mb-1">Kunne ikke hente data fra databasen</p>
            <p className="text-sm text-red-600 font-mono break-all">{fetchError}</p>
            <p className="text-sm text-red-500 mt-2">
              Sjekk at <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> er riktig satt i Vercel og at databasen er tilgjengelig.
            </p>
          </div>
        )}

        {/* Statistikk */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-4 border border-border-light text-center">
            <p className="text-3xl font-bold text-text">{counts.total}</p>
            <p className="text-text-muted">Totalt</p>
          </div>
          <div className="bg-warning-light rounded-xl p-4 border border-warning/25 text-center">
            <p className="text-3xl font-bold text-warning">{counts.nye}</p>
            <p className="text-text-muted">Nye</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/25 text-center">
            <p className="text-3xl font-bold text-primary">{counts.bekreftede}</p>
            <p className="text-text-muted">Bekreftede</p>
          </div>
        </div>

        {/* Visnings-knapper */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "liste" as const, label: "📋 Liste" },
            { key: "kalender" as const, label: "📅 Kalender" },
            { key: "innstillinger" as const, label: "⚙️ Innstillinger" },
          ]).map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`
                px-4 py-2 rounded-lg font-medium cursor-pointer
                transition-colors duration-200
                ${
                  view === v.key
                    ? "bg-primary text-white"
                    : "bg-surface-warm text-text hover:bg-border-light"
                }
              `}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Innhold basert på visning */}
        {view === "liste" && (
          <BookingTable bookings={bookings} onRefresh={fetchData} />
        )}

        {view === "kalender" && <BookingCalendar bookings={bookings} />}

        {view === "innstillinger" && (
          <div className="space-y-6">
            <PriceEditor settings={settings} onUpdate={fetchData} />
            <PageContentEditor pageContent={settings.page_content} onUpdate={fetchData} />
            <WeeklyScheduleEditor onUpdate={fetchData} />
            <BlockedDatesEditor blockedDates={blockedDates} onUpdate={fetchData} />
          </div>
        )}
      </div>
    </div>
  );
}
