-- FormCraft Database Schema
-- PostgreSQL with Supabase Auth integration

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- FORMS TABLE
-- ============================================
CREATE TABLE public.forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups by user
CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_created_at ON public.forms(created_at DESC);

-- ============================================
-- RESPONSES TABLE
-- ============================================
CREATE TABLE public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups by form
CREATE INDEX idx_responses_form_id ON public.responses(form_id);
CREATE INDEX idx_responses_submitted_at ON public.responses(submitted_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Check if form is published (RLS-safe)
CREATE OR REPLACE FUNCTION public.is_form_published(p_form_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.forms
    WHERE id = p_form_id
      AND published = true
  );
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANTS
-- ============================================

-- Authenticated users: full CRUD on their own forms and read their responses
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forms TO authenticated;
GRANT SELECT ON public.responses TO authenticated;

-- Anonymous users: read published forms and submit responses
GRANT SELECT ON public.forms TO anon;
GRANT INSERT, SELECT ON public.responses TO anon;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- FORMS POLICIES
-- Users can only see their own forms
CREATE POLICY "Users can view own forms"
  ON public.forms FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create forms
CREATE POLICY "Users can create forms"
  ON public.forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own forms
CREATE POLICY "Users can update own forms"
  ON public.forms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own forms
CREATE POLICY "Users can delete own forms"
  ON public.forms FOR DELETE
  USING (auth.uid() = user_id);

-- Public can view published forms (for public form filling)
CREATE POLICY "Anyone can view published forms"
  ON public.forms FOR SELECT
  USING (published = true);

-- RESPONSES POLICIES
-- Anyone can submit a response (public form)
CREATE POLICY "Anyone can submit responses"
  ON public.responses FOR INSERT
  WITH CHECK (
    public.is_form_published(form_id)
  );

-- Only form creators can view responses
CREATE POLICY "Form creators can view responses"
  ON public.responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_id AND forms.user_id = auth.uid()
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update updated_at timestamp
CREATE TRIGGER on_forms_updated
  BEFORE UPDATE ON public.forms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- AGGREGATE FUNCTIONS
-- ============================================

-- Function to get response count per form
CREATE OR REPLACE FUNCTION public.get_form_with_response_count(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  fields JSONB,
  published BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  response_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.title,
    f.description,
    f.fields,
    f.published,
    f.created_at,
    f.updated_at,
    COUNT(r.id) AS response_count
  FROM public.forms f
  LEFT JOIN public.responses r ON r.form_id = f.id
  WHERE f.user_id = p_user_id
  GROUP BY f.id
  ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
