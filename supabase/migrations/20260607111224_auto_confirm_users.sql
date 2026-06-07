-- Automatically confirm all existing users
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email_confirmed_at IS NULL;

-- Function to confirm user via security definer (bypassing email)
CREATE OR REPLACE FUNCTION public.confirm_user(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = now()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
