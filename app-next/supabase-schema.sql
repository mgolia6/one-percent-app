-- One Percent Beta — Supabase Schema
-- Run this in your Supabase SQL editor

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  signup_date timestamptz not null default now(),
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date text, -- stored as toDateString() for easy comparison
  created_at timestamptz not null default now()
);

-- Completions table
create table if not exists completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  entry_number text not null, -- '001', '002', etc.
  score integer not null,     -- 0, 1, 2, or 3
  time_to_quiz integer,       -- seconds from page load to submit
  answers jsonb,              -- { "0": 1, "1": 2, "2": 0 } — qi: ai
  completed_at timestamptz not null default now(),
  unique(user_id, entry_number)
);

-- Row level security
alter table profiles enable row level security;
alter table completions enable row level security;

-- Profiles: users can only read/write their own row
create policy "profiles_self" on profiles
  for all using (auth.uid() = id);

-- Completions: users can only read/write their own rows
create policy "completions_self" on completions
  for all using (auth.uid() = user_id);

-- Indexes
create index if not exists completions_user_idx on completions(user_id);
create index if not exists completions_entry_idx on completions(entry_number);
