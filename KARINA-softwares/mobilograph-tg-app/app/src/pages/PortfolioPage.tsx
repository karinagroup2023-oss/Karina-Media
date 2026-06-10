import { useState } from 'react';
import type { PortfolioItem } from '../types/index.ts';
import portfolioData from '../data/portfolio.json';

const portfolio: PortfolioItem[] = portfolioData;

const categories = [
  { key: 'all', label: 'Все' },
  { key: 'events', label: 'Мероприятия' },
  { key: 'love-story', label: 'Love Story' },
  { key: 'content', label: 'Контент' },
  { key: 'product', label: 'Предметная' },
  { key: 'portrait', label: 'Портретная' },
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeFilter === 'all'
      ? portfolio
      : portfolio.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1);
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <div className="page">
      <h1 className="section-title">Портфолио</h1>

      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`filter-btn ${activeFilter === cat.key ? 'filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filtered.map((item, index) => (
          <div
            key={item.id}
            className="portfolio-item"
            onClick={() => openLightbox(index)}
          >
            <img src={item.image} alt={item.caption} loading="lazy" />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button
            className="lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            ✕
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            ‹
          </button>
          <img
            src={filtered[lightboxIndex].image}
            alt={filtered[lightboxIndex].caption}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            ›
          </button>
          <div className="lightbox__caption">{filtered[lightboxIndex].caption}</div>
        </div>
      )}
    </div>
  );
}
