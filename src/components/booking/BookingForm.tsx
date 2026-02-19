"use client";

// ============================================================
// BookingForm – Komplett bookingskjema med to modi:
// 1. Vanlig: velg tjeneste → dato → tid → varighet → kontaktinfo
// 2. Fleksibel: velg tjeneste → velg uke → kontaktinfo (Edvard tar kontakt)
// ============================================================

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ServiceSelector from "./ServiceSelector";
import DatePicker from "./DatePicker";
import TimeSlotPicker from "./TimeSlotPicker";
import BigButton from "@/components/ui/BigButton";
import {
  calculatePrice,
  formatPrice,
  formatDate,
  formatTime,
  FALLBACK_INACTIVE_DAYS,
} from "@/lib/constants";
import { createBooking, getAvailableSlots } from "@/actions/booking";
import { getInactiveDays } from "@/actions/slots";
import type { Service, Settings, TimeSlot } from "@/lib/types";

interface BookingFormProps {
  services: Service[];
  settings: Settings;
}

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

  // Booking-modus
  type BookingMode = null | "bestemt" | "fleksibel";
  const [mode, setMode] = useState<BookingMode>(null);

  // State for vanlig booking
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [inactiveDays, setInactiveDays] = useState<number[]>(
    FALLBACK_INACTIVE_DAYS
  );

  // State for fleksibel booking
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [flexDuration, setFlexDuration] = useState(1);

  // Kontaktinfo
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  // Innsending
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hent inaktive dager ved oppstart
  useEffect(() => {
    getInactiveDays().then(setInactiveDays);
  }, []);

  // Forhåndsvelg tjeneste fra URL-parameter
  useEffect(() => {
    const tjenesteId = searchParams.get("tjeneste");
    if (tjenesteId) {
      const service = services.find((s) => s.id === tjenesteId);
      if (service) setSelectedService(service);
    }
  }, [searchParams, services]);

  // Hent ledige tider når dato velges (med abort for race condition)
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime(null);
    setLoadingSlots(true);

    let cancelled = false;
    getAvailableSlots(selectedDate).then((slots) => {
      if (!cancelled) {
        setAvailableSlots(slots);
        setLoadingSlots(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  // Beregn pris
  const activeDuration = mode === "fleksibel" ? flexDuration : duration;
  const totalPrice = calculatePrice(
    activeDuration,
    settings.price_per_hour,
    settings.discount_per_extra_hour
  );

  // Sjekk konsekutive tider for varighet
  // Finner hvor mange sammenhengende slots som finnes fra valgt tid
  const maxDuration = (() => {
    if (!selectedTime || availableSlots.length === 0) return 1;

    // Sorter slots etter starttid
    const sorted = [...availableSlots].sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );

    // Finn indeksen til valgt tid
    const startIdx = sorted.findIndex((s) => s.start_time === selectedTime);
    if (startIdx === -1) return 1;

    // Tell konsekutive slots: neste slot.start_time === forrige slot.end_time
    let consecutive = 1;
    for (let i = startIdx; i < sorted.length - 1 && consecutive < 4; i++) {
      if (sorted[i].end_time === sorted[i + 1].start_time) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  })();

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

      const dayMonth = (dt: Date) =>
        `${dt.getDate()}.${dt.getMonth() + 1}`;
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
    if (!selectedService) return;
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

    if (mode === "fleksibel") {
      // Fleksibel booking: bruk mandag i valgt uke som dato
      if (!selectedWeek) return;
      const weekData = availableWeeks.find((w) => w.week === selectedWeek);
      const year = weekData?.year || new Date().getFullYear();
      const monday = getMondayOfWeek(year, selectedWeek);
      const bookingDate = `${monday.getFullYear()}-${String(
        monday.getMonth() + 1
      ).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

      const result = await createBooking({
        customer_name: name.trim(),
        customer_address: address.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        service_id: selectedService.id,
        service_name: selectedService.name,
        booking_date: bookingDate,
        booking_time: "00:00",
        duration_hours: flexDuration,
        total_price: totalPrice,
        is_flexible: true,
        customer_comment: comment.trim()
          ? `[Uke ${selectedWeek}] ${comment.trim()}`
          : `[Uke ${selectedWeek}] Fleksibel booking – avtaler tid senere`,
      });

      if (result.success && result.bookingId) {
        router.push(
          `/bestill/bekreftelse?id=${result.bookingId}&fleksibel=true&uke=${selectedWeek}`
        );
      } else {
        setError(result.error || "Noe gikk galt. Prøv igjen.");
        setSubmitting(false);
      }
    } else {
      // Vanlig booking
      if (!selectedDate || !selectedTime) return;

      const result = await createBooking({
        customer_name: name.trim(),
        customer_address: address.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        service_id: selectedService.id,
        service_name: selectedService.name,
        booking_date: selectedDate,
        booking_time: selectedTime,
        duration_hours: duration,
        total_price: totalPrice,
        is_flexible: false,
        customer_comment: comment.trim() || "",
      });

      if (result.success && result.bookingId) {
        router.push(`/bestill/bekreftelse?id=${result.bookingId}`);
      } else {
        setError(result.error || "Noe gikk galt. Prøv igjen.");
        setSubmitting(false);
      }
    }
  };

  // Sjekk om skjemaet er klart
  const isReady =
    selectedService &&
    name.trim() &&
    address.trim() &&
    phone.trim() &&
    email.trim() &&
    (mode === "bestemt"
      ? selectedDate && selectedTime
      : mode === "fleksibel"
        ? selectedWeek
        : false);

  // Stegnummer for fleksibel/vanlig
  const contactStepNum = mode === "fleksibel" ? 4 : 5;
  const summaryStepNum = mode === "fleksibel" ? 5 : 6;

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

      {/* Steg 2: Velg bookingtype */}
      {selectedService && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-2">
            2. Hvordan vil du booke?
          </h2>
          <p className="text-text-muted mb-4">
            Du kan velge en bestemt dag og tid, eller bare velge en uke
            og la Edvard ta kontakt for å avtale.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setMode("bestemt");
                setSelectedWeek(null);
              }}
              className={`
                p-5 rounded-2xl border-2 text-left cursor-pointer
                transition-all duration-300
                ${
                  mode === "bestemt"
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-surface-warm text-text border-border-light hover:border-primary"
                }
              `}
            >
              <span className="text-lg font-bold block mb-1">
                Velg dato og tid
              </span>
              <span
                className={`text-sm ${mode === "bestemt" ? "text-white/80" : "text-text-muted"}`}
              >
                Se ledige tider og velg et bestemt tidspunkt
              </span>
            </button>

            <button
              onClick={() => {
                setMode("fleksibel");
                setSelectedDate(null);
                setSelectedTime(null);
              }}
              className={`
                p-5 rounded-2xl border-2 text-left cursor-pointer
                transition-all duration-300
                ${
                  mode === "fleksibel"
                    ? "bg-secondary text-white border-secondary shadow-md"
                    : "bg-surface-warm text-text border-border-light hover:border-secondary"
                }
              `}
            >
              <span className="text-lg font-bold block mb-1">
                Avtal tid senere
              </span>
              <span
                className={`text-sm ${mode === "fleksibel" ? "text-white/80" : "text-text-muted"}`}
              >
                Velg bare en uke — Edvard ringer for å avtale tid
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ===== VANLIG BOOKING-FLYT ===== */}

      {/* Steg 3: Velg dato */}
      {mode === "bestemt" && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <DatePicker
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            inactiveDays={inactiveDays}
          />
        </div>
      )}

      {/* Steg 3b: Velg tidspunkt */}
      {mode === "bestemt" && selectedDate && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <TimeSlotPicker
            slots={availableSlots}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            loading={loadingSlots}
          />
        </div>
      )}

      {/* Steg 4: Velg varighet (vanlig) */}
      {mode === "bestemt" && selectedTime && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-4">
            4. Hvor mange timer?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((hours) => (
              <button
                key={hours}
                onClick={() => setDuration(hours)}
                disabled={hours > maxDuration}
                className={`
                  min-h-[48px] px-4 py-3 rounded-2xl
                  text-lg font-semibold
                  transition-all duration-300 cursor-pointer
                  ${
                    duration === hours
                      ? "bg-primary text-white shadow-md border-2 border-primary"
                      : hours > maxDuration
                        ? "bg-surface-warm text-border cursor-not-allowed border-2 border-border-light"
                        : "bg-surface text-text border-2 border-border-light hover:border-primary hover:bg-surface-warm"
                  }
                `}
              >
                {hours} {hours === 1 ? "time" : "timer"}
              </button>
            ))}
          </div>
          <p className="text-lg font-semibold text-primary mt-4">
            Totalpris: {formatPrice(totalPrice)}
          </p>
        </div>
      )}

      {/* ===== FLEKSIBEL BOOKING-FLYT ===== */}

      {/* Steg 3: Velg uke (fleksibel) */}
      {mode === "fleksibel" && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-2">
            3. Velg uke
          </h2>
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
                      ? "bg-secondary text-white shadow-md border-2 border-secondary"
                      : "bg-surface-warm text-text border-2 border-border-light hover:border-secondary"
                  }
                `}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* Varighet for fleksibel */}
          {selectedWeek && (
            <div className="mt-6 pt-6 border-t border-border-light">
              <h3 className="text-lg font-bold text-text mb-3">
                Omtrent hvor mange timer trenger du hjelp?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setFlexDuration(hours)}
                    className={`
                      min-h-[48px] px-4 py-3 rounded-2xl
                      text-lg font-semibold
                      transition-all duration-300 cursor-pointer
                      ${
                        flexDuration === hours
                          ? "bg-secondary text-white shadow-md border-2 border-secondary"
                          : "bg-surface text-text border-2 border-border-light hover:border-secondary hover:bg-surface-warm"
                      }
                    `}
                  >
                    {hours} {hours === 1 ? "time" : "timer"}
                  </button>
                ))}
              </div>
              <p className="text-lg font-semibold text-secondary mt-4">
                Estimert pris: {formatPrice(totalPrice)}
              </p>
              <p className="text-sm text-text-muted">
                Endelig pris avtales med Edvard
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== FELLES: Kontaktinfo ===== */}
      {((mode === "bestemt" && selectedTime) ||
        (mode === "fleksibel" && selectedWeek)) && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-4">
            {contactStepNum}. Din kontaktinformasjon
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

      {/* ===== FELLES: Oppsummering og innsending ===== */}
      {isReady && (
        <div className="bg-surface rounded-2xl p-6 md:p-8 card-soft border border-border-light">
          <h2 className="text-2xl font-bold text-text mb-4">
            {summaryStepNum}. Din bestilling
          </h2>
          <div
            className={`rounded-2xl p-6 border space-y-3 ${
              mode === "fleksibel"
                ? "bg-secondary/5 border-secondary/15"
                : "bg-primary/5 border-primary/15"
            }`}
          >
            <div className="flex justify-between">
              <span className="font-medium">Tjeneste:</span>
              <span className="font-semibold">{selectedService!.name}</span>
            </div>

            {mode === "bestemt" ? (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Dato:</span>
                  <span className="font-semibold">
                    {formatDate(selectedDate!)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tidspunkt:</span>
                  <span className="font-semibold">
                    {formatTime(selectedTime!)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="font-medium">Uke:</span>
                <span className="font-semibold">
                  Uke {selectedWeek} — Edvard tar kontakt
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="font-medium">Varighet:</span>
              <span className="font-semibold">
                {mode === "fleksibel" ? "ca. " : ""}
                {activeDuration} {activeDuration === 1 ? "time" : "timer"}
              </span>
            </div>
            <div
              className={`flex justify-between border-t pt-3 mt-3 ${
                mode === "fleksibel"
                  ? "border-secondary/15"
                  : "border-primary/15"
              }`}
            >
              <span className="text-xl font-bold">
                {mode === "fleksibel" ? "Estimert pris:" : "Totalpris:"}
              </span>
              <span
                className={`text-xl font-bold ${
                  mode === "fleksibel" ? "text-secondary" : "text-primary"
                }`}
              >
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {mode === "fleksibel" && (
            <p className="text-sm text-text-muted mt-3 text-center">
              Edvard ringer eller sender melding for å avtale nøyaktig
              dag og tid i uke {selectedWeek}.
            </p>
          )}

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
              variant={mode === "fleksibel" ? "secondary" : "accent"}
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
