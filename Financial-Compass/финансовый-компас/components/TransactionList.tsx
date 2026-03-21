import React from 'react';
import { Transaction, TransactionType, PaymentStatus, Currency } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const formatAmount = (amount: number, currency: Currency) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Описание</th>
              <th className="px-6 py-4">Категория</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4 text-right">Сумма</th>
              <th className="px-6 py-4 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{t.date}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{t.description}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    t.status === PaymentStatus.PAID ? 'bg-green-100 text-green-700' :
                    t.status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {t.status === PaymentStatus.PAID ? 'Оплачено' : 
                     t.status === PaymentStatus.PENDING ? 'К оплате' : 'Просрочено'}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${
                  t.type === TransactionType.INCOME ? 'text-green-600' : 
                  t.type === TransactionType.EXPENSE ? 'text-slate-800' : 'text-blue-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : t.type === TransactionType.EXPENSE ? '-' : '↔ '}
                  {formatAmount(t.amount, t.currency)}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-indigo-500 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-red-500 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Нет операций. Добавьте первую запись.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};