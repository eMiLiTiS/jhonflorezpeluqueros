-- ============================================================
-- Jhon Florez Peluqueros — Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
create table if not exists public.bookings (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Customer info
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,

  -- Service
  service_id        text,                         -- optional FK if you add services table later
  service_name      text not null,

  -- Appointment
  preferred_date    date not null,
  preferred_time    time not null,
  notes             text,

  -- Status
  status            text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'cancelled')),

  -- Admin fields
  admin_notes       text,
  calendar_event_id text,
  locale            text not null default 'es'
                    check (locale in ('es', 'en'))
);

-- Index for admin dashboard queries (filter by status, order by date)
create index if not exists idx_bookings_status      on public.bookings (status);
create index if not exists idx_bookings_created_at  on public.bookings (created_at desc);
create index if not exists idx_bookings_date        on public.bookings (preferred_date);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row execute function public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.bookings enable row level security;

-- Anyone can INSERT (booking form is public)
create policy "Public can insert bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admins can SELECT / UPDATE / DELETE
create policy "Admins can read all bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "Admins can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete bookings"
  on public.bookings for delete
  to authenticated
  using (true);

-- ============================================================
-- REALTIME
-- Enable realtime publication for the admin dashboard
-- ============================================================
alter publication supabase_realtime add table public.bookings;

-- ============================================================
-- SAMPLE DATA (optional — remove before production)
-- ============================================================
-- insert into public.bookings (customer_name, customer_email, customer_phone, service_name, preferred_date, preferred_time, status, locale)
-- values
--   ('María García', 'maria@example.com', '+34 600 111 222', 'Corte Mujer', current_date + 2, '10:00', 'pending', 'es'),
--   ('Carlos López', 'carlos@example.com', '+34 600 333 444', 'Corte Hombre + Barba', current_date + 3, '11:30', 'confirmed', 'es');
