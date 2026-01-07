'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { useAppStore } from '@/lib/store';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function MainLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const isMobile = useIsMobile();
  const { toggleTransactionSheet } = useAppStore();

  const renderDesktopLayout = () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <h1 className="text-xl font-semibold md:text-3xl font-headline">{title}</h1>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
      <TransactionForm />
    </SidebarProvider>
  );

  const renderMobileLayout = () => (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4">
          <h1 className="text-xl font-semibold font-headline">{title}</h1>
          <Button variant="ghost" size="icon" onClick={() => toggleTransactionSheet(true)}>
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Transaction</span>
          </Button>
        </header>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
      <TransactionForm />
    </div>
  );
  
  if (isMobile === undefined) {
    return null; // or a skeleton loader
  }

  return isMobile ? renderMobileLayout() : renderDesktopLayout();
}
