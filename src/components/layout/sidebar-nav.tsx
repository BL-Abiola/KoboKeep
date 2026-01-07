'use client';
import React from 'react';
import { usePathname } from 'next/link';
import Link from 'next/link';
import { Home, List, BookUser, BarChart3, Settings, Wallet, PlusCircle } from 'lucide-react';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/transactions', label: 'Transactions', icon: List },
  { href: '/debts', label: 'Debts', icon: BookUser },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { toggleTransactionSheet } = useAppStore();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Ìṣúná</h2>
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
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
