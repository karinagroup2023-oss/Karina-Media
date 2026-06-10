import type { AboutInfo } from '../types/index.ts';
import { useTelegram } from '../hooks/useTelegram.ts';
import aboutData from '../data/about.json';

const about: AboutInfo = aboutData;

export default function ContactPage() {
  const { openLink, openTelegramLink } = useTelegram();

  return (
    <div className="page">
      <h1 className="section-title">Контакты</h1>

      <div className="contact-buttons">
        <button
          className="contact-btn contact-btn--accent"
          onClick={() => openTelegramLink(about.telegram)}
        >
          <span className="contact-btn__icon">💬</span>
          <span>Написать в Telegram</span>
        </button>

        <button
          className="contact-btn"
          onClick={() => {
            window.open(`tel:${about.phone.replace(/\s/g, '')}`, '_self');
          }}
        >
          <span className="contact-btn__icon">📞</span>
          <span>Позвонить {about.phone}</span>
        </button>

        <button
          className="contact-btn"
          onClick={() => openLink(about.instagram)}
        >
          <span className="contact-btn__icon">📷</span>
          <span>Instagram</span>
        </button>

      </div>
    </div>
  );
}
