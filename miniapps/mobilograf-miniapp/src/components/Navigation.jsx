const tabs = [
  { id: 'portfolio', label: 'Портфолио', icon: '🖼' },
  { id: 'services',  label: 'Услуги',    icon: '💎' },
  { id: 'contacts',  label: 'Контакты',  icon: '📩' },
]

export default function Navigation({ activePage, onNavigate }) {
  const handleClick = (id) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
    onNavigate(id)
  }

  return (
    <nav className="nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activePage === tab.id ? 'active' : ''}`}
          onClick={() => handleClick(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}

      <style>{`
        .nav {
          display: flex;
          background: var(--tg-secondary-bg);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 10px 4px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--tg-hint);
          font-size: 11px;
          font-weight: 500;
          transition: color 0.2s;
          position: relative;
        }
        .nav-tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 2px;
          background: var(--accent);
          border-radius: 2px 2px 0 0;
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .nav-tab.active {
          color: var(--accent);
        }
        .nav-tab.active::after {
          transform: scaleX(1);
        }
        .nav-icon {
          font-size: 18px;
        }
        .nav-label {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </nav>
  )
}
