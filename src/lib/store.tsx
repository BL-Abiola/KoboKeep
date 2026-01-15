
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
  getTodaysLog: (currentState?: AppState) => DailyLog | undefined;
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
        // Migration for older states that don't have cashIncome/cashExpenses
        mergedState.dailyLogs = mergedState.dailyLogs.map((log: DailyLog) => ({
            ...log,
            cashIncome: log.cashIncome ?? 0,
            cashExpenses: log.cashExpenses ?? 0,
        }));

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

  const getTodaysLog = useCallback((currentState: AppState = state) => {
    const todayId = format(new Date(), 'yyyy-MM-dd');
    return currentState.dailyLogs.find(log => log.id === todayId && log.status === 'open');
  }, [state]);

  const startDay = (openingCash: number) => {
    const todayId = format(new Date(), 'yyyy-MM-dd');
    
    setState(prev => {
        if (prev.dailyLogs.some(log => log.id === todayId)) {
          return prev;
        }
        const newLog: DailyLog = {
          id: todayId,
          date: new Date().toISOString(),
          openingCash,
          status: 'open',
          transactions: [],
          totalIncome: 0,
          totalExpenses: 0,
          cashIncome: 0,
          cashExpenses: 0,
        };
        return { ...prev, dailyLogs: [...prev.dailyLogs, newLog] };
    });
  };

  const endDay = () => {
    const todaysLog = getTodaysLog(state);
    if (!todaysLog) return;

    setState(prev => {
      const updatedLogs = prev.dailyLogs.map(log => {
        if (log.id === todaysLog.id) {
          const profit = log.totalIncome - log.totalExpenses;
          const closingCash = log.openingCash + log.cashIncome - log.cashExpenses;
          return { ...log, status: 'closed', profit, closingCash };
        }
        return log;
      });
      return { ...prev, dailyLogs: updatedLogs };
    });
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    setState(prev => {
        const todaysLog = getTodaysLog(prev);
        if (!todaysLog) {
            throw new Error("Cannot add transaction without an active day log. Please start the day first.");
        }

        const newTransaction: Transaction = {
          ...transactionData,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };

        const updatedLogs = prev.dailyLogs.map(log => {
            if (log.id === todaysLog.id) {
                const newLog = { ...log, transactions: [...log.transactions, newTransaction.id] };

                if (newTransaction.type === 'income') {
                    newLog.totalIncome += newTransaction.amount;
                    if (newTransaction.paymentMethod === 'cash') {
                        newLog.cashIncome += newTransaction.amount;
                    }
                } else {
                    newLog.totalExpenses += newTransaction.amount;
                    if (newTransaction.paymentMethod === 'cash') {
                        newLog.cashExpenses += newTransaction.amount;
                    }
                }
                return newLog;
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
      
      const updatedLogs = prev.dailyLogs.map(log => {
        if (log.transactions.includes(updatedTransaction.id)) {
            let { totalIncome, totalExpenses, cashIncome, cashExpenses } = log;
            
            // Revert old transaction's values
            if (oldTransaction!.type === 'income') {
                totalIncome -= oldTransaction!.amount;
                if (oldTransaction!.paymentMethod === 'cash') cashIncome -= oldTransaction!.amount;
            } else {
                totalExpenses -= oldTransaction!.amount;
                if (oldTransaction!.paymentMethod === 'cash') cashExpenses -= oldTransaction!.amount;
            }

            // Apply new transaction's values
            if (updatedTransaction.type === 'income') {
                totalIncome += updatedTransaction.amount;
                if (updatedTransaction.paymentMethod === 'cash') cashIncome += updatedTransaction.amount;
            } else {
                totalExpenses += updatedTransaction.amount;
                if (updatedTransaction.paymentMethod === 'cash') cashExpenses += updatedTransaction.amount;
            }

            return { ...log, totalIncome, totalExpenses, cashIncome, cashExpenses };
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
          const newLog = {
            ...log,
            transactions: log.transactions.filter(id => id !== transactionId),
          };
          if (transactionToDelete.type === 'income') {
            newLog.totalIncome -= transactionToDelete.amount;
            if(transactionToDelete.paymentMethod === 'cash') newLog.cashIncome -= transactionToDelete.amount;
          } else {
            newLog.totalExpenses -= transactionToDelete.amount;
            if(transactionToDelete.paymentMethod === 'cash') newLog.cashExpenses -= transactionToDelete.amount;
          }
          return newLog;
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
                    totalIncome: convert(log.totalIncome),
                    totalExpenses: convert(log.totalExpenses),
                    cashIncome: log.cashIncome ? convert(log.cashIncome) : 0,
                    cashExpenses: log.cashExpenses ? convert(log.cashExpenses) : 0,
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
    setState({ ...initialState, settings: { ...initialState.settings, onboardingCompleted: false }});
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
