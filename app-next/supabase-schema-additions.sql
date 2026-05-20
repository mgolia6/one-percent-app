-- One Percent Beta — Schema Additions
-- Run this in your Supabase SQL editor after the base schema

-- Add onboarding fields to profiles
alter table profiles
  add column if not exists name text,
  add column if not exists onboarding_complete boolean not null default false,
  add column if not exists is_admin boolean not null default false;

-- Add post-entry feedback fields to feedback table
-- (Create the feedback table if it doesn't exist yet)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  feedback_type text not null, -- 'post_entry' | 'weekly' | 'landing' | 'midpoint' | 'final'
  entry_number text,           -- '001', '002', etc. — for post_entry type
  topic_rating integer,        -- 1-5: Was this topic interesting/relevant?
  clarity_rating integer,      -- 1-5: How clear was the content?
  quiz_rating integer,         -- 1-5: Did the quiz test the right things?
  overall_rating integer,      -- 1-5: General rating (landing/weekly)
  would_recommend text,        -- 'Yes' | 'Not yet' | 'No'
  comment text,                -- Freeflow optional
  missing_topics text,         -- Weekly: what's missing
  biggest_win text,            -- Weekly: what they applied
  created_at timestamptz not null default now()
);

-- RLS for feedback
alter table feedback enable row level security;

create policy "feedback_self" on feedback
  for all using (auth.uid() = user_id);

-- Admin read-all policy for feedback
create policy "feedback_admin_read" on feedback
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and is_admin = true
    )
  );

-- Index
create index if not exists feedback_user_idx on feedback(user_id);
create index if not exists feedback_type_idx on feedback(feedback_type);
create index if not exists feedback_entry_idx on feedback(entry_number);

-- Bug reports table (if not already created)
create table if not exists bug_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  page text,
  description text not null,
  browser_info text,
  created_at timestamptz not null default now()
);

alter table bug_reports enable row level security;

create policy "bug_reports_self_insert" on bug_reports
  for insert with check (auth.uid() = user_id);

create policy "bug_reports_admin_read" on bug_reports
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and is_admin = true
    )
  );
