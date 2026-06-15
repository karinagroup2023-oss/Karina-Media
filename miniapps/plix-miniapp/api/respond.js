import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
);

async function sendTelegramNotification(chatId, text, botToken) {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{
          text: '🏗️ Открыть Plix',
          web_app: { url: process.env.APP_URL || 'https://plix-miniapp.vercel.app' },
        }]],
      },
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    item_id,
    item_owner_telegram_id,
    item_title,
    responder_telegram_id,
    responder_name,
    responder_phone,
    price,
    message,
  } = req.body;

  if (!item_id || !responder_name || !responder_phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Нельзя откликнуться на свою же заявку
  if (item_owner_telegram_id === responder_telegram_id) {
    return res.status(400).json({ error: 'Нельзя откликнуться на своё объявление' });
  }

  // Сохраняем отклик
  const { error: insertError } = await supabase.from('responses').insert({
    item_id,
    item_owner_telegram_id,
    responder_telegram_id,
    responder_name,
    responder_phone,
    price: price || null,
    message: message || '',
  });

  if (insertError) {
    console.error('Insert error:', insertError);
    return res.status(500).json({ error: insertError.message });
  }

  // Увеличиваем счётчик откликов
  const { data: item } = await supabase
    .from('items')
    .select('responses')
    .eq('id', item_id)
    .single();

  await supabase
    .from('items')
    .update({ responses: (item?.responses || 0) + 1 })
    .eq('id', item_id);

  // Отправляем уведомление владельцу заявки
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (BOT_TOKEN && item_owner_telegram_id) {
    const priceText = price ? `\n💰 *Цена:* ${price}` : '';
    const msgText = message ? `\n✉️ _«${message}»_` : '';

    const notification = `🔔 *Новый отклик на вашу заявку!*\n\n📋 «${item_title}»\n\n🏢 *Компания:* ${responder_name}\n📞 *Телефон:* ${responder_phone}${priceText}${msgText}\n\nОткройте Plix чтобы посмотреть все отклики 👇`;

    await sendTelegramNotification(item_owner_telegram_id, notification, BOT_TOKEN);
  }

  return res.json({ ok: true });
}
