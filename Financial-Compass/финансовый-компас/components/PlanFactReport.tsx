import React, { useState, useEffect } from 'react';

interface PlanItem {
  id: string;
  name: string;
  plan: number;
  fact: number;
  type: 'income' | 'expense';
}

export const PlanFactReport: React.FC = () => {
  const [items, setItems] = useState<PlanItem[]>(() => {
    const saved = localStorage.getItem('planFactItems');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Оплата покупателя', plan: 0, fact: 0, type: 'income' },
      { id: '2', name: 'Прочий приход', plan: 0, fact: 0, type: 'income' },
      { id: '3', name: 'Счет №1 - Налоги', plan: 500000, fact: 0, type: 'expense' },
      { id: '4', name: 'Счет №2 - Дивиденды', plan: 200000, fact: 0, type: 'expense' },
      { id: '5', name: 'Счет №3 - Продвижение', plan: 500000, fact: 0, type: 'expense' },
      { id: '6', name: 'Счет №5 - Расходы на производство', plan: 50000, fact: 0, type: 'expense' },
    ];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PlanItem>>({});

  useEffect(() => {
    localStorage.setItem('planFactItems', JSON.stringify(items));
  }, [items]);

  const handleAdd = (type: 'income' | 'expense') => {
    const newId = Date.now().toString();
    const newItem: PlanItem = { id: newId, name: '', plan: 0, fact: 0, type };
    setItems([...items, newItem]);
    setEditingId(newId);
    setEditForm(newItem);
  };

  const handleEdit = (item: PlanItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    if (!editForm.name?.trim()) return;
    setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...editForm } as PlanItem : i));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const incomes = items.filter(i => i.type === 'income');
  const expenses = items.filter(i => i.type === 'expense');

  const totalIncomePlan = incomes.reduce((sum, i) => sum + i.plan, 0);
  const totalIncomeFact = incomes.reduce((sum, i) => sum + i.fact, 0);
  
  const totalExpensePlan = expenses.reduce((sum, i) => sum + i.plan, 0);
  const totalExpenseFact = expenses.reduce((sum, i) => sum + i.fact, 0);

  const renderRow = (item: PlanItem) => {
    const deviation = item.fact - item.plan;
    const percent = item.plan > 0 ? Math.round((item.fact / item.plan) * 100) : 0;
    
    if (editingId === item.id) {
      return (
        <tr key={item.id} className="bg-slate-50">
          <td className="p-2 border border-slate-200 text-left sticky left-0 bg-slate-50 z-10 pl-6">
            <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1" placeholder="Название" autoFocus />
          </td>
          <td className="p-2 border border-slate-200">
            <input type="number" value={editForm.plan || 0} onChange={e => setEditForm({...editForm, plan: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded px-2 py-1 text-right" />
          </td>
          <td className="p-2 border border-slate-200">
            <input type="number" value={editForm.fact || 0} onChange={e => setEditForm({...editForm, fact: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded px-2 py-1 text-right" />
          </td>
          <td className="p-2 border border-slate-200 text-right">-</td>
          <td className="p-2 border border-slate-200 text-right space-x-2">
            <button onClick={handleSave} className="text-green-600 hover:text-green-800 font-bold">✓</button>
            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-bold">✕</button>
          </td>
        </tr>
      );
    }

    return (
      <tr key={item.id} className="hover:bg-slate-50 group">
        <td className="p-3 border border-slate-200 text-left sticky left-0 bg-white group-hover:bg-slate-50 z-10 pl-6 flex justify-between items-center">
          <span>{item.name}</span>
          <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100">✎</button>
        </td>
        <td className="p-3 border border-slate-200">{formatMoney(item.plan)}</td>
        <td className="p-3 border border-slate-200">{formatMoney(item.fact)}</td>
        <td className={`p-3 border border-slate-200 ${deviation > 0 && item.type === 'income' ? 'text-green-600' : deviation < 0 && item.type === 'expense' ? 'text-green-600' : deviation !== 0 ? 'text-red-600' : ''}`}>
          {deviation > 0 ? '+' : ''}{formatMoney(deviation)}
        </td>
        <td className="p-3 border border-slate-200">{percent}%</td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">План-Факт анализ</h2>
          <p className="text-sm text-slate-500 mt-1">Сравнение плановых показателей с фактическими (на месяц, квартал, год)</p>
        </div>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option>Январь 2026</option>
          <option>1 Квартал 2026</option>
          <option>2026 Год</option>
        </select>
      </div>
      
      <div className="overflow-x-auto flex-1 p-0">
        <table className="w-full text-sm text-right border-collapse">
          <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10">
            <tr>
              <th className="p-3 border border-slate-200 text-left min-w-[250px] sticky left-0 bg-slate-100 z-20">Статья</th>
              <th className="p-3 border border-slate-200 min-w-[120px]">План (мес)</th>
              <th className="p-3 border border-slate-200 min-w-[120px]">Факт (мес)</th>
              <th className="p-3 border border-slate-200 min-w-[120px]">Отклонение</th>
              <th className="p-3 border border-slate-200 min-w-[100px]">% вып.</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-emerald-50 font-semibold">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-emerald-50 z-10">Остаток на нач. дня/месяца</td>
              <td className="p-3 border border-slate-200">0,00</td>
              <td className="p-3 border border-slate-200">0,00</td>
              <td className="p-3 border border-slate-200">0,00</td>
              <td className="p-3 border border-slate-200">-</td>
            </tr>
            
            {/* Приход */}
            <tr className="bg-blue-50 font-semibold text-blue-900">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-blue-50 z-10 flex justify-between items-center">
                <span>Приход</span>
                <button onClick={() => handleAdd('income')} className="text-blue-600 hover:text-blue-800 text-xs bg-blue-100 px-2 py-1 rounded">+ Добавить</button>
              </td>
              <td className="p-3 border border-slate-200">{formatMoney(totalIncomePlan)}</td>
              <td className="p-3 border border-slate-200">{formatMoney(totalIncomeFact)}</td>
              <td className="p-3 border border-slate-200">{formatMoney(totalIncomeFact - totalIncomePlan)}</td>
              <td className="p-3 border border-slate-200">{totalIncomePlan > 0 ? Math.round((totalIncomeFact / totalIncomePlan) * 100) : 0}%</td>
            </tr>
            {incomes.map(renderRow)}

            {/* Расход */}
            <tr className="bg-red-50 font-semibold text-red-900">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-red-50 z-10 flex justify-between items-center">
                <span>Расход</span>
                <button onClick={() => handleAdd('expense')} className="text-red-600 hover:text-red-800 text-xs bg-red-100 px-2 py-1 rounded">+ Добавить</button>
              </td>
              <td className="p-3 border border-slate-200">{formatMoney(totalExpensePlan)}</td>
              <td className="p-3 border border-slate-200">{formatMoney(totalExpenseFact)}</td>
              <td className="p-3 border border-slate-200">{formatMoney(totalExpenseFact - totalExpensePlan)}</td>
              <td className="p-3 border border-slate-200">{totalExpensePlan > 0 ? Math.round((totalExpenseFact / totalExpensePlan) * 100) : 0}%</td>
            </tr>
            {expenses.map(renderRow)}

            <tr className="bg-emerald-100 font-bold">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-emerald-100 z-10">Остаток на кон. дня/месяца</td>
              <td className="p-3 border border-slate-200">{formatMoney(totalIncomePlan - totalExpensePlan)}</td>
              <td className="p-3 border border-slate-200">{formatMoney(totalIncomeFact - totalExpenseFact)}</td>
              <td className="p-3 border border-slate-200">{formatMoney((totalIncomeFact - totalExpenseFact) - (totalIncomePlan - totalExpensePlan))}</td>
              <td className="p-3 border border-slate-200">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
