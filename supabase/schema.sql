-- ================================================================
-- Jhon Florez Peluqueros — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- SERVICES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  price_display TEXT NOT NULL DEFAULT 'Consultar',
  price_min DECIMAL(10, 2),
  category TEXT CHECK (category IN ('men', 'women', 'bridal', 'makeup', 'treatment')),
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Seed services
INSERT INTO public.services (name_es, name_en, price_display, price_min, category, duration_minutes, sort_order) VALUES
  ('Corte Hombre', 'Men''s Haircut', '15€', 15, 'men', 30, 1),
  ('Corte Hombre + Barba', 'Haircut + Beard', '18€', 18, 'men', 45, 2),
  ('Corte Mujer', 'Women''s Haircut', 'Desde 25€', 25, 'women', 60, 3),
  ('Color', 'Colour', 'Consultar', NULL, 'treatment', 120, 4),
  ('Mechas', 'Highlights', 'Consultar', NULL, 'treatment', 150, 5),
  ('Lavado', 'Wash', 'Consultar', NULL, 'treatment', 20, 6),
  ('Peinado', 'Styling', 'Consultar', NULL, 'women', 30, 7),
  ('Keratina', 'Keratin', 'Consultar', NULL, 'treatment', 180, 8),
  ('Maquillaje Novia', 'Bridal Makeup', '35€', 35, 'bridal', 60, 9),
  ('Maquillaje Novia + Peinado', 'Bridal Makeup + Styling', '55€', 55, 'bridal', 120, 10),
  ('Maquillaje Fantasía', 'Fantasy Makeup', 'Consultar', NULL, 'makeup', 90, 11)
ON CONFLICT DO NOTHING;

-- ================================================================
-- BOOKINGS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  admin_notes TEXT,
  calendar_event_id TEXT,
  locale TEXT DEFAULT 'es' CHECK (locale IN ('es', 'en'))
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- AVAILABILITY TABLE (blocked dates / custom hours)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE,
  time_start TIME,
  time_end TIME,
  is_blocked BOOLEAN DEFAULT TRUE,
  reason TEXT
);

-- ================================================================
-- ADMIN NOTES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ================================================================
-- PROFILES TABLE (admin users)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ---- BOOKINGS ----
-- Public: insert only (create booking)
CREATE POLICY "Public can insert bookings" ON public.bookings
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated admin: full access
CREATE POLICY "Admin can select bookings" ON public.bookings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete bookings" ON public.bookings
  FOR DELETE TO authenticated USING (true);

-- ---- SERVICES ----
-- Public: read only
CREATE POLICY "Public can read services" ON public.services
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- Admin: full CRUD
CREATE POLICY "Admin can manage services" ON public.services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---- AVAILABILITY ----
CREATE POLICY "Public can read availability" ON public.availability
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage availability" ON public.availability
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---- ADMIN NOTES ----
CREATE POLICY "Admin can manage notes" ON public.admin_notes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---- PROFILES ----
CREATE POLICY "Admin can read profiles" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- ================================================================
-- USEFUL INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at DESC);
