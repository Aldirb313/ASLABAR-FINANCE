-- FINAL FIX FOR OAUTH AND PROFILES
-- 1. Ensure all problematic constraints are relaxed
ALTER TABLE public.profiles ALTER COLUMN nik DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;

-- 2. Drop the old trigger function and recreate it with maximum compatibility
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  final_name text;
BEGIN
  -- Extract name from metadata with multiple fallbacks
  final_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );

  -- UPSERT into profiles to avoid "already exists" errors
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    plan_type, 
    avatar_url
  )
  VALUES (
    new.id, 
    new.email, 
    final_name,
    'user',
    'free',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-attach trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Clean up any existing broken profiles (optional but safe)
-- Ensures email is set for existing users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;
