import { useState, useEffect } from 'react';
import { TARIFFS } from '../data/mockData';
import { upsertSubscription } from '../lib/db';

const STARS_PRICE = { monthly: 250, yearly: 1800 };

export default function Profile({ tgUser, telegramId, userPlan, isTeamMember, onPlanChange }) {
  const [loading, setLoading] = useState(null);
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);

  // Промокод
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Команда
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [teamLoading, setTeamLoading] = useState(false);

  const isPaid = userPlan !== 'free';
  const companyName = tgUser ? `${tgUser.first_name || ''}${tgUser.last_name ? ' ' + tgUser.last_name : ''}` : 'Ваша компания';
  const avatarLetter = companyName.charAt(0).toUpperCase();
  const currentTariff = TARIFFS.find(t => t.id === userPlan);

  useEffect(() => {
    if (isPaid) loadTeam();
  }, [isPaid, telegramId]);

  async function loadTeam() {
    const res = await fetch(`/api/team?owner_telegram_id=${telegramId}`);
    const data = await res.json();
    if (data.members) setTeamMembers(data.members);
  }

  const showToast = (msg, isError = false) => {
    setToast(msg);
    setToastError(isError);
    setTimeout(() => setToast(''), 3500);
  };

  // ===== ПРОМОКОД =====
  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    try {
      const res = await fetch('/api/apply-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), telegram_id: telegramId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onPlanChange(data.plan);
      setPromoCode('');
      showToast(`✅ Промокод активирован! Тариф "${data.plan === 'yearly' ? 'Годовой' : 'Ежемесячный'}" подключён бесплатно.`);
    } catch (e) {
      showToast(`❌ ${e.message}`, true);
    } finally {
      setPromoLoading(false);
    }
  };

  // ===== ОПЛАТА STARS =====
  const handleUpgrade = async (planId) => {
    if (planId === 'free' || planId === userPlan) return;
    const tg = window.Telegram?.WebApp;
    if (tg && telegramId !== 999999999) {
      setLoading(planId);
      try {
        const res = await fetch('/api/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: planId, telegram_id: telegramId, stars: STARS_PRICE[planId] }),
        });
        const { invoice_link, error } = await res.json();
        if (error || !invoice_link) throw new Error(error || 'no link');
        tg.openInvoice(invoice_link, async (status) => {
          if (status === 'paid') {
            await upsertSubscription(telegramId, planId);
            onPlanChange(planId);
            showToast('✅ Подписка активирована!');
          } else if (status === 'cancelled') {
            showToast('Оплата отменена', true);
          }
        });
      } catch (e) {
        showToast('Ошибка при создании счёта', true);
      } finally {
        setLoading(null);
      }
    } else {
      await upsertSubscription(telegramId, planId).catch(() => {});
      onPlanChange(planId);
      showToast('✅ Демо: тариф активирован!');
    }
  };

  // ===== КОМАНДА =====
  const handleAddMember = async () => {
    if (!newMember.trim()) return;
    setTeamLoading(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_telegram_id: telegramId, member_username: newMember.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewMember('');
      await loadTeam();
      showToast('✅ Сотрудник добавлен');
    } catch (e) {
      showToast(`❌ ${e.message}`, true);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleRemoveMember = async (username) => {
    await fetch('/api/team', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_telegram_id: telegramId, member_username: username }),
    });
    await loadTeam();
  };

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">Профиль</div>
        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#EBF4FF', color: 'var(--primary)', fontWeight: 600 }}>
          {currentTariff?.name}
        </span>
      </div>

      <div className="profile-scroll">

        {/* Company Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">{avatarLetter}</div>
            <div>
              <div className="profile-name">{companyName}</div>
              {tgUser?.username && <div className="profile-bin">@{tgUser.username} · ID: {telegramId}</div>}
            </div>
          </div>
          <div className="profile-card-body">
            <div className="profile-row">
              <div className="profile-row-left">
                <span className="profile-row-icon">📋</span>
                <span className="profile-row-label">Текущий тариф</span>
              </div>
              <span className="profile-row-value" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {currentTariff?.name}
              </span>
            </div>
          </div>
        </div>

        {/* ===== ПРОМОКОД (только не-сотрудникам) ===== */}
        {!isTeamMember && <div className="profile-card">
          <div style={{ padding: '14px 16px 0', fontWeight: 700, fontSize: 15 }}>🎟️ Промокод</div>
          <div style={{ padding: '12px 16px 16px' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Введите промокод для получения бесплатного доступа или скидки
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                style={{ flex: 1, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}
                placeholder="ПРОМОКОД"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handlePromo()}
              />
              <button
                onClick={handlePromo}
                disabled={promoLoading || !promoCode.trim()}
                style={{
                  background: 'var(--primary)', color: 'white', padding: '0 16px',
                  borderRadius: 8, fontWeight: 600, fontSize: 14,
                  opacity: (!promoCode.trim() || promoLoading) ? 0.5 : 1,
                  flexShrink: 0
                }}
              >
                {promoLoading ? '...' : 'Применить'}
              </button>
            </div>
          </div>
        </div>}

        {/* ===== ТАРИФЫ (только не-сотрудникам) ===== */}
        {isTeamMember && (
          <div className="profile-card" style={{ padding: '16px', background: 'var(--green-light)', border: '1px solid #A5D6A7' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>✅ Корпоративный доступ</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Вы добавлены в команду. Тариф предоставлен владельцем компании.
            </div>
          </div>
        )}
        {!isTeamMember && <div>
        {/* ===== ТАРИФЫ ===== */}
        <div>
          <div className="tariff-section-title">Тарифные планы</div>

          <div style={{ background: '#FFF8E1', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 13, color: '#7B6000', display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <div><strong>Оплата через Telegram Stars.</strong> Купить Stars: Настройки Telegram → Telegram Stars.</div>
          </div>

          <div className="tariff-cards">
            {TARIFFS.map(tariff => (
              <div key={tariff.id} className={`tariff-card${userPlan === tariff.id ? ' current' : ''}`}>
                <div className="tariff-card-header">
                  <div>
                    <div className="tariff-name" style={{ color: tariff.color }}>{tariff.name}</div>
                    {tariff.badge && <span className="tariff-badge">{tariff.badge}</span>}
                  </div>
                  <div className="tariff-price-block">
                    {tariff.oldPrice && <div className="tariff-old-price">{tariff.oldPrice}</div>}
                    <div className="tariff-price" style={{ color: tariff.color }}>
                      {tariff.price}<span className="tariff-period">{tariff.period}</span>
                    </div>
                    {tariff.id !== 'free' && (
                      <div style={{ fontSize: 11, color: 'var(--hint)' }}>⭐ {STARS_PRICE[tariff.id]} Stars</div>
                    )}
                  </div>
                </div>
                <div className="tariff-card-body">
                  <ul className="tariff-features">
                    {tariff.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                  {userPlan === tariff.id ? (
                    <div className="tariff-current-label">✓ Текущий тариф</div>
                  ) : (
                    <button
                      className="btn-upgrade"
                      style={{ background: tariff.color, opacity: loading === tariff.id ? 0.7 : 1 }}
                      onClick={() => handleUpgrade(tariff.id)}
                      disabled={loading === tariff.id}
                    >
                      {loading === tariff.id ? 'Загрузка...'
                        : tariff.id === 'free' ? 'Перейти на бесплатный'
                        : `⭐ Оплатить ${STARS_PRICE[tariff.id]} Stars`}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>}

        {/* ===== КОМАНДА (только для платных владельцев, не сотрудников) ===== */}
        {isPaid && !isTeamMember && (
          <div className="profile-card">
            <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>👥 Сотрудники</div>
              <span style={{ fontSize: 12, color: 'var(--hint)' }}>{teamMembers.length} чел.</span>
            </div>
            <div style={{ padding: '12px 16px 16px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                Добавьте @username сотрудников — они получат доступ к вашему тарифу
              </div>

              {/* Список сотрудников */}
              {teamMembers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {teamMembers.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>👤</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>@{m.member_username}</div>
                          <div style={{ fontSize: 11, color: 'var(--hint)' }}>
                            {m.member_telegram_id ? '✅ Активен' : '⏳ Ещё не заходил'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(m.member_username)}
                        style={{ background: '#FFEBEE', color: '#C62828', fontSize: 12, fontWeight: 500, padding: '5px 10px', borderRadius: 6 }}
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Добавить сотрудника */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="@username в Telegram"
                  value={newMember}
                  onChange={e => setNewMember(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                />
                <button
                  onClick={handleAddMember}
                  disabled={teamLoading || !newMember.trim()}
                  style={{
                    background: 'var(--success-light)', color: 'white', padding: '0 14px',
                    borderRadius: 8, fontWeight: 600, fontSize: 14, flexShrink: 0,
                    opacity: (!newMember.trim() || teamLoading) ? 0.5 : 1
                  }}
                >
                  {teamLoading ? '...' : '+ Добавить'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Поддержка */}
        <div className="profile-card">
          <div className="profile-card-body">
            <div className="profile-row" style={{ cursor: 'pointer' }}
              onClick={() => window.open('https://wa.me/77772488020?text=Здравствуйте, вопрос по Plix', '_blank')}>
              <div className="profile-row-left">
                <span className="profile-row-icon">💬</span>
                <span className="profile-row-label">Поддержка в WhatsApp</span>
              </div>
              <span className="profile-row-value">→</span>
            </div>
            <div className="profile-row" style={{ cursor: 'pointer' }}
              onClick={() => window.open('https://plix.kz/ru', '_blank')}>
              <div className="profile-row-left">
                <span className="profile-row-icon">🌐</span>
                <span className="profile-row-label">Сайт Plix.kz</span>
              </div>
              <span className="profile-row-value">→</span>
            </div>
            <div className="profile-row">
              <div className="profile-row-left">
                <span className="profile-row-icon">🕐</span>
                <span className="profile-row-label">Поддержка</span>
              </div>
              <span className="profile-row-value">10:00–18:00</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--hint)', padding: '4px 0 8px' }}>
          Plix.kz — Строимся вместе 🏗️
        </div>
      </div>

      {toast && (
        <div className="toast" style={{ background: toastError ? '#B71C1C' : '#1B5E20' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
