
'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, Settings } from './types';
import { format } from 'date-fns';
import { CURRENCIES } from './constants';

interface WeeklySummary {
  weekId: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  transactions: Transaction[];
}

export const generateWeeklyReport = (
  week: WeeklySummary,
  settings: Settings
) => {
  const doc = new jsPDF();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  doc.setFontSize(20);
  doc.text(`Weekly Report: ${format(week.startDate, 'MMM d')} - ${format(week.endDate, 'd, yyyy')}`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Business: ${settings.profile.businessName}`, 14, 32);

  const summaryData = [
    ['Total Income', formatCurrency(week.totalIncome)],
    ['Total Expenses', formatCurrency(week.totalExpenses)],
    ['Net Profit', formatCurrency(week.profit)],
  ];

  autoTable(doc, {
    startY: 40,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [46, 89, 132] },
  });

  if (week.transactions.length > 0) {
    const groupedByDay = week.transactions.reduce((acc, t) => {
      const day = format(new Date(t.date), 'yyyy-MM-dd');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);

    const sortedDays = Object.keys(groupedByDay).sort();
    
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Transactions by Day', 14, 22);

    let startY = 30;

    for (const day of sortedDays) {
        const dayTransactions = groupedByDay[day];
        const dayTitle = format(new Date(day), 'EEEE, MMMM dd, yyyy');
        
        const tableBody = dayTransactions.map(t => [
            format(new Date(t.date), 'HH:mm'),
            t.description,
            t.type,
            t.paymentMethod,
            formatCurrency(t.amount)
        ]);

        autoTable(doc, {
            startY,
            head: [[dayTitle, '', '', '', '']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [230, 230, 230], textColor: 20 },
            didDrawPage: (data) => {
                startY = data.cursor?.y ? data.cursor.y + 10 : 30;
            }
        });
        startY = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  doc.save(`Kobokeep-weekly-report-${week.weekId}.pdf`);
};
