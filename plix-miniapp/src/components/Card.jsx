export default function Card({ item, userPlan, telegramId, onOpen, onRespond }) {
  const isOwnItem = item.telegram_id === telegramId;
  const isLocked = item.type === 'request' && userPlan === 'free' && !isOwnItem;

  const handleRespond = (e) => {
    e.stopPropagation();
    if (isLocked) { onOpen(item); return; }
    if (isOwnItem) return;
    onRespond(item);
  };

  return (
    <div className="card" onClick={() => onOpen(item)}>
      <div className="card-top">
        <div className="card-badges">
          <span className={`badge badge-${item.type}`}>
            {item.type === 'request' ? '📩 Заявка' : '🏷️ Предложение'}
          </span>
          <span className="badge" style={{ background: '#F3F0FF', color: '#5B21B6', fontSize: 11 }}>
            {item.categoryIcon} {item.category}
          </span>
          {item.verified && <span className="badge badge-verified">✓ Верифицирован</span>}
          {item.urgent && <span className="badge badge-urgent">⚡ Срочно</span>}
        </div>
        <span className="card-date">{item.date}</span>
      </div>

      <div className="card-body">
        <div className="card-title">{item.title}</div>
        <div className="card-desc">{item.description}</div>
        <div className="card-meta">
          <span className="card-meta-item">📍 {item.city}</span>
          <span className="card-meta-item">📦 {item.quantity}</span>
          {item.price && <span className="card-meta-item price">💰 {item.price}</span>}
        </div>
      </div>

      <div className="card-footer">
        <div className="card-company">🏢 {item.company}</div>
        <div className="card-actions">
          {item.responses > 0 && (
            <span className="card-responses">{item.responses} откл.</span>
          )}
          {isOwnItem ? (
            <span className="btn-respond" style={{ background: 'var(--bg)', color: 'var(--hint)', cursor: 'default' }}>
              Моё
            </span>
          ) : (
            <button
              className={`btn-respond${isLocked ? ' locked' : ''}`}
              onClick={handleRespond}
            >
              {isLocked ? '🔒 Подписка' : item.type === 'request' ? 'Откликнуться' : 'Подробнее'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
