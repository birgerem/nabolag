-- ============================================================
-- Legg til customer_email i bookings-tabellen
-- Kjøres manuelt i Supabase SQL Editor
-- ============================================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS customer_email TEXT;
