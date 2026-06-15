import { supabase } from './supabase'

// Форматируем дату для отображения
function fmtDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Нормализуем строку из БД в формат приложения
function normalize(row) {
  return {
    ...row,
    date: fmtDate(row.created_at),
    isOwn: false,
  }
}

// ===== ITEMS =====

export async function fetchItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(normalize)
}

export async function fetchMyItems(telegramId) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('telegram_id', telegramId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(r => ({ ...normalize(r), isOwn: true }))
}

export async function createItem(item, telegramId) {
  const { data, error } = await supabase
    .from('items')
    .insert({
      telegram_id: telegramId,
      type: item.type,
      category: item.category,
      category_icon: item.categoryIcon,
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      price: item.price || null,
      city: item.city,
      company: item.company,
      bin: item.bin || '',
      contact: item.contact || '',
      urgent: item.urgent || false,
    })
    .select()
    .single()
  if (error) throw error
  return { ...normalize(data), isOwn: true }
}

export async function deleteItem(id) {
  const { error } = await supabase
    .from('items')
    .update({ is_active: false })
    .eq('id', id)
  if (error) throw error
}

export async function incrementResponses(id) {
  const { error } = await supabase.rpc('increment_responses', { item_id: id })
  if (error) {
    // fallback если RPC не настроена
    const { data } = await supabase.from('items').select('responses').eq('id', id).single()
    await supabase.from('items').update({ responses: (data?.responses || 0) + 1 }).eq('id', id)
  }
}

// ===== RESPONSES =====

export async function fetchResponsesForMyItems(telegramId) {
  const { data, error } = await supabase
    .from('responses')
    .select('*, items(title, type, category)')
    .eq('item_owner_telegram_id', telegramId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(r => ({
    ...r,
    item_title: r.items?.title || '',
    item_type: r.items?.type || '',
    date: fmtDate(r.created_at),
  }))
}

export async function fetchMyResponses(telegramId) {
  const { data, error } = await supabase
    .from('responses')
    .select('*, items(title, type, city)')
    .eq('responder_telegram_id', telegramId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(r => ({
    ...r,
    item_title: r.items?.title || '',
    item_type: r.items?.type || '',
    date: fmtDate(r.created_at),
  }))
}

// ===== SUBSCRIPTIONS =====

async function getOwnerPlan(ownerTelegramId) {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, expires_at')
    .eq('telegram_id', ownerTelegramId)
    .single()
  if (data && data.plan !== 'free') {
    if (!data.expires_at || new Date(data.expires_at) > new Date()) return data.plan
  }
  return null
}

export async function fetchSubscription(telegramId, username) {
  // 1. Собственная подписка
  const { data: own } = await supabase
    .from('subscriptions')
    .select('plan, expires_at')
    .eq('telegram_id', telegramId)
    .single()

  if (own && own.plan !== 'free') {
    if (!own.expires_at || new Date(own.expires_at) > new Date()) return own.plan
  }

  // 2. По username (если задан)
  if (username) {
    const { data: m } = await supabase
      .from('team_members')
      .select('id, owner_telegram_id, member_telegram_id')
      .eq('member_username', username.toLowerCase())
      .single()

    if (m) {
      // Запоминаем telegram_id сотрудника для будущих проверок
      if (!m.member_telegram_id) {
        supabase.from('team_members').update({ member_telegram_id: telegramId }).eq('id', m.id)
      }
      const plan = await getOwnerPlan(m.owner_telegram_id)
      if (plan) return plan
    }
  }

  // 3. По telegram_id — для аккаунтов без username или уже записанных
  const { data: m2 } = await supabase
    .from('team_members')
    .select('owner_telegram_id')
    .eq('member_telegram_id', telegramId)
    .single()

  if (m2) {
    const plan = await getOwnerPlan(m2.owner_telegram_id)
    if (plan) return plan
  }

  return 'free'
}

export async function checkIsTeamMember(telegramId, username) {
  // У кого есть собственная активная платная подписка — всегда владелец, не сотрудник
  const { data: own } = await supabase
    .from('subscriptions')
    .select('plan, expires_at')
    .eq('telegram_id', telegramId)
    .single()
  if (own && own.plan !== 'free' && (!own.expires_at || new Date(own.expires_at) > new Date())) {
    return false
  }

  if (username) {
    const { data } = await supabase
      .from('team_members')
      .select('id')
      .eq('member_username', username.toLowerCase())
      .single()
    if (data) return true
  }
  const { data } = await supabase
    .from('team_members')
    .select('id')
    .eq('member_telegram_id', telegramId)
    .single()
  return !!data
}

export async function upsertSubscription(telegramId, plan, paymentId = null) {
  const days = plan === 'yearly' ? 365 : 30
  const expires_at = new Date(Date.now() + days * 86400000).toISOString()

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      telegram_id: telegramId,
      plan,
      expires_at,
      payment_id: paymentId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'telegram_id' })

  if (error) throw error
}
