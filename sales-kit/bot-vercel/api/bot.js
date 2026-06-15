import { Bot, InlineKeyboard, session, webhookCallback } from "grammy";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const bot = new Bot(process.env.BOT_TOKEN);
const OWNER = process.env.OWNER_CHAT_ID;
const BASE = process.env.PUBLIC_BASE || "https://bot-vercel-five.vercel.app";
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- Session storage в Supabase ---
const storage = {
  async read(key) {
    const { data } = await sb.from("bot_sessions").select("value").eq("key", key).maybeSingle();
    return data?.value ?? undefined;
  },
  async write(key, value) {
    await sb.from("bot_sessions").upsert({ key, value, updated_at: new Date().toISOString() });
  },
  async delete(key) {
    await sb.from("bot_sessions").delete().eq("key", key);
  },
};

const shot = (img) => `${BASE}/shots/${img}?v=3`;

// --- Работы по нишам ---
const NICHES = {
  beauty: {
    label: "💅 Бьюти / салон",
    works: [
      { name: "DrElima «Код Роскоши» — мини-апп", desc: "Запись, бонусы, карта кожи, услуги — прямо в Telegram.", img: "drelima-miniapp.png", url: "https://drelima-miniapp.vercel.app", kind: "мини-апп" },
      { name: "Velvet Studio — сайт салона", desc: "Услуги, мастера, прозрачные цены, онлайн-запись.", img: "velvet-studio.png", url: "https://velvet-studio-eight.vercel.app", kind: "сайт" },
    ],
  },
  shop: {
    label: "🛍 Магазин / товары",
    works: [
      { name: "NURA — магазин одежды", desc: "Каталог, категории, заказ. Премиальная подача.", img: "nura-store.png", url: "https://nura-store-liard.vercel.app", kind: "сайт" },
      { name: "GlowSeoul — корейская косметика", desc: "Каталог, бренды, заказ через WhatsApp.", img: "glowseoul.png", url: "https://glowseoul-ruby.vercel.app", kind: "сайт" },
    ],
  },
  services: {
    label: "📸 Услуги / эксперт",
    works: [
      { name: "Mobilograf — мини-апп фотографа", desc: "Портфолио, услуги, онлайн-запись на съёмку.", img: "mobilograf.png", url: "https://app-ivory-five-19.vercel.app", kind: "мини-апп" },
      { name: "Сымбат — налоговый консультант", desc: "Двуязычный лендинг услуг с формой обращения.", img: "symbat.png", url: "https://symbat-website.vercel.app", kind: "сайт" },
    ],
  },
  education: {
    label: "🎓 Образование",
    works: [
      { name: "Академия Гениев — мини-апп", desc: "Курсы, направления, рейтинг, запись — прямо в Telegram.", img: "agenio-miniapp.png", url: "https://agenio-website.vercel.app/miniapp.html", kind: "мини-апп" },
      { name: "Agenio — сайт центра", desc: "Программы, запись на занятия, заявки в WhatsApp.", img: "agenio.png", url: "https://agenio-website.vercel.app", kind: "сайт" },
      { name: "StudyMe — образование за рубежом", desc: "Программы, страны, заявка на консультацию.", img: "studyme.png", url: "https://studyme-self.vercel.app", kind: "сайт" },
    ],
  },
  construction: {
    label: "🏗 Стройка / B2B",
    works: [
      { name: "Plix — заявки по стройматериалам", desc: "Мини-апп заявок и предложений с категориями.", img: "plix.png", url: "https://plix-miniapp.vercel.app", kind: "мини-апп" },
    ],
  },
  other: {
    label: "🤖 Другое / моей ниши нет",
    intro: "Вашей сферы пока нет в примерах — не страшно. Сделаем под вас с нуля, а пока вот несколько разных работ:",
    works: [
      { name: "DrElima — мини-апп", desc: "Telegram мини-апп приёма заявок.", img: "drelima-miniapp.png", url: "https://drelima-miniapp.vercel.app", kind: "мини-апп" },
      { name: "NURA — магазин", desc: "Сайт-магазин с каталогом.", img: "nura-store.png", url: "https://nura-store-liard.vercel.app", kind: "сайт" },
      { name: "Сымбат — лендинг услуг", desc: "Двуязычный лендинг с формой заявки.", img: "symbat.png", url: "https://symbat-website.vercel.app", kind: "сайт" },
    ],
  },
};

