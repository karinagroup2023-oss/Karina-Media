-- Таблица откликов на объявления
create table if not exists responses (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references items(id) on delete cascade,
  item_owner_telegram_id bigint not null,
  responder_telegram_id bigint not null,
  responder_name text not null,
  responder_phone text not null,
  message text default '',
  price text,
  created_at timestamptz default now()
);

alter table responses enable row level security;

create policy "read responses" on responses for select using (true);
create policy "insert responses" on responses for insert with check (true);
