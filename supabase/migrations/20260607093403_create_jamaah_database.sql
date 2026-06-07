-- Create JAMAAH table
create table public.jamaah (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  nik text unique not null,
  phone text,
  address text,
  package_type text not null check (package_type in ('haji_reguler', 'haji_plus', 'umroh_reguler', 'umroh_eksekutif')),
  status text not null default 'waiting' check (status in ('waiting', 'verified', 'scheduled', 'departed', 'completed')),
  registration_date date default current_date,
  estimated_departure_year integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jamaah enable row level security;

-- Policies: Only Admins can manage jamaah data
create policy "Admins can manage jamaah database"
on public.jamaah
for all
using (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- Profiles can see if they are in the database (optional, for personal tracking)
create policy "Users can view their own jamaah status"
on public.jamaah
for select
using (
  nik in (select nik from profiles where id = auth.uid())
);
