-- Таблица сотрудников компании
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  owner_telegram_id bigint not null,
  member_username text not null,
  member_telegram_id bigint,
  created_at timestamptz default now(),
  unique(owner_telegram_id, member_username)
);

alter table team_members enable row level security;
create policy "read team" on team_members for select using (true);
create policy "insert team" on team_members for insert with check (true);
create policy "delete team" on team_members for delete using (true);
create policy "update team" on team_members for update using (true);

-- Таблица промокодов
create table if not exists promo_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_percent int default 100,
  plan text default 'yearly',
  uses_left int default -1,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table promo_codes enable row level security;
create policy "read promos" on promo_codes for select using (true);
create policy "update promos" on promo_codes for update using (true);

-- 100% промокод для владельца приложения (безлимитный)
insert into promo_codes (code, discount_percent, plan, uses_left)
values ('PLIX2026', 100, 'yearly', -1)
on conflict (code) do nothing;

-- Промокод для тестирования (10 использований)
insert into promo_codes (code, discount_percent, plan, uses_left)
values ('PLIXTEST', 100, 'monthly', 10)
on conflict (code) do nothing;
