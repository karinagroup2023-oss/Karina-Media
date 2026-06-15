export default function Header() {
  return (
    <header className="header">
      <div className="header-cover">
        <img
          src="./natalia.jpg"
          alt="Наталия"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&q=80' }}
        />
        <div className="header-overlay">
          <h1 className="header-name">НАТАЛИЯ</h1>
          <p className="header-tagline">Видеомонтаж · Визуал · Обучение</p>
          <div className="header-location">
            <span>📍</span>
            <span>Москва, Россия</span>
          </div>
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
          border-bottom: 1px solid var(--border);
        }
        .header-cover {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
        }
        .header-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .header-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px 16px;
        }
        .header-name {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          margin-bottom: 4px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .header-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          margin-bottom: 6px;
          font-style: italic;
        }
        .header-location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }
        .header-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          background: var(--card-bg);
          padding: 14px 20px;
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
