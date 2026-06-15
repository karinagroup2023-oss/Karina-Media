// Vercel Serverless Function — создаёт счёт в Telegram Stars
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan, telegram_id, stars } = req.body;

  if (!plan || !telegram_id || !stars) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not configured' });

  const titles = {
    monthly: 'Подписка Ежемесячная — Plix',
    yearly: 'Подписка Годовая — Plix',
  };

  const descriptions = {
    monthly: 'Доступ к откликам на заявки и размещению предложений на платформе Plix.kz на 30 дней',
    yearly: 'Доступ ко всем функциям Plix.kz на 365 дней + приоритетная поддержка',
  };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titles[plan],
          description: descriptions[plan],
          payload: JSON.stringify({ plan, telegram_id }),
          currency: 'XTR', // Telegram Stars
          prices: [{ label: titles[plan], amount: stars }],
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: data.description });
    }

    return res.json({ invoice_link: data.result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
