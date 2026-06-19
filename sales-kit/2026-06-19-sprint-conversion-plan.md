# Sprint Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять конверсию воронки кассового спринта — бот ловит импульс днём и держит лида тёплым до вечера, когда Еркин дожимает.

**Architecture:** 3 точечные правки webhook-бота (grammy, Vercel) в `bot-vercel/api/bot.js` + 2 памятки-документа. Бот уже на проде (`bot-vercel-five.vercel.app/api/bot`), env и деплой настроены.

**Tech Stack:** Node.js, grammy, Supabase (bot_sessions/bot_leads/bot_users), Vercel CLI (`vercel --prod --yes`).

**Верификация:** тест-фреймворка в проекте нет и не заводим (3 правки UX/копирайта — не повод). Проверка: передеплой → живой клик-через в Telegram (@karina_media_bot) → заявка падает в группу «Заявки KARINA Media» с верным текстом + curl POST `/api/bot` = 200.

---

### Task 1: Авто-ответ-ожидание (держим импульс до вечера)

**Files:**
- Modify: `sales-kit/bot-vercel/api/bot.js` (финальные реплики после заявки и после записи на созвон)

- [ ] **Step 1: Заменить финал заявки (lead_phone)**

Найти в `bot.on("message:text", ...)`, case `"lead_phone"`, строку ответа:

```js
      return ctx.reply(`Спасибо, ${name}! 🙌 Заявка принята.\n\nСвяжусь с вами в ближайшее время, покажу демо под вашу нишу и обсудим детали.`, { reply_markup: toMenu() });
```

Заменить на:

```js
      return ctx.reply(`Спасибо, ${name}! 🙌 Заявка принята.\n\nЕркин свяжется с вами лично сегодня вечером — покажет пример под вашу нишу и обсудит детали. Место и условия придержим.`, { reply_markup: toMenu() });
```

- [ ] **Step 2: Заменить финал созвона (call_time)**

Найти case `"call_time"`, строку:

```js
      return ctx.reply(`Готово, ${name}! 📞 Спишемся в указанное время.`, { reply_markup: toMenu() });
```

Заменить на:

```js
      return ctx.reply(`Готово, ${name}! 📞 Еркин лично спишется с вами в указанное время.`, { reply_markup: toMenu() });
```

- [ ] **Step 3: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/api/bot.js
git commit -m "[agent] feat: бот — авто-ответ с ожиданием вечернего созвона"
```

---

### Task 2: Нудж на контакт для «посмотрел и завис»

Те, кто открыл демо/цены, но не нажал «Оставить заявку», должны иметь лёгкий путь оставить контакт. Добавляем кнопку «💬 Скинуть контакт» (спрашивает только телефон/ник) — порог ниже полного опросника.

**Files:**
- Modify: `sales-kit/bot-vercel/api/bot.js` (клавиатуры afterDemo/backMenu, новый callback, новый case в FSM)

- [ ] **Step 1: Добавить кнопку в клавиатуры afterDemo и backMenu**

Найти:

```js
const afterDemo = () => new InlineKeyboard().text("📝 Оставить заявку", "lead").row().text("🎬 Другая сфера", "demo").text("⬅️ Меню", "back");
const backMenu = () => new InlineKeyboard().text("📝 Оставить заявку", "lead").text("⬅️ Меню", "back");
```

Заменить на:

```js
const afterDemo = () => new InlineKeyboard().text("📝 Оставить заявку", "lead").row().text("💬 Скинуть контакт", "quickcontact").row().text("🎬 Другая сфера", "demo").text("⬅️ Меню", "back");
const backMenu = () => new InlineKeyboard().text("📝 Оставить заявку", "lead").row().text("💬 Скинуть контакт", "quickcontact").row().text("⬅️ Меню", "back");
```

- [ ] **Step 2: Добавить обработчик callback `quickcontact`**

Сразу после обработчика `bot.callbackQuery("call", ...)` (перед `bot.on("message:text", ...)`) добавить:

```js
// --- Быстрый контакт (для тех, кто посмотрел и завис) ---
bot.callbackQuery("quickcontact", async (ctx) => {
  ctx.session.step = "quick_phone"; ctx.session.data = { type: "quick" };
  await ctx.answerCallbackQuery();
  await ctx.reply("Скинь телефон (WhatsApp) или @ник — Еркин вечером лично пришлёт пример под твою нишу. Без спама.");
});
```

- [ ] **Step 3: Добавить case `quick_phone` в FSM по тексту**

В `bot.on("message:text", ...)`, в `switch (s.step)`, перед `default:` добавить:

```js
    case "quick_phone": {
      s.data.phone = text; s.step = "idle";
      await saveLead(ctx, s.data); s.data = {};
      return ctx.reply("Принял 🙌 Еркин свяжется лично сегодня вечером и пришлёт пример под твою нишу.", { reply_markup: toMenu() });
    }
