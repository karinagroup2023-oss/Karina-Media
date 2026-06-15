import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Service, Schedule } from '../types/index.ts';
import servicesData from '../data/services.json';
import scheduleData from '../data/schedule.json';

const services: Service[] = servicesData;
const schedule: Schedule = scheduleData;

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Access native Telegram WebApp object
function getTelegramWebApp(): any {
  try {
    return (window as any).Telegram?.WebApp;
  } catch {
    return null;
  }
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU').format(price) + ' тг';

const countryCodes = [
  { code: '+7', country: '🇰🇿 KZ / RU', digits: 10 },
  { code: '+998', country: '🇺🇿 UZ', digits: 9 },
  { code: '+996', country: '🇰🇬 KG', digits: 9 },
  { code: '+992', country: '🇹🇯 TJ', digits: 9 },
  { code: '+993', country: '🇹🇲 TM', digits: 8 },
  { code: '+994', country: '🇦🇿 AZ', digits: 9 },
  { code: '+374', country: '🇦🇲 AM', digits: 8 },
  { code: '+375', country: '🇧🇾 BY', digits: 9 },
  { code: '+380', country: '🇺🇦 UA', digits: 9 },
  { code: '+995', country: '🇬🇪 GE', digits: 9 },
  { code: '+90', country: '🇹🇷 TR', digits: 10 },
  { code: '+971', country: '🇦🇪 AE', digits: 9 },
  { code: '+1', country: '🇺🇸 US', digits: 10 },
  { code: '+44', country: '🇬🇧 UK', digits: 10 },
  { code: '+49', country: '🇩🇪 DE', digits: 10 },
];

function isValidLocalPhone(phone: string, expectedDigits: number): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length === expectedDigits;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();

  const webapp = getTelegramWebApp();
  const tgUser = webapp?.initDataUnsafe?.user as
    | { id?: number; first_name?: string; last_name?: string; username?: string }
    | undefined;

  const preselectedService = searchParams.get('service') || '';
  const preselectedTier = searchParams.get('tier') || '';

  // Validate preselected service exists
  const validPreselected = preselectedService
    ? services.some((s) => s.id === preselectedService)
    : false;

  const [step, setStep] = useState(validPreselected ? 2 : 1);
  const [selectedServiceId, setSelectedServiceId] = useState(
    validPreselected ? preselectedService : ''
  );
  const [selectedTierIndex, setSelectedTierIndex] = useState<number | null>(
    preselectedTier ? Number(preselectedTier) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState(
    tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : ''
  );
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedTier =
    selectedService && selectedTierIndex !== null
      ? selectedService.pricing[selectedTierIndex]
      : null;

  const today = startOfDay(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule.blockedDates.includes(dateStr);
  };

  const isDatePast = (date: Date) => {
    return isBefore(date, today);
  };

  const canGoBack = () => {
    const thisMonth = startOfMonth(new Date());
    return isBefore(thisMonth, startOfMonth(currentMonth));
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const blockedSlots = schedule.blockedSlots[dateStr] || [];
    const isToday = isSameDay(selectedDate, new Date());
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return schedule.timeSlots.map((slot) => {
      let pastTime = false;
      if (isToday) {
        const [h, m] = slot.split(':').map(Number);
        pastTime = h < currentHour || (h === currentHour && m <= currentMinute);
      }
      return {
        time: slot,
        available: !blockedSlots.includes(slot) && !pastTime,
      };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedServiceId;
      case 2:
        return !!selectedDate && !!selectedTime;
      case 3:
        return name.trim() !== '' && phone.trim() !== '' && isValidLocalPhone(phone, countryCode.digits);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 3 && !isValidLocalPhone(phone, countryCode.digits)) {
      setPhoneError(`Введите ${countryCode.digits} цифр номера`);
      return;
    }
    setPhoneError('');
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const dateStr = selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: ru }) : '';
      const tierInfo = selectedTier ? ` (${selectedTier.name})` : '';
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: (selectedService?.title || '') + tierInfo,
          date: dateStr,
          time: selectedTime,
          name,
          phone: `${countryCode.code} ${phone}`,
          comment,
          tgUser: tgUser ? {
            id: tgUser.id,
            firstName: tgUser.first_name || '',
            lastName: tgUser.last_name || '',
            username: tgUser.username || '',
          } : null,
          initData: webapp?.initData || '',
        }),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Ошибка отправки. Попробуйте ещё раз.');
      }
    } catch {
      alert('Ошибка сети. Проверьте подключение.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="success">
          <div className="success__icon">✅</div>
          <h2 className="success__title">Заявка отправлена!</h2>
          <p className="success__text">
            Спасибо, {name}! Карина свяжется с вами в Telegram для
            подтверждения записи.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="section-title">Запись на съёмку</h1>

      <div className="booking-steps">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`booking-step ${
              s === step
                ? 'booking-step--active'
                : s < step
                  ? 'booking-step--done'
                  : ''
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="booking__title">Выберите услугу</h2>
          <div className="service-select">
            {services.map((service) => (
              <button
                key={service.id}
                className={`service-select__item ${
                  selectedServiceId === service.id
                    ? 'service-select__item--selected'
                    : ''
                }`}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setSelectedTierIndex(null);
                }}
              >
                <span>{service.emoji}</span>
                <span>{service.title}</span>
              </button>
            ))}
          </div>

          {selectedService && (
            <div style={{ marginTop: '16px' }}>
              <h3 className="booking__subtitle">Выберите пакет</h3>
              <div className="tier-select">
                {selectedService.pricing.map((tier, index) => (
                  <button
                    key={tier.name}
                    className={`tier-select__item ${
                      selectedTierIndex === index ? 'tier-select__item--selected' : ''
                    }`}
                    onClick={() => setSelectedTierIndex(index)}
                  >
                    <div className="tier-select__name">{tier.name}</div>
                    <div className="tier-select__price">{formatPrice(tier.price)}</div>
                    <div className="tier-select__duration">{tier.duration}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="booking__title">Выберите дату и время</h2>
          <p className="booking__subtitle">
            Серые даты недоступны для записи
          </p>

          <div className="calendar">
            <div className="calendar__header">
              <button
                className="calendar__nav-btn"
                disabled={!canGoBack()}
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                ‹
              </button>
              <span className="calendar__month">
                {format(currentMonth, 'LLLL yyyy', { locale: ru })}
              </span>
              <button
                className="calendar__nav-btn"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                ›
              </button>
            </div>

            <div className="calendar__weekdays">
              {weekdays.map((day) => (
                <div key={day} className="calendar__weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar__days">
              {calendarDays.map((day, i) => {
                const inMonth = isSameMonth(day, currentMonth);
                const disabled =
                  !inMonth || isDatePast(day) || isDateBlocked(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);

                return (
                  <button
                    key={i}
                    className={`calendar__day ${
                      isSelected ? 'calendar__day--selected' : ''
                    } ${isToday ? 'calendar__day--today' : ''}`}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime('');
                    }}
                  >
                    {inMonth ? format(day, 'd') : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="time-slots">
              {getAvailableTimeSlots().map((slot) => (
                <button
                  key={slot.time}
                  className={`time-slot ${
                    selectedTime === slot.time ? 'time-slot--selected' : ''
                  }`}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="booking__title">Контактные данные</h2>
          <div className="form-group">
            <label className="form-label">Имя</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Телефон</label>
            <div className="phone-input">
              <select
                className="phone-input__code"
                value={countryCode.code}
                onChange={(e) => {
                  const found = countryCodes.find((c) => c.code === e.target.value);
                  if (found) {
                    setCountryCode(found);
                    setPhone('');
                    setPhoneError('');
                  }
                }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.country} {c.code}
                  </option>
                ))}
              </select>
              <input
                className={`phone-input__number ${phoneError ? 'form-input--error' : ''}`}
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d\s\-]/g, '');
                  setPhone(val);
                  if (phoneError) setPhoneError('');
                }}
                placeholder={'0'.repeat(countryCode.digits)}
                maxLength={countryCode.digits + 4}
              />
            </div>
            {phoneError && <span className="form-error">{phoneError}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Комментарий</label>
            <textarea
              className="form-input form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Пожелания к съёмке (необязательно)"
              maxLength={500}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="booking__title">Подтверждение</h2>
          <div className="summary">
            <div className="summary__row">
              <span className="summary__label">Услуга</span>
              <span className="summary__value">
                {selectedService?.title}
              </span>
            </div>
            {selectedTier && (
              <>
                <div className="summary__row">
                  <span className="summary__label">Пакет</span>
                  <span className="summary__value">
                    {selectedTier.name} — {formatPrice(selectedTier.price)}
                  </span>
                </div>
                <div className="summary__row">
                  <span className="summary__label">Длительность</span>
                  <span className="summary__value">{selectedTier.duration}</span>
                </div>
              </>
            )}
            <div className="summary__row">
              <span className="summary__label">Дата</span>
              <span className="summary__value">
                {selectedDate
                  ? format(selectedDate, 'd MMMM yyyy', { locale: ru })
                  : ''}
              </span>
            </div>
            <div className="summary__row">
              <span className="summary__label">Время</span>
              <span className="summary__value">{selectedTime}</span>
            </div>
            <div className="summary__row">
              <span className="summary__label">Имя</span>
              <span className="summary__value">{name}</span>
            </div>
            <div className="summary__row">
              <span className="summary__label">Телефон</span>
              <span className="summary__value">{countryCode.code} {phone}</span>
            </div>
            {comment && (
              <div className="summary__row">
                <span className="summary__label">Комментарий</span>
                <span className="summary__value">{comment}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        {step > 1 && (
          <button className="btn btn--secondary" onClick={handleBack}>
            Назад
          </button>
        )}
        {step < 4 ? (
          <button
            className="btn btn--primary"
            disabled={!canProceed()}
            onClick={handleNext}
            style={{ opacity: canProceed() ? 1 : 0.5 }}
          >
            Далее
          </button>
        ) : (
          <button className="btn btn--primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        )}
      </div>
    </div>
  );
}
