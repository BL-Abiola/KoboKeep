
'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { TransactionList } from "@/components/transactions/transaction-list";
import { useAppStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import { WeekNavigator } from "@/components/transactions/week-navigator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
    const { transactions } = useAppStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState('all');

    const dailyTransactions = useMemo(() => {
        let daily = [...transactions].filter(t => {
            const transactionDate = new Date(t.date);
            return isSameDay(transactionDate, selectedDate);
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (filter === 'income') {
            return daily.filter(t => t.type === 'income');
        }
        if (filter === 'expense') {
            return daily.filter(t => t.type === 'expense');
        }
        return daily;

    }, [transactions, selectedDate, filter]);
    
    return (
        <MainLayout title="Transaction History">
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <WeekNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                
                <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="expense">Expenses</TabsTrigger>
                    </TabsList>
                </Tabs>

                <TransactionList transactions={dailyTransactions} showDate={false} key={dailyTransactions.length} />
             </div>
        </MainLayout>
    );
}
