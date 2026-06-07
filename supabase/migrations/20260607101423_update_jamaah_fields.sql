-- Update jamaah table with new specific fields
ALTER TABLE public.jamaah 
ADD COLUMN IF NOT EXISTS group_name text,
ADD COLUMN IF NOT EXISTS birth_info text,
ADD COLUMN IF NOT EXISTS registration_year integer,
ADD COLUMN IF NOT EXISTS registration_location text,
ADD COLUMN IF NOT EXISTS portion_number text;

-- Make existing fields optional if they were required
ALTER TABLE public.jamaah ALTER COLUMN nik DROP NOT NULL;
ALTER TABLE public.jamaah ALTER COLUMN package_type DROP NOT NULL;
ALTER TABLE public.jamaah DROP CONSTRAINT IF EXISTS jamaah_package_type_check;
