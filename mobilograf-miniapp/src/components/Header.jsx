export default function Header() {
  return (
    <header className="header">
      <div className="header-avatar">
        <img
          src="./natalia.jpg"
          alt="Наталия"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80' }}
        />
      </div>
      <div className="header-info">
        <h1 className="header-name">НАТАЛИЯ</h1>
        <p className="header-tagline">Видеомонтаж · Визуал · Обучение</p>
        <div className="header-location">
          <span className="location-icon">📍</span>
          <span>Москва, Россия</span>
        </div>
      </div>
      <div className="header-stats">
        <div className="stat">
          <span className="stat-value">200+</span>
          <span className="stat-label">Проектов</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">3 года</span>
          <span className="stat-label">Опыт</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">5.0 ★</span>
          <span className="stat-label">Рейтинг</span>
        </div>
      </div>

      <style>{`
        .header {
          background: linear-gradient(180deg, #141414 0%, #0a0a0a 100%);
          padding: 24px 16px 20px;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }
        .header-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 12px;
          border: 2.5px solid var(--accent);
          padding: 2px;
          background: var(--accent);
        }
        .header-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .header-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--tg-text);
          margin-bottom: 4px;
        }
        .header-tagline {
          font-size: 13px;
          color: var(--tg-hint);
          margin-bottom: 8px;
          font-style: italic;
        }
        .header-location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--tg-hint);
          margin-bottom: 20px;
        }
        .location-icon {
          font-size: 11px;
        }
        .header-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          background: var(--card-bg);
          border-radius: var(--radius-sm);
          padding: 12px 20px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .stat-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--accent);
        }
        .stat-label {
          font-size: 11px;
          color: var(--tg-hint);
        }
        .stat-divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }
      `}</style>
    </header>
  )
}
