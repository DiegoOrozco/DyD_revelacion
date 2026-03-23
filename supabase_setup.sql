-- Run this in your Supabase SQL Editor

create table if not exists confirmations (
  id uuid default gen_random_uuid() primary key,
  guest_name text not null,
  slots_assigned int not null,
  ha_confirmado boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Optional but recommended)
-- alter table confirmations enable row level security;

-- Create policy to allow public inserts (for the invitation form)
-- create policy "Allow public inserts" on confirmations for insert with check (true);

-- Create policy to allow admin to select all (for the admin panel)
-- create policy "Allow admin select" on confirmations for select using (true);
