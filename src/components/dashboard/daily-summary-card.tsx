'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyLog } from '@/lib/types';
import { TrendingUp, TrendingDown, Banknote, Landmark } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';

interface DailySummaryCardProps {
  log: DailyLog;
}

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: string; icon: React.ElementType; colorClass?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function DailySummaryCard({ log }: DailySummaryCardProps) {
  const { settings } = useAppStore();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';
  
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
        colorClass="text-green-500"
      />
      <StatCard 
        title="Total Expenses"
        value={formatCurrency(log.totalExpenses)}
        icon={TrendingDown}
        colorClass="text-red-500"
      />
      <StatCard 
        title="Net Profit"
        value={formatCurrency(profit)}
        icon={Landmark}
        colorClass={profit >= 0 ? 'text-green-500' : 'text-red-500'}
      />
      <StatCard 
        title="Opening Cash"
        value={formatCurrency(log.openingCash)}
        icon={Banknote}
      />
    </div>
  );
}
