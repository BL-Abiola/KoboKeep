'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, BookUser, BarChart3, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/transactions', label: 'History', icon: List },
  { type: 'button', label: 'Add', icon: PlusCircle },
  { href: '/debts', label: 'Debts', icon: BookUser },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();
  const { toggleTransactionSheet } = useAppStore();

  const navLinks = navItems.map((item, index) => {
    if (item.type === 'button') {
        return (
             <button
                key="add-button"
                onClick={() => toggleTransactionSheet(true)}
                className={cn(
                    'flex flex-col items-center justify-center gap-1 p-2 transition-colors w-full text-primary'
                )}
                >
                <item.icon className="h-6 w-6" />
                <span className="text-xs text-center">{item.label}</span>
            </button>
        )
    }

    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href!}
        className={cn(
          'flex flex-col items-center justify-center gap-1 p-2 transition-colors w-full',
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        <span className="text-xs text-center">{item.label}</span>
      </Link>
    );
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur-sm z-20">
      <div className="grid grid-cols-5 h-full items-stretch justify-items-center text-sm relative">
        {navLinks}
      </div>
    </div>
  );
}
