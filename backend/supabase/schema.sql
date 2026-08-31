-- ==============================================================================
-- SIH26031 - AI Onion Quality Assessment & Disease Grading Platform
-- Phase 03: Supabase PostgreSQL Database Schema, RLS & Storage Buckets
-- Execute this script in the Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enum Types
CREATE TYPE user_role AS ENUM ('FARMER', 'PROCUREMENT_OFFICER', 'ADMIN');
CREATE TYPE onion_grade AS ENUM ('A', 'B', 'C', 'REJECTED');
CREATE TYPE freshness_level AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE damage_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE recommendation_status AS ENUM ('ACCEPT', 'CONDITIONAL_ACCEPT', 'REJECT');

-- ==============================================================================
-- TABLE 1: profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  role user_role DEFAULT 'FARMER'::user_role NOT NULL,
  village TEXT,
  district TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- TABLE 2: detections
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  processed_image_url TEXT,
  grade onion_grade NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  size TEXT NOT NULL,
  freshness freshness_level NOT NULL,
  damage_level damage_level NOT NULL,
  recommendation recommendation_status NOT NULL,
  ai_model_version TEXT DEFAULT 'YOLO11n-v2.0'::text NOT NULL,
  processing_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- TABLE 3: detection_results (YOLO11n Bounding Boxes & Diseases)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.detection_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  detection_id UUID NOT NULL REFERENCES public.detections(id) ON DELETE CASCADE,
  defect_type TEXT NOT NULL,
  disease_name TEXT,
  confidence DOUBLE PRECISION NOT NULL,
  area_percentage DOUBLE PRECISION,
  severity TEXT,
  treatment TEXT,
  storage_advice TEXT,
  x_min DOUBLE PRECISION,
  y_min DOUBLE PRECISION,
  x_max DOUBLE PRECISION,
  y_max DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- TABLE 4: disease_information (Agronomic Disease Knowledge Base)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.disease_information (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_code TEXT UNIQUE NOT NULL,
  disease_name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  severity_default TEXT DEFAULT 'Medium'::text NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- TABLE 5: recommendations (Agronomic Spray & Storage Precautions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_code TEXT NOT NULL REFERENCES public.disease_information(disease_code) ON DELETE CASCADE,
  fungicide_treatment TEXT NOT NULL,
  dosage TEXT NOT NULL,
  application_method TEXT NOT NULL,
  storage_precaution TEXT NOT NULL,
  curing_guideline TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public Profiles Read" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users Update Own Profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Detections Policies
CREATE POLICY "Users Read Own Detections OR Officer Admin Read All" ON public.detections
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('PROCUREMENT_OFFICER', 'ADMIN')
    )
  );

CREATE POLICY "Users Create Own Detections" ON public.detections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users Delete Own Detections" ON public.detections
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Detection Results Policies
CREATE POLICY "Read Detection Results" ON public.detection_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.detections d
      WHERE d.id = detection_id AND (
        d.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('PROCUREMENT_OFFICER', 'ADMIN')
        )
      )
    )
  );

CREATE POLICY "Insert Detection Results" ON public.detection_results
  FOR INSERT WITH CHECK (true);

-- 4. Disease Information & Recommendations Policies (Public Read)
CREATE POLICY "Public Read Disease Info" ON public.disease_information
  FOR SELECT USING (true);

CREATE POLICY "Public Read Recommendations" ON public.recommendations
  FOR SELECT USING (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'FARMER'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SUPABASE STORAGE BUCKET SETUP: onion-images
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('onion-images', 'onion-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Onion Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'onion-images');

CREATE POLICY "Authenticated Upload Onion Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'onion-images' AND auth.role() = 'authenticated');

-- ==============================================================================
-- INITIAL SEED DATA: disease_information & recommendations
-- ==============================================================================
INSERT INTO public.disease_information (disease_code, disease_name, scientific_name, description, symptoms, severity_default)
VALUES
  ('PURPLE_BLOTCH', 'Purple Blotch', 'Alternaria porri', 'Fungal disease favored by warm humid foliage moisture.', 'Purple lesions with yellow halos on leaves & neck.', 'High'),
  ('SOFT_ROT', 'Bacterial Soft Rot', 'Erwinia carotovora', 'Bacterial bulb decay entering through harvest wounds.', 'Soft watery scales emitting foul pungent odor.', 'Severe'),
  ('BLACK_MOLD', 'Black Mold', 'Aspergillus niger', 'Fungal black spore masses under outer scales.', 'Black powdery mold around bulb neck.', 'Medium'),
  ('STEMPHYLIUM', 'Stemphylium Leaf Blight', 'Stemphylium vesicarium', 'Foliar blight leading to premature neck death.', 'Ovated tan spots with dark brown centers.', 'Medium'),
  ('SMUT', 'Onion Smut', 'Urocystis cepulae', 'Soil-borne fungal blister disease.', 'Dark raised blisters containing black powdery spores.', 'High'),
  ('MECHANICAL_CUT', 'Mechanical Cut', 'N/A', 'Physical injuries during mechanical harvesting or sorting.', 'Open wounds or surface skin tears.', 'Low')
ON CONFLICT (disease_code) DO NOTHING;

INSERT INTO public.recommendations (disease_code, fungicide_treatment, dosage, application_method, storage_precaution, curing_guideline)
VALUES
  ('PURPLE_BLOTCH', 'Mancozeb 75 WP / Tebuconazole 50%', '2.5 g/L water', 'Foliar spray at 10-14 day intervals', 'Store at 0-2°C with 65-70% RH', 'Field cure 10-14 days until neck tissue is tight and dry'),
  ('SOFT_ROT', 'Copper Oxychloride 50 WP + Streptocycline', '3 g/L + 0.1 g/L water', 'Base drenching & foliage spray', 'Isolate rotting bulbs immediately', 'Avoid over-irrigation 2 weeks prior to harvest'),
  ('BLACK_MOLD', 'Carbendazim 50 WP / Trichoderma viride', '1 g/L or 5 g/L', 'Foliar spray and crate dip', 'Keep storage humidity below 70%', 'Cure thoroughly under shaded ventilation'),
  ('STEMPHYLIUM', 'Azoxystrobin 23% SC / Dithane M-45', '1 mL/L or 2.5 g/L', 'Foliar spray during humid weather', 'Store only dry, well-cured bulbs', 'Remove infected crop debris post harvest'),
  ('SMUT', 'Thiram 75 WS (Seed Treatment)', '3 g/kg seed', 'Seed dressing prior to sowing', 'Disinfect storage crates with 1% formalin', 'Practice 3-year crop rotation with non-hosts'),
  ('MECHANICAL_CUT', 'N/A', 'N/A', 'Manual sorting', 'Divert cut onions for immediate sale; do not store', 'Use padded harvesting buckets and sorting tables')
ON CONFLICT DO NOTHING;
