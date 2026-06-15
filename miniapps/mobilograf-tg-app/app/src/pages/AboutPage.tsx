import type { AboutInfo } from '../types/index.ts';
import aboutData from '../data/about.json';

const about: AboutInfo = aboutData;

export default function AboutPage() {
  return (
    <div className="page">
      <div className="about">
        <div
          className="about__photo"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '56px',
            background: 'var(--tg-theme-secondary-bg)',
          }}
        >
          📸
        </div>
        <h1 className="about__name">{about.name}</h1>
        <p className="about__subtitle">{about.title}</p>
        <p className="about__bio">{about.bio}</p>

        <div className="about__equipment">
          <h3>Оборудование</h3>
          <ul className="equipment-list">
            {about.equipment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
