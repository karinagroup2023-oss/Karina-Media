import React from 'react';
import { Contract, Transaction, TransactionType, PaymentStatus, Currency } from '../types';

interface ContractListProps {
  contracts: Contract[];
  transactions: Transaction[];
  onAddPayment: (contractId: string) => void;
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (val: number, curr: Currency) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);

export const ContractList: React.FC<ContractListProps> = ({ contracts, transactions, onAddPayment, onEdit, onDelete }) => {

  // Calculate paid amounts
  const getProgress = (contract: Contract) => {
    const paid = transactions
      .filter(t => t.contractId === contract.id && t.status === PaymentStatus.PAID && t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0); // Warning: assumes simple currency match for now
    
    const percentage = Math.min(100, Math.round((paid / contract.amount) * 100));
    return { paid, percentage };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {contracts.map(contract => {
        const { paid, percentage } = getProgress(contract);
        
        return (
          <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
                     {contract.status === 'ACTIVE' ? 'В работе' : 'Завершен'}
                   </span>
                   <h3 className="text-lg font-bold text-slate-800 mt-2">{contract.clientName}</h3>
                   <p className="text-sm text-slate-500">№ {contract.contractNumber}</p>
                </div>
                <button onClick={() => onEdit(contract)} className="text-slate-300 hover:text-indigo-500 mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => onDelete(contract.id)} className="text-slate-300 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Сумма договора:</span>
                  <span className="font-semibold">{formatCurrency(contract.amount, contract.currency)}</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Оплачено:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(paid, contract.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Срок:</span>
                  <span className="text-slate-700">{contract.startDate} — {contract.endDate || '...'}</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
              <p className="text-xs text-right text-slate-400 mb-6">{percentage}% выполнено</p>
            </div>

            <button 
              onClick={() => onAddPayment(contract.id)}
              className="w-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium py-2 rounded-lg transition flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Внести оплату
            </button>
          </div>
        );
      })}
      
      {/* Empty State */}
      {contracts.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p>Нет активных договоров. Создайте первый проект.</p>
        </div>
      )}
    </div>
  );
};