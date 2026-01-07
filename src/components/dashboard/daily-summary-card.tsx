'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyLog } from '@/lib/types';
import { TrendingUp, TrendingDown, Banknote, Landmark } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

interface DailySummaryCardProps {
  log: DailyLog;
}

const StatCard = ({ title, value, icon: Icon, iconClassName }: { title: string; value: string; icon: React.ElementType; iconClassName?: string }) => (
  <Card>
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
  
  const [highlightSale, setHighlightSale] = useState(false);
  const [highlightExpense, setHighlightExpense] = useState(false);

  const prevSales = useRef(log.totalSales);
  const prevExpenses = useRef(log.totalExpenses);

  useEffect(() => {
    if (log.totalSales > prevSales.current) {
      setHighlightSale(true);
      const timer = setTimeout(() => setHighlightSale(false), 2500);
      return () => clearTimeout(timer);
    }
    prevSales.current = log.totalSales;
  }, [log.totalSales]);

  useEffect(() => {
    if (log.totalExpenses > prevExpenses.current) {
      setHighlightExpense(true);
      const timer = setTimeout(() => setHighlightExpense(false), 2500);
      return () => clearTimeout(timer);
    }
    prevExpenses.current = log.totalExpenses;
  }, [log.totalExpenses]);


  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
  };
  
  const profit = log.totalSales - log.totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Sales"
        value={formatCurrency(log.totalSales)}
        icon={TrendingUp}
        iconClassName={cn({'text-green-500': highlightSale})}
      />
      <StatCard 
        title="Total Expenses"
        value={formatCurrency(log.totalExpenses)}
        icon={TrendingDown}
        iconClassName={cn({'text-red-500': highlightExpense})}
      />
      <StatCard 
        title="Net Profit"
        value={formatCurrency(profit)}
        icon={Landmark}
        iconClassName={profit >= 0 ? 'text-green-500' : 'text-red-500'}
      />
      <StatCard 
        title="Opening Cash"
        value={formatCurrency(log.openingCash)}
        icon={Banknote}
      />
    </div>
  );
}
