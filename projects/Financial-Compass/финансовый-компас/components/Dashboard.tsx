import React, { useMemo } from 'react';
import { KPI, Transaction, TransactionType, Currency } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  kpi: KPI;
  aiAdvice: string;
  baseCurrency: Currency;
}

const formatCurrency = (val: number, currency: Currency) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);

export const Dashboard: React.FC<DashboardProps> = ({ transactions, kpi, aiAdvice, baseCurrency }) => {
  
  // NOTE: Charts receive raw data here. 
  // For a real production app, we would pass 'normalized' data to charts matching the KPI calculation in App.tsx
  // Here we will do a simple aggregation assuming App.tsx passed normalized KPI, but transactions in charts 
  // might look mixed unless we convert them here too. 
  // For visual simplicity in this demo, chart data logic needs to match App.tsx conversion logic.
  // We will pass the KPI directly which is already converted.

  // We need to re-calculate chart data normalized to Base Currency for the visualization to be meaningful
  const chartData = useMemo(() => {
    // Simple mock conversion for charts to match KPI. 
    // In a real app, pass conversion rate map or function.
    const getRate = (curr: Currency) => {
      if (baseCurrency === 'KZT') {
         if (curr === 'USD') return 450;
         if (curr === 'RUB') return 5;
         if (curr === 'EUR') return 490;
         return 1;
      }
      if (baseCurrency === 'RUB') {
         if (curr === 'KZT') return 0.2;
         if (curr === 'USD') return 90;
         if (curr === 'EUR') return 98;
         return 1;
      }
      // Fallback 1:1 if complex cross-rates not defined in this scope
      return 1;
    };

    const grouped: Record<string, { date: string; income: number; expense: number }> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(t => {
      const dateKey = t.date;
      if (!grouped[dateKey]) grouped[dateKey] = { date: dateKey, income: 0, expense: 0 };
      
      const convertedAmount = t.amount * getRate(t.currency);

      if (t.type === TransactionType.INCOME) {
        grouped[dateKey].income += convertedAmount;
      } else if (t.type === TransactionType.EXPENSE) {
        grouped[dateKey].expense += convertedAmount;
      }
    });

    return Object.values(grouped).slice(-14);
  }, [transactions, baseCurrency]);

  const categoryData = useMemo(() => {
     // Re-implement rate logic for categories locally or pass utility
     const getRate = (curr: Currency) => {
        if (baseCurrency === 'KZT') {
           if (curr === 'USD') return 450;
           if (curr === 'RUB') return 5;
           if (curr === 'EUR') return 490;
           return 1;
        }
        if (baseCurrency === 'RUB') {
           if (curr === 'KZT') return 0.2;
           if (curr === 'USD') return 90;
           if (curr === 'EUR') return 98;
           return 1;
        }
        return 1;
      };

    const catMap: Record<string, number> = {};
    transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      const converted = t.amount * getRate(t.currency);
      catMap[t.category] = (catMap[t.category] || 0) + converted;
    });
    return Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));
  }, [transactions, baseCurrency]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      
      {/* AI Insight Header */}
      {aiAdvice && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg flex items-start space-x-3">
          <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <div>
            <h3 className="font-bold text-lg">Совет ФинДиректора (AI)</h3>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed">{aiAdvice}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Денег на счетах (Total)" 
          value={kpi.totalBalance} 
          currency={baseCurrency}
          trend={kpi.totalBalance > 0 ? "positive" : "negative"} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="К оплате (План)" 
          value={kpi.pendingPayables} 
          currency={baseCurrency}
          color="text-red-600"
          subtext="Ближайшие 30 дней"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <KpiCard 
          title="Чистая прибыль (мес)" 
          value={kpi.netProfit} 
          currency={baseCurrency}
          trend={kpi.netProfit > 0 ? "positive" : "negative"}
          subtext={`Рентабельность: ${kpi.margin}%`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>}
        />
        <KpiCard 
          title="В работе сделок" 
          value={transactions.length} 
          isCurrency={false}
          subtext="Активные транзакции"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
        />
      </div>

      {/* Financial Summary Block */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="flex items-center space-x-4">
             <div className="p-3 bg-green-100 text-green-600 rounded-full">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
             </div>
             <div>
               <p className="text-sm text-slate-500">Выручка (мес)</p>
               <p className="text-xl font-bold text-slate-800">{formatCurrency(kpi.monthlyRevenue, baseCurrency)}</p>
             </div>
         </div>
         <div className="flex items-center space-x-4">
             <div className="p-3 bg-red-100 text-red-600 rounded-full">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
             </div>
             <div>
               <p className="text-sm text-slate-500">Расходы (мес)</p>
               <p className="text-xl font-bold text-slate-800">{formatCurrency(kpi.monthlyExpenses, baseCurrency)}</p>
             </div>
         </div>
         <div className="flex items-center space-x-4">
             <div className={`p-3 rounded-full ${kpi.netProfit >= 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
               <p className="text-sm text-slate-500">Прибыль (мес)</p>
               <p className={`text-xl font-bold ${kpi.netProfit >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>{formatCurrency(kpi.netProfit, baseCurrency)}</p>
             </div>
         </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-slate-800">Динамика ({baseCurrency})</h3>
             <span className="text-xs text-slate-400">Сконвертировано по курсу</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.slice(5)} stroke="#94a3b8" />
                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  formatter={(value: number) => formatCurrency(value, baseCurrency)}
                />
                <Area type="monotone" dataKey="income" name="Выручка" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" name="Расходы" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-6 text-sm">
             <div className="flex items-center">
               <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
               <span className="text-slate-600">Выручка (Доходы)</span>
             </div>
             <div className="flex items-center">
               <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
               <span className="text-slate-600">Расходы</span>
             </div>
          </div>
        </div>

        {/* Expenses Structure */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Структура Расходов</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} stroke="#64748b" />
                <Tooltip formatter={(value: number) => formatCurrency(value, baseCurrency)} cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" name="Сумма" radius={[0, 4, 4, 0]} label={{ position: 'insideRight', formatter: (val: number) => formatCurrency(val, baseCurrency), fontSize: 11, fill: '#fff', offset: 5 }}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, subtext, icon, trend, color, isCurrency = true, currency = 'KZT' }: any) => {
  const displayValue = isCurrency ? formatCurrency(value, currency) : value;
  const textColor = color ? color : (trend === 'negative' && value < 0) ? 'text-red-600' : 'text-slate-800';

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 font-medium text-sm">{title}</span>
        <div className={`p-2 rounded-lg ${trend === 'positive' ? 'bg-green-100 text-green-600' : trend === 'negative' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className={`text-2xl font-bold ${textColor}`}>{displayValue}</h4>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};