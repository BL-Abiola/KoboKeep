export type TransactionType = 'sale' | 'expense';
export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type DebtType = 'owed_to_me' | 'i_owe';

export type Transaction = {
  id: string;
  date: string; // ISO string
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
};

export type DailyLog = {
  id: string; // YYYY-MM-DD
  date: string; // ISO string
  openingCash: number;
  closingCash?: number;
  transactions: Transaction['id'][];
  totalSales: number;
  totalExpenses: number;
  profit?: number;
  status: 'open' | 'closed';
};

export type Debt = {
  id: string;
  contactName: string;
  amount: number;
  type: DebtType;
  lastUpdated: string; // ISO string
  notes?: string;
};

export type ProfileSettings = {
  name: string;
  businessName: string;
};

export type Settings = {
  profile: ProfileSettings;
  currency: string;
};

export type AppState = {
  transactions: Transaction[];
  dailyLogs: DailyLog[];
  debts: Debt[];
  settings: Settings;
  isTransactionSheetOpen: boolean;
  editingTransactionId: string | null;
};
