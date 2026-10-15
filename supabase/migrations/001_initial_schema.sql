-- Lumio AI — initial schema + RLS
-- Run in Supabase SQL Editor or via CLI: supabase db push

create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Meetings
create table if not exists public.meetings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled Meeting',
  duration_seconds integer not null default 0,
  audio_url text,
  audio_path text,
  status text not null default 'recording'
    check (status in ('recording', 'uploading', 'transcribing', 'summarizing', 'completed', 'failed')),
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  participants text[] default '{}',
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meetings_user_id_idx on public.meetings (user_id);
create index if not exists meetings_recorded_at_idx on public.meetings (recorded_at desc);

-- Transcripts
create table if not exists public.transcripts (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null default '',
  segments jsonb default '[]',
  provider text,
  created_at timestamptz not null default now(),
  unique (meeting_id)
);

-- Summaries
create table if not exists public.summaries (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  executive_summary text not null default '',
  key_points jsonb default '[]',
  decisions jsonb default '[]',
  risks jsonb default '[]',
  follow_ups jsonb default '[]',
  sentiment_score integer,
  sentiment_label text,
  sentiment_description text,
  raw_json jsonb,
  created_at timestamptz not null default now(),
  unique (meeting_id)
);

-- Action items
create table if not exists public.action_items (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references public.meetings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  assignee text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists action_items_meeting_id_idx on public.action_items (meeting_id);

-- Interviews
create table if not exists public.interviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_type text not null,
  mode text not null default 'text' check (mode in ('text', 'voice')),
  confidence_score integer,
  technical_score integer,
  communication_score integer,
  speaking_speed integer,
  filler_words integer,
  questions jsonb default '[]',
  answers jsonb default '[]',
  feedback jsonb default '{}',
  suggestions jsonb default '[]',
  created_at timestamptz not null default now()
);

-- Resume uploads
create table if not exists public.resume_uploads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  file_url text,
  file_name text,
  score integer,
  skills jsonb default '[]',
  missing_skills jsonb default '[]',
  interview_questions jsonb default '[]',
  suggestions jsonb default '[]',
  analysis_json jsonb,
  created_at timestamptz not null default now()
);

-- Notifications log / inbox
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read boolean not null default false,
  data jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  revenuecat_id text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI chat history
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  meeting_id uuid references public.meetings (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_user_id_idx on public.chat_messages (user_id, created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  insert into public.subscriptions (user_id, plan) values (new.id, 'free');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.meetings enable row level security;
alter table public.transcripts enable row level security;
alter table public.summaries enable row level security;
alter table public.action_items enable row level security;
alter table public.interviews enable row level security;
alter table public.resume_uploads enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Meetings
create policy "meetings_all_own" on public.meetings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Transcripts
create policy "transcripts_all_own" on public.transcripts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Summaries
create policy "summaries_all_own" on public.summaries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Action items
create policy "action_items_all_own" on public.action_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Interviews
create policy "interviews_all_own" on public.interviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Resumes
create policy "resumes_all_own" on public.resume_uploads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Notifications
create policy "notifications_all_own" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Subscriptions
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions_update_own" on public.subscriptions for update using (auth.uid() = user_id);

-- Chat
create policy "chat_all_own" on public.chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage buckets (create in dashboard): meeting-recordings, resumes
-- Policies: authenticated users can read/write their own folder {user_id}/*
