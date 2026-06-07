-- More robust handle_new_user to ensure Google Auth doesn't fail due to missing fields
create or replace function public.handle_new_user()
returns trigger as $$
declare
  username text;
begin
  -- Try to get full name from metadata, fallback to email prefix if not available
  username := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, full_name, role, plan_type)
  values (
    new.id, 
    new.email, 
    username,
    'user',
    'free'
  )
  on conflict (id) do update 
  set full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
      
  return new;
exception when others then
  -- Ensure the auth process doesn't hang if profile creation fails
  return new;
end;
$$ language plpgsql security definer;
