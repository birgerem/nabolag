// ============================================================
// Konstanter og hjelpefunksjoner for Nabolagshjelpen
// ============================================================

import type { Service, Testimonial } from "./types";

// Standardverdier (brukes som fallback hvis DB ikke er tilgjengelig)
export const DEFAULT_PRICE_PER_HOUR = 160;
export const DEFAULT_PHONE = "976 14 526";
export const DEFAULT_MIN_HOURS = 1;
export const DEFAULT_DISCOUNT = 20;
// Rabatten slår inn fra og med denne timen (time 3 = rabatt på 3. time og utover)
export const DISCOUNT_STARTS_AT_HOUR = 3;

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
    name: "Plenklipping/stell i hagen",
    description: "Jeg klipper plenen, luker, raker og hjelper til med enkelt stell i hagen slik at det ser fint og velstelt ut.",
    category: "tjenester",
    price_per_hour: 160,
    sort_order: 1,
    is_active: true,
    created_at: "",
  },
  {
    id: "fallback-2",
    name: "Handle på butikken",
    description: "Jeg handler det du trenger og leverer det hjem til deg.",
    category: "tjenester",
    price_per_hour: 160,
    sort_order: 2,
    is_active: true,
    created_at: "",
  },
  {
    id: "fallback-3",
    name: "Annen hjelp",
    description: "Trenger du hjelp med noe annet? Ta kontakt, så finner vi ut av det sammen.",
    category: "tjenester",
    price_per_hour: 160,
    sort_order: 3,
    is_active: true,
    created_at: "",
  },
];

// ============================================================
// Fallback-referanser (vises til ekte referanser legges inn i admin)
// ============================================================
export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "eksempel-1",
    quote:
      "Edvard klipte plenen vår mens vi var bortreist. Alt var nydelig stelt da vi kom hjem, og han var både høflig og punktlig. Anbefales på det varmeste!",
    name: "Kari, Brekka",
    service: "Plenklipping/stell i hagen",
  },
  {
    id: "eksempel-2",
    quote:
      "Så greit å få handlet varene levert helt hjem til døra. Edvard er en blid og pålitelig ungdom som gjør en skikkelig jobb.",
    name: "Olav, Færvik",
    service: "Handle på butikken",
  },
  {
    id: "eksempel-3",
    quote:
      "Vi trengte hjelp med litt av hvert i hagen før sommeren. Edvard stilte opp på kort varsel og gjorde mer enn vi hadde forventet.",
    name: "Ingrid, Tromøy",
    service: "Annen hjelp",
  },
];

/** Kort ned tekst til maks-lengde (for delekort og forhåndsvisning) */
export function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Stabil ID for en referanse som mangler egen ID (eldre data lagret før
 * ID-systemet). Utledet deterministisk fra navn + sitat, så samme referanse
 * alltid får samme ID – uansett rekkefølge – og delelenker holder seg gyldige.
 */
export function stableTestimonialId(name: string, quote: string): string {
  const s = `${name}|${quote}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return "r" + (h >>> 0).toString(36);
}

/**
 * Beregner pris basert på antall timer.
 * Timene før rabattstart koster full pris. Fra og med rabatt-timen
 * får hver time et fratrekk (pris - rabatt per time).
 * Eksempel med 160 kr/t, 20 kr rabatt og rabattstart på time 3:
 *   1 time = 160 kr
 *   2 timer = 160 + 160 = 320 kr
 *   3 timer = 160 + 160 + 140 = 460 kr
 *   4 timer = 160 + 160 + 140 + 140 = 600 kr
 */
export function calculatePrice(
  hours: number,
  pricePerHour: number = DEFAULT_PRICE_PER_HOUR,
  discountPerExtraHour: number = DEFAULT_DISCOUNT,
  discountStartsAtHour: number = DISCOUNT_STARTS_AT_HOUR
): number {
  if (hours <= 0) return 0;
  const fullPriceHours = Math.min(hours, discountStartsAtHour - 1);
  const discountedHours = Math.max(0, hours - (discountStartsAtHour - 1));
  return fullPriceHours * pricePerHour
       + discountedHours * (pricePerHour - discountPerExtraHour);
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

// ============================================================
// Uke-hjelpefunksjoner (brukes av bestilling og admin-ukeblokkering)
// ============================================================

/** Hent ISO-ukenummer fra en dato */
export function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Hent mandag i en gitt uke */
export function getMondayOfWeek(year: number, week: number): Date {
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  return monday;
}

export interface UpcomingWeek {
  week: number;
  year: number;
  monday: string; // "YYYY-MM-DD" – mandag i uka, brukt som nøkkel for blokkering
  label: string; // "Uke 30 (20.7 – 26.7)"
}

/**
 * Generer de neste `count` ukene fra og med neste uke.
 * `monday` brukes som stabil nøkkel både i bestilling og for blokkerte uker.
 */
export function getUpcomingWeeks(count = 8): UpcomingWeek[] {
  const weeks: UpcomingWeek[] = [];
  const today = new Date();
  // Start fra neste uke (mandag)
  const nextWeekDate = new Date(today);
  nextWeekDate.setDate(today.getDate() + 7 - today.getDay() + 1);

  for (let i = 0; i < count; i++) {
    const d = new Date(nextWeekDate);
    d.setDate(nextWeekDate.getDate() + i * 7);
    const week = getWeekNumber(d);
    const monday = getMondayOfWeek(d.getFullYear(), week);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const dayMonth = (dt: Date) => `${dt.getDate()}.${dt.getMonth() + 1}`;
    const mondayStr = `${monday.getFullYear()}-${String(
      monday.getMonth() + 1
    ).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

    weeks.push({
      week,
      year: d.getFullYear(),
      monday: mondayStr,
      label: `Uke ${week} (${dayMonth(monday)} – ${dayMonth(sunday)})`,
    });
  }
  return weeks;
}
