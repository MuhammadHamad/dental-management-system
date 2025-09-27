-- Fix security warnings by setting search path for functions that don't have it
ALTER FUNCTION public.generate_patient_number(UUID) SET search_path = public;
ALTER FUNCTION public.set_patient_number() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;