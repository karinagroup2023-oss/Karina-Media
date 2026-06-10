import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Review, Service } from '../types/index.ts';
import reviewsData from '../data/reviews.json';
import servicesData from '../data/services.json';

const reviews: Review[] = reviewsData;
const services: Service[] = servicesData;

const renderStars = (rating: number) =>
  '★'.repeat(rating) + '☆'.repeat(5 - rating);

const getServiceTitle = (serviceId: string) => {
  const service = services.find((s) => s.id === serviceId);
  return service ? service.title : serviceId;
};

export default function ReviewsPage() {
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="page">
      <div className="reviews-header">
        <div className="reviews-header__avg">{avgRating.toFixed(1)}</div>
        <div className="reviews-header__stars" style={{ color: 'var(--accent)' }}>
          {renderStars(Math.round(avgRating))}
        </div>
        <div className="reviews-header__count">
          {reviews.length} отзывов
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-card__header">
            <span className="review-card__name">{review.name}</span>
            <span className="review-card__date">
              {format(parseISO(review.date), 'd MMM yyyy', { locale: ru })}
            </span>
          </div>
          <div className="review-card__stars" style={{ color: 'var(--accent)' }}>
            {renderStars(review.rating)}
          </div>
          <div className="review-card__text">{review.text}</div>
          <span className="review-card__service">
            {getServiceTitle(review.serviceId)}
          </span>
        </div>
      ))}
    </div>
  );
}
