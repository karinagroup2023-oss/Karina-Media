import React, { useState, useEffect } from 'react';

interface BalanceItem {
  id: string;
  name: string;
  value: number;
  type: 'asset' | 'liability';
}

export const BalanceReport: React.FC = () => {
  const [items, setItems] = useState<BalanceItem[]>(() => {
    const saved = localStorage.getItem('balanceItems');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Денежные средства', value: 0, type: 'asset' },
      { id: '2', name: 'Дебиторская задолженность', value: 0, type: 'asset' },
      { id: '3', name: 'Запасы', value: 0, type: 'asset' },
      { id: '4', name: 'Основные средства', value: 0, type: 'asset' },
      { id: '5', name: 'Кредиторская задолженность', value: 0, type: 'liability' },
      { id: '6', name: 'Кредиты и займы', value: 0, type: 'liability' },
      { id: '7', name: 'Собственный капитал', value: 0, type: 'liability' },
      { id: '8', name: 'Нераспределенная прибыль', value: 0, type: 'liability' },
    ];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BalanceItem>>({});

  useEffect(() => {
    localStorage.setItem('balanceItems', JSON.stringify(items));
  }, [items]);

  const handleAdd = (type: 'asset' | 'liability') => {
    const newId = Date.now().toString();
    const newItem: BalanceItem = { id: newId, name: '', value: 0, type };
    setItems([...items, newItem]);
    setEditingId(newId);
    setEditForm(newItem);
  };

  const handleEdit = (item: BalanceItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    if (!editForm.name?.trim()) return;
    setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...editForm } as BalanceItem : i));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ₸';
  };

  const assets = items.filter(i => i.type === 'asset');
  const liabilities = items.filter(i => i.type === 'liability');
  const totalAssets = assets.reduce((sum, i) => sum + i.value, 0);
  const totalLiabilities = liabilities.reduce((sum, i) => sum + i.value, 0);

  const renderItem = (item: BalanceItem) => {
    if (editingId === item.id) {
      return (
        <li key={item.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded -mx-2">
          <input
            type="text"
            value={editForm.name || ''}
            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
            placeholder="Название"
            autoFocus
          />
          <input
            type="number"
            value={editForm.value || 0}
            onChange={e => setEditForm({ ...editForm, value: parseFloat(e.target.value) || 0 })}
            className="w-32 border border-slate-300 rounded px-2 py-1 text-sm text-right"
          />
          <button onClick={handleSave} className="text-green-600 hover:text-green-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </li>
      );
    }

    return (
      <li key={item.id} className="flex justify-between items-center group py-1">
        <span className="flex-1">{item.name}</span>
        <span className="font-medium mr-4">{formatMoney(item.value)}</span>
        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
          <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Управленческий Баланс</h2>
      <p className="text-slate-500 mb-6">Структура активов, обязательств и капитала.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="font-bold text-lg text-slate-700">Активы</h3>
            <button onClick={() => handleAdd('asset')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Добавить</button>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {assets.map(renderItem)}
            <li className="flex justify-between font-bold text-slate-800 pt-2 border-t mt-2">
              <span>ИТОГО АКТИВЫ</span> <span>{formatMoney(totalAssets)}</span>
            </li>
          </ul>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="font-bold text-lg text-slate-700">Пассивы</h3>
            <button onClick={() => handleAdd('liability')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Добавить</button>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {liabilities.map(renderItem)}
            <li className="flex justify-between font-bold text-slate-800 pt-2 border-t mt-2">
              <span>ИТОГО ПАССИВЫ</span> <span>{formatMoney(totalLiabilities)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
