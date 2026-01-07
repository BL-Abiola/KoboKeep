'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { TransactionList } from "@/components/transactions/transaction-list";
import { useAppStore } from "@/lib/store";
import { useMemo } from "react";

export default function TransactionsPage() {
    const { transactions } = useAppStore();

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);
    
    return (
        <MainLayout title="Transaction History">
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <TransactionList transactions={sortedTransactions} showDate={true} />
             </div>
        </MainLayout>
    );
}