```

(`saveLead` уже умеет writing с `product/niche/urgency = null` — отдельная схема не нужна.)

- [ ] **Step 4: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/api/bot.js
git commit -m "[agent] feat: бот — быстрый захват контакта после демо/цен"
```

---

### Task 3: 🔥-приоритет срочных заявок в группе

Чтобы вечером сразу видеть, кого дожимать первым.

**Files:**
- Modify: `sales-kit/bot-vercel/api/bot.js` (функция `saveLead`, формирование уведомления владельцу)

- [ ] **Step 1: Добавить признак срочности и тип «контакт» в заголовок**

Найти в `saveLead` блок формирования `text` для владельца:

```js
    const text = `🔥 <b>Новая ${d.type === "call" ? "запись на созвон" : "заявка"}!</b>

🎯 Продукт: ${d.product || "—"}
🏢 Ниша: ${d.niche || "—"}
⏱ Срочность: ${d.urgency || "—"}
👤 Имя: ${d.name || "—"}
📱 Телефон: ${d.phone || "—"}
${d.time ? "🕐 Удобное время: " + d.time + "\n" : ""}💬 Контакт: ${tg_user || "—"}`;
```

Заменить на:

```js
    const hot = d.urgency === "Срочно";
    const kind = d.type === "call" ? "запись на созвон" : d.type === "quick" ? "контакт" : "заявка";
    const text = `${hot ? "🔥🔥 СРОЧНО — " : "🔥 "}<b>Новая ${kind}!</b>

🎯 Продукт: ${d.product || "—"}
🏢 Ниша: ${d.niche || "—"}
⏱ Срочность: ${d.urgency || "—"}
👤 Имя: ${d.name || "—"}
📱 Телефон: ${d.phone || "—"}
${d.time ? "🕐 Удобное время: " + d.time + "\n" : ""}💬 Контакт: ${tg_user || "—"}`;
```

- [ ] **Step 2: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/api/bot.js
git commit -m "[agent] feat: бот — приоритет срочных заявок в уведомлении"
```

---

### Task 4: Деплой и живая проверка бота

**Files:** нет (деплой + ручная проверка)

- [ ] **Step 1: Передеплой на прод**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```
Expected: строка `Deployment ... ready.`

- [ ] **Step 2: Проверить доступность вебхука**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST "https://bot-vercel-five.vercel.app/api/bot" -H 'content-type: application/json' -d '{}'
```
Expected: `200`

- [ ] **Step 3: Живой клик-через в Telegram**

Вручную в @karina_media_bot: `/start` → «Показать работы» → выбрать нишу → нажать «💬 Скинуть контакт» → отправить телефон.
Expected: ответ «Принял 🙌 ... сегодня вечером», и в группе «Заявки KARINA Media» приходит уведомление с заголовком «🔥 Новая контакт!».

- [ ] **Step 4: Проверить срочную заявку**

Вручную: `/start` → «Оставить заявку» → пройти опрос, на шаге срочности выбрать «🔥 Срочно».
Expected: в группе заголовок «🔥🔥 СРОЧНО — Новая заявка!», финал в чате — «Еркин свяжется лично сегодня вечером ... Место и условия придержим.»

---

### Task 5: Памятка «вечерний дожим»

**Files:**
- Create: `sales-kit/evening-followup.md`

- [ ] **Step 1: Создать памятку**

Содержимое:

```markdown
# Вечерний дожим (1-2 часа)

