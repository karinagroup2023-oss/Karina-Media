import { useNavigate } from 'react-router-dom';

const navCards = [
  { icon: '📷', label: 'Портфолио', path: '/portfolio' },
  { icon: '💼', label: 'Услуги', path: '/services' },
  { icon: '⭐', label: 'Отзывы', path: '/reviews' },
  { icon: '📅', label: 'Записаться', path: '/booking' },
  { icon: '📞', label: 'Контакты', path: '/contact' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="hero">
        <div
          className="hero__photo"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            background: 'var(--tg-theme-secondary-bg)',
          }}
        >
          📸
        </div>
        <h1 className="hero__name">Карина</h1>
        <p className="hero__title">Мобилограф в Астане</p>
        <div className="hero__stats">
          <div className="hero__stat">
            <div className="hero__stat-value">3+</div>
            <div className="hero__stat-label">лет опыта</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">200+</div>
            <div className="hero__stat-label">съёмок</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">5.0</div>
            <div className="hero__stat-label">рейтинг</div>
          </div>
        </div>
      </div>

      <div className="nav-cards">
        {navCards.map((card) => (
          <button
            key={card.path}
            className="nav-card"
            onClick={() => navigate(card.path)}
          >
            <span className="nav-card__icon">{card.icon}</span>
            <span className="nav-card__label">{card.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
