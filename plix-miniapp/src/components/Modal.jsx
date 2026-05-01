import { useEffect } from 'react';

export default function Modal({ item, userPlan, onClose, onUpgrade }) {
  const isLocked = item.type === 'request' && userPlan === 'free';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleWhatsApp = () => {
    const phone = item.contact?.replace(/\D/g, '');
    const msg = encodeURIComponent(`Здравствуйте! Видел вашу ${item.type === 'request' ? 'заявку' : 'предложение'} на Plix: «${item.title}»`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-content">

          <div className="modal-badges">
            <span className={`badge badge-${item.type}`}>
              {item.type === 'request' ? '📩 Заявка' : '🏷️ Предложение'}
            </span>
            <span className="badge" style={{ background: '#F3F0FF', color: '#5B21B6' }}>
              {item.categoryIcon} {item.category}
            </span>
            {item.verified && <span className="badge badge-verified">✓ Верифицирован</span>}
            {item.urgent && <span className="badge badge-urgent">⚡ Срочно</span>}
          </div>

          <div className="modal-title">{item.title}</div>
          <div className="modal-desc">{item.description}</div>

          <div className="modal-section">
            <div className="modal-row">
              <span className="modal-row-label">Количество</span>
              <span className="modal-row-value">{item.quantity}</span>
            </div>
            {item.price && (
              <div className="modal-row">
                <span className="modal-row-label">Цена</span>
                <span className="modal-row-value price">{item.price}</span>
              </div>
            )}
            <div className="modal-row">
              <span className="modal-row-label">Город</span>
              <span className="modal-row-value">📍 {item.city}</span>
            </div>
            <div className="modal-row">
              <span className="modal-row-label">Компания</span>
              <span className="modal-row-value">{item.company}</span>
            </div>
            {item.bin && (
              <div className="modal-row">
                <span className="modal-row-label">БИН</span>
                <span className="modal-row-value">{item.bin}</span>
              </div>
            )}
            <div className="modal-row">
              <span className="modal-row-label">Дата</span>
              <span className="modal-row-value">{item.date}</span>
            </div>
            {item.type === 'request' && (
              <div className="modal-row">
                <span className="modal-row-label">Откликов</span>
                <span className="modal-row-value">{item.responses}</span>
              </div>
            )}
          </div>

          <div className="modal-cta">
            {isLocked ? (
              <>
                <div className="lock-notice">
                  🔒 Откликайтесь на заявки с платной подпиской
                </div>
                <button className="btn-primary" onClick={onUpgrade}>
                  Подключить подписку
                </button>
                <button className="btn-secondary" onClick={onClose}>Закрыть</button>
              </>
            ) : (
              <>
                <button className="btn-accent" onClick={handleWhatsApp}>
                  💬 Написать в WhatsApp
                </button>
                {item.contact && (
                  <a href={`tel:${item.contact}`} className="btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '14px', borderRadius: 12, background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    📞 Позвонить: {item.contact}
                  </a>
                )}
                <button className="btn-secondary" onClick={onClose}>Закрыть</button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
