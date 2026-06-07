-- FOUNDATIONAL SCHEMA FOR FAV UMROH MAGETAN

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & SUBSCRIPTIONS
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
ADD COLUMN IF NOT EXISTS departure_date date,
ADD COLUMN IF NOT EXISTS origin_city text,
ADD COLUMN IF NOT EXISTS phone_number text;

-- 2. BANK DOA (Contents)
CREATE TABLE public.doa_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  icon text,
  display_order integer DEFAULT 0
);

CREATE TABLE public.doa_list (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id uuid REFERENCES public.doa_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  arabic_text text NOT NULL,
  latin_text text,
  translation_id text,
  audio_url text,
  context text,
  is_premium boolean DEFAULT false,
  display_order integer DEFAULT 0
);

CREATE TABLE public.user_favorites (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  doa_id uuid REFERENCES public.doa_list(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, doa_id)
);

-- 3. PANDUAN IBADAH (Steps)
CREATE TABLE public.umroh_steps (
  id integer PRIMARY KEY,
  title text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  display_order integer NOT NULL
);

CREATE TABLE public.user_progress (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_id integer REFERENCES public.umroh_steps(id),
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  current_sub_step integer DEFAULT 0, -- for counters like tawaf loops
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, step_id)
);

-- 4. PERENCANAAN & CHECKLIST
CREATE TABLE public.user_plans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  estimated_cost numeric,
  itinerary_json jsonb, -- storage for custom itinerary
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.checklist_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  phase text NOT NULL, -- e.g., 'H-6 Month'
  description text,
  is_global boolean DEFAULT true -- if true, shown to all users
);

CREATE TABLE public.user_checklist (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.checklist_items(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  PRIMARY KEY (user_id, item_id)
);

-- 5. PHOTO SPOTS
CREATE TABLE public.photo_spots (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  city text NOT NULL CHECK (city IN ('makkah', 'madinah')),
  title text NOT NULL,
  description text,
  best_time text,
  angle_tips text,
  camera_settings text,
  coordinates point, -- x=lat, y=lng
  image_urls text[],
  is_premium boolean DEFAULT true,
  display_order integer DEFAULT 0
);

-- 6. PRACTICAL GUIDES (Informational)
CREATE TABLE public.practical_guides (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  category text NOT NULL, -- transport, health, facility, etc.
  title text NOT NULL,
  content text NOT NULL,
  icon text
);

-- RLS POLICIES
ALTER TABLE public.doa_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view doa categories" ON public.doa_categories FOR SELECT USING (true);

ALTER TABLE public.doa_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view free doa" ON public.doa_list FOR SELECT USING (is_premium = false OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND plan_type = 'premium')));

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own plan" ON public.user_plans FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.user_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own checklist" ON public.user_checklist FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.photo_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view spots" ON public.photo_spots FOR SELECT USING (true);

-- SEED INITIAL DATA (Optional Categories)
INSERT INTO public.doa_categories (name, icon, display_order) VALUES 
('Doa Perjalanan', 'plane', 1),
('Doa di Masjidil Haram', 'mosque', 2),
('Doa Sa''i', 'running', 3),
('Doa di Masjid Nabawi', 'star', 4),
('Dzikir Harian', 'heart', 5);

INSERT INTO public.umroh_steps (id, title, slug, display_order) VALUES
(1, 'Miqat & Niat', 'miqat', 1),
(2, 'Tawaf', 'tawaf', 2),
(3, 'Makam Ibrahim', 'makam-ibrahim', 3),
(4, 'Multazam & Zamzam', 'zamzam', 4),
(5, 'Sa''i', 'sai', 5),
(6, 'Tahallul', 'tahallul', 6);
