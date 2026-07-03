"use client";

// ============================================================
// BookingForm – Enkelt, ukebasert bookingskjema
// Flyt: velg tjeneste → uke → ønsket dag (valgfritt) → varighet →
//       kontaktinfo → send. Edvard tar kontakt for å avtale tid.
// ============================================================

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ServiceSelector from "./ServiceSelector";
import BigButton from "@/components/ui/BigButton";
import { calculatePrice, formatPrice, DAY_NAMES } from "@/lib/constants";
import { createBooking } from "@/actions/booking";
import type { Service, Settings } from "@/lib/types";

interface BookingFormProps {
  services: Service[];
  settings: Settings;
}

// Ukedager i visningsrekkefølge (mandag først), verdi = getDay()-indeks (0=søndag)
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

// Hent ISO-ukenummer fra en dato
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Hent mandag i en gitt uke
function getMondayOfWeek(year: number, week: number): Date {
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  return monday;
}

export default function BookingForm({ services, settings }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Valg
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [preferredDay, setPreferredDay] = useState<number | null>(null); // 0-6, null = ingen preferanse
  const [duration, setDuration] = useState(1);

  // Kontaktinfo
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  // Innsending
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forhåndsvelg tjeneste fra URL-parameter
  useEffect(() => {
    const tjenesteId = searchParams.get("tjeneste");
    if (tjenesteId) {
      const service = services.find((s) => s.id === tjenesteId);
      if (service) setSelectedService(service);
    }
  }, [searchParams, services]);

  // Beregn pris
  const totalPrice = calculatePrice(
    duration,
    settings.price_per_hour,
    settings.discount_per_extra_hour
  );

  // Generer tilgjengelige uker (neste 8 uker)
  const availableWeeks = (() => {
    const weeks: { week: number; year: number; label: string }[] = [];
    const today = new Date();
    // Start fra neste uke
    const nextWeekDate = new Date(today);
    nextWeekDate.setDate(today.getDate() + 7 - today.getDay() + 1);

    for (let i = 0; i < 8; i++) {
      const d = new Date(nextWeekDate);
      d.setDate(nextWeekDate.getDate() + i * 7);
      const weekNum = getWeekNumber(d);

      // Finn mandag og søndag i denne uken
      const monday = getMondayOfWeek(d.getFullYear(), weekNum);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const dayMonth = (dt: Date) => `${dt.getDate()}.${dt.getMonth() + 1}`;
      weeks.push({
        week: weekNum,
        year: d.getFullYear(),
        label: `Uke ${weekNum} (${dayMonth(monday)} – ${dayMonth(sunday)})`,
      });
    }
    return weeks;
  })();

  // Send booking
  const handleSubmit = async () => {
    if (!selectedService || !selectedWeek) return;
    if (!name.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      setError("Vennligst fyll ut navn, adresse, telefonnummer og e-postadresse.");
      return;
    }
    // Enkel e-post-validering
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Vennligst oppgi en gyldig e-postadresse.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Bruk mandag i valgt uke som booking_date
    const weekData = availableWeeks.find((w) => w.week === selectedWeek);
    const year = weekData?.year || new Date().getFullYear();
    const monday = getMondayOfWeek(year, selectedWeek);
    const bookingDate = `${monday.getFullYear()}-${String(
      monday.getMonth() + 1
    ).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

    // Bygg kommentar med uke, ev. ønsket dag og kundens egen tekst
    const parts = [`[Uke ${selectedWeek}]`];
    if (preferredDay !== null) parts.push(`[Ønsket dag: ${DAY_NAMES[preferredDay]}]`);
    if (comment.trim()) {
      parts.push(comment.trim());
    } else {
      parts.push("Fleksibel booking – avtaler tid senere");
    }
    const fullComment = parts.join(" ");

    const result = await createBooking({
      customer_name: name.trim(),
      customer_address: address.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      service_id: selectedService.id,
      service_name: selectedService.name,
      booking_date: bookingDate,
      booking_time: "00:00",
      duration_hours: duration,
      total_price: totalPrice,
      is_flexible: true,
      customer_comment: fullComment,
    });

    if (result.success && result.bookingId) {
      router.push(
        `/bestill/bekreftelse?id=${result.bookingId}&fleksibel=true&uke=${selectedWeek}`
      );
    } else {
      setError(result.error || "Noe gikk galt. Prøv igjen.");
      setSubmitting(false);
    }
  };

  // Sjekk om skjemaet er klart
  const isReady =
    selectedService &&
    selectedWeek &&
    name.trim() &&
    address.trim() &&
    phone.trim() &&
    email.trim();

  return (
    <div className="space-y-10">
      {/* Steg 1: Velg tjeneste */}
      <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
        <ServiceSelector
          services={services}
          selectedId={selectedService?.id || null}
          onSelect={setSelectedService}
        />
      </div>

      {/* Steg 2: Velg uke */}
      {selectedService && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-2">2. Velg uke</h2>
          <p className="text-text-muted mb-4">
            Hvilken uke passer best? Edvard tar kontakt for å avtale
            nøyaktig dag og tid.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableWeeks.map((w) => (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(w.week)}
                className={`
                  min-h-[48px] px-4 py-3 rounded-2xl
                  text-lg font-semibold text-left
                  transition-all duration-300 cursor-pointer
                  ${
                    selectedWeek === w.week
                      ? "bg-primary text-white shadow-md border-2 border-primary"
                      : "bg-surface-warm text-text border-2 border-border-light hover:border-primary"
                  }
                `}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Steg 3: Ønsket dag (valgfritt) */}
      {selectedWeek && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-2">
            3. Ønsket dag{" "}
            <span className="text-text-muted font-normal text-lg">
              (valgfritt)
            </span>
          </h2>
          <p className="text-text-muted mb-4">
            Er det en dag i uka som passer best? Edvard prøver å ta hensyn
            til ønsket ditt når han avtaler tid.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setPreferredDay(null)}
              className={`
                min-h-[48px] px-4 py-3 rounded-2xl
                text-base font-semibold
                transition-all duration-300 cursor-pointer
                ${
                  preferredDay === null
                    ? "bg-primary text-white shadow-md border-2 border-primary"
                    : "bg-surface text-text border-2 border-border-light hover:border-primary hover:bg-surface-warm"
                }
              `}
            >
              Ingen preferanse
            </button>
            {WEEKDAY_ORDER.map((dayIdx) => (
              <button
                key={dayIdx}
                onClick={() => setPreferredDay(dayIdx)}
                className={`
                  min-h-[48px] px-4 py-3 rounded-2xl
                  text-base font-semibold
                  transition-all duration-300 cursor-pointer
                  ${
                    preferredDay === dayIdx
                      ? "bg-primary text-white shadow-md border-2 border-primary"
                      : "bg-surface text-text border-2 border-border-light hover:border-primary hover:bg-surface-warm"
                  }
                `}
              >
                {DAY_NAMES[dayIdx]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Steg 4: Velg varighet */}
      {selectedWeek && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-2">
            4. Omtrent hvor mange timer trenger du hjelp?
          </h2>
          <p className="text-text-muted mb-4">
            Et anslag er nok — endelig pris avtales med Edvard.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((hours) => (
              <button
                key={hours}
                onClick={() => setDuration(hours)}
                className={`
                  min-h-[48px] px-4 py-3 rounded-2xl
                  text-lg font-semibold
                  transition-all duration-300 cursor-pointer
                  ${
                    duration === hours
                      ? "bg-primary text-white shadow-md border-2 border-primary"
                      : "bg-surface text-text border-2 border-border-light hover:border-primary hover:bg-surface-warm"
                  }
                `}
              >
                {hours} {hours === 1 ? "time" : "timer"}
              </button>
            ))}
          </div>
          <p className="text-lg font-semibold text-primary mt-4">
            Estimert pris: {formatPrice(totalPrice)}
          </p>
        </div>
      )}

      {/* Steg 5: Kontaktinfo */}
      {selectedWeek && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-4">
            5. Din kontaktinformasjon
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name">Navn</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ditt fulle navn"
                required
              />
            </div>
            <div>
              <label htmlFor="address">Adresse på Tromøya</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Gateadresse og postnummer"
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Telefonnummer</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ditt telefonnummer"
                required
              />
            </div>
            <div>
              <label htmlFor="email">
                E-postadresse{" "}
                <span className="text-text-muted font-normal text-sm">
                  (for kvittering etter oppdraget)
                </span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                required
              />
            </div>
            <div>
              <label htmlFor="comment">Kommentar (valgfritt)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Er det noe spesielt jeg bør vite?"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Steg 6: Oppsummering og innsending */}
      {isReady && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-4">
            6. Din bestilling
          </h2>
          <div className="rounded-2xl p-6 border space-y-3 bg-primary/5 border-primary/15">
            <div className="flex justify-between">
              <span className="font-medium">Tjeneste:</span>
              <span className="font-semibold">{selectedService!.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Uke:</span>
              <span className="font-semibold">
                Uke {selectedWeek} — Edvard tar kontakt
              </span>
            </div>

            {preferredDay !== null && (
              <div className="flex justify-between">
                <span className="font-medium">Ønsket dag:</span>
                <span className="font-semibold">{DAY_NAMES[preferredDay]}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="font-medium">Varighet:</span>
              <span className="font-semibold">
                ca. {duration} {duration === 1 ? "time" : "timer"}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 mt-3 border-primary/15">
              <span className="text-xl font-bold">Estimert pris:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <p className="text-sm text-text-muted mt-3 text-center">
            Edvard ringer eller sender melding for å avtale nøyaktig dag og
            tid i uke {selectedWeek}.
          </p>

          {/* Feilmelding */}
          {error && (
            <div className="bg-error-light rounded-xl p-4 border border-error/20 mt-4">
              <p className="text-error font-semibold">{error}</p>
            </div>
          )}

          {/* Send-knapp */}
          <div className="mt-6">
            <BigButton
              onClick={handleSubmit}
              variant="accent"
              fullWidth
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sender bestilling..." : "Send bestilling"}
            </BigButton>
          </div>

          <p className="text-sm text-text-muted text-center mt-4">
            Ved å bestille godtar du vår{" "}
            <a href="/personvern" className="text-primary">
              personvernerklæring
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
