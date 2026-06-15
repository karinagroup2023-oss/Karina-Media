import { useState, useEffect, useRef } from 'react';
import './App.css';
import { fetchItems, fetchMyItems, createItem, deleteItem, fetchSubscription, checkIsTeamMember } from './lib/db';
import { MOCK_ITEMS } from './data/mockData';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import Create from './screens/Create';
import My from './screens/My';
import Profile from './screens/Profile';

const DEMO_TG_ID = 999999999;

export default function App() {
  const [screen, setScreen] = useState('home');
  const [tgUser, setTgUser] = useState(null);
  const [telegramId, setTelegramId] = useState(DEMO_TG_ID);
  const [userPlan, setUserPlan] = useState('free');
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadSeq = useRef(0);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.('#1565C0');
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTgUser(user);
        setTelegramId(user.id);
      }
    }
  }, []);

  useEffect(() => {
    loadAll(telegramId, tgUser?.username || null);
  }, [telegramId]);

  async function loadAll(id, username) {
    const seq = ++loadSeq.current;
    setLoading(true);
    try {
      const [allItems, ownItems, plan, teamMember] = await Promise.all([
        fetchItems(),
        fetchMyItems(id),
        fetchSubscription(id, username),
        checkIsTeamMember(id, username),
      ]);
      if (seq !== loadSeq.current) return;
      setItems(allItems);
      setMyItems(ownItems);
      setUserPlan(plan);
      setIsTeamMember(teamMember);
    } catch (err) {
      if (seq !== loadSeq.current) return;
      console.warn('Supabase не настроен, используем мок-данные:', err.message);
      setItems(MOCK_ITEMS);
    } finally {
      if (seq === loadSeq.current) setLoading(false);
    }
  }

  const handleAdd = async (newItemData) => {
    try {
      const saved = await createItem(newItemData, telegramId);
      setItems(prev => [saved, ...prev]);
      setMyItems(prev => [saved, ...prev]);
    } catch {
      setItems(prev => [newItemData, ...prev]);
      setMyItems(prev => [newItemData, ...prev]);
    }
    setScreen('my');
  };

  const handleDelete = async (id) => {
    try { await deleteItem(id); } catch { }
    setMyItems(prev => prev.filter(i => i.id !== id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const goToUpgrade = () => setScreen('profile');

  return (
    <div className="app">
      {screen === 'home' && (
        <Home
          items={items}
          userPlan={userPlan}
          telegramId={telegramId}
          tgUser={tgUser}
          loading={loading}
          onUpgrade={goToUpgrade}
        />
      )}
      {screen === 'create' && (
        <Create
          userPlan={userPlan}
          onAdd={handleAdd}
          onUpgrade={goToUpgrade}
        />
      )}
      {screen === 'my' && (
        <My
          items={items}
          myItems={myItems}
          userPlan={userPlan}
          telegramId={telegramId}
          onDelete={handleDelete}
          onUpgrade={goToUpgrade}
        />
      )}
      {screen === 'profile' && (
        <Profile
          tgUser={tgUser}
          telegramId={telegramId}
          userPlan={userPlan}
          isTeamMember={isTeamMember}
          onPlanChange={setUserPlan}
        />
      )}

      <BottomNav active={screen} onChange={setScreen} notify={myItems.reduce((s, i) => s + (i.responses || 0), 0)} />
    </div>
  );
}
