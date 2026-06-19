# KARINA Mini App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Telegram Mini App KARINA Media (шоурум ниш → шаблон «твой мини-апп» → заявка), который предприниматель проходит и примеряет на себя.

**Architecture:** Статический мини-апп в `bot-vercel/public/app/` (открывается через Telegram WebApp SDK), заявка летит на serverless endpoint `bot-vercel/api/lead.js` → тот же Supabase (`bot_leads`, type `miniapp`) + уведомление в группу. Меню-кнопка бота открывает мини-апп. Чат-воронка остаётся fallback.

**Tech Stack:** Vanilla HTML/CSS/JS, Telegram WebApp SDK, Vercel serverless (Node ESM), @supabase/supabase-js (уже зависимость), crypto (валидация initData).

**Верификация:** unit-тестов в проекте нет и не заводим. Проверка каждой задачи: деплой `vercel --prod` + открыть мини-апп в Telegram (@karina_media_bot) + curl по endpoint. Имена файлов латиницей.

---

### Task 1: Скелет мини-аппа + Telegram SDK + роутер экранов

**Files:**
- Create: `sales-kit/bot-vercel/public/app/index.html`
- Create: `sales-kit/bot-vercel/public/app/styles.css`
- Create: `sales-kit/bot-vercel/public/app/app.js`

- [ ] **Step 1: index.html (подключает SDK, 3 контейнера-экрана)**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>KARINA Media</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="hd">
    <div class="hd-t">KARINA Media</div>
    <div class="hd-s" id="hdSub">Мини-аппы и сайты для бизнеса</div>
  </header>
  <main id="app"></main>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: styles.css (премиум-тема, без эмодзи/иконок)**

```css
:root{--grad:linear-gradient(135deg,#6d5efc,#9b5cf0);--accent:#6d5efc;--bg:#f5f6fb;--card:#fff;--line:#e8eaf1;--ink:#2a2d36;--mut:#8a8f9c}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink)}
.hd{background:var(--grad);color:#fff;padding:18px 16px}
.hd-t{font-size:18px;font-weight:700}
.hd-s{font-size:12px;opacity:.9;margin-top:2px}
main{padding:14px;display:flex;flex-direction:column;gap:12px;max-width:560px;margin:0 auto}
.lbl{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut);font-weight:700}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tile{position:relative;height:108px;border-radius:14px;overflow:hidden;display:flex;align-items:flex-end;cursor:pointer}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tile .ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,16,40,.74),rgba(20,16,40,.05))}
.tile .nm{position:relative;color:#fff;font-size:14px;font-weight:700;padding:10px 12px;z-index:1}
.cta{background:var(--grad);color:#fff;border:0;border-radius:14px;text-align:center;font-size:15px;font-weight:700;padding:15px;width:100%;cursor:pointer}
.cta.ghost{background:#fff;color:var(--accent);border:1px solid var(--line)}
.prod{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.prod .img{height:84px;overflow:hidden}
.prod .img img{width:100%;height:100%;object-fit:cover}
.prod .pb{padding:9px 10px}
.prod .nm{font-size:13px;font-weight:700}
.prod .pr{font-size:12px;color:var(--accent);font-weight:700;margin-top:2px}
.book{position:relative;height:74px;border-radius:14px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.book img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.book .ov{position:absolute;inset:0;background:rgba(20,16,40,.45)}
.book span{position:relative;color:#fff;font-weight:700;z-index:1}
.fld{width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:13px;font-size:15px;color:var(--ink)}
.fld::placeholder{color:var(--mut)}
.ok{text-align:center;padding:30px 10px}
.ok h2{font-size:20px;margin:0 0 8px}
.sticky{position:sticky;bottom:10px}
```

- [ ] **Step 3: app.js (инициализация Telegram + роутер экранов)**

