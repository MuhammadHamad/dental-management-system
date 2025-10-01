-- Fix for initial admin setup - bypass RLS for first admin user creation

-- Create a function to setup the first admin user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.setup_first_admin(
  user_uuid UUID,
  clinic_uuid UUID DEFAULT '123e4567-e89b-12d3-a456-426614174000'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public
AS $$
BEGIN
  -- Delete any existing role for this user
  DELETE FROM public.user_roles WHERE user_id = user_uuid;
  
  -- Delete any existing profile for this user
  DELETE FROM public.profiles WHERE id = user_uuid;
  
  -- Insert admin role (bypasses RLS because function is SECURITY DEFINER)
  INSERT INTO public.user_roles (user_id, clinic_id, role)
  VALUES (user_uuid, clinic_uuid, 'admin');
  
  -- Insert profile (bypasses RLS because function is SECURITY DEFINER)
  INSERT INTO public.profiles (id, clinic_id, email)
  VALUES (user_uuid, clinic_uuid, '');
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and return false
    RAISE LOG 'Error in setup_first_admin: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.setup_first_admin(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.setup_first_admin(UUID) TO authenticated;

-- Create a simpler function for any user to become admin (for development only)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clinic_uuid UUID := '123e4567-e89b-12d3-a456-426614174000';
BEGIN
  -- Delete existing role if any
  DELETE FROM public.user_roles WHERE user_id = user_uuid;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, clinic_id, role)
  VALUES (user_uuid, clinic_uuid, 'admin');
  
  -- Upsert profile
  INSERT INTO public.profiles (id, clinic_id, email)
  VALUES (user_uuid, clinic_uuid, '')
  ON CONFLICT (id) DO UPDATE SET
    clinic_id = EXCLUDED.clinic_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in make_user_admin: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.make_user_admin(UUID) TO authenticated;
