-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  nik text unique,
  phone text unique,
  address text,
  email text,
  avatar_url text,
  ktp_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile." on profiles for insert with check (auth.uid() = id);

-- SAVINGS
create table public.savings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('haji_reguler', 'haji_khusus', 'umroh')),
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  monthly_deposit numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.savings enable row level security;
create policy "Users can view own savings." on savings for select using (auth.uid() = user_id);
create policy "Users can insert own savings." on savings for insert with check (auth.uid() = user_id);
create policy "Users can update own savings." on savings for update using (auth.uid() = user_id);

-- LOANS
create table public.loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  tenor integer not null, -- in months
  purpose text,
  status text not null default 'pending' check (status in ('pending', 'verified', 'approved', 'disbursed', 'rejected', 'paid')),
  interest_rate numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.loans enable row level security;
create policy "Users can view own loans." on loans for select using (auth.uid() = user_id);
create policy "Users can insert own loans." on loans for insert with check (auth.uid() = user_id);
create policy "Users can update own loans." on loans for update using (auth.uid() = user_id);

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('deposit', 'withdrawal', 'loan_payment', 'loan_disbursement')),
  amount numeric not null,
  reference_id text,
  receipt_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;
create policy "Users can view own transactions." on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions." on transactions for insert with check (auth.uid() = user_id);

-- Function to handle new users from auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.phone);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', true) on conflict do nothing;

-- Bucket Policies
create policy "Users can upload own documents" on storage.objects for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can view own documents" on storage.objects for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload own receipts" on storage.objects for insert with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can view own receipts" on storage.objects for select using (bucket_id = 'receipts');