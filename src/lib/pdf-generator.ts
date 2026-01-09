
'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DailyLog, Transaction, Settings } from './types';
import { format } from 'date-fns';
import { CURRENCIES } from './constants';

export const generateDailyLogReport = (
  log: DailyLog,
  transactions: Transaction[],
  settings: Settings
) => {
  const doc = new jsPDF();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  doc.setFontSize(20);
  doc.text(`Daily Log Report - ${format(new Date(log.date), 'MMMM dd, yyyy')}`, 14, 22);

  doc.setFontSize(12);
  doc.text(`Business: ${settings.profile.businessName}`, 14, 32);
  doc.text(`Status: ${log.status}`, 14, 38);

  const profit = log.totalIncome - log.totalExpenses;
  const closingCash = log.openingCash + log.cashIncome - log.cashExpenses;

  const summaryData = [
    ['Opening Cash', formatCurrency(log.openingCash)],
    ['Total Income', formatCurrency(log.totalIncome)],
    ['Total Expenses', formatCurrency(log.totalExpenses)],
    ['Profit', formatCurrency(profit)],
    ['Closing Cash', formatCurrency(log.closingCash ?? closingCash)],
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [46, 89, 132] }, // Primary color
  });
  
  if (transactions.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Transactions', 14, 22);
    
    const tableBody = transactions.map(t => [
        format(new Date(t.date), 'HH:mm'),
        t.description,
        t.type,
        t.paymentMethod,
        formatCurrency(t.amount)
    ]);

    autoTable(doc, {
        startY: 30,
        head: [['Time', 'Description', 'Type', 'Method', 'Amount']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [46, 89, 132] },
    });
  }


  doc.save(`Kobokeep-report-${log.id}.pdf`);
};
