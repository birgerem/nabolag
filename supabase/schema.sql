-- ============================================================
-- NABOLAGSHJELPEN DATABASE SCHEMA
-- Kjør dette i Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- 1. TJENESTER
create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  category text not null default 'tjenester',
  price_per_hour integer not null default 150,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now() not null
);

alter table public.services enable row level security;

create policy "Alle kan lese aktive tjenester"
  on public.services for select
  using (is_active = true);

-- 2. INNSTILLINGER (én rad)
create table public.settings (
  id integer primary key default 1 check (id = 1),
  price_per_hour integer not null default 150,
  phone_number text not null default '976 14 526',
  min_hours integer not null default 1,
  discount_per_extra_hour integer not null default 25,
  updated_at timestamptz default now() not null
);

alter table public.settings enable row level security;

create policy "Alle kan lese innstillinger"
  on public.settings for select
  using (true);

insert into public.settings (id, price_per_hour, phone_number, min_hours, discount_per_extra_hour)
values (1, 150, '976 14 526', 1, 25);

-- 3. TILGJENGELIGE TIDER (ukentlig)
create table public.available_slots (
  id uuid default gen_random_uuid() primary key,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz default now() not null,
  constraint valid_time_range check (start_time < end_time)
);

alter table public.available_slots enable row level security;

create policy "Alle kan lese tilgjengelige tider"
  on public.available_slots for select
  using (is_active = true);

-- Admin kan administrere tidsluker (krever innlogging)
create policy "Admin kan administrere tidslots"
  on public.available_slots for all
  using (auth.role() = 'authenticated');

-- 4. BLOKKERTE DATOER
create table public.blocked_dates (
  id uuid default gen_random_uuid() primary key,
  blocked_date date not null unique,
  reason text,
  created_at timestamptz default now() not null
);

alter table public.blocked_dates enable row level security;

create policy "Alle kan lese blokkerte datoer"
  on public.blocked_dates for select
  using (true);

-- 5. BOOKINGER
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_address text not null,
  customer_phone text not null,
  service_id uuid references public.services(id) not null,
  service_name text not null,
  booking_date date not null,
  booking_time time not null,
  duration_hours integer not null default 1 check (duration_hours >= 1),
  total_price integer not null,
  is_flexible boolean not null default false,
  status text not null default 'ny' check (status in ('ny', 'bekreftet', 'fullfort', 'avlyst')),
  customer_comment text,
  admin_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.bookings enable row level security;

create policy "Alle kan opprette bookinger"
  on public.bookings for insert
  with check (true);

-- Auto-oppdater updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.bookings
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- SEED DATA: Tjenester
-- ============================================================
insert into public.services (name, description, category, sort_order) values
  ('Gressklipping', 'Jeg klipper gresset slik at plenen ser fin og velstelt ut.', 'tjenester', 1),
  ('Handle på butikken', 'Jeg handler det du trenger og leverer det hjem til deg.', 'tjenester', 2),
  ('Rydding og støvsuging', 'Rydding, støvsuging og enkel rengjøring i hjemmet.', 'tjenester', 3),
  ('Matlaging', 'Jeg lager et enkelt måltid for deg – etter dine ønsker.', 'tjenester', 4),
  ('Annen hjelp', 'Trenger du hjelp med noe annet? Ta kontakt, så finner vi ut av det sammen.', 'tjenester', 5);

-- ============================================================
-- SEED DATA: Tilgjengelige tider (Edvards faktiske timeplan)
-- Skole man-fre 08-15, treninger man/ons 18:00, tir/tor 16:00
-- Tirsdag og torsdag: for kort tid, hoppes over
-- ============================================================
insert into public.available_slots (day_of_week, start_time, end_time) values
  -- Mandag (1): 15:00-17:00 (trening 18:00-19:30)
  (1, '15:00', '16:00'), (1, '16:00', '17:00'),
  -- Tirsdag (2): STENGT (trening 16:00-17:30, for kort tid)
  -- Onsdag (3): 15:00-17:00 (trening 18:00-19:30)
  (3, '15:00', '16:00'), (3, '16:00', '17:00'),
  -- Torsdag (4): STENGT (trening 16:00-18:00, for kort tid)
  -- Fredag (5): 15:00-19:00 (fri etter skolen)
  (5, '15:00', '16:00'), (5, '16:00', '17:00'), (5, '17:00', '18:00'), (5, '18:00', '19:00'),
  -- Lørdag (6): 10:00-17:00 (fri hele dagen)
  (6, '10:00', '11:00'), (6, '11:00', '12:00'),
  (6, '12:00', '13:00'), (6, '13:00', '14:00'), (6, '14:00', '15:00'),
  (6, '15:00', '16:00'), (6, '16:00', '17:00'),
  -- Søndag (0): 10:00-17:00 (fri hele dagen)
  (0, '10:00', '11:00'), (0, '11:00', '12:00'), (0, '12:00', '13:00'),
  (0, '13:00', '14:00'), (0, '14:00', '15:00'), (0, '15:00', '16:00'),
  (0, '16:00', '17:00');
