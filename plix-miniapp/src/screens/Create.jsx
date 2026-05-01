import { useState } from 'react';
import { CATEGORIES, CITIES, UNITS } from '../data/mockData';

const INIT = {
  type: 'request',
  category: '',
  title: '',
  description: '',
  quantity: '',
  unit: 'шт',
  city: '',
  price: '',
  contact: '',
};

export default function Create({ userPlan, onAdd, onUpgrade }) {
  const [form, setForm] = useState(INIT);
  const [submitted, setSubmitted] = useState(false);

  const isOffer = form.type === 'offer';

  const canCreate = userPlan !== 'free' || form.type === 'request';

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.category || !form.title || !form.city) return;
    if (!canCreate) { onUpgrade(); return; }

    const newItem = {
      id: Date.now(),
      type: form.type,
      category: CATEGORIES.find(c => c.id === form.category)?.label || form.category,
      categoryIcon: CATEGORIES.find(c => c.id === form.category)?.icon || '📦',
      title: form.title,
      description: form.description,
      quantity: `${form.quantity} ${form.unit}`,
      price: form.price ? `${form.price} ₸` : undefined,
      city: form.city,
      company: 'Ваша компания',
      bin: '—',
      contact: form.contact,
      date: 'Сегодня',
      responses: 0,
      verified: false,
      urgent: false,
      isOwn: true,
    };

    onAdd(newItem);
    setForm(INIT);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">Создать объявление</div>
      </div>

      <div className="form-scroll">
        {/* Type toggle */}
        <div className="form-toggle">
          <button
            className={`toggle-btn${!isOffer ? ' active' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'request' }))}
          >
            📩 Заявка на покупку
          </button>
          <button
            className={`toggle-btn${isOffer ? ' active offer' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'offer' }))}
          >
            🏷️ Предложение продажи
          </button>
        </div>

        {isOffer && userPlan === 'free' && (
          <div className="lock-notice" style={{ marginBottom: 16 }}>
            🔒 Размещение предложений доступно с подпиской
            <button
              onClick={onUpgrade}
              style={{ background: 'var(--accent)', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, marginLeft: 8 }}
            >
              Подключить
            </button>
          </div>
        )}

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Категория <span className="form-required">*</span></label>
          <select className="form-input select" value={form.category} onChange={set('category')}>
            <option value="">Выберите категорию</option>
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Заголовок <span className="form-required">*</span></label>
          <input
            className="form-input"
            placeholder={isOffer ? 'Напр.: Цемент М400 оптом со склада' : 'Напр.: Нужен цемент М400 — 200 мешков'}
            value={form.title}
            onChange={set('title')}
            maxLength={80}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Дополнительные детали: марка, размер, доставка, условия оплаты..."
            value={form.description}
            onChange={set('description')}
            maxLength={500}
          />
          <div className="form-hint">{form.description.length}/500</div>
        </div>

        {/* Quantity + Unit */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Количество</label>
            <input
              className="form-input"
              type="number"
              placeholder="100"
              value={form.quantity}
              onChange={set('quantity')}
            />
          </div>
          <div className="form-group" style={{ flex: '0 0 110px' }}>
            <label className="form-label">Единица</label>
            <select className="form-input select" value={form.unit} onChange={set('unit')}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Price (offers only) */}
        {isOffer && (
          <div className="form-group">
            <label className="form-label">Цена (₸)</label>
            <input
              className="form-input"
              type="number"
              placeholder="250000"
              value={form.price}
              onChange={set('price')}
            />
            <div className="form-hint">За единицу измерения</div>
          </div>
        )}

        {/* City */}
        <div className="form-group">
          <label className="form-label">Город <span className="form-required">*</span></label>
          <select className="form-input select" value={form.city} onChange={set('city')}>
            <option value="">Выберите город</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Contact */}
        <div className="form-group">
          <label className="form-label">Контактный телефон</label>
          <input
            className="form-input"
            type="tel"
            placeholder="+7 701 234 5678"
            value={form.contact}
            onChange={set('contact')}
          />
        </div>

        <button
          className={`form-submit${isOffer ? ' offer' : ''}`}
          onClick={handleSubmit}
          disabled={!form.category || !form.title || !form.city}
          style={{ opacity: (!form.category || !form.title || !form.city) ? 0.5 : 1 }}
        >
          {isOffer && userPlan === 'free' ? '🔒 Нужна подписка' : `Разместить ${isOffer ? 'предложение' : 'заявку'}`}
        </button>
      </div>

      {submitted && (
        <div className="toast">
          ✅ Объявление успешно размещено!
        </div>
      )}
    </div>
  );
}
