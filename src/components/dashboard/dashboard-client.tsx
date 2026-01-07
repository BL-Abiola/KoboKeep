'use client';
import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DailySummaryCard } from './daily-summary-card';
import { StartDayDialog } from './start-day-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Sun } from 'lucide-react';
import { WeeklyChart } from './weekly-chart';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';

export function DashboardClient() {
  const { getTodaysLog, endDay, transactions } = useAppStore();
  const todaysLog = getTodaysLog();

  const todaysTransactions = useMemo(() => {
    if (!todaysLog) return [];
    const transactionIds = new Set(todaysLog.transactions);
    return transactions.filter(t => transactionIds.has(t.id)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [todaysLog, transactions]);

  const weeklyTransactions = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions]);


  if (!todaysLog) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mb-4">
             <Sun className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold">Good Morning!</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Ready to make today count? Start your day to begin tracking your business performance.
          </p>
          <StartDayDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight">Today's Summary</h2>
          </div>
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
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-xl">Weekly Performance</CardTitle>
            <CardDescription>A visual summary of this week's sales and expenses.</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
            <WeeklyChart data={weeklyTransactions} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-xl">Today's Transactions</CardTitle>
            <CardDescription>A list of all sales and expenses for today.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <TransactionList transactions={todaysTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
