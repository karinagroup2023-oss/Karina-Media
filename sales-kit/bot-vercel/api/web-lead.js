import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const TOKEN = process.env.BOT_TOKEN;
const OWNER = process.env.OWNER_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const { name, phone, product, niche, time, company } = req.body || {};

  // honeypot: боты заполняют скрытое поле company
  if (company) return res.status(200).json({ ok: true });
  if (!name || !phone) return res.status(400).json({ ok: false, error: "name/phone required" });

  try {
    await sb.from("bot_leads").insert({
      type: "website", product: product || null, niche: niche || null,
      call_time: time || null, name, phone,
    });
  } catch (e) { console.error("web-lead insert:", e.message); }

  if (OWNER && TOKEN) {
    const text = `🔥 <b>Новая заявка с САЙТА!</b>\n\n🎯 Продукт: ${product || "—"}\n🏢 Ниша: ${niche || "—"}\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n${time ? "🕐 Удобное время: " + time + "\n" : ""}🌐 Источник: сайт KARINA Media`;
    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: OWNER, text, parse_mode: "HTML" }),
      });
    } catch (e) { console.error("web-lead notify:", e.message); }
  }
  res.status(200).json({ ok: true });
}
