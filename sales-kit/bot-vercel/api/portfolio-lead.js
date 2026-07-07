// Уведомление о заявке из портфолио-аппа (сам лид уже записан фронтом в pf_leads)
const TOKEN = process.env.BOT_TOKEN;
const OWNER = process.env.OWNER_CHAT_ID;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { name, phone, message, case_title, ref_code, company } = req.body || {};
  // honeypot: боты заполняют скрытое поле company
  if (company) return res.status(200).json({ ok: true });
  if (!name || !phone) return res.status(400).json({ ok: false, error: "name/phone required" });

  if (OWNER && TOKEN) {
    const text =
      `🔥 <b>Заявка из ПОРТФОЛИО!</b>\n\n` +
      `👤 Имя: ${esc(name)}\n` +
      `📱 Телефон: ${esc(phone)}\n` +
      (case_title ? `📁 Кейс: ${esc(case_title)}\n` : "") +
      (ref_code ? `🔗 Источник: ${esc(ref_code)}\n` : "") +
      (message ? `💬 Комментарий: ${esc(message)}\n` : "");
    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: OWNER, text, parse_mode: "HTML" }),
      });
    } catch (e) { console.error("portfolio-lead notify:", e.message); }
  }
  res.status(200).json({ ok: true });
}
