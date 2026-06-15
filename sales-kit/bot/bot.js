import "dotenv/config";
import { Bot, InlineKeyboard, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import fs from "fs";

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID;

if (!BOT_TOKEN) {
  console.error("❌ Нет BOT_TOKEN. Скопируйте .env.example в .env и впишите токен от @BotFather.");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

// --- Демо живых мини-аппов (открываются прямо в Telegram) ---
const DEMOS = {
  beauty: { title: "💅 Бьюти / салон", url: "https://drelima-miniapp.vercel.app" },
  photo: { title: "📸 Услуги / фотограф", url: "https://app-ivory-five-19.vercel.app" },
  shop: { title: "🛍 Магазин / заявки", url: "https://plix-miniapp.vercel.app" },
};

// --- Тексты ---
const WELCOME = `<b>KARINA Media</b> — мини-аппы и сайты для бизнеса 🚀

Делаем <b>Telegram мини-апп приёма заявок</b> под ключ за 5 дней. Клиенты оставляют заявки и записываются 24/7 — без менеджера, заявка сразу у вас.

Выберите, что показать 👇`;

const PRICES = `💰 <b>Цены</b>

🟢 <b>Старт — 250 000 ₸</b> · запуск за 3 дня
Бот приёма заявок: меню, услуги/каталог, форма заявки, уведомления, кнопка WhatsApp.

⭐️ <b>Бизнес — 490 000 ₸</b> · запуск за 5 дней <i>(хит)</i>
Мини-апп: каталог с фото и ценами, корзина/заявка, админка, интеграция WhatsApp/Kaspi, база клиентов.

💎 <b>Премиум — 900 000 ₸</b> · 7–10 дней
Всё из «Бизнес» + продающий лендинг + автоворонка + настройка приёма оплаты.

🛡 Гарантия: <b>не запущу за 5 дней — верну предоплату.</b>
Оплата 100% сегодня — <b>скидка 15%</b>. Принимаем на Kaspi / счёт ИП.`;

const PORTFOLIO = `💼 <b>Портфолио</b> — наши живые работы:

💅 DrElima «Код Роскоши» — бьюти мини-апп
📸 Mobilograf — мини-апп фотографа
🛍 Plix — заявки по стройматериалам
🧴 GlowSeoul — магазин корейской косметики
👗 NURA — магазин одежды
🎓 StudyMe — образование за рубежом
📊 Финансовый Компас — дашборд для бизнеса

Нажмите «Демо», чтобы открыть примеры прямо в Telegram. Под вашу нишу покажу отдельно.`;

// --- Клавиатуры ---
function mainMenu() {
  return new InlineKeyboard()
    .text("🎬 Демо мини-аппов", "demo").row()
    .text("💼 Портфолио", "portfolio").text("💰 Цены", "prices").row()
    .text("📝 Оставить заявку", "lead").row()
    .text("📞 Записаться на созвон", "call");
}

function demoMenu() {
  const kb = new InlineKeyboard();
  for (const d of Object.values(DEMOS)) kb.webApp(d.title, d.url).row();
  kb.text("⬅️ Назад", "back");
  return kb;
}

function backMenu() {
  return new InlineKeyboard().text("📝 Оставить заявку", "lead").text("⬅️ Меню", "back");
}

// --- Сохранение и отправка заявки владельцу ---
async function saveLead(ctx, lead) {
  const record = {
    ...lead,
    tg_user: ctx.from?.username ? "@" + ctx.from.username : ctx.from?.first_name,
    tg_id: ctx.from?.id,
    at: new Date().toISOString(),
  };
  try {
    const file = "leads.json";
    const arr = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
    arr.push(record);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  } catch (e) {
    console.error("Не удалось записать leads.json:", e.message);
  }
  if (OWNER_CHAT_ID) {
    const text = `🔥 <b>Новая ${lead.type === "call" ? "запись на созвон" : "заявка"}!</b>

🏢 Бизнес/ниша: ${lead.niche || "—"}
👤 Имя: ${lead.name || "—"}
📱 Телефон: ${lead.phone || "—"}
${lead.time ? "🕐 Удобное время: " + lead.time + "\n" : ""}💬 Контакт: ${record.tg_user || "—"}`;
    try {
      await bot.api.sendMessage(OWNER_CHAT_ID, text, { parse_mode: "HTML" });
    } catch (e) {
      console.error("Не удалось отправить заявку владельцу:", e.message);
    }
  }
}

// --- Диалог: заявка ---
async function leadConversation(conversation, ctx) {
  await ctx.reply("📝 Отлично! Пара вопросов.\n\n<b>1/3.</b> Какой у вас бизнес / ниша?", { parse_mode: "HTML" });
  const niche = (await conversation.waitFor("message:text")).message.text;
  await ctx.reply("<b>2/3.</b> Как вас зовут?", { parse_mode: "HTML" });
  const name = (await conversation.waitFor("message:text")).message.text;
  await ctx.reply("<b>3/3.</b> Ваш телефон (WhatsApp) для связи?", { parse_mode: "HTML" });
  const phone = (await conversation.waitFor("message:text")).message.text;

  await saveLead(ctx, { type: "lead", niche, name, phone });
  await ctx.reply(
    `Спасибо, ${name}! 🙌 Заявка принята.\n\nСвяжусь с вами в ближайшее время, покажу демо под вашу нишу и обсудим детали.`,
    { reply_markup: new InlineKeyboard().text("⬅️ В меню", "back") }
  );
}

// --- Диалог: запись на созвон ---
async function callConversation(conversation, ctx) {
  await ctx.reply("📞 Запишемся на короткий созвон (15 мин).\n\n<b>1/3.</b> Как вас зовут?", { parse_mode: "HTML" });
  const name = (await conversation.waitFor("message:text")).message.text;
  await ctx.reply("<b>2/3.</b> Ваш телефон (WhatsApp)?", { parse_mode: "HTML" });
  const phone = (await conversation.waitFor("message:text")).message.text;
  await ctx.reply("<b>3/3.</b> Когда удобно? (например: сегодня после 18:00 / завтра утром)", { parse_mode: "HTML" });
  const time = (await conversation.waitFor("message:text")).message.text;

  await saveLead(ctx, { type: "call", name, phone, time });
  await ctx.reply(
    `Готово, ${name}! 📞 Спишемся в указанное время.`,
    { reply_markup: new InlineKeyboard().text("⬅️ В меню", "back") }
  );
}

// --- Подключение плагинов ---
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(leadConversation, "lead"));
bot.use(createConversation(callConversation, "call"));

// --- Хендлеры ---
bot.command("start", (ctx) => ctx.reply(WELCOME, { parse_mode: "HTML", reply_markup: mainMenu() }));

bot.command("id", (ctx) => ctx.reply(`Ваш chat_id: <code>${ctx.from?.id}</code>`, { parse_mode: "HTML" }));

bot.callbackQuery("demo", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("🎬 Откройте любое демо прямо в Telegram:", { reply_markup: demoMenu() });
});

bot.callbackQuery("portfolio", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(PORTFOLIO, { parse_mode: "HTML", reply_markup: backMenu() });
});

bot.callbackQuery("prices", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(PRICES, { parse_mode: "HTML", reply_markup: backMenu() });
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(WELCOME, { parse_mode: "HTML", reply_markup: mainMenu() });
});

bot.callbackQuery("lead", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("lead");
});

bot.callbackQuery("call", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("call");
});

bot.catch((err) => console.error("Ошибка бота:", err));

bot.start({ onStart: (i) => console.log(`✅ Бот @${i.username} запущен`) });
console.log("Сделано в KARINA Media · wa.me/77066567765");
