import React, { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { CategoryManager } from './components/CategoryManager';
import { ContractList } from './components/ContractList';
import { ContractForm } from './components/ContractForm';
import { PnLReport } from './components/PnLReport';
import { ReferenceBook } from './components/ReferenceBook';
import { CashFlowReport } from './components/CashFlowReport';
import { BalanceReport } from './components/BalanceReport';
import { AssetsList } from './components/AssetsList';
import { PaymentCalendar } from './components/PaymentCalendar';
import { PlanFactReport } from './components/PlanFactReport';
import { Transaction, KPI, TransactionType, PaymentStatus, DEFAULT_CATEGORIES, Currency, Contract, FixedExpense } from './types';
import { generateFinancialAdvice } from './services/geminiService';
import { fetchExchangeRates } from './services/currencyService';

// Mock data generator
const generateMockData = (): Transaction[] => [
  { id: '1', date: '2024-05-01', amount: 350000, currency: 'KZT', type: TransactionType.INCOME, category: 'Выручка', description: 'Выручка от ТОО "Ромашка"', status: PaymentStatus.PAID, contractId: 'c1' },
  { id: '2', date: '2024-05-05', amount: 150000, currency: 'KZT', type: TransactionType.EXPENSE, category: 'Аренда', description: 'Аренда офиса Алматы', status: PaymentStatus.PAID },
  { id: '3', date: '2024-05-10', amount: 500, currency: 'USD', type: TransactionType.EXPENSE, category: 'Маркетинг', description: 'Google Ads', status: PaymentStatus.PAID },
  { id: '4', date: '2024-05-15', amount: 50000, currency: 'RUB', type: TransactionType.INCOME, category: 'Выручка', description: 'Клиент из РФ', status: PaymentStatus.PAID },
  { id: '5', date: '2024-05-25', amount: 45000, currency: 'KZT', type: TransactionType.EXPENSE, category: 'Налоги', description: 'Налоги ИП', status: PaymentStatus.PENDING },
  { id: '6', date: '2024-05-28', amount: 200, currency: 'USD', type: TransactionType.EXPENSE, category: 'Офисные расходы', description: 'Software Subscription', status: PaymentStatus.PENDING },
];

const generateMockContracts = (): Contract[] => [
  { id: 'c1', contractNumber: '24/001', clientName: 'ТОО "Ромашка"', startDate: '2024-01-10', endDate: '2024-12-31', amount: 5000000, currency: 'KZT', description: 'Поставка оборудования', status: 'ACTIVE' },
  { id: 'c2', contractNumber: '24/005', clientName: 'ИП Иванов', startDate: '2024-03-01', endDate: '2024-06-30', amount: 150000, currency: 'RUB', description: 'Консалтинг', status: 'ACTIVE' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'dds' | 'contracts' | 'pnl' | 'reference' | 'balance' | 'assets' | 'calendar' | 'planFact'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | undefined>(undefined);
  
  // Editing state
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [editingContract, setEditingContract] = useState<Contract | undefined>(undefined);

  const [baseCurrency, setBaseCurrency] = useState<Currency>('KZT');
  
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : generateMockData();
  });

  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem('contracts');
    return saved ? JSON.parse(saved) : generateMockContracts();
  });

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(() => {
    const saved = localStorage.getItem('fixedExpenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [aiAdvice, setAiAdvice] = useState<string>('');
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ KZT: 1, RUB: 6.0, USD: 486.2, EUR: 557.82 });
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchExchangeRates().then(rates => {
      setExchangeRates(rates);
      setIsRatesLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await generateFinancialAdvice(transactions, baseCurrency);
      setAiAdvice(advice);
    };
    if (transactions.length > 0 && !aiAdvice) {
      fetchAdvice();
    }
  }, [transactions, baseCurrency, aiAdvice]);

  // Handle category management
  const handleAddCategory = (cat: string) => {
    setCategories(prev => [...prev, cat]);
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  // Helper to convert amounts to base currency for KPI
  const getExchangeRate = (from: Currency, to: Currency): number => {
    if (from === to) return 1;
    const rateFrom = exchangeRates[from] || 1;
    const rateTo = exchangeRates[to] || 1;
    
    return rateFrom / rateTo;
  };

  const kpi: KPI = useMemo(() => {
    let cashIncome = 0;
    let cashExpense = 0;
    
    let accrualIncome = 0;
    let accrualExpense = 0;
    
    let pendingPayables = 0;

    transactions.forEach(t => {
      const convertedAmount = t.amount * getExchangeRate(t.currency, baseCurrency);

      // Cash Flow (Paid only)
      if (t.status === PaymentStatus.PAID) {
        if (t.type === TransactionType.INCOME) {
          cashIncome += convertedAmount;
        } else if (t.type === TransactionType.EXPENSE) {
          cashExpense += convertedAmount;
        }
      }

      // Accrual (All transactions)
      if (t.type === TransactionType.INCOME) {
        accrualIncome += convertedAmount;
      } else if (t.type === TransactionType.EXPENSE) {
        accrualExpense += convertedAmount;
      }

      // Pending Payables
      if (t.status === PaymentStatus.PENDING || t.status === PaymentStatus.OVERDUE) {
         if (t.type === TransactionType.EXPENSE) {
            pendingPayables += convertedAmount;
         }
      }
    });

    // Add amortized fixed expenses to Accrual Expense for the current month (approximate for KPI)
    // For a simple KPI "Net Profit", we might just take the total accrual profit of the current month?
    // Or just total accumulated profit?
    // Let's stick to "Total Accumulated" for simplicity in this view, 
    // but ideally it should be "Current Month Profit".
    // Let's calculate "Current Month" for KPI to be more relevant.
    
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    let currentMonthRevenue = 0;
    let currentMonthExpense = 0;

    transactions.forEach(t => {
       const d = new Date(t.date);
       const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
       if (key === currentMonthKey) {
          const converted = t.amount * getExchangeRate(t.currency, baseCurrency);
          if (t.type === TransactionType.INCOME) currentMonthRevenue += converted;
          if (t.type === TransactionType.EXPENSE) currentMonthExpense += converted;
       }
    });

    // Add fixed expenses for this month
    fixedExpenses.forEach(fe => {
       // Check if current month is within period
       const start = new Date(fe.startDate);
       const end = new Date(start);
       end.setMonth(start.getMonth() + fe.periodMonths);
       
       if (now >= start && now < end) {
          const monthly = (fe.amount * getExchangeRate(fe.currency, baseCurrency)) / fe.periodMonths;
          currentMonthExpense += monthly;
          accrualExpense += monthly; // Add to total accrual expense too
       }
    });

    return {
      totalBalance: cashIncome - cashExpense, // Real money on hand
      pendingPayables,
      monthlyRevenue: currentMonthRevenue, 
      monthlyExpenses: currentMonthExpense, 
      netProfit: currentMonthRevenue - currentMonthExpense, // P&L for current month
      margin: currentMonthRevenue > 0 ? Math.round(((currentMonthRevenue - currentMonthExpense) / currentMonthRevenue) * 100) : 0,
      cashGapRisk: (cashIncome - cashExpense) < pendingPayables
    };
  }, [transactions, fixedExpenses, baseCurrency, exchangeRates]);

  const handleAddTransaction = (txData: Transaction | Omit<Transaction, 'id'>) => {
    if ('id' in txData) {
      // Update existing
      setTransactions(prev => prev.map(t => t.id === txData.id ? txData : t));
    } else {
      // Create new
      const transaction: Transaction = {
        ...txData,
        id: Date.now().toString()
      };
      setTransactions(prev => [transaction, ...prev]);
    }
    setEditingTransaction(undefined);
  };

  const handleAddContract = (contractData: Contract | Omit<Contract, 'id'>) => {
    if ('id' in contractData) {
       setContracts(prev => prev.map(c => c.id === contractData.id ? contractData : c));
    } else {
       const contract: Contract = {
        ...contractData,
        id: 'c' + Date.now().toString()
      };
      setContracts(prev => [contract, ...prev]);
    }
    setEditingContract(undefined);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (t: Transaction) => {
    setEditingTransaction(t);
    setShowForm(true);
  };

  const handleEditContract = (c: Contract) => {
    setEditingContract(c);
    setShowContractForm(true);
  };

  const handleDeleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
  };

  const handleAddFixedExpense = (fe: Omit<FixedExpense, 'id'>) => {
    const newFe: FixedExpense = { ...fe, id: 'fe' + Date.now() };
    setFixedExpenses(prev => [...prev, newFe]);
  };

  const handleDeleteFixedExpense = (id: string) => {
    setFixedExpenses(prev => prev.filter(fe => fe.id !== id));
  };

  const openAddPaymentForContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setEditingTransaction(undefined);
    setShowForm(true);
  };

  const openGeneralForm = () => {
    setSelectedContractId(undefined);
    setEditingTransaction(undefined);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Финансовый Компас
          </h1>
          <p className="text-xs text-slate-500 mt-2">Финансы под контролем</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>Дашборд</NavButton>
          <NavButton active={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>Проекты / Договоры</NavButton>
          <NavButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>Журнал операций</NavButton>
          <NavButton active={activeTab === 'dds'} onClick={() => setActiveTab('dds')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>ДДС (Отчет)</NavButton>
          <NavButton active={activeTab === 'pnl'} onClick={() => setActiveTab('pnl')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>}>P&L (ОПиУ)</NavButton>
          <NavButton active={activeTab === 'balance'} onClick={() => setActiveTab('balance')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}>Баланс</NavButton>
          <NavButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}>Основные Средства</NavButton>
          <NavButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>Платежный Календарь</NavButton>
          <NavButton active={activeTab === 'planFact'} onClick={() => setActiveTab('planFact')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>План-Факт</NavButton>
          <NavButton active={activeTab === 'reference'} onClick={() => setActiveTab('reference')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}>Справочник</NavButton>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800 rounded-lg p-3">
             <p className="text-xs text-slate-400 mb-1">Баланс (консолид.)</p>
             <p className="text-lg font-bold text-white">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: baseCurrency, maximumFractionDigits: 0 }).format(kpi.totalBalance)}
             </p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <h1 className="font-bold">Финансовый Компас</h1>
          <button onClick={() => setActiveTab('dashboard')} className="text-sm">Меню</button>
        </header>

        {/* Topbar */}
        <div className="px-8 py-6 flex justify-between items-center bg-white border-b border-slate-200">
          <div>
             <h2 className="text-2xl font-bold text-slate-800">
               {activeTab === 'dashboard' ? 'Финансовый обзор' : 
                activeTab === 'transactions' ? 'Журнал операций' : 
                activeTab === 'dds' ? 'Отчет о движении денежных средств (ДДС)' :
                activeTab === 'pnl' ? 'Прибыли и Убытки (P&L)' :
                activeTab === 'reference' ? 'Справочник статей' :
                activeTab === 'balance' ? 'Управленческий Баланс' :
                activeTab === 'assets' ? 'Основные Средства' :
                activeTab === 'calendar' ? 'Платежный Календарь' :
                activeTab === 'planFact' ? 'План-Факт анализ' :
                'Договоры и Проекты'}
             </h2>
             <div className="text-xs text-slate-500 mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-medium text-slate-700">
                  {currentTime.toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'medium' })}
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                <span>
                  Курс НБ РК: 
                  {isRatesLoading ? ' загрузка...' : ` 1 USD = ${exchangeRates.USD?.toFixed(2)} ₸, 1 RUB = ${exchangeRates.RUB?.toFixed(2)} ₸, 1 EUR = ${exchangeRates.EUR?.toFixed(2)} ₸`}
                </span>
             </div>
          </div>
          <div className="flex items-center space-x-4">
             {/* Currency Switcher */}
             <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                {(['KZT', 'RUB', 'USD'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setBaseCurrency(curr)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition ${baseCurrency === curr ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {curr}
                  </button>
                ))}
             </div>

             {activeTab === 'contracts' ? (
                <button 
                  onClick={() => { setEditingContract(undefined); setShowContractForm(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-medium flex items-center transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Новый договор
                </button>
             ) : (activeTab === 'pnl' || activeTab === 'reference' || activeTab === 'dds' || activeTab === 'balance' || activeTab === 'assets' || activeTab === 'calendar' || activeTab === 'planFact') ? null : (
                <button 
                  onClick={openGeneralForm}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-medium flex items-center transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Добавить
                </button>
             )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} kpi={kpi} aiAdvice={aiAdvice} baseCurrency={baseCurrency} />}
          {activeTab === 'transactions' && <TransactionList transactions={transactions} onDelete={handleDelete} onEdit={handleEditTransaction} />}
          {activeTab === 'dds' && <CashFlowReport transactions={transactions} />}
          {activeTab === 'balance' && <BalanceReport />}
          {activeTab === 'assets' && <AssetsList />}
          {activeTab === 'calendar' && <PaymentCalendar />}
          {activeTab === 'planFact' && <PlanFactReport />}
          {activeTab === 'reference' && <ReferenceBook />}
          {activeTab === 'pnl' && (
            <PnLReport 
              transactions={transactions} 
              fixedExpenses={fixedExpenses} 
              baseCurrency={baseCurrency} 
              onAddFixedExpense={handleAddFixedExpense}
              onDeleteFixedExpense={handleDeleteFixedExpense}
            />
          )}
          {activeTab === 'contracts' && (
            <ContractList 
              contracts={contracts} 
              transactions={transactions} 
              onAddPayment={openAddPaymentForContract}
              onEdit={handleEditContract}
              onDelete={handleDeleteContract}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <TransactionForm 
          categories={categories}
          contracts={contracts}
          initialContractId={selectedContractId}
          initialData={editingTransaction}
          onSubmit={handleAddTransaction} 
          onClose={() => setShowForm(false)} 
          onManageCategories={() => setShowCategoryManager(true)}
        />
      )}

      {showContractForm && (
        <ContractForm 
          initialData={editingContract}
          onSubmit={handleAddContract}
          onClose={() => setShowContractForm(false)}
        />
      )}
      
      {showCategoryManager && (
        <CategoryManager 
          categories={categories}
          onAdd={handleAddCategory}
          onRemove={handleRemoveCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
};

const NavButton = ({ children, active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className="mr-3 opacity-90">{icon}</span>
    {children}
  </button>
);

export default App;