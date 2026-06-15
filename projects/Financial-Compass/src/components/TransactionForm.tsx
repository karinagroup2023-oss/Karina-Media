import React, { useState, useRef, useEffect } from 'react';
import { TransactionType, PaymentStatus, Transaction, Currency, Contract } from '../types';
import { analyzeFinancialDocument } from '../services/geminiService';

interface TransactionFormProps {
  categories: string[];
  contracts: Contract[];
  initialContractId?: string;
  initialData?: Transaction; // For editing
  onSubmit: (transaction: Transaction | Omit<Transaction, 'id'>) => void;
  onClose: () => void;
  onManageCategories: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ categories, contracts, initialContractId, initialData, onSubmit, onClose, onManageCategories }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State to hold multiple transactions if a statement is parsed
  const [pendingTransactions, setPendingTransactions] = useState<Partial<Transaction>[]>([]);
  
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: 'KZT',
    type: TransactionType.EXPENSE,
    category: categories[0] || 'Прочее',
    description: '',
    status: PaymentStatus.PAID,
    contractId: initialContractId || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (initialContractId) {
      // ... existing logic for contract pre-fill
      const c = contracts.find(c => c.id === initialContractId);
      if (c) {
        setFormData(prev => ({
          ...prev,
          currency: c.currency,
          description: `Оплата по договору ${c.contractNumber}`,
          type: TransactionType.INCOME, 
          category: 'Выручка'
        }));
      }
    }
  }, [initialData, initialContractId, contracts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(',')[1];
        
        // Use generalized analysis
        const analyzedDataArray = await analyzeFinancialDocument(base64Content, categories);
        
        if (analyzedDataArray && analyzedDataArray.length > 0) {
          if (analyzedDataArray.length === 1) {
            // Single receipt
            setFormData(prev => ({
              ...prev,
              ...analyzedDataArray[0],
              status: PaymentStatus.PAID,
              attachmentUrl: base64data
            }));
          } else {
            // Multiple items (Bank Statement)
            setPendingTransactions(analyzedDataArray);
          }
        }
        setLoading(false);
      };
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.description) return;
    
    if (initialData && initialData.id) {
        // Editing existing
        onSubmit({ ...formData, id: initialData.id } as Transaction);
    } else {
        // Creating new
        onSubmit(formData as Omit<Transaction, 'id'>);
    }
    onClose();
  };

  const handleSaveAllPending = () => {
    pendingTransactions.forEach(t => {
       onSubmit(t as Omit<Transaction, 'id'>);
    });
    onClose();
  };

  // If we found multiple transactions from a statement, show a preview list
  if (pendingTransactions.length > 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800">Распознано {pendingTransactions.length} операций (Выписка)</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
             <div className="space-y-2">
               {pendingTransactions.map((t, idx) => (
                 <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.date} | {t.category}</p>
                    </div>
                    <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-slate-700'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}{t.amount} {t.currency}
                    </span>
                 </div>
               ))}
             </div>
          </div>
          <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
             <button onClick={() => setPendingTransactions([])} className="text-slate-600 font-medium px-4">Отмена</button>
             <button onClick={handleSaveAllPending} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
               Сохранить все
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">{initialData ? 'Редактирование операции' : 'Новая операция'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* AI Upload Section */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
            <p className="text-sm text-indigo-700 mb-3">
              Загрузите чек (фото) или выписку (скриншот/Excel/PDF)
            </p>
            <input type="file" accept="image/*,.csv,.txt" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center mx-auto space-x-2"
            >
              {loading ? <span>Анализ документа...</span> : <span>Загрузить документ</span>}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Тип</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={TransactionType.INCOME}>Доход</option>
                <option value={TransactionType.EXPENSE}>Расход</option>
                <option value={TransactionType.EXCHANGE}>Конвертация</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Статус</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={PaymentStatus.PAID}>Оплачено</option>
                <option value={PaymentStatus.PENDING}>К оплате</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Сумма</label>
              <input 
                type="number" 
                name="amount"
                required
                value={formData.amount} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Валюта</label>
              <select 
                name="currency" 
                value={formData.currency} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 font-bold"
              >
                <option value="KZT">₸ KZT</option>
                <option value="RUB">₽ RUB</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Проект / Договор (опционально)</label>
            <select 
                name="contractId" 
                value={formData.contractId} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Без договора --</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.clientName} (№{c.contractNumber})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Дата</label>
            <input 
              type="date" 
              name="date"
              required
              value={formData.date} 
              onChange={handleInputChange}
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-600">Категория</label>
              <button type="button" onClick={onManageCategories} className="text-xs text-indigo-600 hover:text-indigo-800">
                + Настроить
              </button>
            </div>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Описание</label>
            <input 
              type="text" 
              name="description"
              required
              value={formData.description} 
              onChange={handleInputChange}
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Например: Оплата аренды"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-slate-800 text-white font-medium py-2.5 rounded-lg hover:bg-slate-900 transition shadow-lg shadow-slate-200"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};