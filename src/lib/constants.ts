// ============================================================
// Konstanter og hjelpefunksjoner for Nabolagshjelpen
// ============================================================

import type { Service } from "./types";

// Standardverdier (brukes som fallback hvis DB ikke er tilgjengelig)
export const DEFAULT_PRICE_PER_HOUR = 150;
export const DEFAULT_PHONE = "976 14 526";
export const DEFAULT_MIN_HOURS = 1;
export const DEFAULT_DISCOUNT = 25;

// Kategorinavn på norsk
export const CATEGORY_LABELS: Record<string, string> = {
  tjenester: "Tjenester",
};

// Statusnavn på norsk
export const STATUS_LABELS: Record<string, string> = {
  ny: "Ny",
  bekreftet: "Bekreftet",
  fullfort: "Fullført",
  avlyst: "Avlyst",
};

// Ukedager på norsk
export const DAY_NAMES = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
];

export const DAY_NAMES_SHORT = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

// Månedsnavn på norsk
export const MONTH_NAMES = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember",
];

// ============================================================
// Fallback ukentlig timeplan (brukes når Supabase ikke er tilgjengelig)
// Matcher Edvards faktiske schedule: skole 08-15, treninger man/ons/tir/tor
// ============================================================
export const FALLBACK_WEEKLY_SLOTS: Record<number, { start: string; end: string }[]> = {
  0: [   // Søndag — 10:00-18:00
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
  ],
  1: [], // Mandag — INGEN (leksedag)
  2: [   // Tirsdag — 18:00-21:00
    { start: "18:00", end: "19:00" },
    { start: "19:00", end: "20:00" },
    { start: "20:00", end: "21:00" },
  ],
  3: [], // Onsdag — INGEN (leksedag)
  4: [   // Torsdag — 18:00-21:00
    { start: "18:00", end: "19:00" },
    { start: "19:00", end: "20:00" },
    { start: "20:00", end: "21:00" },
  ],
  5: [   // Fredag — 15:30-20:00
    { start: "15:30", end: "16:30" },
    { start: "16:30", end: "17:30" },
    { start: "17:30", end: "18:30" },
    { start: "18:30", end: "19:30" },
  ],
  6: [   // Lørdag — 10:00-18:00
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
  ],
};

// Dager uten tidsluker (fallback) — brukes av DatePicker
export const FALLBACK_INACTIVE_DAYS = [1, 3]; // Mandag, onsdag (leksedager)

// ============================================================
// Fallback-tjenester (brukes når Supabase ikke er tilgjengelig)
// ============================================================
export const FALLBACK_SERVICES: Service[] = [
  {
    id: "fallback-1",
    name: "Gressklipping",
    description: "Jeg klipper gresset slik at plenen ser fin og velstelt ut.",
    category: "tjenester",
    price_per_hour: 150,
    sort_order: 1,
    is_active: true,
    created_at: "",
  },
  {
    id: "fallback-2",
    name: "Handle på butikken",
    description: "Jeg handler det du trenger og leverer det hjem til deg.",
    category: "tjenester",
    price_per_hour: 150,
    sort_order: 2,
    is_active: true,
    created_at: "",
  },
  {
    id: "fallback-3",
    name: "Rydding og støvsuging",
    description: "Rydding, støvsuging og enkel rengjøring i hjemmet.",
    category: "tjenester",
    price_per_hour: 150,
    sort_order: 3,
    is_active: true,
    created_at: "",
  },
  {
    id: "fallback-4",
    name: "Matlaging",
    description: "Jeg lager et enkelt måltid for deg – etter dine ønsker.",
    category: "tjenester",
    price_per_hour: 150,
    sort_order: 4,
    is_active: true,
    created_at: "",
  },
  {
    id: "fallback-5",
    name: "Annen hjelp",
    description: "Trenger du hjelp med noe annet? Ta kontakt, så finner vi ut av det sammen.",
    category: "tjenester",
    price_per_hour: 150,
    sort_order: 5,
    is_active: true,
    created_at: "",
  },
];

/**
 * Beregner pris basert på antall timer.
 * Første time: full pris. Ekstra timer: pris - rabatt per time.
 * Eksempel med 150 kr/t og 25 kr rabatt:
 *   1 time = 150 kr
 *   2 timer = 150 + 125 = 275 kr
 *   3 timer = 150 + 125 + 125 = 400 kr
 */
export function calculatePrice(
  hours: number,
  pricePerHour: number = DEFAULT_PRICE_PER_HOUR,
  discountPerExtraHour: number = DEFAULT_DISCOUNT
): number {
  if (hours <= 0) return 0;
  if (hours === 1) return pricePerHour;
  return pricePerHour + (hours - 1) * (pricePerHour - discountPerExtraHour);
}

/**
 * Formater tid fra "15:00:00" til "15:00"
 */
export function formatTime(time: string): string {
  return time.substring(0, 5);
}

/**
 * Formater dato fra "2026-03-15" til "15. mars 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].toLowerCase();
  const year = date.getFullYear();
  return `${day}. ${month} ${year}`;
}

/**
 * Formater pris med "kr"
 */
export function formatPrice(price: number): string {
  return `${price} kr`;
}
