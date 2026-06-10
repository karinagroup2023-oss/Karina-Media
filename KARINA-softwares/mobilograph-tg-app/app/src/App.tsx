import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import PortfolioPage from './pages/PortfolioPage.tsx';
import ServicesPage from './pages/ServicesPage.tsx';
import ServiceDetailPage from './pages/ServiceDetailPage.tsx';
import BookingPage from './pages/BookingPage.tsx';
import ReviewsPage from './pages/ReviewsPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';

const navItems = [
  { path: '/', icon: '🏠', label: 'Главная' },
  { path: '/portfolio', icon: '📷', label: 'Портфолио' },
  { path: '/services', icon: '💼', label: 'Услуги' },
  { path: '/reviews', icon: '⭐', label: 'Отзывы' },
  { path: '/booking', icon: '📅', label: 'Запись' },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <nav className="nav">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              className={`nav__item ${isActive ? 'nav__item--active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav__icon">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
