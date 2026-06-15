import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  const { method } = req;
  const { owner_telegram_id, member_username } = req.body || req.query;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_telegram_id', req.query.owner_telegram_id)
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ members: data });
  }

  if (method === 'POST') {
    if (!owner_telegram_id || !member_username) {
      return res.status(400).json({ error: 'Укажите @username сотрудника' });
    }
    const clean = member_username.replace('@', '').toLowerCase().trim();
    const { error } = await supabase.from('team_members').insert({
      owner_telegram_id,
      member_username: clean,
    });
    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Сотрудник уже добавлен' });
      return res.status(500).json({ error: error.message });
    }
    return res.json({ ok: true });
  }

  if (method === 'DELETE') {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('owner_telegram_id', owner_telegram_id)
      .eq('member_username', member_username.replace('@', '').toLowerCase().trim());
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
