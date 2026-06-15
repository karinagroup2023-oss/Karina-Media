import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { fetchResponsesForMyItems, fetchMyResponses } from '../lib/db';

export default function My({ items, myItems, userPlan, telegramId, onDelete, onUpgrade }) {
  const [tab, setTab] = useState('my');
  const [selectedItem, setSelectedItem] = useState(null);
  const [incomingResponses, setIncomingResponses] = useState([]);
  const [outgoingResponses, setOutgoingResponses] = useState([]);
  const [loadingResp, setLoadingResp] = useState(false);

  useEffect(() => {
    if (!telegramId) return;
    loadResponses();
  }, [telegramId, tab]);

  async function loadResponses() {
    if (tab !== 'incoming' && tab !== 'outgoing') return;
    setLoadingResp(true);
    try {
      if (tab === 'incoming') {
        const data = await fetchResponsesForMyItems(telegramId);
        setIncomingResponses(data);
      } else {
        const data = await fetchMyResponses(telegramId);
        setOutgoingResponses(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingResp(false);
    }
  }

  const totalIncoming = myItems.reduce((s, i) => s + (i.responses || 0), 0);

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">Мои объявления</div>
        {totalIncoming > 0 && (
          <span className="header-badge" style={{ background: '#E53935' }}>
            {totalIncoming} новых
          </span>
        )}
      </div>

      <div className="tabs" style={{ overflowX: 'auto' }}>
        <button className={`tab${tab === 'my' ? ' active' : ''}`} onClick={() => setTab('my')}>
          Мои <span className="tab-count">{myItems.length}</span>
        </button>
        <button className={`tab${tab === 'incoming' ? ' active' : ''}`} onClick={() => setTab('incoming')}>
          Отклики ко мне
          {totalIncoming > 0 && <span className="tab-count" style={{ background: '#E53935' }}>{totalIncoming}</span>}
        </button>
        <button className={`tab${tab === 'outgoing' ? ' active' : ''}`} onClick={() => setTab('outgoing')}>
          Мои отклики
        </button>
      </div>

      <div className="my-list">

        {/* МОИ ОБЪЯВЛЕНИЯ */}
        {tab === 'my' && (
          myItems.length === 0 ? (
            <div className="feed-empty">
              <div className="feed-empty-icon">📋</div>
              <div className="feed-empty-text">У вас пока нет объявлений</div>
            </div>
          ) : myItems.map(item => (
            <div key={item.id} className="my-card">
              <div className="my-card-body">
                <div className="my-card-row">
                  <div className="my-card-title">{item.title}</div>
                  <span className={`badge badge-${item.type}`} style={{ fontSize: 11, flexShrink: 0 }}>
                    {item.type === 'request' ? '📩' : '🏷️'}
                  </span>
                </div>
                <div className="card-meta" style={{ marginBottom: 0 }}>
                  <span className="card-meta-item">📍 {item.city}</span>
                  <span className="card-meta-item">📦 {item.quantity}</span>
                  {item.price && <span className="card-meta-item price">💰 {item.price}</span>}
                </div>
              </div>
              <div className="my-card-footer">
                <div className="my-card-status">
                  <span className="status-dot" />
                  Активно · {item.date}
                  {item.responses > 0 && (
                    <span
                      style={{ color: '#E53935', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => setTab('incoming')}
                    >
                      {item.responses} откл. →
                    </span>
                  )}
                </div>
                <button className="btn-delete" onClick={() => onDelete(item.id)}>Удалить</button>
              </div>
            </div>
          ))
        )}

        {/* ОТКЛИКИ КО МНЕ */}
        {tab === 'incoming' && (
          loadingResp ? (
            <div className="feed-empty"><div className="feed-empty-icon">⏳</div></div>
          ) : incomingResponses.length === 0 ? (
            <div className="feed-empty">
              <div className="feed-empty-icon">💬</div>
              <div className="feed-empty-text">Откликов пока нет.\nОни появятся здесь когда кто-то откликнется на ваши заявки</div>
            </div>
          ) : incomingResponses.map(r => (
            <div key={r.id} className="my-card">
              <div className="my-card-body">
                <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: 6 }}>
                  На заявку: «{r.item_title}»
                </div>
                <div className="my-card-row">
                  <div className="my-card-title">🏢 {r.responder_name}</div>
                  <span style={{ fontSize: 11, color: 'var(--hint)' }}>{r.date}</span>
                </div>
                {r.price && (
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                    💰 {r.price}
                  </div>
                )}
                {r.message && (
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 8 }}>
                    «{r.message}»
                  </div>
                )}
              </div>
              <div className="my-card-footer">
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📞 {r.responder_phone}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`https://wa.me/${r.responder_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Здравствуйте, по заявке «${r.item_title}» на Plix`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: '#25D366', color: 'white', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 6, display: 'inline-block' }}
                    onClick={e => e.stopPropagation()}
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${r.responder_phone}`}
                    style={{ background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', display: 'inline-block' }}
                  >
                    Позвонить
                  </a>
                </div>
              </div>
            </div>
          ))
        )}

        {/* МОИ ОТКЛИКИ */}
        {tab === 'outgoing' && (
          loadingResp ? (
            <div className="feed-empty"><div className="feed-empty-icon">⏳</div></div>
          ) : outgoingResponses.length === 0 ? (
            <div className="feed-empty">
              <div className="feed-empty-icon">📤</div>
              <div className="feed-empty-text">Вы ещё не откликались на заявки</div>
            </div>
          ) : outgoingResponses.map(r => (
            <div key={r.id} className="my-card">
              <div className="my-card-body">
                <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: 6 }}>Откликнулись на:</div>
                <div className="my-card-title" style={{ marginBottom: 6 }}>📋 {r.item_title}</div>
                {r.price && <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>💰 {r.price}</div>}
                {r.message && (
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 4 }}>
                    «{r.message}»
                  </div>
                )}
              </div>
              <div className="my-card-footer">
                <span style={{ fontSize: 12, color: 'var(--hint)' }}>{r.date}</span>
                <span style={{ fontSize: 12, color: 'var(--success-light)', fontWeight: 600 }}>✓ Отправлен</span>
              </div>
            </div>
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
    </div>
  );
}