> Дневную «скорость» делает бот. Твой вечерний час — только закрытие. Ничего не ищешь: всё в группе «Заявки KARINA Media», отсортировано по горячести.

## Порядок сессии
1. Открой группу заявок. Сначала — «🔥🔥 СРОЧНО», потом «🔥 заявка/контакт».
2. По каждому горячему: голосовое под нишу (заготовки ниже) → пример под его дело → договорись на созвон/закрой.
3. Закрытие — по `call-offer-script.md` (быстрый вход + Kaspi).
4. Остаток времени — follow-up (текст D из whatsapp-hooks.md) по вчерашним, кто завис.

## Заготовки голосовых под нишу (подставлять реальное)
- Бьюти/салон: «Привет! Видел, [ниша]. Скинул бы пример: у косметологии DrElima запись и услуги прямо в Telegram, клиент бронирует сам ночью. Под твой салон так же ляжет — за пару минут покажу?»
- Магазин/товары: «Привет! У тебя магазин в Instagram — клиент в директе остывает, пока ответишь. Пример GlowSeoul: каталог с ценами и заказ прямо в Telegram. Скинуть, как под твой ассортимент?»
- Услуги/эксперт: «Привет! Под услуги делал мини-апп фотографу — портфолио + онлайн-запись в Telegram. Под твоё дело покажу за пару минут?»
- Образование: «Привет! Для центра Agenio собрал мини-апп: программы, запись на занятия, заявки. Под твои курсы так же. Глянешь пример?»

## Правило
Скорость > красота. Лучше короткое живое голосовое сегодня вечером, чем идеальный текст через два дня.
```

- [ ] **Step 2: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/evening-followup.md
git commit -m "[agent] docs: памятка вечернего дожима"
```

---

### Task 6: Шаблон сегментации базы

**Files:**
- Create: `sales-kit/base-segments.md`

- [ ] **Step 1: Создать шаблон**

Содержимое:

```markdown
# Сегментация базы (заполнить 1 раз, ~1 час)

> Один правильный текст не тем людям = слив. Разложи контакты на 3 списка, под каждый — свой угол.

## Список 1: Горячие — знаю лично + точно льют рекламу
Угол: «не сливай рекламный бюджет» (текст C → потом A). Дожимать первыми.

| Имя | Ниша | Контакт | Льёт рекламу? | Статус |
|-----|------|---------|---------------|--------|
|     |      |         |               |        |

## Список 2: Тёплые без рекламы (сарафан/оффлайн)
Угол: НЕ «не сливай бюджет», а «лови заявки 24/7 без переписки, не теряй тех, кто пишет ночью».

| Имя | Ниша | Контакт | Статус |
|-----|------|---------|--------|
|     |      |         |        |

## Список 3: Чаты
Пост A (услуги) или B (магазины). Правило: 1 пост в чат раз в 2-3 дня, чередуя. Не выжигать.

| Чат | Тема/ниша | Дата поста | Текст (A/B) |
|-----|-----------|------------|-------------|
|     |           |            |             |

## Дисциплина
- Списки 1-2: адресно, по одному, отклик обрабатывать в тот же вечер.
- Список 3: массово, но аккуратно — это комьюнити, где ты ещё работать.
```

- [ ] **Step 2: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/base-segments.md
git commit -m "[agent] docs: шаблон сегментации базы"
```
