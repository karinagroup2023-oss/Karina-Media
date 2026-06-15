import { useNavigate } from 'react-router-dom';
import type { Service } from '../types/index.ts';
import servicesData from '../data/services.json';

const services: Service[] = servicesData;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU').format(price) + ' тг';

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1 className="section-title">Услуги</h1>
      <div className="services-list">
        {services.map((service) => {
          const minPrice = Math.min(...service.pricing.map((p) => p.price));
          return (
            <button
              key={service.id}
              className="service-card"
              onClick={() => navigate(`/services/${service.id}`)}
            >
              <span className="service-card__emoji">{service.emoji}</span>
              <div className="service-card__info">
                <div className="service-card__title">{service.title}</div>
                <div className="service-card__desc">{service.shortDescription}</div>
                <div className="service-card__price">от {formatPrice(minPrice)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
