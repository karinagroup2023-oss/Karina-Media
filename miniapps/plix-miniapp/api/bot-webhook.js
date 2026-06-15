// Vercel Serverless Function — обрабатывает события от Telegram бота
// Принимает: pre_checkout_query (подтверждение оплаты) и successful_payment
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
);

async function tgCall(method, body, token) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const update = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  // 1. Подтверждаем готовность к оплате
  if (update.pre_checkout_query) {
    await tgCall('answerPreCheckoutQuery', {
      pre_checkout_query_id: update.pre_checkout_query.id,
      ok: true,
    }, BOT_TOKEN);
    return res.json({ ok: true });
  }

  // 2. Обрабатываем успешную оплату
  if (update.message?.successful_payment) {
    const payment = update.message.successful_payment;
    const telegramId = update.message.from.id;

    let payload;
    try {
      payload = JSON.parse(payment.invoice_payload);
    } catch {
      return res.json({ ok: true });
    }

    const { plan } = payload;
    const days = plan === 'yearly' ? 365 : 30;
    const expires_at = new Date(Date.now() + days * 86400000).toISOString();

    // Обновляем подписку в Supabase
    await supabase.from('subscriptions').upsert({
      telegram_id: telegramId,
      plan,
      expires_at,
      payment_id: payment.telegram_payment_charge_id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'telegram_id' });

    // Отправляем подтверждение пользователю
    const planNames = { monthly: 'Ежемесячная', yearly: 'Годовая' };
    await tgCall('sendMessage', {
      chat_id: telegramId,
      text: `✅ Подписка *${planNames[plan]}* активирована!\n\nТеперь вы можете откликаться на заявки и размещать предложения на Plix.\n\n👇 Открыть приложение:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{
          text: '🏗️ Открыть Plix',
          web_app: { url: process.env.APP_URL || 'https://plix-miniapp.vercel.app' },
        }]],
      },
    }, BOT_TOKEN);

    return res.json({ ok: true });
  }

  // 3. Команда /start — отправляем кнопку открытия приложения
  if (update.message?.text === '/start') {
    const chatId = update.message.chat.id;
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: '🏗️ *Plix* — маркетплейс строительных материалов Казахстана\n\nРазмещайте заявки на покупку и предложения о продаже. Все компании верифицированы по БИН.',
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{
          text: '🚀 Открыть Plix',
          web_app: { url: process.env.APP_URL || 'https://plix-miniapp.vercel.app' },
        }]],
      },
    }, BOT_TOKEN);
  }

  return res.json({ ok: true });
}
