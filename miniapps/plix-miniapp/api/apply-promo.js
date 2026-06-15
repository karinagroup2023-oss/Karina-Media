import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code, telegram_id } = req.body;
  if (!code || !telegram_id) return res.status(400).json({ error: 'Укажите промокод' });

  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single();

  if (!promo) return res.status(404).json({ error: 'Промокод не найден' });
  if (promo.uses_left === 0) return res.status(400).json({ error: 'Промокод уже использован' });
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Срок действия промокода истёк' });
  }

  const days = promo.plan === 'yearly' ? 365 : 30;
  const expires_at = new Date(Date.now() + days * 86400000).toISOString();

  await supabase.from('subscriptions').upsert({
    telegram_id,
    plan: promo.plan,
    expires_at,
    payment_id: `promo_${promo.code}`,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'telegram_id' });

  if (promo.uses_left > 0) {
    await supabase.from('promo_codes').update({ uses_left: promo.uses_left - 1 }).eq('id', promo.id);
  }

  return res.json({ ok: true, plan: promo.plan, discount: promo.discount_percent });
}
