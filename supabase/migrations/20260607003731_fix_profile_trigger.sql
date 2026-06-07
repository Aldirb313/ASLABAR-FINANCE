-- Fix the handle_new_user function to correctly pull phone from metadata if signing up via email
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.phone, new.raw_user_meta_data->>'phone')
  );
  return new;
end;
$$ language plpgsql security definer;
