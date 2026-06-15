import { useState } from 'react';

export default function ResponseModal({ item, tgUser, telegramId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: tgUser ? `${tgUser.first_name || ''}${tgUser.last_name ? ' ' + tgUser.last_name : ''}` : '',
    phone: '',
    price: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError('Укажите имя/компанию и телефон');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          item_owner_telegram_id: item.telegram_id,
          item_title: item.title,
          responder_telegram_id: telegramId,
          responder_name: form.name,
          responder_phone: form.phone,
          price: form.price || null,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');

      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-content">

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Откликнуться на заявку
            </div>
            <div style={{ fontSize: 13, color: 'var(--hint)', background: 'var(--bg)', padding: '8px 12px', borderRadius: 8 }}>
              📋 {item.title}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ваше имя / Компания <span className="form-required">*</span></label>
            <input
              className="form-input"
              placeholder="ТОО «МеталлСервис» или Иван Петров"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Телефон <span className="form-required">*</span></label>
            <input
              className="form-input"
              type="tel"
              placeholder="+7 701 234 5678"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ваша цена (необязательно)</label>
            <input
              className="form-input"
              placeholder="напр. 12 500 ₸/мешок"
              value={form.price}
              onChange={set('price')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Сообщение</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Кратко о вашем предложении: наличие, сроки, доставка..."
              value={form.message}
              onChange={set('message')}
              maxLength={300}
            />
          </div>

          {error && (
            <div style={{ color: '#C62828', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#FFEBEE', borderRadius: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Отправляем...' : '📨 Отправить отклик'}
            </button>
            <button className="btn-secondary" onClick={onClose}>Отмена</button>
          </div>

        </div>
      </div>
    </div>
  );
}
