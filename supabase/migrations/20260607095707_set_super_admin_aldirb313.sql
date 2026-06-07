-- Set role to super_admin for specific email
UPDATE public.profiles
SET role = 'super_admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'aldirb313@gmail.com'
);
