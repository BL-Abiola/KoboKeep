'use client';
import React from 'react';
import { Transaction } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Edit, Clock } from 'lucide-react';
import { CURRENCIES } from '@/lib/constants';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TransactionListProps {
  transactions: Transaction[];
  showDate?: boolean;
}

export function TransactionList({ transactions, showDate = false }: TransactionListProps) {
  const { settings, deleteTransaction, toggleTransactionSheet } = useAppStore();
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No transactions recorded for this day.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {showDate && <TableHead>Date</TableHead>}
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                {showDate && <TableCell>{format(new Date(t.date), 'MMM dd, yyyy')}</TableCell>}
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {t.type}
                   </span>
                </TableCell>
                <TableCell className="hidden md:table-cell capitalize">{t.paymentMethod}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{format(new Date(t.date), 'p')}</TableCell>
                <TableCell className={`text-right font-semibold ${t.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'sale' ? '+' : '-'}
                  {currencySymbol}
                  {t.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => toggleTransactionSheet(true, t.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this transaction record.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => deleteTransaction(t.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
