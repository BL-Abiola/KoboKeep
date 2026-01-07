'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { useAppStore } from '@/lib/store';
import { Button } from '../ui/button';
import { Plus, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function MainLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const isMobile = useIsMobile();
  const { toggleTransactionSheet, settings } = useAppStore();

  const renderDesktopLayout = () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-auto items-center justify-between gap-4 border-b bg-background px-4 py-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="sm:hidden" />
            <div>
                <h1 className="text-xl font-semibold md:text-3xl font-headline">{title}</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back, {settings.profile.name}.
                </p>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
      <TransactionForm />
    </SidebarProvider>
  );

  const renderMobileLayout = () => (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4">
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <User className="h-5 w-5"/>
              </AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-semibold font-headline">{title}</h1>
          </div>
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
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
