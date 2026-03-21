export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  EXCHANGE = 'EXCHANGE' // New type for currency conversion records
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING', // Planned/Accrued but not paid
  OVERDUE = 'OVERDUE'
}

export type Currency = 'KZT' | 'RUB' | 'USD' | 'EUR';

export interface Contract {
  id: string;
  contractNumber: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  amount: number;
  currency: Currency;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT';
}

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  amount: number;
  currency: Currency;
  type: TransactionType;
  category: string; // Changed from enum to string to allow custom categories
  description: string;
  status: PaymentStatus;
  contractId?: string; // Link to a contract
  attachmentUrl?: string; // For receipts
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  startDate: string; // YYYY-MM-DD
  periodMonths: number; // Duration of the prepayment/subscription
  category: string;
}

export interface ReferenceArticle {
  id: string;
  name: string;
  activityType: string;
  costType: string;
  description: string;
}

export interface KPI {
  totalBalance: number;
  pendingPayables: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  margin: number; // Percentage
  cashGapRisk: boolean; // Prediction based on pending payables vs balance
}

export const DEFAULT_CATEGORIES = [
  'Выручка',
  'Аренда',
  'Зарплата',
  'Налоги',
  'Маркетинг',
  'Закупка товара',
  'Логистика',
  'Офисные расходы',
  'Конвертация',
  'Прочее'
];