const PRODUCTS = { product_miniapp: "Мини-апп", product_site: "Сайт", product_bot: "Бот", product_unknown: "Пока не знаю" };
const URGENCY = { urgency_now: "Срочно", urgency_month: "2-4 недели", urgency_interest: "Просто интересуюсь" };

const WELCOME = `<b>KARINA Media</b> — мини-аппы и сайты для бизнеса 🚀

Делаем <b>Telegram мини-аппы и сайты приёма заявок</b> под ключ за 5 дней. Клиенты оставляют заявки и записываются 24/7 — без менеджера, заявка сразу у вас.

Выберите 👇`;

const PRICES = `💰 <b>Цены</b>

🟢 <b>Старт — 250 000 ₸</b> · запуск за 3 дня
Бот приёма заявок: меню, услуги/каталог, форма заявки, уведомления, кнопка WhatsApp.

⭐️ <b>Бизнес — 490 000 ₸</b> · запуск за 5 дней <i>(хит)</i>
Мини-апп: каталог с фото и ценами, корзина/заявка, админка, интеграция WhatsApp/Kaspi, база клиентов.

💎 <b>Премиум — 900 000 ₸</b> · 7–10 дней
Всё из «Бизнес» + продающий лендинг + автоворонка + настройка приёма оплаты.

🛡 Гарантия: <b>не запущу за 5 дней — верну предоплату.</b>
Оплата 100% сегодня — <b>скидка 15%</b>. Принимаем на Kaspi / счёт ИП.`;

// --- Клавиатуры ---
function mainMenu() {
  return new InlineKeyboard()
    .text("🎬 Показать работы под вашу сферу", "demo").row()
    .text("💰 Цены", "prices").text("📝 Оставить заявку", "lead").row()
    .text("📞 Записаться на созвон", "call");
}
function nicheMenu() {
  const kb = new InlineKeyboard();
  for (const [key, n] of Object.entries(NICHES)) kb.text(n.label, "niche_" + key).row();
  kb.text("⬅️ Назад", "back");
  return kb;
}
const afterDemo = () => new InlineKeyboard().text("📝 Оставить заявку", "lead").row().text("🎬 Другая сфера", "demo").text("⬅️ Меню", "back");
const backMenu = () => new InlineKeyboard().text("📝 Оставить заявку", "lead").text("⬅️ Меню", "back");
const toMenu = () => new InlineKeyboard().text("⬅️ В меню", "back");
function productMenu() {
  return new InlineKeyboard()
    .text("📱 Мини-апп", "product_miniapp").text("🌐 Сайт", "product_site").row()
    .text("🤖 Бот", "product_bot").text("🤔 Пока не знаю", "product_unknown");
}
function urgencyMenu() {
  return new InlineKeyboard()
    .text("🔥 Срочно", "urgency_now").row()
    .text("📅 2-4 недели", "urgency_month").text("👀 Просто интересуюсь", "urgency_interest");
}

async function saveLead(ctx, d) {
  const tg_user = ctx.from?.username ? "@" + ctx.from.username : ctx.from?.first_name;
  try {
    await sb.from("bot_leads").insert({
      type: d.type, product: d.product ?? null, niche: d.niche ?? null,
      urgency: d.urgency ?? null, name: d.name ?? null, phone: d.phone ?? null,
      call_time: d.time ?? null, tg_user, tg_id: ctx.from?.id,
    });
  } catch (e) { console.error("insert lead:", e.message); }
  if (OWNER) {
    const text = `🔥 <b>Новая ${d.type === "call" ? "запись на созвон" : "заявка"}!</b>

🎯 Продукт: ${d.product || "—"}
🏢 Ниша: ${d.niche || "—"}
⏱ Срочность: ${d.urgency || "—"}
👤 Имя: ${d.name || "—"}
📱 Телефон: ${d.phone || "—"}
${d.time ? "🕐 Удобное время: " + d.time + "\n" : ""}💬 Контакт: ${tg_user || "—"}`;
    try { await ctx.api.sendMessage(OWNER, text, { parse_mode: "HTML" }); }
    catch (e) { console.error("notify owner:", e.message); }
  }
}

