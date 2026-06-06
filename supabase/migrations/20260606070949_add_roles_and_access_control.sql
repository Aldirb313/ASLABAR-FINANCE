-- Add role and access flags to profiles
alter table public.profiles 
add column if not exists role text default 'user' check (role in ('user', 'super_admin')),
add column if not exists is_loan_authorized boolean default false;

-- Update RLS for loans to check for is_loan_authorized
drop policy if exists "Users can view own loans." on public.loans;
create policy "Users can view own loans if authorized." 
on public.loans 
for select 
using (
  (auth.uid() = user_id) AND 
  (exists (select 1 from profiles where id = auth.uid() and (is_loan_authorized = true or role = 'super_admin')))
);

drop policy if exists "Users can insert own loans." on public.loans;
create policy "Users can insert own loans if authorized." 
on public.loans 
for insert 
with check (
  (auth.uid() = user_id) AND 
  (exists (select 1 from profiles where id = auth.uid() and (is_loan_authorized = true or role = 'super_admin')))
);
