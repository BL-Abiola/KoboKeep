'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { TransactionList } from "@/components/transactions/transaction-list";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { WeekNavigator } from "@/components/transactions/week-navigator";

export default function TransactionsPage() {
    const { transactions } = useAppStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    const weeklyTransactions = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
        const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
        
        return [...transactions].filter(t => {
            const transactionDate = new Date(t.date);
            return isWithinInterval(transactionDate, { start, end });
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, currentDate]);
    
    return (
        <MainLayout title="Transaction History">
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <WeekNavigator currentDate={currentDate} onDateChange={setCurrentDate} />
                <TransactionList transactions={weeklyTransactions} showDate={true} />
             </div>
        </MainLayout>
    );
}
