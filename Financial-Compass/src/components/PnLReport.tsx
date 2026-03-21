import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, FixedExpense, Currency, DEFAULT_CATEGORIES } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PnLReportProps {
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  baseCurrency: Currency;
  onAddFixedExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  onDeleteFixedExpense: (id: string) => void;
}

const formatCurrency = (val: number, currency: Currency) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);

export const PnLReport: React.FC<PnLReportProps> = ({ 
  transactions, 
  fixedExpenses, 
  baseCurrency, 
  onAddFixedExpense, 
  onDeleteFixedExpense 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<FixedExpense>>({
    name: '',
    amount: 0,
    currency: 'KZT',
    startDate: new Date().toISOString().split('T')[0],
    periodMonths: 1,
    category: 'Аренда'
  });

  // Helper for currency conversion (duplicated from App.tsx for now, ideally should be a context or utility)
  const getExchangeRate = (from: Currency, to: Currency): number => {
    if (from === to) return 1;
    const ratesToKZT: Record<Currency, number> = {
      KZT: 1,
      RUB: 5.0,
      USD: 450.0,
      EUR: 490.0
    };
    return ratesToKZT[from] / ratesToKZT[to];
  };

  const pnlData = useMemo(() => {
    const monthlyData: Record<string, { 
      month: string; 
      income: number; 
      variableExpense: number; 
      fixedExpense: number; 
      netProfit: number 
    }> = {};

    // 1. Process Transactions (Variable Income/Expense)
    transactions.forEach(t => {
      // For P&L, we typically use Accrual basis (by date), regardless of payment status?
      // Or Cash basis? The user asked for P&L to include fixed long-term payments amortized.
      // Let's use the transaction date.
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, variableExpense: 0, fixedExpense: 0, netProfit: 0 };
      }

      const convertedAmount = t.amount * getExchangeRate(t.currency, baseCurrency);

      if (t.type === TransactionType.INCOME) {
        monthlyData[monthKey].income += convertedAmount;
      } else if (t.type === TransactionType.EXPENSE) {
        monthlyData[monthKey].variableExpense += convertedAmount;
      }
    });

    // 2. Process Fixed Expenses (Amortization)
    fixedExpenses.forEach(fe => {
      const start = new Date(fe.startDate);
      const monthlyAmount = (fe.amount * getExchangeRate(fe.currency, baseCurrency)) / fe.periodMonths;

      for (let i = 0; i < fe.periodMonths; i++) {
        const currentMonthDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const monthKey = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, income: 0, variableExpense: 0, fixedExpense: 0, netProfit: 0 };
        }
        
        monthlyData[monthKey].fixedExpense += monthlyAmount;
      }
    });

    // 3. Calculate Net Profit
    Object.values(monthlyData).forEach(d => {
      d.netProfit = d.income - (d.variableExpense + d.fixedExpense);
    });

    // Sort by date
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions, fixedExpenses, baseCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.name && newExpense.amount && newExpense.periodMonths) {
      onAddFixedExpense(newExpense as Omit<FixedExpense, 'id'>);
      setShowForm(false);
      setNewExpense({
        name: '',
        amount: 0,
        currency: 'KZT',
        startDate: new Date().toISOString().split('T')[0],
        periodMonths: 1,
        category: 'Аренда'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Отчет о Прибылях и Убытках (P&L)</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Добавить фикс. расход
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pnlData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tickFormatter={(val) => val.slice(5)} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip formatter={(val: number) => formatCurrency(val, baseCurrency)} />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="income" name="Выручка" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="variableExpense" name="Переменные расходы" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} />
            <Bar dataKey="fixedExpense" name="Фикс. расходы" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="netProfit" name="Чистая прибыль" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fixed Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Фиксированные / Долгосрочные расходы</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 font-medium border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3">Наименование</th>
              <th className="px-6 py-3">Категория</th>
              <th className="px-6 py-3">Период</th>
              <th className="px-6 py-3 text-right">Сумма (Общая)</th>
              <th className="px-6 py-3 text-right">В месяц</th>
              <th className="px-6 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fixedExpenses.map(fe => {
               const monthly = fe.amount / fe.periodMonths;
               return (
                <tr key={fe.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{fe.name}</td>
                  <td className="px-6 py-4 text-slate-500">{fe.category}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {fe.startDate} ({fe.periodMonths} мес.)
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatCurrency(fe.amount, fe.currency)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    ~{formatCurrency(monthly, fe.currency)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => onDeleteFixedExpense(fe.id)} className="text-slate-400 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
               );
            })}
            {fixedExpenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Нет фиксированных расходов. Добавьте аренду, подписки и т.д.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Добавить фикс. расход</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Наименование</label>
                <input 
                  type="text" 
                  required
                  value={newExpense.name}
                  onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  placeholder="Аренда офиса"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Сумма (Общая)</label>
                  <input 
                    type="number" 
                    required
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                    className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Валюта</label>
                  <select 
                    value={newExpense.currency}
                    onChange={e => setNewExpense({...newExpense, currency: e.target.value as Currency})}
                    className="w-full rounded-lg border-slate-300 border p-2 text-sm font-bold"
                  >
                    <option value="KZT">KZT</option>
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Дата начала</label>
                  <input 
                    type="date" 
                    required
                    value={newExpense.startDate}
                    onChange={e => setNewExpense({...newExpense, startDate: e.target.value})}
                    className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Период (мес)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newExpense.periodMonths}
                    onChange={e => setNewExpense({...newExpense, periodMonths: parseInt(e.target.value)})}
                    className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Категория</label>
                <select 
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                >
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 mt-2">
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
