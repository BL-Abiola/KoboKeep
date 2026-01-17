'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, List, BookUser, BarChart3, Settings, Wallet, PlusCircle, Info } from 'lucide-react';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/transactions', label: 'Transactions', icon: List },
  { href: '/debts', label: 'Debts', icon: BookUser },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ onAboutClick }: { onAboutClick: () => void }) {
  const pathname = usePathname();
  const { toggleTransactionSheet } = useAppStore();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold font-headline">KoboKeep</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2">
          <Button className="w-full" onClick={() => toggleTransactionSheet(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton isActive={pathname === item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={onAboutClick}>
          <Info />
          <span>About</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </>
  );
}
