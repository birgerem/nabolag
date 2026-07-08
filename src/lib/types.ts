// ============================================================
// TypeScript-typer for Nabolagshjelpen
// ============================================================

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_hour: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PageContent {
  hero_heading: string;
  hero_subheading: string;
  about_paragraph1: string;
  about_paragraph2: string;
  about_paragraph3: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  service: string;
}

// Referanse sendt inn av en kunde – venter på godkjenning i admin
export interface TestimonialSubmission {
  id: string;
  quote: string;
  name: string;
  service: string | null;
  created_at: string;
}

export interface Settings {
  id: number;
  price_per_hour: number;
  phone_number: string;
  min_hours: number;
  discount_per_extra_hour: number;
  updated_at: string;
  page_content?: PageContent | null;
  testimonials?: Testimonial[] | null;
}

export interface AvailableSlot {
  id: string;
  day_of_week: number; // 0=Søndag, 1=Mandag, ..., 6=Lørdag
  start_time: string;  // "15:00:00"
  end_time: string;    // "16:00:00"
  is_active: boolean;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // "2026-03-15"
  reason: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_email: string | null;
  service_id: string;
  service_name: string;
  booking_date: string;  // "2026-03-15"
  booking_time: string;  // "15:00:00"
  duration_hours: number;
  total_price: number;
  is_flexible: boolean;
  status: "ny" | "bekreftet" | "fullfort" | "avlyst";
  customer_comment: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// For booking-skjemaet (før innsending)
export interface BookingFormData {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_email: string;
  service_id: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  total_price: number;
  is_flexible: boolean;
  customer_comment: string;
}

// Tidsluker som vises i booking-kalenderen
export interface TimeSlot {
  start_time: string; // "15:00"
  end_time: string;   // "16:00"
}
