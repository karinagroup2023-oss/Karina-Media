const packages = [
  {
    id: 'video-short',
    name: 'Видеомонтаж до 1 мин',
    price: 'от 1 200',
    unit: '₽',
    tag: null,
    icon: '🎬',
    features: [
      'Reels, Shorts, TikTok',
      'Монтаж + цветокоррекция',
      'Музыка и звук',
      'Субтитры по запросу',
      'Цена зависит от сложности',
    ],
  },
  {
    id: 'podcast',
    name: 'Монтаж подкаста',
    price: 'от 5 000',
    unit: '₽',
    tag: 'Популярный',
    icon: '🎙️',
    features: [
      'Видео до 1 часа',
      'Чистка звука и пауз',
      'Заставка и аутро',
      'Главы и таймкоды',
      'Адаптация под платформу',
    ],
  },
  {
    id: 'visual',
    name: 'Визуал / Обложки',
    price: 'от 3 000',
    unit: '₽',
    tag: null,
    icon: '🎨',
    features: [
      'Раскладка на 9 обложек',
      'Единый стиль ленты',
      'Форматы для Instagram',
      'Исходники в архиве',
      'До 2 правок',
    ],
  },
  {
    id: 'education',
    name: 'Обучение монтажу',
    price: 'от 7 500',
    unit: '₽',
    tag: 'Онлайн',
    icon: '🎓',
    features: [
      'Курс 2 недели',
      'Индивидуальные занятия',
      'Выбор программы (Premiere / CapCut / DaVinci)',
      'Домашние задания + разбор',
      'Поддержка после курса',
    ],
  },
]

function handleBook(packageName) {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.HapticFeedback?.impactOccurred('medium')
    tg.showPopup({
      title: 'Заявка отправлена',
      message: `Услуга: ${packageName}. Напишите мне в Telegram или WhatsApp — обсудим детали!`,
      buttons: [{ type: 'ok' }],
    })
  } else {
    alert(`Выбрана услуга: ${packageName}`)
  }
}

export default function Services() {
  return (
    <div className="services fade-in">
      <p className="section-title">Услуги и цены</p>

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
              Заказать
            </button>
          </div>
        ))}
      </div>

      <div className="note-card">
        <p className="note-title">📌 Важно</p>
        <ul className="note-list">
          <li>Стоимость видеомонтажа может меняться в зависимости от сложности</li>
          <li>Срочные заказы — по договорённости</li>
          <li>Оплата: 50% предоплата, 50% после сдачи</li>
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
        .package-icon { font-size: 28px; flex-shrink: 0; }
        .package-name {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 2px;
          padding-right: 70px;
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
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--tg-hint);
        }
        .feature-check {
          color: var(--accent);
          font-weight: 700;
          font-size: 12px;
          margin-top: 2px;
          flex-shrink: 0;
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
