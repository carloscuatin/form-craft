-- Drop the anonymous SELECT policy on responses
-- anon should only INSERT responses, not read them
DROP POLICY IF EXISTS "Submitters can read own inserted response" ON public.responses;
