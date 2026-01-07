'use client';
import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DailySummaryCard } from './daily-summary-card';
import { StartDayDialog } from './start-day-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Transaction } from '@/lib/types';
import { TransactionList } from '@/components/transactions/transaction-list';

export function DashboardClient() {
  const { getTodaysLog, endDay, transactions } = useAppStore();
  const todaysLog = getTodaysLog();

  const todaysTransactions = useMemo(() => {
    if (!todaysLog) return [];
    const transactionIds = new Set(todaysLog.transactions);
    return transactions.filter(t => transactionIds.has(t.id)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [todaysLog, transactions]);

  if (!todaysLog) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Start Your Day</CardTitle>
            <CardDescription>Begin a new daily log to track your sales and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <StartDayDialog />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Today's Summary</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">End Day</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to end the day?</AlertDialogTitle>
              <AlertDialogDescription>
                This will close today's log and calculate your final profit. You won't be able to add more transactions to it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={endDay}>End Day</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <DailySummaryCard log={todaysLog} />
      
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4">Today's Transactions</h3>
        <TransactionList transactions={todaysTransactions} />
      </div>
    </div>
  );
}
