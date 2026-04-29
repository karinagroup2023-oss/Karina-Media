import { useState } from 'react'

const categories = ['Все', 'Портреты', 'Свадьбы', 'События', 'Природа']

const photos = [
  { id: 1, category: 'Портреты', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', alt: 'Портрет' },
  { id: 2, category: 'Свадьбы',  src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', alt: 'Свадьба' },
  { id: 3, category: 'События',  src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', alt: 'Событие' },
  { id: 4, category: 'Природа',  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', alt: 'Природа' },
  { id: 5, category: 'Портреты', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', alt: 'Портрет мужской' },
  { id: 6, category: 'Свадьбы',  src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80', alt: 'Свадебная пара' },
  { id: 7, category: 'Природа',  src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', alt: 'Пейзаж' },
  { id: 8, category: 'События',  src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80', alt: 'Корпоратив' },
  { id: 9, category: 'Портреты', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', alt: 'Женский портрет' },
]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [lightbox, setLightbox] = useState(null)

  const filtered = activeCategory === 'Все'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  const openLightbox = (photo) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
    }
    setLightbox(photo)
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

      <div className="photo-grid">
        {filtered.map((photo, i) => (
          <div
            key={photo.id}
            className="photo-card"
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => openLightbox(photo)}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className="photo-overlay">
              <span className="photo-category">{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src.replace('w=400', 'w=800')} alt={lightbox.alt} />
            <p className="lightbox-label">{lightbox.category}</p>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
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
        .photo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .photo-card {
          position: relative;
          border-radius: var(--radius-sm);
          overflow: hidden;
          aspect-ratio: 1;
          cursor: pointer;
          animation: fadeIn 0.4s ease both;
          background: var(--card-bg);
        }
        .photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
          display: block;
        }
        .photo-card:active img {
          transform: scale(1.04);
        }
        .photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
          display: flex;
          align-items: flex-end;
          padding: 10px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .photo-card:hover .photo-overlay { opacity: 1; }
        .photo-category {
          font-size: 11px;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .lightbox-inner {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        .lightbox-inner img {
          width: 100%;
          border-radius: var(--radius);
          display: block;
        }
        .lightbox-label {
          text-align: center;
          color: var(--tg-hint);
          font-size: 13px;
          margin-top: 12px;
        }
        .lightbox-close {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: #000;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
