-- ============================================================
-- Fiks RLS-policies for bookings-tabellen
-- Kjøres manuelt i Supabase SQL Editor
-- ============================================================

-- Legg til SELECT-policy (mangler i original schema)
-- Uten denne kan ikke .insert().select() returnere ID-en
CREATE POLICY IF NOT EXISTS "Service role kan lese bookinger"
  ON public.bookings FOR SELECT
  USING (true);

-- Legg til UPDATE-policy for admin
CREATE POLICY IF NOT EXISTS "Service role kan oppdatere bookinger"
  ON public.bookings FOR UPDATE
  USING (true);

-- Legg til DELETE-policy for admin
CREATE POLICY IF NOT EXISTS "Service role kan slette bookinger"
  ON public.bookings FOR DELETE
  USING (true);