// --- Учёт всех пользователей бота (для рассылок) ---
bot.use(async (ctx, next) => {
  const u = ctx.from;
  if (u && !u.is_bot) {
    try {
      await sb.from("bot_users").upsert(
        { tg_id: u.id, username: u.username ? "@" + u.username : null, first_name: u.first_name ?? null, last_seen: new Date().toISOString() },
        { onConflict: "tg_id" }
      );
    } catch (e) { console.error("track user:", e.message); }
  }
  await next();
});

bot.use(session({ initial: () => ({ step: "idle", data: {} }), storage }));

const isAdmin = (ctx) => String(ctx.chat?.id) === String(OWNER);

bot.command("start", async (ctx) => {
  ctx.session.step = "idle"; ctx.session.data = {};
  await ctx.reply(WELCOME, { parse_mode: "HTML", reply_markup: mainMenu() });
});
bot.command("id", (ctx) =>
  ctx.reply(`chat_id этого чата: <code>${ctx.chat.id}</code>`, { parse_mode: "HTML" })
);

// --- Админ-команды (только из группы заявок) ---
bot.command("stats", async (ctx) => {
  if (!isAdmin(ctx)) return;
  const all = await sb.from("bot_users").select("*", { count: "exact", head: true });
  const act = await sb.from("bot_users").select("*", { count: "exact", head: true }).eq("active", true);
  const leads = await sb.from("bot_leads").select("*", { count: "exact", head: true });
  await ctx.reply(`📊 <b>Статистика</b>\n\n👥 Пользователей: ${all.count ?? 0}\n✅ Активных: ${act.count ?? 0}\n📝 Заявок: ${leads.count ?? 0}`, { parse_mode: "HTML" });
});

bot.command("broadcast", async (ctx) => {
  if (!isAdmin(ctx)) return;
  const text = ctx.match?.trim();
  if (!text) return ctx.reply("Использование:\n/broadcast текст сообщения\n\nПоддерживается HTML: <b>жирный</b>, <i>курсив</i>, <a href=\"...\">ссылка</a>.", { parse_mode: "HTML" });
  const { data: users } = await sb.from("bot_users").select("tg_id").eq("active", true);
  await ctx.reply(`📣 Рассылка ${users?.length ?? 0} пользователям...`);
  let ok = 0, fail = 0;
  for (const u of users ?? []) {
    try {
      await bot.api.sendMessage(u.tg_id, text, { parse_mode: "HTML" });
      ok++;
    } catch (e) {
      fail++;
      if (e?.error_code === 403) await sb.from("bot_users").update({ active: false }).eq("tg_id", u.tg_id);
    }
  }
  await ctx.reply(`✅ Доставлено: ${ok}\n🚫 Не доставлено: ${fail}`);
});

// --- Демо по нишам ---
bot.callbackQuery("demo", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("🎬 Выберите вашу сферу — покажу подходящие работы:", { reply_markup: nicheMenu() });
});
bot.callbackQuery(/^niche_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const n = NICHES[ctx.match[1]];
  if (!n) return;
  if (n.intro) await ctx.reply(n.intro);
  for (const w of n.works) {
    await ctx.replyWithPhoto(shot(w.img), {
      caption: `<b>${w.name}</b>\n${w.desc}`,
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().webApp(`🔗 Открыть ${w.kind}`, w.url),
    });
  }
  await ctx.reply("Хотите такое для своего бизнеса? 👇", { reply_markup: afterDemo() });
});

