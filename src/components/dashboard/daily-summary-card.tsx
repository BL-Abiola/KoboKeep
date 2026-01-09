
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyLog } from '@/lib/types';
import { TrendingUp, TrendingDown, Landmark, Wallet } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

interface DailySummaryCardProps {
  log: DailyLog;
}

const StatCard = ({ title, value, icon: Icon, iconClassName, className }: { title: string; value: string; icon: React.ElementType; iconClassName?: string, className?: string }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={cn("h-4 w-4 text-muted-foreground transition-colors duration-300", iconClassName)} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function DailySummaryCard({ log }: DailySummaryCardProps) {
  const { settings } = useAppStore();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';
  
  const [highlightIncome, setHighlightIncome] = useState(false);
  const [highlightExpense, setHighlightExpense] = useState(false);

  const prevIncome = useRef(log.totalIncome);
  const prevExpenses = useRef(log.totalExpenses);

  useEffect(() => {
    if (log.totalIncome > prevIncome.current) {
      setHighlightIncome(true);
      const timer = setTimeout(() => setHighlightIncome(false), 3000);
      return () => clearTimeout(timer);
    }
    prevIncome.current = log.totalIncome;
  }, [log.totalIncome]);

  useEffect(() => {
    if (log.totalExpenses > prevExpenses.current) {
      setHighlightExpense(true);
      const timer = setTimeout(() => setHighlightExpense(false), 3000);
      return () => clearTimeout(timer);
    }
    prevExpenses.current = log.totalExpenses;
  }, [log.totalExpenses]);


  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
  };
  
  const profit = log.totalIncome - log.totalExpenses;
  const cashOnHand = log.openingCash + profit;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Income"
        value={formatCurrency(log.totalIncome)}
        icon={TrendingUp}
        iconClassName={cn({'animate-blink-sale text-green-500': highlightIncome})}
      />
      <StatCard 
        title="Total Expenses"
        value={formatCurrency(log.totalExpenses)}
        icon={TrendingDown}
        iconClassName={cn({'animate-blink-expense text-red-500': highlightExpense})}
      />
      <StatCard 
        title="Net Profit"
        value={formatCurrency(profit)}
        icon={Landmark}
        iconClassName={profit >= 0 ? 'text-green-500' : 'text-red-500'}
      />
      <StatCard 
        title="Cash on Hand"
        value={formatCurrency(cashOnHand)}
        icon={Wallet}
        iconClassName={cashOnHand >= log.openingCash ? 'text-green-500' : 'text-red-500'}
      />
    </div>
  );
}
