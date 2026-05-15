-- LoopCRM Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  business_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CUSTOMERS TABLE
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  full_name text not null,
  phone text not null,
  product_service text,
  notes text,
  last_contacted timestamptz,
  next_followup timestamptz,
  status text default 'active' check (status in ('active', 'pending', 'inactive')),
  created_at timestamptz default now()
);

-- REMINDERS TABLE
create table public.reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  customer_id uuid references public.customers on delete cascade not null,
  title text not null,
  reminder_date timestamptz not null,
  status text default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- ACTIVITIES TABLE
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  customer_id uuid references public.customers on delete set null,
  activity_type text not null check (activity_type in ('whatsapp', 'call', 'note', 'visit', 'created', 'reminder_completed')),
  message text,
  created_at timestamptz default now()
);

-- MESSAGE TEMPLATES TABLE
create table public.message_templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  category text default 'general',
  created_at timestamptz default now()
);

-- RLS POLICIES

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.reminders enable row level security;
alter table public.activities enable row level security;
alter table public.message_templates enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Auto-create profile on signup" on public.profiles
  for insert with check (auth.uid() = id);

-- Customers policies
create policy "Users can view own customers" on public.customers
  for select using (auth.uid() = user_id);

create policy "Users can insert own customers" on public.customers
  for insert with check (auth.uid() = user_id);

create policy "Users can update own customers" on public.customers
  for update using (auth.uid() = user_id);

create policy "Users can delete own customers" on public.customers
  for delete using (auth.uid() = user_id);

-- Reminders policies
create policy "Users can view own reminders" on public.reminders
  for select using (auth.uid() = user_id);

create policy "Users can insert own reminders" on public.reminders
  for insert with check (auth.uid() = user_id);

create policy "Users can update own reminders" on public.reminders
  for update using (auth.uid() = user_id);

create policy "Users can delete own reminders" on public.reminders
  for delete using (auth.uid() = user_id);

-- Activities policies
create policy "Users can view own activities" on public.activities
  for select using (auth.uid() = user_id);

create policy "Users can insert own activities" on public.activities
  for insert with check (auth.uid() = user_id);

-- Message templates policies
create policy "Users can view own templates" on public.message_templates
  for select using (auth.uid() = user_id);

create policy "Users can insert own templates" on public.message_templates
  for insert with check (auth.uid() = user_id);

create policy "Users can update own templates" on public.message_templates
  for update using (auth.uid() = user_id);

create policy "Users can delete own templates" on public.message_templates
  for delete using (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, business_name, phone)
  values (new.id, new.raw_user_meta_data->>'business_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INDEXES for better query performance
create index idx_customers_user_id on public.customers(user_id);
create index idx_customers_status on public.customers(status);
create index idx_reminders_user_id on public.reminders(user_id);
create index idx_reminders_date on public.reminders(reminder_date);
create index idx_activities_user_id on public.activities(user_id);
create index idx_activities_created on public.activities(created_at desc);