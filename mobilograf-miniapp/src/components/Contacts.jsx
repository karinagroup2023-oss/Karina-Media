const contacts = [
  {
    icon: '✈️',
    label: 'Telegram',
    value: '@mobilograf',
    href: 'https://t.me/mobilograf',
    primary: true,
  },
  {
    icon: '📷',
    label: 'Instagram',
    value: '@mobilograf.kz',
    href: 'https://instagram.com/mobilograf.kz',
    primary: false,
  },
  {
    icon: '📞',
    label: 'Телефон',
    value: '+7 777 123 45 67',
    href: 'tel:+77771234567',
    primary: false,
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@mobilograf.kz',
    href: 'mailto:hello@mobilograf.kz',
    primary: false,
  },
]

function handleContact(contact) {
  const tg = window.Telegram?.WebApp
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light')
  }
  if (tg?.openLink) {
    tg.openLink(contact.href)
  } else {
    window.open(contact.href, '_blank')
  }
}

function handleQuickBook() {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.HapticFeedback?.impactOccurred('medium')
    tg.showPopup({
      title: 'Быстрое бронирование',
      message: 'Напишите нам в Telegram, и мы подберём удобное время для съёмки!',
      buttons: [
        { id: 'open', type: 'default', text: 'Открыть Telegram' },
        { type: 'cancel', text: 'Закрыть' },
      ],
    }, (id) => {
      if (id === 'open') tg.openLink('https://t.me/mobilograf')
    })
  } else {
    window.open('https://t.me/mobilograf', '_blank')
  }
}

export default function Contacts() {
  return (
    <div className="contacts fade-in">
      <p className="section-title">Связаться</p>

      <div className="contacts-list">
        {contacts.map((c) => (
          <button
            key={c.label}
            className={`contact-item ${c.primary ? 'primary-contact' : ''}`}
            onClick={() => handleContact(c)}
          >
            <span className="contact-icon">{c.icon}</span>
            <div className="contact-text">
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </div>
            <span className="contact-arrow">›</span>
          </button>
        ))}
      </div>

      <div className="book-section">
        <p className="book-title">Готовы создать воспоминания?</p>
        <p className="book-sub">Запишитесь на съёмку прямо сейчас — места ограничены</p>
        <button className="btn-primary" onClick={handleQuickBook}>
          📸 Записаться на съёмку
        </button>
      </div>

      <div className="schedule-card">
        <p className="schedule-title">🕐 График работы</p>
        <div className="schedule-rows">
          <div className="schedule-row">
            <span>Пн — Пт</span>
            <span className="schedule-time">10:00 — 20:00</span>
          </div>
          <div className="schedule-row">
            <span>Сб — Вс</span>
            <span className="schedule-time">09:00 — 22:00</span>
          </div>
        </div>
      </div>

      <style>{`
        .contacts { animation: fadeIn 0.35s ease; }
        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--card-bg);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .contact-item:active { opacity: 0.8; }
        .contact-item.primary-contact {
          border-color: var(--accent);
          background: var(--accent-dim);
        }
        .contact-icon { font-size: 22px; flex-shrink: 0; }
        .contact-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .contact-label {
          font-size: 11px;
          color: var(--tg-hint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .contact-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--tg-text);
        }
        .primary-contact .contact-value { color: var(--accent); }
        .contact-arrow {
          font-size: 20px;
          color: var(--tg-hint);
        }
        .book-section {
          background: linear-gradient(135deg, #1e1a0e 0%, #141414 100%);
          border: 1.5px solid var(--accent);
          border-radius: var(--radius);
          padding: 20px 16px;
          text-align: center;
          margin-bottom: 16px;
        }
        .book-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .book-sub {
          font-size: 12px;
          color: var(--tg-hint);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .schedule-card {
          background: var(--card-bg);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
        }
        .schedule-title {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .schedule-rows { display: flex; flex-direction: column; gap: 6px; }
        .schedule-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--tg-hint);
        }
        .schedule-time { color: var(--accent); font-weight: 500; }
      `}</style>
    </div>
  )
}
