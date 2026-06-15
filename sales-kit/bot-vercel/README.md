# KARINA Media — бот-воронка (Vercel webhook)

Serverless-версия бота для бесплатного хостинга 24/7 на Vercel.
Состояние диалога и заявки хранятся в Supabase (таблицы `bot_sessions`, `bot_leads`).

## Переменные окружения (Vercel)

- `BOT_TOKEN` — токен от @BotFather
- `OWNER_CHAT_ID` — chat_id группы заявок
- `SUPABASE_URL` — URL проекта Supabase
- `SUPABASE_KEY` — anon key Supabase

## Деплой

```bash
vercel --prod
```

После деплоя установить webhook:
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<deployment>.vercel.app/api/bot"
```

## Перенос на VPS

Для VPS используйте long-polling версию из соседней папки `../bot` (проще, без webhook).

---
Сделано в KARINA Media · https://wa.me/77066567765
