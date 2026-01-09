
'use client';
import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format, startOfWeek, getWeek, isPast } from 'date-fns';
import { CURRENCIES } from '@/lib/constants';
import { Transaction } from '@/lib/types';
import { generateWeeklyReport } from '@/lib/weekly-pdf-generator';

interface WeeklySummary {
  weekId: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  transactions: Transaction[];
}

export function WeeklyReports() {
  const { transactions, dailyLogs, settings } = useAppStore();

  const weeklyData = useMemo(() => {
    // Get IDs of closed logs
    const closedLogDates = new Set(
      dailyLogs.filter(log => log.status === 'closed').map(log => format(new Date(log.date), 'yyyy-MM-dd'))
    );

    // Only include transactions from closed days
    const closedTransactions = transactions.filter(t => 
      closedLogDates.has(format(new Date(t.date), 'yyyy-MM-dd'))
    );

    const groupedByWeek = closedTransactions.reduce((acc, t) => {
      const transactionDate = new Date(t.date);
      const weekNumber = getWeek(transactionDate, { weekStartsOn: 1 });
      const year = transactionDate.getFullYear();
      const weekId = `${year}-W${weekNumber}`;

      if (!acc[weekId]) {
        const startDate = startOfWeek(transactionDate, { weekStartsOn: 1 });
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        acc[weekId] = {
          weekId,
          startDate,
          endDate,
          totalIncome: 0,
          totalExpenses: 0,
          profit: 0,
          transactions: [],
        };
      }

      if (t.type === 'income') {
        acc[weekId].totalIncome += t.amount;
      } else {
        acc[weekId].totalExpenses += t.amount;
      }
      acc[weekId].profit = acc[weekId].totalIncome - acc[weekId].totalExpenses;
      acc[weekId].transactions.push(t);
      return acc;
    }, {} as Record<string, WeeklySummary>);

    // Filter out the current week and sort by date
    return Object.values(groupedByWeek)
      .filter(week => isPast(week.endDate))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
      
  }, [transactions, dailyLogs]);

  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };
  
  const handleDownload = (week: WeeklySummary) => {
    generateWeeklyReport(week, settings);
  };

  if (weeklyData.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No completed weekly reports are available yet.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {weeklyData.map(week => (
        <AccordionItem value={week.weekId} key={week.weekId}>
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
              <span>
                {format(week.startDate, 'MMM d')} - {format(week.endDate, 'd, yyyy')}
              </span>
              <span className={`font-semibold ${week.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(week.profit)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Income:</span> <span>{formatCurrency(week.totalIncome)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Expenses:</span> <span>{formatCurrency(week.totalExpenses)}</span></div>
              <div className="flex justify-between font-bold"><span>Profit:</span> <span>{formatCurrency(week.profit)}</span></div>
              <div className="pt-4">
                <Button onClick={() => handleDownload(week)} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
