
'use client';
import React, { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { CURRENCIES } from '@/lib/constants';
import { generateDailyLogReport } from '@/lib/pdf-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WeeklyReports } from './weekly-reports';

function DailyReports() {
    const { dailyLogs, transactions, settings } = useAppStore();
    const closedLogs = useMemo(() => {
        return [...dailyLogs]
          .filter(log => log.status === 'closed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }, [dailyLogs]);
      
      const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';
    
      const formatCurrency = (amount: number | undefined) => {
        return `${currencySymbol}${(amount ?? 0).toFixed(2)}`;
      };
      
      const handleDownload = (logId: string) => {
        const log = dailyLogs.find(l => l.id === logId);
        if (log) {
            const logTransactionIds = new Set(log.transactions);
            const logTransactions = transactions.filter(t => logTransactionIds.has(t.id));
            generateDailyLogReport(log, logTransactions, settings);
        }
      };

    if (closedLogs.length === 0) {
        return (
          <div className="p-6 text-center text-muted-foreground">
            You have no closed daily logs to generate reports from.
          </div>
        );
    }
    
    return (
        <Accordion type="single" collapsible className="w-full">
            {closedLogs.map(log => (
                <AccordionItem value={log.id} key={log.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                            <span>{format(new Date(log.date), 'MMMM dd, yyyy')}</span>
                            <span className={`font-semibold ${log.profit && log.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(log.profit)}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 p-4 border rounded-md">
                            <div className="flex justify-between"><span className="text-muted-foreground">Total Income:</span> <span>{formatCurrency(log.totalIncome)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Total Expenses:</span> <span>{formatCurrency(log.totalExpenses)}</span></div>
                            <div className="flex justify-between font-bold"><span >Profit:</span> <span>{formatCurrency(log.profit)}</span></div>
                            <div className="pt-4">
                            <Button onClick={() => handleDownload(log.id)} variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4"/>
                                Download PDF
                            </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export function ReportsClient() {
  const { dailyLogs } = useAppStore();

  const hasClosedLogs = useMemo(() => dailyLogs.some(log => log.status === 'closed'), [dailyLogs]);

  return (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Review your past performance day by day or week by week.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasClosedLogs ? (
                    <Tabs defaultValue="daily" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="daily">Daily Logs</TabsTrigger>
                            <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
                        </TabsList>
                        <TabsContent value="daily">
                            <DailyReports />
                        </TabsContent>
                        <TabsContent value="weekly">
                           <WeeklyReports />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="p-6 text-center text-muted-foreground">
                        You have no closed logs to generate reports from.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