```js
const tg = window.Telegram?.WebApp;
tg?.ready(); tg?.expand();
const app = document.getElementById("app");
const sub = document.getElementById("hdSub");
const state = { niche: null };

function go(screen){ window.scrollTo(0,0); screen(); }
function el(html){ const d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstElementChild; }

// экраны подключаются в следующих задачах
go(()=>{ app.innerHTML = '<p class="lbl">Загрузка…</p>'; });
window.__screens = {};
```

- [ ] **Step 4: Деплой и проверка, что мини-апп отдаётся**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
curl -s -o /dev/null -w "%{http_code}\n" "https://bot-vercel-five.vercel.app/app/"
```
Expected: `Deployment ... ready.` и `200`.

- [ ] **Step 5: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/public/app/
git commit -m "[agent] feat: скелет мини-аппа KARINA + Telegram SDK"
```

---

### Task 2: Luxury-фото ниш + экран «Шоурум»

**Files:**
- Create: `sales-kit/bot-vercel/public/app/img/` (4 фото ниш + 1 фон записи)
- Modify: `sales-kit/bot-vercel/public/app/app.js`

- [ ] **Step 1: Скачать curated luxury-фото (free Unsplash) в img/**

Команды (Unsplash CDN, free-лицензия, оптимизированный размер). После скачивания ОТКРЫТЬ каждый файл и убедиться, что это премиальное тематическое фото; если фото не подходит — заменить URL на другое с unsplash.com по тому же запросу.

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel/public/app && mkdir -p img
curl -sL "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=70" -o img/beauty.jpg
curl -sL "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=70" -o img/shop.jpg
curl -sL "https://images.unsplash.com/photo-1606986628253-05620e9b0f43?auto=format&fit=crop&w=600&q=70" -o img/services.jpg
curl -sL "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=70" -o img/education.jpg
curl -sL "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=70" -o img/booking.jpg
for f in img/*.jpg; do test -s "$f" && echo "ok $f" || echo "EMPTY $f — заменить URL"; done
```
Expected: 5 строк `ok img/...`. Любой `EMPTY` — заменить URL и перекачать.

- [ ] **Step 2: Данные ниш + рендер шоурума в app.js**

Добавить в `app.js` (перед `go(...)`):

```js
const NICHES = [
  { key:"beauty",    name:"Бьюти",    img:"img/beauty.jpg",    demo:"https://drelima-miniapp.vercel.app" },
  { key:"shop",      name:"Магазин",  img:"img/shop.jpg",      demo:"https://nura-store-liard.vercel.app" },
  { key:"services",  name:"Услуги",   img:"img/services.jpg",  demo:"https://app-ivory-five-19.vercel.app" },
  { key:"education", name:"Обучение", img:"img/education.jpg", demo:"https://agenio-website.vercel.app/miniapp.html" },
];

function openDemo(url){ tg?.openLink ? tg.openLink(url) : window.open(url,"_blank"); }

window.__screens.showroom = function(){
  sub.textContent = "Мини-аппы и сайты для бизнеса";
  tg?.BackButton?.hide();
  const tiles = NICHES.map(n =>
    `<div class="tile" data-key="${n.key}"><img src="${n.img}" alt=""><div class="ov"></div><div class="nm">${n.name}</div></div>`
  ).join("");
  app.innerHTML = `
    <p class="lbl">Выбери свою сферу — покажу живой пример</p>
    <div class="grid2">${tiles}</div>
    <button class="cta sticky" id="wantBtn">Хочу себе такой</button>`;
  app.querySelectorAll(".tile").forEach(t => t.onclick = () => {
    const n = NICHES.find(x => x.key === t.dataset.key);
    state.niche = n.name;
    openDemo(n.demo);
    go(window.__screens.template);
  });
  document.getElementById("wantBtn").onclick = () => go(window.__screens.lead);
};
```

- [ ] **Step 3: Стартовать с шоурума**

Заменить заглушку `go(()=>{ app.innerHTML = ... });` на:

```js
go(window.__screens.showroom);
```

- [ ] **Step 4: Деплой + живой просмотр**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```
Затем открыть `https://bot-vercel-five.vercel.app/app/` в браузере: 4 плитки на фото, тап по плитке открывает демо. Expected: фото грузятся, плитки кликаются.

- [ ] **Step 5: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/public/app/
git commit -m "[agent] feat: мини-апп — шоурум ниш на luxury-фото"
```

---

### Task 3: Экран «Твой будущий мини-апп» (шаблon)

**Files:**
- Modify: `sales-kit/bot-vercel/public/app/app.js`

- [ ] **Step 1: Рендер шаблона**

Добавить в `app.js`:

```js
window.__screens.template = function(){
  sub.textContent = state.niche ? `Пример: ${state.niche}` : "Так это будет у тебя";
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(window.__screens.showroom));
  app.innerHTML = `
    <p class="lbl">Каталог / услуги</p>
    <div class="grid2">
      <div class="prod"><div class="img"><img src="img/beauty.jpg" alt=""></div><div class="pb"><div class="nm">Услуга 1</div><div class="pr">от 10 000 ₸</div></div></div>
      <div class="prod"><div class="img"><img src="img/services.jpg" alt=""></div><div class="pb"><div class="nm">Услуга 2</div><div class="pr">от 15 000 ₸</div></div></div>
    </div>
    <div class="book"><img src="img/booking.jpg" alt=""><div class="ov"></div><span>Записаться · выбрать время</span></div>
    <button class="cta sticky" id="mineBtn">Сделать такой мне</button>`;
  document.getElementById("mineBtn").onclick = () => go(window.__screens.lead);
};
```

- [ ] **Step 2: Деплой + просмотр**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```
Открыть мини-апп, тап по нише → виден шаблон (каталог + блок записи + кнопка «Сделать такой мне»), кнопка «Назад» возвращает в шоурум. Expected: переходы работают.

- [ ] **Step 3: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/public/app/app.js
git commit -m "[agent] feat: мини-апп — шаблон «твой будущий мини-апп»"
```

---

### Task 4: Экран «Заявка» + авто-подстановка из Telegram

**Files:**
- Modify: `sales-kit/bot-vercel/public/app/app.js`

- [ ] **Step 1: Рендер формы с авто-подстановкой имени/username и кнопкой телефона**

Добавить в `app.js`:

```js
window.__screens.lead = function(){
  sub.textContent = "Оставить заявку";
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(window.__screens.showroom));
  const u = tg?.initDataUnsafe?.user || {};
  const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
  app.innerHTML = `
    <div class="ok" style="padding:10px 0"><h2 style="font-size:18px">Соберём за 5 дней</h2></div>
    <p class="lbl">Имя</p>
    <input class="fld" id="fName" placeholder="Ваше имя" value="${fullName}">
    <p class="lbl">Телефон / WhatsApp</p>
    <input class="fld" id="fPhone" placeholder="+7 …" inputmode="tel">
    <button class="cta ghost" id="pullPhone" style="margin-top:8px">Подтянуть телефон из Telegram</button>
    <p class="lbl">Сфера</p>
    <input class="fld" id="fNiche" placeholder="Например: салон красоты" value="${state.niche||""}">
    <button class="cta sticky" id="sendBtn" style="margin-top:12px">Отправить заявку</button>`;

  // Телефон одним тапом (Bot API 6.9+). Если SDK не вернёт номер в WebApp — поле остаётся ручным.
  document.getElementById("pullPhone").onclick = () => {
    if(!tg?.requestContact){ tg?.showAlert?.("Введите номер вручную"); return; }
    tg.requestContact((ok, res) => {
      const phone = res?.responseUnsafe?.contact?.phone_number || res?.contact?.phone_number;
      if(ok && phone){ document.getElementById("fPhone").value = phone; }
      else { tg?.showAlert?.("Не получилось — введите номер вручную"); }
    });
  };

  document.getElementById("sendBtn").onclick = submitLead;
};
```

- [ ] **Step 2: Деплой + просмотр (без отправки — submitLead в Task 6)**

Добавить временную заглушку в `app.js`, чтобы не было ошибки до Task 6:

```js
async function submitLead(){ tg?.showAlert?.("Отправка появится после подключения бэкенда"); }
```

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```
Открыть мини-апп → дойти до заявки: имя подставлено из Telegram, поле ниши заполнено из выбранной ниши, кнопка «Подтянуть телефон» вызывает диалог Telegram. Expected: автоподстановка имени видна.

- [ ] **Step 3: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/public/app/app.js
git commit -m "[agent] feat: мини-апп — форма заявки с авто-подстановкой из Telegram"
```

---

### Task 5: Backend endpoint `api/lead.js`

**Files:**
- Create: `sales-kit/bot-vercel/api/lead.js`

- [ ] **Step 1: Endpoint с валидацией initData, записью в Supabase, уведомлением в группу**

```js
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TOKEN = process.env.BOT_TOKEN;
const OWNER = process.env.OWNER_CHAT_ID;

function validInitData(initData) {
  if (!initData) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  p.delete("hash");
  const dcs = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(TOKEN).digest();
  const calc = crypto.createHmac("sha256", secret).update(dcs).digest("hex");
  if (calc !== hash) return null;
  try { return JSON.parse(p.get("user") || "{}"); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const { name, phone, niche, initData } = req.body || {};
  const user = validInitData(initData);
  if (!user) return res.status(401).json({ ok: false, error: "bad initData" });

  const tg_user = user.username ? "@" + user.username : (user.first_name || null);
  try {
    await sb.from("bot_leads").insert({
      type: "miniapp", niche: niche || null,
      name: name || user.first_name || null, phone: phone || null,
      tg_user, tg_id: user.id || null,
    });
  } catch (e) { console.error("lead insert:", e.message); }

  if (OWNER) {
    const text = `🔥 <b>Новая заявка из мини-аппа!</b>\n\n🏢 Ниша: ${niche || "—"}\n👤 Имя: ${name || user.first_name || "—"}\n📱 Телефон: ${phone || "—"}\n💬 Контакт: ${tg_user || "—"}`;
    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: OWNER, text, parse_mode: "HTML" }),
      });
    } catch (e) { console.error("notify:", e.message); }
  }
  res.status(200).json({ ok: true });
}
```

- [ ] **Step 2: Деплой**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```

- [ ] **Step 3: Проверка, что endpoint жив и отбивает невалидный initData**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST "https://bot-vercel-five.vercel.app/api/lead" -H 'content-type: application/json' -d '{"name":"x","initData":"bad"}'
```
Expected: `401` (подпись не прошла — защита работает).

- [ ] **Step 4: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/api/lead.js
git commit -m "[agent] feat: api/lead — приём заявок из мини-аппа (Supabase + группа)"
```

---

### Task 6: Подключить отправку формы → endpoint

**Files:**
- Modify: `sales-kit/bot-vercel/public/app/app.js`

- [ ] **Step 1: Заменить заглушку submitLead на реальную отправку**

Заменить функцию-заглушку из Task 4 Step 2 на:

```js
async function submitLead(){
  const name = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const niche = document.getElementById("fNiche").value.trim();
  if(!name || !phone){ tg?.showAlert?.("Заполните имя и телефон"); return; }
  const btn = document.getElementById("sendBtn"); btn.disabled = true; btn.textContent = "Отправляю…";
  try{
    const r = await fetch("/api/lead", {
      method:"POST", headers:{"content-type":"application/json"},
      body: JSON.stringify({ name, phone, niche, initData: tg?.initData || "" })
    });
    const j = await r.json();
    if(j.ok){
      app.innerHTML = `<div class="ok"><h2>Заявка принята</h2><p>Еркин свяжется с вами лично сегодня вечером. Место и условия придержим.</p><button class="cta" id="backBtn">В начало</button></div>`;
      document.getElementById("backBtn").onclick = () => go(window.__screens.showroom);
    } else { throw new Error(j.error||"fail"); }
  }catch(e){ tg?.showAlert?.("Не отправилось, попробуйте ещё раз"); btn.disabled=false; btn.textContent="Отправить заявку"; }
}
```

- [ ] **Step 2: Деплой + живой тест отправки**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```
В Telegram открыть мини-апп → заявка → отправить. Expected: экран «Заявка принята», в группе «Заявки KARINA Media» приходит «🔥 Новая заявка из мини-аппа!», в Supabase `bot_leads` строка с `type=miniapp`.

- [ ] **Step 3: Проверить запись в Supabase**

Через Supabase: `select type,name,phone,niche,tg_user from bot_leads where type='miniapp' order by created_at desc limit 3;`
Expected: видна свежая заявка.

- [ ] **Step 4: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/public/app/app.js
git commit -m "[agent] feat: мини-апп — отправка заявки в бэкенд"
```

---

### Task 7: Вход в мини-апп из бота (меню-кнопка + инлайн-кнопка)

**Files:**
- Modify: `sales-kit/bot-vercel/api/bot.js` (приветствие)
- Команда Bot API (меню-кнопка)

- [ ] **Step 1: Меню-кнопка бота → мини-апп**

```bash
TOKEN=$(grep '^BOT_TOKEN=' /Users/yerkink/Karina-Media/sales-kit/bot/.env | cut -d= -f2-)
curl -s "https://api.telegram.org/bot$TOKEN/setChatMenuButton" -H 'content-type: application/json' \
  -d '{"menu_button":{"type":"web_app","text":"Открыть мини-апп","web_app":{"url":"https://bot-vercel-five.vercel.app/app/"}}}'
```
Expected: `{"ok":true,"result":true}`

- [ ] **Step 2: Инлайн-кнопка в приветствии `/start`**

В `api/bot.js`, функция `mainMenu()` — добавить web_app-кнопку первой строкой. Найти:

```js
function mainMenu() {
  return new InlineKeyboard()
    .text("🎬 Показать работы под вашу сферу", "demo").row()
```

Заменить на:

```js
function mainMenu() {
  return new InlineKeyboard()
    .webApp("Открыть мини-апп KARINA", "https://bot-vercel-five.vercel.app/app/").row()
    .text("🎬 Показать работы под вашу сферу", "demo").row()
```

- [ ] **Step 3: Деплой**

```bash
cd /Users/yerkink/Karina-Media/sales-kit/bot-vercel && vercel --prod --yes 2>&1 | grep -E 'Deployment .* ready'
```

- [ ] **Step 4: Живой тест входа**

В Telegram: у бота слева кнопка «Открыть мини-апп» открывает мини-апп; `/start` показывает инлайн-кнопку «Открыть мини-апп KARINA», она тоже открывает. Expected: оба входа работают.

- [ ] **Step 5: Коммит**

```bash
cd /Users/yerkink/Karina-Media
git add sales-kit/bot-vercel/api/bot.js
git commit -m "[agent] feat: бот — вход в мини-апп (меню-кнопка + инлайн)"
```

---

### Task 8: Финальная сквозная проверка

**Files:** нет (приёмка)

- [ ] **Step 1: Полный путь на телефоне**

В Telegram на телефоне: открыть мини-апп → шоурум (фото грузятся) → тап ниши открывает реальный демо → вернуться → шаблон → «Сделать такой мне» → заявка (имя подставлено, телефон одним тапом) → отправить.
Expected: проходится без багов, заявка падает в группу + Supabase (`type=miniapp`).

- [ ] **Step 2: Проверить, что чат-воронка (fallback) цела**

В Telegram: `/start` → «Оставить заявку» проходит как раньше. Expected: старый поток работает.
