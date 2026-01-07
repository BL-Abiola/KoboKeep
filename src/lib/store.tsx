
'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AppState, Transaction, Debt, DailyLog, Settings } from './types';
import { format } from 'date-fns';
import { getExchangeRate } from './exchange-rates';


const APP_STORAGE_KEY = 'isuna-app-state';

const initialState: AppState = {
  transactions: [],
  dailyLogs: [],
  debts: [],
  settings: {
    profile: {
      name: 'User',
      businessName: 'My Business',
    },
    currency: 'USD',
    baseCurrency: 'USD',
    onboardingCompleted: false,
  },
  isTransactionSheetOpen: false,
  editingTransactionId: null,
};

type StoreActions = {
  getTodaysLog: () => DailyLog | undefined;
  startDay: (openingCash: number) => void;
  endDay: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
  addDebt: (debt: Omit<Debt, 'id' | 'lastUpdated'>) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (debtId: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetData: () => void;
  toggleTransactionSheet: (open: boolean, transactionId?: string | null) => void;
};

type AppStoreType = AppState & StoreActions;

const AppStoreContext = createContext<AppStoreType | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(APP_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        const mergedState = { 
          ...initialState, 
          ...parsedState, 
          settings: { 
            ...initialState.settings, 
            ...parsedState.settings, 
            profile: { 
              ...initialState.settings.profile, 
              ...parsedState.settings?.profile 
            } 
          } 
        };
        setState(mergedState);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state, isInitialized]);

  const getTodaysLog = useCallback(() => {
    const todayId = format(new Date(), 'yyyy-MM-dd');
    return state.dailyLogs.find(log => log.id === todayId && log.status === 'open');
  }, [state.dailyLogs]);

  const startDay = (openingCash: number) => {
    const todayId = format(new Date(), 'yyyy-MM-dd');
    if (state.dailyLogs.some(log => log.id === todayId)) {
      return;
    }
    const newLog: DailyLog = {
      id: todayId,
      date: new Date().toISOString(),
      openingCash,
      status: 'open',
      transactions: [],
      totalSales: 0,
      totalExpenses: 0,
    };
    setState(prev => ({ ...prev, dailyLogs: [...prev.dailyLogs, newLog] }));
  };

  const endDay = () => {
    const todaysLog = getTodaysLog();
    if (!todaysLog) return;

    setState(prev => {
      const updatedLogs = prev.dailyLogs.map(log => {
        if (log.id === todaysLog.id) {
          const profit = log.totalSales - log.totalExpenses;
          const closingCash = log.openingCash + profit;
          return { ...log, status: 'closed', profit, closingCash };
        }
        return log;
      });
      return { ...prev, dailyLogs: updatedLogs };
    });
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const todaysLog = getTodaysLog();
    if (!todaysLog) {
        throw new Error("Cannot add transaction without an active day log. Please start the day first.");
    }

    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    setState(prev => {
      const updatedLogs = prev.dailyLogs.map(log => {
        if (log.id === todaysLog.id) {
          return {
            ...log,
            transactions: [...log.transactions, newTransaction.id],
            totalSales: transactionData.type === 'sale' ? log.totalSales + transactionData.amount : log.totalSales,
            totalExpenses: transactionData.type === 'expense' ? log.totalExpenses + transactionData.amount : log.totalExpenses,
          };
        }
        return log;
      });
      return {
        ...prev,
        transactions: [...prev.transactions, newTransaction],
        dailyLogs: updatedLogs,
      };
    });
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setState(prev => {
      let oldTransaction: Transaction | undefined;
      const newTransactions = prev.transactions.map(t => {
        if (t.id === updatedTransaction.id) {
          oldTransaction = t;
          return updatedTransaction;
        }
        return t;
      });

      if (!oldTransaction) return prev;
      
      const amountDifference = updatedTransaction.amount - oldTransaction.amount;
      const typeChanged = updatedTransaction.type !== oldTransaction.type;
      
      const updatedLogs = prev.dailyLogs.map(log => {
        if (log.transactions.includes(updatedTransaction.id)) {
            let { totalSales, totalExpenses } = log;
            
            if (typeChanged) {
                if (oldTransaction!.type === 'sale') totalSales -= oldTransaction!.amount;
                else totalExpenses -= oldTransaction!.amount;

                if (updatedTransaction.type === 'sale') totalSales += updatedTransaction.amount;
                else totalExpenses += updatedTransaction.amount;
            } else {
                if (updatedTransaction.type === 'sale') totalSales += amountDifference;
                else totalExpenses += amountDifference;
            }

            return { ...log, totalSales, totalExpenses };
        }
        return log;
      });

      return { ...prev, transactions: newTransactions, dailyLogs: updatedLogs };
    });
  };

  const deleteTransaction = (transactionId: string) => {
    setState(prev => {
      const transactionToDelete = prev.transactions.find(t => t.id === transactionId);
      if (!transactionToDelete) return prev;

      const updatedTransactions = prev.transactions.filter(t => t.id !== transactionId);

      const updatedLogs = prev.dailyLogs.map(log => {
        if (log.transactions.includes(transactionId)) {
          return {
            ...log,
            transactions: log.transactions.filter(id => id !== transactionId),
            totalSales: transactionToDelete.type === 'sale' ? log.totalSales - transactionToDelete.amount : log.totalSales,
            totalExpenses: transactionToDelete.type === 'expense' ? log.totalExpenses - transactionToDelete.amount : log.totalExpenses,
          };
        }
        return log;
      });

      return { ...prev, transactions: updatedTransactions, dailyLogs: updatedLogs };
    });
  };
  
  const addDebt = (debtData: Omit<Debt, 'id' | 'lastUpdated'>) => {
    const newDebt: Debt = {
      ...debtData,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, debts: [...prev.debts, newDebt] }));
  };

  const updateDebt = (updatedDebt: Debt) => {
    setState(prev => ({
      ...prev,
      debts: prev.debts.map(d => d.id === updatedDebt.id ? { ...updatedDebt, lastUpdated: new Date().toISOString() } : d),
    }));
  };

  const deleteDebt = (debtId: string) => {
    setState(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== debtId) }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setState(prev => {
        const oldSettings = prev.settings;
        const updatedSettings = { ...oldSettings, ...newSettings };

        if (newSettings.currency && newSettings.currency !== oldSettings.currency) {
            const rate = getExchangeRate(oldSettings.currency, newSettings.currency);
            
            if (rate) {
                const convert = (amount: number) => amount * rate;

                const newTransactions = prev.transactions.map(t => ({
                    ...t,
                    amount: convert(t.amount)
                }));

                const newDailyLogs = prev.dailyLogs.map(log => ({
                    ...log,
                    openingCash: convert(log.openingCash),
                    closingCash: log.closingCash ? convert(log.closingCash) : undefined,
                    totalSales: convert(log.totalSales),
                    totalExpenses: convert(log.totalExpenses),
                    profit: log.profit ? convert(log.profit) : undefined,
                }));

                const newDebts = prev.debts.map(debt => ({
                    ...debt,
                    amount: convert(debt.amount)
                }));

                return {
                    ...prev,
                    transactions: newTransactions,
                    dailyLogs: newDailyLogs,
                    debts: newDebts,
                    settings: updatedSettings
                };
            }
        }
        
        return { ...prev, settings: { ...prev.settings, ...newSettings } };
    });
};

  
  const resetData = () => {
    const defaultState = {
        ...initialState,
        settings: {
            ...initialState.settings,
            profile: state.settings.profile // Keep profile settings
        }
    };
    setState(defaultState);
  };
  
  const toggleTransactionSheet = (open: boolean, transactionId: string | null = null) => {
    setState(prev => ({
      ...prev,
      isTransactionSheetOpen: open,
      editingTransactionId: open ? transactionId : null,
    }));
  };

  if (!isInitialized) {
    return null; // Or a loading component
  }
  
  return (
    <AppStoreContext.Provider value={{
      ...state,
      getTodaysLog,
      startDay,
      endDay,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addDebt,
      updateDebt,
      deleteDebt,
      updateSettings,
      resetData,
      toggleTransactionSheet,
    }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
