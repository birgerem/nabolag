// ============================================================
// Zod-skjemaer for validering
// ============================================================

import { z } from "zod";

// Validering av booking-skjema
export const bookingSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Navnet må være minst 2 tegn")
    .max(100, "Navnet kan ikke være mer enn 100 tegn"),
  customer_address: z
    .string()
    .min(5, "Adressen må være minst 5 tegn")
    .max(200, "Adressen kan ikke være mer enn 200 tegn"),
  customer_phone: z
    .string()
    .min(8, "Telefonnummeret må være minst 8 siffer")
    .max(20, "Telefonnummeret kan ikke være mer enn 20 tegn")
    .regex(/^[+\d\s-]+$/, "Ugyldig telefonnummer"),
  service_id: z.string().min(1, "Ugyldig tjeneste"),
  service_name: z.string().min(1, "Tjeneste mangler"),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ugyldig dato"),
  booking_time: z.string().regex(/^\d{2}:\d{2}$/, "Ugyldig tid"),
  duration_hours: z
    .number()
    .int()
    .min(1, "Minimum 1 time")
    .max(8, "Maksimum 8 timer"),
  total_price: z.number().int().min(0, "Ugyldig pris"),
  is_flexible: z.boolean().default(false),
  customer_comment: z.string().max(500, "Kommentaren kan ikke være mer enn 500 tegn").optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;

// Validering av innstillinger
export const settingsSchema = z.object({
  price_per_hour: z
    .number()
    .int()
    .min(50, "Minste pris er 50 kr")
    .max(1000, "Høyeste pris er 1000 kr"),
  phone_number: z
    .string()
    .min(8, "Telefonnummeret må være minst 8 tegn")
    .max(20, "Telefonnummeret kan ikke være mer enn 20 tegn"),
});

// Validering av admin-login
export const loginSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  password: z.string().min(6, "Passordet må være minst 6 tegn"),
});
