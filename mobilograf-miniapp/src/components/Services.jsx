const packages = [
  {
    id: 'mini',
    name: 'Мини-сессия',
    price: '15 000',
    unit: '₸',
    tag: null,
    icon: '📷',
    features: [
      '1 час съёмки',
      '10 обработанных фото',
      '1 локация',
      'Онлайн-галерея',
      'Срок: 5 дней',
    ],
  },
  {
    id: 'standard',
    name: 'Стандарт',
    price: '35 000',
    unit: '₸',
    tag: 'Популярный',
    icon: '✨',
    features: [
      '3 часа съёмки',
      '30 обработанных фото',
      'До 2 локаций',
      'Онлайн-галерея',
      'Печать 5 фото (10×15)',
      'Срок: 3 дня',
    ],
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: '75 000',
    unit: '₸',
    tag: 'Лучший выбор',
    icon: '👑',
    features: [
      'Полный день (8 часов)',
      '100+ обработанных фото',
      'Неограниченные локации',
      'Онлайн-галерея',
      'Фотокнига (20 стр.)',
      'Приоритетная обработка',
      'Срок: 2 дня',
    ],
  },
]

function handleBook(packageName) {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.HapticFeedback?.impactOccurred('medium')
    tg.showPopup({
      title: 'Бронирование',
      message: `Вы выбрали: ${packageName}. Мы свяжемся с вами в ближайшее время!`,
      buttons: [{ type: 'ok' }],
    })
  } else {
    alert(`Выбран пакет: ${packageName}`)
  }
}

export default function Services() {
  return (
    <div className="services fade-in">
      <p className="section-title">Пакеты услуг</p>

      <div className="packages">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`package-card ${pkg.tag ? 'featured' : ''}`}>
            {pkg.tag && <div className="package-tag">{pkg.tag}</div>}
            <div className="package-header">
              <span className="package-icon">{pkg.icon}</span>
              <div>
                <h3 className="package-name">{pkg.name}</h3>
                <div className="package-price">
                  <span className="price-value">{pkg.price}</span>
                  <span className="price-unit"> {pkg.unit}</span>
                </div>
              </div>
            </div>
            <ul className="package-features">
              {pkg.features.map((f, i) => (
                <li key={i}>
                  <span className="feature-check">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`btn-primary ${pkg.tag ? '' : 'btn-outline'}`}
              onClick={() => handleBook(pkg.name)}
            >
              Забронировать
            </button>
          </div>
        ))}
      </div>

      <div className="note-card">
        <p className="note-title">📌 Важно знать</p>
        <ul className="note-list">
          <li>Предоплата 50% при бронировании</li>
          <li>Выезд за город — доп. оплата от 5 000 ₸</li>
          <li>Индивидуальные условия для свадеб</li>
        </ul>
      </div>

      <style>{`
        .services { animation: fadeIn 0.35s ease; }
        .packages { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .package-card {
          background: var(--card-bg);
          border-radius: var(--radius);
          padding: 18px;
          border: 1.5px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .package-card.featured {
          border-color: var(--accent);
          background: linear-gradient(135deg, #1e1a0e 0%, var(--card-bg) 100%);
        }
        .package-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--accent);
          color: #000;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }
        .package-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .package-icon { font-size: 28px; }
        .package-name {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .package-price { display: flex; align-items: baseline; }
        .price-value {
          font-size: 22px;
          font-weight: 700;
          color: var(--accent);
        }
        .price-unit {
          font-size: 14px;
          color: var(--tg-hint);
        }
        .package-features {
          list-style: none;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .package-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--tg-hint);
        }
        .feature-check {
          color: var(--accent);
          font-weight: 700;
          font-size: 12px;
        }
        .btn-outline {
          background: transparent !important;
          border: 1.5px solid var(--accent);
          color: var(--accent) !important;
        }
        .note-card {
          background: var(--card-bg);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          border-left: 3px solid var(--accent);
        }
        .note-title {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .note-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .note-list li {
          font-size: 12px;
          color: var(--tg-hint);
          padding-left: 12px;
          position: relative;
        }
        .note-list li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--accent);
        }
      `}</style>
    </div>
  )
}
