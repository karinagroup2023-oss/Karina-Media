import { useState } from 'react'

const categories = ['Все', 'Монтаж', 'Подкасты', 'Визуал', 'Обучение']

const works = [
  { id: 1, category: 'Монтаж',    emoji: '🎬', title: 'Reels для бренда',      desc: 'Динамичный монтаж 30 сек' },
  { id: 2, category: 'Визуал',    emoji: '🎨', title: 'Обложки Instagram',     desc: 'Раскладка на 9 постов' },
  { id: 3, category: 'Подкасты',  emoji: '🎙️', title: 'Подкаст «Бизнес-час»', desc: 'Монтаж 45 мин + главы' },
  { id: 4, category: 'Монтаж',    emoji: '✂️', title: 'TikTok × 5 роликов',   desc: 'Серия коротких видео' },
  { id: 5, category: 'Визуал',    emoji: '🖼️', title: 'Личный бренд',         desc: 'Единый визуал ленты' },
  { id: 6, category: 'Обучение',  emoji: '🎓', title: 'Курс Premiere Pro',    desc: 'Студент за 2 недели' },
  { id: 7, category: 'Подкасты',  emoji: '🎧', title: 'Интервью-подкаст',     desc: 'Два спикера, 60 мин' },
  { id: 8, category: 'Монтаж',    emoji: '🎥', title: 'Клип для музыканта',   desc: 'Короткометражный формат' },
  { id: 9, category: 'Визуал',    emoji: '💎', title: 'Сторис-шаблоны',       desc: '12 анимированных сторис' },
]

const bgColors = [
  '#1a1200', '#0d1a0d', '#0d0d1a', '#1a0d0d',
  '#001a1a', '#1a001a', '#1a1a00', '#00101a', '#1a0d1a',
]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [selected, setSelected] = useState(null)

  const filtered = activeCategory === 'Все'
    ? works
    : works.filter(w => w.category === activeCategory)

  const handleOpen = (work) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
    setSelected(work)
  }

  const handleBook = () => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.HapticFeedback?.impactOccurred('medium')
      tg.openLink('https://t.me/natalipnv')
    } else {
      window.open('https://t.me/natalipnv', '_blank')
    }
    setSelected(null)
  }

  return (
    <div className="portfolio fade-in">
      <p className="section-title">Мои работы</p>

      <div className="filter-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="works-grid">
        {filtered.map((work, i) => (
          <div
            key={work.id}
            className="work-card"
            style={{ animationDelay: `${i * 0.05}s`, background: bgColors[work.id - 1] }}
            onClick={() => handleOpen(work)}
          >
            <span className="work-emoji">{work.emoji}</span>
            <p className="work-title">{work.title}</p>
            <p className="work-desc">{work.desc}</p>
            <span className="work-tag">{work.category}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <span className="modal-emoji">{selected.emoji}</span>
            <h3 className="modal-title">{selected.title}</h3>
            <p className="modal-desc">{selected.desc}</p>
            <p className="modal-tag">{selected.category}</p>
            <button className="btn-primary" onClick={handleBook}>
              ✈️ Заказать похожее
            </button>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
          </div>
        </div>
      )}

      <style>{`
        .portfolio { animation: fadeIn 0.35s ease; }
        .filter-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 16px;
          margin-bottom: 16px;
          scrollbar-width: none;
        }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .filter-btn {
          white-space: nowrap;
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--tg-hint);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .filter-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #000;
          font-weight: 600;
        }
        .works-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .work-card {
          border-radius: var(--radius-sm);
          padding: 16px 12px;
          cursor: pointer;
          animation: fadeIn 0.4s ease both;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: transform 0.2s;
          min-height: 130px;
        }
        .work-card:active { transform: scale(0.97); }
        .work-emoji { font-size: 28px; margin-bottom: 4px; }
        .work-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--tg-text);
          line-height: 1.3;
        }
        .work-desc {
          font-size: 11px;
          color: var(--tg-hint);
          line-height: 1.4;
          flex: 1;
        }
        .work-tag {
          font-size: 10px;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .modal-card {
          background: var(--card-bg);
          border: 1.5px solid var(--accent);
          border-radius: var(--radius);
          padding: 28px 20px 20px;
          width: 100%;
          max-width: 340px;
          text-align: center;
          position: relative;
        }
        .modal-emoji { font-size: 48px; display: block; margin-bottom: 12px; }
        .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .modal-desc { font-size: 13px; color: var(--tg-hint); margin-bottom: 8px; }
        .modal-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: #000;
          background: var(--accent);
          padding: 3px 12px;
          border-radius: 20px;
          margin-bottom: 20px;
        }
        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--border);
          color: var(--tg-hint);
          border: none;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
