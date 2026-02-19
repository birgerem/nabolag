-- ============================================================
-- OPPDATER: Edvards nye timeplan
-- Kjør i Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- Slett alle eksisterende slots
DELETE FROM public.available_slots;

-- Mandag (1): INGEN — leksedag
-- Tirsdag (2): 18:00-21:00
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (2, '18:00', '19:00'),
  (2, '19:00', '20:00'),
  (2, '20:00', '21:00');

-- Onsdag (3): INGEN — leksedag

-- Torsdag (4): 18:00-21:00
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (4, '18:00', '19:00'),
  (4, '19:00', '20:00'),
  (4, '20:00', '21:00');

-- Fredag (5): 15:30-20:00
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (5, '15:30', '16:30'),
  (5, '16:30', '17:30'),
  (5, '17:30', '18:30'),
  (5, '18:30', '19:30');

-- Lørdag (6): 10:00-18:00
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (6, '10:00', '11:00'),
  (6, '11:00', '12:00'),
  (6, '12:00', '13:00'),
  (6, '13:00', '14:00'),
  (6, '14:00', '15:00'),
  (6, '15:00', '16:00'),
  (6, '16:00', '17:00'),
  (6, '17:00', '18:00');

-- Søndag (0): 10:00-18:00
INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (0, '10:00', '11:00'),
  (0, '11:00', '12:00'),
  (0, '12:00', '13:00'),
  (0, '13:00', '14:00'),
  (0, '14:00', '15:00'),
  (0, '15:00', '16:00'),
  (0, '16:00', '17:00'),
  (0, '17:00', '18:00');
