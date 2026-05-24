create extension if not exists pgcrypto;

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  public_input jsonb not null,
  result_snapshot jsonb not null,
  monthly_spend numeric not null,
  estimated_monthly_savings numeric not null,
  estimated_annual_savings numeric not null,
  savings_rate integer not null
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  audit_id uuid not null references audits(id) on delete cascade,
  intent text not null check (intent in ('email-report', 'consultation', 'notify-me')),
  ip_hash text not null
);

create index if not exists leads_ip_hash_created_at_idx on leads (ip_hash, created_at desc);
create index if not exists leads_audit_id_idx on leads (audit_id);