bot.callbackQuery("prices", async (ctx) => { await ctx.answerCallbackQuery(); await ctx.reply(PRICES, { parse_mode: "HTML", reply_markup: backMenu() }); });
bot.callbackQuery("back", async (ctx) => {
  ctx.session.step = "idle"; ctx.session.data = {};
  await ctx.answerCallbackQuery();
  await ctx.reply(WELCOME, { parse_mode: "HTML", reply_markup: mainMenu() });
});

// --- Опросник: заявка ---
bot.callbackQuery("lead", async (ctx) => {
  ctx.session.step = "lead_product"; ctx.session.data = { type: "lead" };
  await ctx.answerCallbackQuery();
  await ctx.reply("📝 Пара вопросов, отвечу быстро.\n\n<b>1/5.</b> Что вас интересует?", { parse_mode: "HTML", reply_markup: productMenu() });
});
bot.callbackQuery(/^product_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  if (ctx.session.step !== "lead_product") return;
  ctx.session.data.product = PRODUCTS["product_" + ctx.match[1]];
  ctx.session.step = "lead_niche";
  await ctx.reply("<b>2/5.</b> Какая у вас ниша / бизнес?", { parse_mode: "HTML" });
});
bot.callbackQuery(/^urgency_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  if (ctx.session.step !== "lead_urgency") return;
  ctx.session.data.urgency = URGENCY["urgency_" + ctx.match[1]];
  ctx.session.step = "lead_name";
  await ctx.reply("<b>4/5.</b> Как вас зовут?", { parse_mode: "HTML" });
});

// --- Запись на созвон ---
bot.callbackQuery("call", async (ctx) => {
  ctx.session.step = "call_name"; ctx.session.data = { type: "call" };
  await ctx.answerCallbackQuery();
  await ctx.reply("📞 Запишемся на короткий созвон (15 мин).\n\n<b>1/3.</b> Как вас зовут?", { parse_mode: "HTML" });
});

// --- FSM по тексту ---
bot.on("message:text", async (ctx) => {
  if (ctx.message.text.startsWith("/")) return;
  const text = ctx.message.text;
  const s = ctx.session;
  switch (s.step) {
    case "lead_niche":
      s.data.niche = text; s.step = "lead_urgency";
      return ctx.reply("<b>3/5.</b> Когда нужно?", { parse_mode: "HTML", reply_markup: urgencyMenu() });
    case "lead_name":
      s.data.name = text; s.step = "lead_phone";
      return ctx.reply("<b>5/5.</b> Ваш телефон (WhatsApp) для связи?", { parse_mode: "HTML" });
    case "lead_phone": {
      s.data.phone = text; s.step = "idle";
      const name = s.data.name;
      await saveLead(ctx, s.data); s.data = {};
      return ctx.reply(`Спасибо, ${name}! 🙌 Заявка принята.\n\nСвяжусь с вами в ближайшее время, покажу демо под вашу нишу и обсудим детали.`, { reply_markup: toMenu() });
    }
    case "call_name":
      s.data.name = text; s.step = "call_phone";
      return ctx.reply("<b>2/3.</b> Ваш телефон (WhatsApp)?", { parse_mode: "HTML" });
    case "call_phone":
      s.data.phone = text; s.step = "call_time";
      return ctx.reply("<b>3/3.</b> Когда удобно? (например: сегодня после 18:00 / завтра утром)", { parse_mode: "HTML" });
    case "call_time": {
      s.data.time = text; s.step = "idle";
      const name = s.data.name;
      await saveLead(ctx, s.data); s.data = {};
      return ctx.reply(`Готово, ${name}! 📞 Спишемся в указанное время.`, { reply_markup: toMenu() });
    }
    default:
      return ctx.reply("Нажмите кнопку в меню 👇", { reply_markup: mainMenu() });
  }
});

bot.catch((err) => console.error("Ошибка бота:", err));

export default webhookCallback(bot, "https");
