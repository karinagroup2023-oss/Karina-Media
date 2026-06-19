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
