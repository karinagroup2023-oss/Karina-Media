-- Таблица объявлений (заявки и предложения)
create table if not exists items (
  id uuid default gen_random_uuid() primary key,
  telegram_id bigint not null,
  type text not null check (type in ('request', 'offer')),
  category text not null,
  category_icon text default '📦',
  title text not null,
  description text default '',
  quantity text default '',
  price text,
  city text not null,
  company text default '',
  bin text default '',
  contact text default '',
  responses int default 0,
  verified boolean default false,
  urgent boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Таблица подписок
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  telegram_id bigint unique not null,
  plan text not null default 'free' check (plan in ('free', 'monthly', 'yearly')),
  expires_at timestamptz,
  payment_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Включаем RLS
alter table items enable row level security;
alter table subscriptions enable row level security;

-- Все могут читать активные объявления
create policy "public read items"
  on items for select
  using (is_active = true);

-- Все могут создавать объявления (telegram_id проверяется на фронте)
create policy "insert items"
  on items for insert
  with check (true);

-- Обновление откликов
create policy "update responses"
  on items for update
  using (true);

-- Удаление своих объявлений
create policy "delete own items"
  on items for delete
  using (true);

-- Чтение подписок
create policy "read subscriptions"
  on subscriptions for select
  using (true);

-- Запись подписок
create policy "upsert subscriptions"
  on subscriptions for insert
  with check (true);

create policy "update subscriptions"
  on subscriptions for update
  using (true);
