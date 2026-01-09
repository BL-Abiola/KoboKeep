
'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { TransactionList } from "@/components/transactions/transaction-list";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import { WeekNavigator } from "@/components/transactions/week-navigator";

export default function TransactionsPage() {
    const { transactions } = useAppStore();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const dailyTransactions = useMemo(() => {
        return [...transactions].filter(t => {
            const transactionDate = new Date(t.date);
            return isSameDay(transactionDate, selectedDate);
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, selectedDate]);
    
    return (
        <MainLayout title="Transaction History">
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <WeekNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                <TransactionList transactions={dailyTransactions} showDate={false} key={transactions.length} />
             </div>
        </MainLayout>
    );
}
