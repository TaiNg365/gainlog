-- GainLog Database Schema
-- Run this in Supabase SQL Editor

-- Workout logs table
create table if not exists workout_logs (
  id text primary key,
  date text not null,
  machine text not null,
  sets jsonb not null default '[]',
  superset boolean default false,
  superset_with text default '',
  notes text default '',
  is_pr boolean default false,
  created_at timestamp with time zone default now()
);

-- Body scans table (Starfit data)
create table if not exists body_scans (
  id text primary key,
  date text not null,
  source text default 'Manual',
  score numeric default 0,
  weight numeric default 0,
  body_fat numeric default 0,
  muscle numeric default 0,
  skeletal_muscle numeric default 0,
  protein numeric default 0,
  body_water numeric default 0,
  inorganic_salt numeric default 0,
  bmi numeric default 0,
  visceral_fat numeric default 0,
  bmr numeric default 0,
  body_age numeric default 0,
  fat_free_mass numeric default 0,
  subcutaneous_fat numeric default 0,
  smi numeric default 0,
  whr numeric default 0,
  notes text default '',
  created_at timestamp with time zone default now()
);

-- Machines table
create table if not exists machines (
  id serial primary key,
  name text unique not null,
  created_at timestamp with time zone default now()
);

-- Insert default machines
insert into machines (name) values
  ('Smith Machine (Bench)'),
  ('Smith Machine (Squat)'),
  ('Smith Machine (Hip Thrust)'),
  ('Lat Pulldown'),
  ('Row Machine'),
  ('Seated Cable Row'),
  ('Cable Chest Fly (High)'),
  ('Cable Chest Fly (Mid)'),
  ('Cable Chest Fly (Low)'),
  ('Cable Curl'),
  ('Cable Lat Pullover'),
  ('Cable Rope Curl (Drop Set)'),
  ('Overhead Rope Triceps'),
  ('Cable Crunch Machine'),
  ('Chest Press Machine'),
  ('Incline Chest Press Machine'),
  ('Pec Deck Machine'),
  ('Triceps Extension Machine'),
  ('Seated Triceps Press'),
  ('Machine Shoulder Press'),
  ('Hack Squat Machine'),
  ('Leg Press Machine'),
  ('Leg Extension Machine'),
  ('Lying Hamstring Curl'),
  ('Seated Calf Raise'),
  ('Calf Extension Machine'),
  ('Glute Kickback Machine'),
  ('Hip Thrust Machine'),
  ('Hip Abduction Machine'),
  ('Hip Adduction Machine'),
  ('Rear Delt Fly Machine'),
  ('Preacher Curl Machine'),
  ('Ab Crunch Machine'),
  ('Rotary Torso Machine'),
  ('Dumbbells'),
  ('EZ Bar'),
  ('Barbell')
on conflict (name) do nothing;

-- Settings table (for API key and preferences)
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (but allow all for now - no login required)
alter table workout_logs enable row level security;
alter table body_scans enable row level security;
alter table machines enable row level security;
alter table settings enable row level security;

-- Allow all operations for now (no auth required for personal use)
create policy "Allow all on workout_logs" on workout_logs for all using (true) with check (true);
create policy "Allow all on body_scans" on body_scans for all using (true) with check (true);
create policy "Allow all on machines" on machines for all using (true) with check (true);
create policy "Allow all on settings" on settings for all using (true) with check (true);

-- ── Add cardio logs table (run this if you already ran the first schema)
create table if not exists cardio_logs (
  id text primary key,
  date text not null,
  machine text not null,
  duration numeric default 0,
  cal_display numeric default 0,
  notes text default '',
  created_at timestamp with time zone default now()
);

alter table cardio_logs enable row level security;
create policy "Allow all on cardio_logs" on cardio_logs for all using (true) with check (true);
