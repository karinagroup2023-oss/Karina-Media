import { useState, useMemo } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ResponseModal from '../components/ResponseModal';
import { CATEGORIES } from '../data/mockData';

export default function Home({ items, userPlan, telegramId, tgUser, loading, onUpgrade }) {
  const [tab, setTab] = useState('request');
  const [catFilter, setCatFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [respondItem, setRespondItem] = useState(null);
  const [successToast, setSuccessToast] = useState(false);

  const requests = items.filter(i => i.type === 'request');
  const offers = items.filter(i => i.type === 'offer');

  const filtered = useMemo(() => {
    const list = tab === 'request' ? requests : offers;
    if (catFilter === 'all') return list;
    return list.filter(i => i.category === CATEGORIES.find(c => c.id === catFilter)?.label);
  }, [tab, catFilter, requests, offers]);

  const handleSuccess = () => {
    setRespondItem(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  return (
    <div className="screen">
      <div className="header">
        <div className="header-logo">
          <div className="header-logo-icon">P</div>
          <div className="header-logo-text">Plix</div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--hint)', marginLeft: 6 }}>Стройматериалы KZ</span>
        {userPlan !== 'free' && (
          <span className="header-badge">{userPlan === 'yearly' ? '⭐ Год' : '✓ Pro'}</span>
        )}
      </div>

      <div className="tabs">
        <button className={`tab${tab === 'request' ? ' active' : ''}`} onClick={() => setTab('request')}>
          📩 Заявки <span className="tab-count">{requests.length}</span>
        </button>
        <button className={`tab${tab === 'offer' ? ' active' : ''}`} onClick={() => setTab('offer')}>
          🏷️ Предложения <span className="tab-count">{offers.length}</span>
        </button>
      </div>

      <div className="category-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cat-chip${catFilter === cat.id ? ' active' : ''}`}
            onClick={() => setCatFilter(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="feed">
        {loading ? (
          [1, 2, 3].map(n => (
            <div key={n} className="card" style={{ pointerEvents: 'none' }}>
              <div style={{ padding: 14 }}>
                <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 14, width: '75%' }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="feed-empty">
            <div className="feed-empty-icon">🔍</div>
            <div className="feed-empty-text">Нет объявлений в этой категории</div>
          </div>
        ) : (
          filtered.map(item => (
            <Card
              key={item.id}
              item={item}
              userPlan={userPlan}
              telegramId={telegramId}
              onOpen={setSelectedItem}
              onRespond={setRespondItem}
            />
          ))
        )}
      </div>

      {selectedItem && (
        <Modal
          item={selectedItem}
          userPlan={userPlan}
          onClose={() => setSelectedItem(null)}
          onUpgrade={() => { setSelectedItem(null); onUpgrade(); }}
        />
      )}

      {respondItem && (
        <ResponseModal
          item={respondItem}
          tgUser={tgUser}
          telegramId={telegramId}
          onClose={() => setRespondItem(null)}
          onSuccess={handleSuccess}
        />
      )}

      {successToast && (
        <div className="toast">
          ✅ Отклик отправлен! Владелец получит уведомление в Telegram.
        </div>
      )}
    </div>
  );
}
