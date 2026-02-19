-- ============================================================
-- FIKS: Oppdater lørdag og søndag til 10:00-17:00
-- Kjør dette i Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- Slett alle eksisterende slots for lørdag (6) og søndag (0)
DELETE FROM public.available_slots WHERE day_of_week IN (0, 6);

-- Lørdag (6): 10:00-17:00 (7 slots)
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (6, '10:00', '11:00'),
  (6, '11:00', '12:00'),
  (6, '12:00', '13:00'),
  (6, '13:00', '14:00'),
  (6, '14:00', '15:00'),
  (6, '15:00', '16:00'),
  (6, '16:00', '17:00');

-- Søndag (0): 10:00-17:00 (7 slots)
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (0, '10:00', '11:00'),
  (0, '11:00', '12:00'),
  (0, '12:00', '13:00'),
  (0, '13:00', '14:00'),
  (0, '14:00', '15:00'),
  (0, '15:00', '16:00'),
  (0, '16:00', '17:00');
