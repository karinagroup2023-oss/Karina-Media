export default function BottomNav({ active, onChange, notify }) {
  const items = [
    { id: 'home', label: 'Лента', icon: '🏗️' },
    { id: 'create', label: 'Создать', icon: '➕' },
    { id: 'my', label: 'Мои', icon: '📋' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item${active === item.id ? ' active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-item-icon">
            {item.icon}
            {item.id === 'my' && notify > 0 && <span className="nav-dot" />}
          </span>
          <span className="nav-item-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
