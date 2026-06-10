import { useParams, useNavigate } from 'react-router-dom';
import type { Service } from '../types/index.ts';
import servicesData from '../data/services.json';

const services: Service[] = servicesData;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU').format(price) + ' тг';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="page">
        <p>Услуга не найдена</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="service-detail__header">
        <div className="service-detail__emoji">{service.emoji}</div>
        <h1 className="service-detail__title">{service.title}</h1>
        <p className="service-detail__desc">{service.fullDescription}</p>
      </div>

      <div className="pricing-cards">
        {service.pricing.map((tier, index) => {
          const isPopular = index === 1;
          return (
            <div
              key={tier.name}
              className={`pricing-card ${isPopular ? 'pricing-card--popular' : ''}`}
            >
              {isPopular && (
                <span className="pricing-card__badge">Популярный</span>
              )}
              <div className="pricing-card__name">{tier.name}</div>
              <div className="pricing-card__duration">{tier.duration}</div>
              <div className="pricing-card__price">
                {formatPrice(tier.price)}
              </div>
              <ul className="pricing-card__includes">
                {tier.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                className="pricing-card__btn"
                onClick={() =>
                  navigate(`/booking?service=${service.id}&tier=${index}`)
                }
              >
                Забронировать
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
