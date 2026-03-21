import React, { useState } from 'react';
import { Contract, Currency } from '../types';

interface ContractFormProps {
  initialData?: Contract;
  onSubmit: (contract: Contract | Omit<Contract, 'id'>) => void;
  onClose: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<Contract>>(initialData || {
    contractNumber: '',
    clientName: '',
    startDate: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: 'KZT',
    description: '',
    status: 'ACTIVE'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contractNumber || !formData.amount || !formData.clientName) return;
    
    if (initialData && initialData.id) {
        onSubmit({ ...formData, id: initialData.id } as Contract);
    } else {
        onSubmit(formData as Omit<Contract, 'id'>);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">{initialData ? 'Редактирование договора' : 'Новый Договор / Проект'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">№ Договора</label>
              <input 
                type="text" 
                name="contractNumber"
                required
                value={formData.contractNumber} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ДГ-2024/001"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Клиент / Контрагент</label>
              <input 
                type="text" 
                name="clientName"
                required
                value={formData.clientName} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ТОО Ромашка"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Сумма договора</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Дата начала</label>
              <input 
                type="date" 
                name="startDate"
                required
                value={formData.startDate} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Дата окончания (план)</label>
              <input 
                type="date" 
                name="endDate"
                value={formData.endDate || ''} 
                onChange={handleInputChange}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Описание / Заметки</label>
            <textarea 
              name="description"
              value={formData.description} 
              onChange={handleInputChange}
              className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium py-2.5 rounded-lg transition">
               Отмена
             </button>
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Создать договор
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};