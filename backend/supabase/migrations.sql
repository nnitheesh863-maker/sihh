-- ==============================================================================
-- SIH26031 - AI Onion Quality Assessment & Disease Grading Platform
-- Phase 03: SUPPLEMENTARY - Additional Indexes, Views & Functions
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ==============================================================================

-- ==============================================================================
-- INDEXES for Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON public.detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_grade ON public.detections(grade);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON public.detections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detection_results_detection_id ON public.detection_results(detection_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_disease_code ON public.recommendations(disease_code);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- HELPER FUNCTION: updated_at trigger
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- VIEW: detection_summary (convenient join for dashboard queries)
-- ==============================================================================
CREATE OR REPLACE VIEW public.detection_summary AS
SELECT
  d.id,
  d.user_id,
  p.full_name AS farmer_name,
  p.district AS farmer_district,
  d.grade,
  d.score,
  d.freshness,
  d.damage_level,
  d.recommendation,
  d.ai_model_version,
  d.processing_time_ms,
  d.created_at,
  COUNT(dr.id) AS defect_count,
  MAX(dr.confidence) AS max_confidence
FROM public.detections d
LEFT JOIN public.profiles p ON p.id = d.user_id
LEFT JOIN public.detection_results dr ON dr.detection_id = d.id
GROUP BY d.id, p.full_name, p.district;

-- ==============================================================================
-- VIEW: disease_with_recommendations (full disease info & spray guidance)
-- ==============================================================================
CREATE OR REPLACE VIEW public.disease_with_recommendations AS
SELECT
  di.disease_code,
  di.disease_name,
  di.scientific_name,
  di.description,
  di.symptoms,
  di.severity_default,
  r.fungicide_treatment,
  r.dosage,
  r.application_method,
  r.storage_precaution,
  r.curing_guideline
FROM public.disease_information di
LEFT JOIN public.recommendations r ON r.disease_code = di.disease_code;

-- ==============================================================================
-- FUNCTION: get_grade_statistics (grade breakdown for dashboard)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_grade_statistics(
  p_user_id UUID DEFAULT NULL,
  p_days_back INT DEFAULT 30
)
RETURNS TABLE (
  grade TEXT,
  count BIGINT,
  avg_score DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.grade::TEXT,
    COUNT(*) AS count,
    ROUND(AVG(d.score)::numeric, 2)::DOUBLE PRECISION AS avg_score
  FROM public.detections d
  WHERE
    d.created_at >= NOW() - (p_days_back || ' days')::INTERVAL
    AND (p_user_id IS NULL OR d.user_id = p_user_id)
  GROUP BY d.grade
  ORDER BY d.grade;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
